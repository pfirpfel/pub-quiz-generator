import fs from 'fs';
import { readFile } from 'node:fs/promises';
import yaml from 'js-yaml';

export const writeFile = async function(data, path) {
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

export const createDirectoryIfNotExists = async function(path) {
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
};

export const listFiles = async function(path) {
    return new Promise(((resolve, reject) => {
        fs.readdir(path, (err, files) => {
            if (err) {
                reject(err);
            } else {
                resolve(files);
            }
        });
    }));
};

export const findFile = async function(path, baseName) {
    return listFiles(path).then(files => {
        for(let file of files) {
            if (String(file).startsWith(baseName)){
                return file;
            }
        }
        return null;
    });
};

export const readYamlFile = async function(path) {
    return readFile(path)
        .then( content => yaml.load(content, 'utf8'));
};
