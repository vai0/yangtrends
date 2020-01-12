const _ = require("lodash");

const CONTEXTUAL_SEARCH_NEWS_ENDPOINT =
    "https://contextualwebsearch-websearch-v1.p.rapidapi.com/api/Search/NewsSearchAPI";
const INTERNET_ARCHIVE_ENDPOINT = "https://archive.org/advancedsearch.php";
const BING_NEWS_ENDPOINT =
    "https://api.cognitive.microsoft.com/bing/v7.0/news/search";
const POLL_CSV_URL =
    "https://projects.fivethirtyeight.com/polls-page/president_primary_polls.csv";
const POLLSTER_CSV_URL =
    "https://raw.githubusercontent.com/fivethirtyeight/data/master/pollster-ratings/pollster-ratings.csv";

const CANDIDATES = {
    bernie: {
        name: "Bernie Sanders",
        q: `"bernie sanders"`,
        fecId: "P60007168",
        pollId: "13257",
    },
    biden: {
        name: "Joe Biden",
        q: `"joe biden"`,
        fecId: "P80000722",
        pollId: "13256",
    },
    bloomberg: {
        name: "Mike Bloomberg",
        q: `"mike bloomberg"`,
        fecId: "P00014530",
        pollId: "13289",
    },
    cory: {
        name: "Cory Booker",
        q: `"cory booker"`,
        fecId: "P00009795",
        pollId: "13287",
    },
    klobuchar: {
        name: "Amy Klobuchar",
        q: `"amy klobuchar"`,
        fecId: "P80006117",
        pollId: "13310",
    },
    pete: {
        name: "Pete Buttigieg",
        q: `"buttigieg"`,
        fecId: "P00010298",
        pollId: "13345",
    },
    steyer: {
        name: "Tom Steyer",
        q: `"tom steyer"`,
        fecId: "P00012716",
        pollId: "13327",
    },
    warren: {
        name: "Elizabeth Warren",
        q: `"elizabeth warren"`,
        fecId: "P00009621",
        pollId: "13258",
    },
    yang: {
        name: "Andrew Yang",
        q: `"andrew yang"`,
        fecId: "P00006486",
        pollId: "13329",
    },
};

const CABLE_SOURCES = {
    foxnews: {
        id: "FOXNEWSW",
        name: "Fox News",
    },
    cnn: {
        id: "CNNW",
        name: "CNN",
    },
    msnbc: {
        id: "MSNBCW",
        name: "MSNBC",
    },
    abc7: {
        id: "KGO",
        name: "ABC 7 news",
    },
};

const CABLE_SOURCE_IDS = _.map(
    CABLE_SOURCES,
    (val, key) => CABLE_SOURCES[key].id
);

const ARTICLE_SOURCES = [
    "politico",
    "washingtontimes",
    "nytimes",
    "foxnews",
    "cbsnews",
    "cnn",
    "pbs",
    "cnbc",
    "npr",
];

// Missing Associated Press, NBC News/Marist, New York Times :(
const OFFICIAL_POLLS = [
    {
        pollsterRatingId: "3", // ABC News/Washington Post
        sponsorId: null,
    },
    {
        pollsterRatingId: "391", // YouGov
        sponsorId: "133", // CBS News
    },
    {
        pollsterRatingId: "any",
        sponsorId: "143", // CNN
    },
    {
        pollsterRatingId: "any",
        sponsorId: "52", // Des Moines Register
    },
    {
        pollsterRatingId: "103", // Fox News/Beacon Research/Shaw & Co. Research
        sponsorId: null,
    },
    {
        pollsterRatingId: "215", // Monmouth University
        sponsorId: null,
    },
    {
        pollsterRatingId: "222", // NPR
        sponsorId: null,
    },
    {
        pollsterRatingId: "221", // NBC News/Wall Street Journal
        sponsorId: null,
    },
    {
        pollsterRatingId: "205", // Mellman Group
        sponsorId: "944", // The Nevada Independent
    },
    {
        pollsterRatingId: "267", // Quinnipiac University
        sponsorId: null,
    },
    {
        pollsterRatingId: "357", // University of New Hampshire
        sponsorId: "any",
    },
    {
        pollsterRatingId: "386", // Winthrop University
        sponsorId: null,
    },
    {
        pollsterRatingId: "323", // Suffolk University
        sponsorId: "135", // USA Today
    },
];

const EARLY_STATES = ["Iowa", "New Hampshire", "Nevada", "South Carolina"];

module.exports = {
    CONTEXTUAL_SEARCH_NEWS_ENDPOINT,
    INTERNET_ARCHIVE_ENDPOINT,
    BING_NEWS_ENDPOINT,
    POLL_CSV_URL,
    POLLSTER_CSV_URL,
    CANDIDATES,
    CABLE_SOURCES,
    CABLE_SOURCE_IDS,
    ARTICLE_SOURCES,
    OFFICIAL_POLLS,
    EARLY_STATES,
};
