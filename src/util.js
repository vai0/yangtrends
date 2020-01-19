const momentLib = require("moment-timezone");
const _ = require("lodash");

const { OFFICIAL_POLLS, EARLY_STATES, CANDIDATES } = require("./constants");

const moment = (...args) => momentLib(...args).tz("America/New_York");

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

const now = () => formatDate(moment().utc());
const oneWeekAgo = () =>
    `${formatDate(
        moment()
            .utc()
            .subtract(7, "d")
    )}T00:00:00Z`;
const twoWeeksAgo = () =>
    `${formatDate(
        moment()
            .utc()
            .subtract(14, "d")
    )}T00:00:00Z`;

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
            (official.sponsorId === null && sponsorIds === null) ||
            (_.isArray(sponsorIds) && sponsorIds.includes(official.sponsorId));
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
    formatDate,
    formatDateShort,
    formatDateRange,
    now,
    oneWeekAgo,
    twoWeeksAgo,
    isPollOfficial,
    isPollQualifying,
    isPollAboveThreshold,
    isEarlyState,
    getYangPolls,
    moment,
};
