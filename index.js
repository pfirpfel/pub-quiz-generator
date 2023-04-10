const process = require('node:process');
const path = require('path');
const { listFiles, createDirectoryIfNotExists, writeFile } = require('./src/util');
const yaml = require('js-yaml');
const ejs = require('ejs');
const { readFile } = require('node:fs/promises');

const templatesPath = path.resolve(__dirname + '/templates/');
const outPath = path.resolve(__dirname + '/output/');

async function main() {
    const examplePath = path.resolve(__dirname + '/example/');
    const projectFiles = await listFiles(examplePath);
    let categoryFiles = projectFiles.filter(f => f.match(/^.+\.yaml$/));

    // remove and handle config.yaml
    const configIndex = categoryFiles.indexOf('config.yaml');
    let config = null;
    if (configIndex !== -1) {
        const configFile = categoryFiles.splice(configIndex, 1);
        config = await readFile(examplePath + '/' + configFile)
            .then( content => yaml.load(content, 'utf8'));
        config = config || {};
        config.title = config.title || 'Pub Quiz';
    }

    const categoryYamls = await Promise.all(
        categoryFiles.map(file => {
            return readFile(examplePath + '/' + file)
               .then( content => yaml.load(content, 'utf8'))
        })
    );

    const slides = [];
    let categoryCount = 0;
    for(const category of categoryYamls) {
        // add category title page first
        slides.push({
            type: 'title',
            ...category.title_page
        });

        if(category.hasOwnProperty('questions') && category.questions.length > 0){
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

    await createSlides(slides, config);

    process.exit(0);
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
})();
