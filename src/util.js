const fs = require('fs');

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
