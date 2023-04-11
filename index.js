#!/usr/bin/env node
const process = require('node:process');
const path = require('path');
const { listFiles, createDirectoryIfNotExists, writeFile, readYamlFile } = require('./src/util');
const ejs = require('ejs');

const templatesPath = path.resolve(__dirname + '/templates/');
const outPath = path.resolve(__dirname + '/output/');

async function main() {
    const argv = require('yargs/yargs')(process.argv.slice(2))
        .usage('Usage: $0 [directory]')
        .alias('d', 'directory')
        .nargs('d', 1)
        .describe('d', 'Path to config/question directory')
        .demandOption(['d'])
        .argv;

    const yamlDir = path.resolve(argv.directory);

    const { config, slides } = await parseYamlFiles(yamlDir);

    await createSlides(slides, config);
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
    }

    const categories = await Promise.all(
        yamlFiles.map(file => readYamlFile(path + '/' + file))
    );

    const slides = [];
    let categoryCount = 0;
    for(const category of categories) {
        // add category title page first
        slides.push({
            type: 'title',
            ...category.title_page
        });

        if (category.hasOwnProperty('questions') && category.questions.length > 0) {
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

async function createSlides(slides, config){
    await createDirectoryIfNotExists(outPath);

    const quiz = await render(templatesPath + '/index.ejs', { questions: slides, isAnswer: false, config }, {});
    const answers = await render(templatesPath + '/index.ejs', { questions: slides, isAnswer: true, config }, {});

    await writeFile(quiz, outPath + '/index.html');
    await writeFile(answers, outPath + '/answers.html');
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
