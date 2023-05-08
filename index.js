#!/usr/bin/env node
const process = require('node:process');
const path = require('path');
const { listFiles, createDirectoryIfNotExists, writeFile, readYamlFile, findFile } = require('./src/util');
const { download, checkDependencies } = require('./src/youtube-dl');
const ejs = require('ejs');

async function main() {
    const { yamlDir, templatesPath, outPath } = parseArgs();

    const { config, slides } = await parseYamlFiles(yamlDir);

    const processedSlides = await downloadYoutubeMedia(slides, yamlDir);

    await createSlides(processedSlides, config, templatesPath, outPath);
}

function parseArgs() {
    const argv = require('yargs/yargs')(process.argv.slice(2))
        .usage('Usage: $0 -d [directory]')
        .alias('d', 'directory')
        .nargs('d', 1)
        .describe('d', 'Path to the question directory')
        .demandOption(['d'])
        .alias('o', 'output')
        .default('o', path.resolve(__dirname + '/output/'))
        .nargs('o', 1)
        .describe('o', 'Path to output directory, where the HTML is written to')
        .alias('t', 'templates')
        .default('t', path.resolve(__dirname + '/templates/'))
        .nargs('t', 1)
        .describe('t', 'Path to template directory')
        .argv;

    return {
        yamlDir: path.resolve(argv.directory),
        templatesPath: path.resolve(argv.templates),
        outPath: path.resolve(argv.output)
    };
}

async function parseYamlFiles(path) {
    const filesInPath = await listFiles(path);
    const yamlFiles = filesInPath.filter(f => f.match(/^.+\.yaml$/));

    // remove and handle config.yaml
    const configIndex = yamlFiles.indexOf('config.yaml');
    let config = null;
    if (configIndex !== -1) {
        const configFile = yamlFiles.splice(configIndex, 1);
        config = await readYamlFile(path + '/' + configFile);
        config = config || {};
        config.title = config.title || 'Pub Quiz';
        config.revealjs_path = config.revealjs_path || '../node_modules/reveal.js/';
        config.revealjs_theme = config.revealjs_theme || 'black';
    }

    const categories = await Promise.all(
        yamlFiles.map(file => readYamlFile(path + '/' + file))
    );

    const slides = [];
    let categoryCount = 0;
    for(const category of categories) {
        // add category title page first
        if (Object.prototype.hasOwnProperty.call(category, 'title_pages')) {
            // in case of multiple title pages
            slides.push(...category.title_pages.map(page => {
                page.type = 'title';
                return page;
            }));
        } else {
            // single title page
            slides.push({
                type: 'title',
                ...category.title_page
            });
        }

        if (Object.prototype.hasOwnProperty.call(category, 'questions') && category.questions.length > 0) {
            // add numbering to questions
            categoryCount++;
            category.questions.forEach((question, index) => {
                question.category_number = categoryCount;
                question.question_number = index + 1;
            });
            // add questions
            slides.push(...category.questions);
        }
    }

    return {
        config,
        slides
    };
}

async function createSlides(slides, config, templatesPath, outPath){
    await createDirectoryIfNotExists(outPath);

    const quiz = await render(templatesPath + '/index.ejs', { questions: slides, isAnswer: false, config }, {});
    const answers = await render(templatesPath + '/index.ejs', { questions: slides, isAnswer: true, config }, {});

    await writeFile(quiz, outPath + '/index.html');
    await writeFile(answers, outPath + '/answers.html');
}

async function downloadYoutubeMedia(slides, yamlDir) {
    let dependenciesInstalled = false;
    for(let index = 0; index < slides.length; index++) {
        const question = slides[index];
        // skip if non-youtube
        if (question.type !== 'youtube-dl') continue;

        // check dependencies on first run
        if(!dependenciesInstalled) {
            dependenciesInstalled = await checkDependencies()
        }
        const fileDirectory = path.resolve(yamlDir + '/' +question.outputPath);
        // check if already downloaded
        let fileName = await findFile(fileDirectory, question.fileBaseName);
        if (fileName === null) {
            const properties = {
                outputPath: fileDirectory,
                fileBaseName: question.fileBaseName,
            };
            if (question.start) {
                properties.start = question.start;
            }
            if (question.end) {
                properties.end = question.end;
            }
            properties.hasVideo = question.hasVideo ?? true;
            properties.hasAudio = question.hasAudio ?? true;
            await download(question.url, properties);
            fileName = await findFile(fileDirectory, question.fileBaseName);
        }
        const transformed = Object.assign({}, question);
        // transform question
        const fileExtension = String(fileName).split('.').pop();
        const filePath = transformed.outputPath + '/' + transformed.fileBaseName + '.' + fileExtension;
        if (transformed.hasVideo) {
            transformed.type = 'video';
            transformed.video = filePath;
            transformed.video_type = 'video/' + fileExtension;
        } else {
            transformed.type = 'audio';
            transformed.audio = filePath;
            transformed.audio_type = 'audio/' + fileExtension;
        }
        slides[index] = transformed;
    }
    return slides;
}

async function render(template, data, options = {}) {
    return new Promise(((resolve, reject) => {
        ejs.renderFile(template, data, options, (err, str) => {
            if (err) {
                reject(err);
            } else {
                resolve(str);
            }
        })
    }));
}

(async function(){
    await main();
    process.exit(0);
})();
