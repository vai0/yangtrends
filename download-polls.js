const path = require("path");
const download = require("download-to-file");

const { POLL_CSV_URL, POLLSTER_CSV_URL } = require("./src/constants");

const CONTENT_DIR = path.resolve(__dirname, "src/content/polls");
const FILENAME_PRIMARY_POLLS = "primary-polls.csv";
const FILENAME_POLLSTER = "pollsters.csv";

const downloadFile = (url, filename) => {
    const fullPath = path.resolve(CONTENT_DIR, filename);
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
