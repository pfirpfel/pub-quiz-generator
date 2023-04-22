const fs = require('fs');
const { readFile } = require("node:fs/promises");
const yaml = require("js-yaml");

exports.writeFile =  async function(data, path) {
    return new Promise((resolve, reject) => {
        fs.writeFile(path, data, (err) => {
            if (err) {
                reject(err);
            } else {
                resolve();
            }
        });
    });
};

exports.createDirectoryIfNotExists = async function(path) {
    return new Promise((resolve, reject) => {
        fs.access(path, fs.constants.F_OK, (err => {
            if (err) {
                fs.mkdir(path, { recursive: true }, (err) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve();
                    }
                });
            } else {
                resolve();
            }
        }));
    });
}

exports.listFiles =  async function(path) {
    return new Promise(((resolve, reject) => {
        fs.readdir(path, (err, files) => {
            if (err) {
                reject(err);
            } else {
                resolve(files);
            }
        });
    }));
}

exports.findFile = async function(path, baseName) {
    return exports.listFiles(path).then(files => {
        for(let file of files) {
            if (String(file).startsWith(baseName)){
                return file;
            }
        }
        return null;
    });
}

exports.readYamlFile = async function(path) {
    return readFile(path)
        .then( content => yaml.load(content, 'utf8'));
}
