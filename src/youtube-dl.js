// FIXME switch to esm syntax?
import binaryVersionCheck from 'binary-version-check';

function convertTimeToSeconds(time= '00:00'){
    const parts = time.split(':');
    const factors =  [1, 60, 60 * 60, 60 * 60 * 24];
    return parts
        .reverse()
        .reduce((acc, curr, index) => acc + Number.parseInt(curr.trim(), 10) * factors[index], 0);
}

const defaults = {
    //dumpSingleJson: true,
    noCheckCertificates: true,
    noWarnings: true,
    preferFreeFormats: true,
    addHeader: [
        'referer:youtube.com',
        'user-agent:googlebot'
    ]
};

function buildProperties(properties = {}) {
    const optionals = {};

    // format selection
    const hasAudio = properties.hasAudio ?? true;
    const hasVideo = properties.hasVideo ?? true;
    // default: video + audio
    let format = 'best';
    if (!hasAudio && hasVideo) {
        // only video
        format = 'bestvideo';
    }
    if (hasAudio && !hasVideo) {
        // only audio
        format = 'bestaudio';
        optionals.extractAudio = true;
        optionals.noKeepVideo = true;
        optionals.audioFormat = 'vorbis';
    }
    delete properties.hasAudio;
    delete properties.hasVideo;
    optionals.format = format;

    if (properties.start || properties.end) {
        optionals.downloader = 'ffmpeg';
        let downloaderArgs = 'ffmpeg_i:';
        if (properties.start) {
            downloaderArgs += '-ss ' + convertTimeToSeconds(properties.start);
        } else {
            downloaderArgs += '-ss 0';
        }
        if (properties.end) {
            downloaderArgs += ' -to ' + convertTimeToSeconds(properties.end);
        }
        delete properties.start;
        delete properties.end;
        optionals.downloaderArgs = downloaderArgs;
    }

    if (properties.outputPath) {
        properties.fileBaseName = properties.fileBaseName || 'yt-dl';
        optionals.output = properties.outputPath + "/" + properties.fileBaseName + ".%(ext)s"
        delete properties.fileBaseName;
        delete properties.outputPath;
    }

    return {
        ...defaults,
        ...properties, // overwrite defaults if properties also present
        ...optionals
    };
}

let youtubedl = null;

export const download = async function(url, properties = {}) {
    if (youtubedl === null) { // lazy load dependency
        youtubedl = require('youtube-dl-exec');
    }

    await youtubedl(url, buildProperties(properties))
        .then(output => console.log(output));
};

export const checkDependencies = async function() {
    // check for python >= 3.7
    try {
        await binaryVersionCheck('python3', '>=3.7');
        // eslint-disable-next-line no-unused-vars
    } catch(error) {
        try {
            await binaryVersionCheck('python', '>=3.7');
        }
        catch(error) {
            console.log(error);
            return false;
        }
    }
    // check for ffmpeg >= 3.7
    try {
        await binaryVersionCheck('ffmpeg', '>=5');
    } catch(error) {
        console.log(error);
        return false;
    }
    return true;
};
