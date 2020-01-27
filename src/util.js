const momentLib = require("moment-timezone");
const _ = require("lodash");

const { OFFICIAL_POLLS, EARLY_STATES, CANDIDATES } = require("./constants");

const moment = (...args) => momentLib(...args).tz("America/New_York");

const formatDateShort = date => moment(date).format("MM/DD");

const formatDateRange = (fromDate, toDate, parseFormat = "YYYY-MM-DD") => {
    const format = "MM/DD";
    const from = moment(fromDate, parseFormat).format(format);
    const to = moment(toDate, parseFormat).format(format);
    return `${from} - ${to}`;
};

const NOW = moment("2020-01-27T23:59:59-05:00").format();
const ONE_WEEK_AGO = moment(NOW)
    .subtract(7, "d")
    .format();
const TWO_WEEKS_AGO = moment(NOW)
    .subtract(14, "d")
    .format();

const getYangPolls = polls =>
    _(polls)
        .filter({
            candidateId: CANDIDATES.yang.pollId,
        })
        .uniqBy("pollId")
        .map(poll => {
            const cleanPoll = { ...poll };
            if (cleanPoll.sponsorIds === "") {
                cleanPoll.sponsorIds = null;
            } else if (cleanPoll.sponsorIds) {
                cleanPoll.sponsorIds = cleanPoll.sponsorIds.split(",");
            } else {
                throw Error(`Unexpected sponsorIds: ${cleanPoll.sponsorIds}`);
            }
            return cleanPoll;
        })
        .value();

const isPollOfficial = ({ pollsterRatingId, sponsorIds }) =>
    _.some(OFFICIAL_POLLS, official => {
        const pollsterMatches =
            official.pollsterRatingId === pollsterRatingId ||
            official.pollsterRatingId === "any";
        const sponsorMatches =
            official.sponsorId === "any" ||
            official.sponsorId === sponsorIds ||
            (_.isArray(sponsorIds) &&
                _.isArray(official.sponsorId) &&
                _.isEqual(sponsorIds.sort(), official.sponsorId.sort()));
        return pollsterMatches && sponsorMatches;
    });

const isPollAboveThreshold = ({ pct }, earlyState) => {
    const threshold = earlyState ? 7 : 5;
    return parseFloat(pct) >= threshold;
};

const isPollQualifying = (poll, earlyState = false) =>
    isPollOfficial(poll) &&
    isPollAboveThreshold(poll, earlyState) &&
    poll.state.toLowerCase() !== "iowa";

const isEarlyState = state => EARLY_STATES.includes(state);

module.exports = {
    formatDateShort,
    formatDateRange,
    NOW,
    ONE_WEEK_AGO,
    TWO_WEEKS_AGO,
    isPollOfficial,
    isPollQualifying,
    isPollAboveThreshold,
    isEarlyState,
    getYangPolls,
    moment,
};
