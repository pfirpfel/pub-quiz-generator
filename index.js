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
    if (configIndex !== -1) {
        const removedFiles = categoryFiles.splice(configIndex, 1);
        // TODO parse config
    }

    const categoryYamls = await Promise.all(
        categoryFiles.map(file => {
            return readFile(examplePath + '/' + file)
               .then( content => yaml.load(content, 'utf8'))
        })
    );

    const slides = [];
    for(const category of categoryYamls) {
        // add category title page first
        slides.push({
            type: 'title',
            ...category.title_page
        });

        // add questions
        if(category.hasOwnProperty('questions'))
            slides.push(...category.questions);
    }

    await createSlides(slides);

    process.exit(0);
}

async function createSlides(slides){
    await createDirectoryIfNotExists(outPath);

    const quiz = await render(templatesPath + '/index.ejs', { questions: slides, isAnswer: false }, {});
    const answers = await render(templatesPath + '/index.ejs', { questions: slides, isAnswer: true }, {});

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
