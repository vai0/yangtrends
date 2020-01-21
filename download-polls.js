const path = require("path");
const download = require("download-to-file");

const {
    POLL_CSV_URL,
    POLLSTER_CSV_URL,
    CONTENT_DIR_POLLS,
    FILENAME_PRIMARY_POLLS,
    FILENAME_POLLSTER,
} = require("./src/constants");

const downloadFile = (url, filename) => {
    const fullPath = path.resolve(CONTENT_DIR_POLLS, filename);
    download(url, fullPath, (err, filepath) => {
        if (err) {
            console.log(err);
            process.exit(1);
        }

        console.log(`Downloaded to ${filepath}`);
    });
};

downloadFile(POLL_CSV_URL, FILENAME_PRIMARY_POLLS);
downloadFile(POLLSTER_CSV_URL, FILENAME_POLLSTER);
