const moment = require("moment");
const _ = require("lodash");

const { OFFICIAL_POLLS } = require("./constants");

const formatDate = (date, parseFormat) =>
    moment(date).format("YYYY-MM-DD", parseFormat);

const formatDateShort = (date, parseFormat) =>
    moment(date).format("MM/DD", parseFormat);

const formatDateRange = (fromDate, toDate, parseFormat = "YYYY-MM-DD") => {
    const format = "MM/DD";
    const from = moment(fromDate, parseFormat).format(format);
    const to = moment(toDate, parseFormat).format(format);
    return `${from} - ${to}`;
};

const NOW = formatDate(moment());
const ONE_WEEK_AGO = `${formatDate(moment().subtract(7, "d"))}T00:00:00Z`;
const TWO_WEEKS_AGO = `${formatDate(moment().subtract(14, "d"))}T00:00:00Z`;

const isPollOfficial = ({ pollsterRatingId, sponsorIds }) =>
    _.some(OFFICIAL_POLLS, official => {
        const pollsterMatches =
            official.pollsterRatingId === pollsterRatingId ||
            official.pollsterRatingId === "any";
        const sponsorMatches =
            official.sponsorId === "any" ||
            (official.sponsorId === null && sponsorIds === null) ||
            (_.isArray(sponsorIds) && sponsorIds.includes(official.sponsorId));
        return pollsterMatches && sponsorMatches;
    });

const isPollAboveThreshold = ({ pct }) => parseFloat(pct) >= 5;

const isPollQualifying = poll =>
    isPollOfficial(poll) && isPollAboveThreshold(poll);

module.exports = {
    formatDate,
    formatDateShort,
    formatDateRange,
    NOW,
    ONE_WEEK_AGO,
    TWO_WEEKS_AGO,
    isPollOfficial,
    isPollQualifying,
    isPollAboveThreshold,
};
