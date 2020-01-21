const _ = require("lodash");
const csv = require("csv-parser");
const fs = require("fs");
const path = require("path");

const {
    moment,
    NOW,
    ONE_WEEK_AGO,
    TWO_WEEKS_AGO,
    getYangPolls,
    isEarlyState,
    isPollOfficial,
} = require("./util");
const {
    CANDIDATES,
    CABLE_SOURCES,
    CABLE_SOURCE_IDS,
    MONTHS,
    CONTENT_DIR_POLLS,
    FILENAME_PRIMARY_POLLS,
} = require("./constants");

const getCable = ({ all, cand, fromDate, toDate }) => {
    return all
        .filter(({ candidate }) => candidate === cand)
        .filter(({ publicdate }) => {
            const date = moment(publicdate);
            return date.isSameOrAfter(fromDate) && date.isSameOrBefore(toDate);
        });
};

const getCableCount = ({ all, cand, fromDate, toDate }) => {
    const cableForCand = getCable({ all, cand, fromDate, toDate });
    const total = cableForCand.length;
    const main = cableForCand.filter(({ contributor }) =>
        CABLE_SOURCE_IDS.includes(contributor)
    ).length;
    const other = total - main;

    return {
        total,
        main,
        other,
    };
};

const getDigital = allArticles => {
    const getDigitalCount = ({ all, cand, fromDate, toDate }) => {
        return all
            .filter(({ candidate }) => candidate === cand)
            .filter(({ datePublished }) => {
                const date = moment(datePublished);
                return (
                    date.isSameOrAfter(fromDate) && date.isSameOrBefore(toDate)
                );
            }).length;
    };

    return _(CANDIDATES)
        .keys()
        .map(cand => {
            const { name } = CANDIDATES[cand];

            const two = getDigitalCount({
                all: allArticles,
                cand,
                fromDate: TWO_WEEKS_AGO,
                toDate: ONE_WEEK_AGO,
            });
            const one = getDigitalCount({
                all: allArticles,
                cand,
                fromDate: ONE_WEEK_AGO,
                toDate: NOW,
            });
            const diff = one - two;

            return {
                candidate: name,
                two,
                one,
                diff,
            };
        })
        .orderBy(["one"], ["desc"])
        .value();
};

const getStationMentions = allCable => {
    const getStationCount = ({ all, cand, source, fromDate, toDate }) => {
        const cableForCand = getCable({ all, cand, fromDate, toDate });
        return cableForCand.filter(({ contributor }) => contributor === source)
            .length;
    };

    const getOtherStationCount = ({ all, cand, fromDate, toDate }) => {
        const cableForCand = getCable({ all, cand, fromDate, toDate });
        return cableForCand.filter(
            ({ contributor }) => !CABLE_SOURCE_IDS.includes(contributor)
        ).length;
    };

    const trackedStations = _(CABLE_SOURCES)
        .keys()
        .map(source => {
            const { id, name } = CABLE_SOURCES[source];
            const two = getStationCount({
                all: allCable,
                cand: "yang",
                source: id,
                fromDate: TWO_WEEKS_AGO,
                toDate: ONE_WEEK_AGO,
            });
            const one = getStationCount({
                all: allCable,
                cand: "yang",
                source: id,
                fromDate: ONE_WEEK_AGO,
                toDate: NOW,
            });
            const diff = one - two;

            return {
                source: name,
                two,
                one,
                diff,
            };
        })
        .orderBy(["one"], ["desc"])
        .value();

    const otherTwo = getOtherStationCount({
        all: allCable,
        cand: "yang",
        fromDate: TWO_WEEKS_AGO,
        toDate: ONE_WEEK_AGO,
    });

    const otherOne = getOtherStationCount({
        all: allCable,
        cand: "yang",
        fromDate: ONE_WEEK_AGO,
        toDate: NOW,
    });

    const otherStations = {
        source: "Other",
        two: otherTwo,
        one: otherOne,
        diff: otherOne - otherTwo,
    };

    const data = [...trackedStations, otherStations];
    return data;
};

const getCableMentions = allCable => {
    return _(CANDIDATES)
        .keys()
        .map(cand => {
            const { name } = CANDIDATES[cand];
            const two = getCableCount({
                all: allCable,
                cand,
                fromDate: TWO_WEEKS_AGO,
                toDate: ONE_WEEK_AGO,
            });
            const one = getCableCount({
                all: allCable,
                cand,
                fromDate: ONE_WEEK_AGO,
                toDate: NOW,
            });
            const diff = {
                total: one.total - two.total,
                main: one.main - two.main,
                other: one.other - two.other,
            };

            return {
                candidate: name,
                two: two.total,
                one: one.total,
                diff: diff.total,
            };
        })
        .orderBy(["one"], ["desc"])
        .value();
};

const getPollAverages = () => {
    const cleanRawData = data => {
        return data.map(poll => {
            return _.mapKeys(poll, (__, key) => {
                if (key === "start_date") {
                    return "startDate";
                } else if (key === "end_date") {
                    return "endDate";
                } else if (key === "pollster_rating_id") {
                    return "pollsterRatingId";
                } else if (key === "display_name") {
                    return "pollsterName";
                } else if (key === "sponsor_ids") {
                    return "sponsorIds";
                } else if (key === "created_at") {
                    return "createdAt";
                } else if (key === "candidate_id") {
                    return "candidateId";
                } else if (key === "poll_id") {
                    return "pollId";
                }
                return key;
            });
        });
    };

    const getAvg = (polls, month, year) => {
        const monthPolls = _.filter(polls, ({ endDate }) => {
            const date = moment(endDate, "M/DD/YY");
            const m = date.month();
            const y = date.year();
            return m === month && y === year;
        });

        const avg = _(monthPolls)
            .map(({ pct }) => parseFloat(pct))
            .mean();
        return `${avg.toFixed(1)}%`;
    };

    const getAvgsPerMonth = (polls, type) => {
        const avgsPerMonth = _(MONTHS)
            .keyBy(({ month, year }) => {
                return `${month}-${year}`;
            })
            .mapValues(({ month, year }) => {
                return getAvg(polls, month, year);
            })
            .value();
        avgsPerMonth.type = type;
        return avgsPerMonth;
    };

    let rawData = [];
    const primaryPollsPath = path.resolve(
        __dirname,
        CONTENT_DIR_POLLS,
        FILENAME_PRIMARY_POLLS
    );

    return new Promise(resolve => {
        fs.createReadStream(primaryPollsPath)
            .pipe(csv())
            .on("data", data => rawData.push(data))
            .on("end", () => {
                rawData = cleanRawData(rawData);

                const yangPolls = getYangPolls(rawData);
                const national = _.filter(yangPolls, { state: "" });
                const early = _.filter(yangPolls, ({ state }) =>
                    isEarlyState(state)
                );
                const official = _.filter(yangPolls, poll =>
                    isPollOfficial(poll)
                );
                const unofficial = _.filter(
                    yangPolls,
                    poll => !isPollOfficial(poll)
                );

                const data = [
                    getAvgsPerMonth(national, "national"),
                    getAvgsPerMonth(early, "early"),
                    getAvgsPerMonth(official, "official"),
                    getAvgsPerMonth(unofficial, "unofficial"),
                ];

                const findPollAvg = (period, type) =>
                    _.find(data, ({ type: t }) => t === type)[period];

                const invertedData = _(MONTHS)
                    .map(({ month, year }) => {
                        const period = `${month}-${year}`;

                        const national = findPollAvg(period, "national");
                        const early = findPollAvg(period, "early");
                        const official = findPollAvg(period, "official");
                        const unofficial = findPollAvg(period, "unofficial");

                        const formattedMonth = moment(month + 1, "M").format(
                            "MMM"
                        );
                        const formattedYear = moment(year, "YYYY").format("YY");
                        const formattedPeriod = `${formattedMonth} '${formattedYear}`;

                        return {
                            period: formattedPeriod,
                            national,
                            early,
                            official,
                            unofficial,
                        };
                    })
                    .reverse()
                    .value();

                resolve(invertedData);
            });
    });
};

module.exports = {
    getCable,
    getCableCount,
    getDigital,
    getStationMentions,
    getCableMentions,
    getPollAverages,
};
