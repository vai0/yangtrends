const axios = require("axios");
const qs = require("query-string");
const _ = require("lodash");

require("dotenv").config({
    path: ".env",
});

const {
    CANDIDATES,
    CONTEXTUAL_SEARCH_NEWS_ENDPOINT,
    INTERNET_ARCHIVE_ENDPOINT,
    BING_NEWS_ENDPOINT,
} = require("./src/constants");
const { now, twoWeeksAgo } = require("./src/util");

const paramsSerializer = params =>
    qs.stringify(params, { arrayFormat: "bracket" });

const getArticles = async (fromDate, q) => {
    const PAGE_SIZE = 50;
    const articleRequest = async (pageNumber = 1) => {
        const { data } = await axios.get(CONTEXTUAL_SEARCH_NEWS_ENDPOINT, {
            headers: {
                "X-RapidAPI-Key": process.env.RAPID_API_KEY,
            },
            params: {
                autoCorrect: false,
                pageNumber,
                pageSize: PAGE_SIZE,
                safeSearch: false,
                fromPublishedDate: fromDate,
                toPublishedDate: now(),
                q,
            },
            paramsSerializer,
        });
        return data;
    };

    const firstPage = await articleRequest();
    const totalPages = Math.ceil(firstPage.totalCount / PAGE_SIZE);
    const articles = [Promise.resolve(firstPage)];

    for (let i = 2; i <= totalPages; i++) {
        articles.push(articleRequest(i));
    }

    const allArticles = await Promise.all(articles);

    return _(allArticles)
        .map(({ value }) => value)
        .flatten()
        .value();
};

const getCable = async (fromDate, q) => {
    const PAGE_SIZE = 100000000;
    const FIELDS = [
        "contributor",
        "identifier",
        "mediatype",
        "publicdate",
        "source",
        "title",
    ];
    const cableRequest = async (pageNumber = 1) => {
        const dateRange = `publicdate:[${fromDate} TO ${now()}]`;
        const mediatype = "mediatype:movies";
        const { data } = await axios.get(INTERNET_ARCHIVE_ENDPOINT, {
            params: {
                q: `${q} AND ${dateRange} AND ${mediatype}`,
                fl: FIELDS,
                rows: PAGE_SIZE,
                page: pageNumber,
                output: "json",
            },
            paramsSerializer,
        });
        return data.response;
    };

    const firstPage = await cableRequest();
    const totalPages = Math.ceil(firstPage.numFound / PAGE_SIZE);
    let items = [Promise.resolve(firstPage)];

    for (let i = 2; i <= totalPages; i++) {
        items.push(cableRequest(i));
    }

    items = await Promise.all(items);

    return _(items)
        .map(({ docs }) => docs)
        .flatten()
        .map(item => {
            // add [field]: null if field doesn't exist on item
            FIELDS.forEach(f => {
                if (!item[f]) {
                    item[f] = null;
                }
            });
            return item;
        })
        .value();
};

const getNewsForAllCandidates = async getNewsFunc => {
    const allNews = [];
    for (cand in CANDIDATES) {
        let news = await getNewsFunc(twoWeeksAgo(), CANDIDATES[cand].q);
        news = news.map(n => {
            n.candidate = cand;
            return n;
        });
        allNews.push(news);
    }
    return _.flatten(allNews);
};

const getHeadlines = async () => {
    const response = await axios.get(BING_NEWS_ENDPOINT, {
        headers: {
            "Ocp-Apim-Subscription-Key": process.env.BING_NEWS_API_KEY,
        },
        params: {
            q: CANDIDATES.yang.q,
            mkt: "en-US",
            headlineCount: 20,
            count: 20,
            category: "Politics",
            freshness: "Week",
        },
        paramsSerializer,
    });
    return response.data.value;
};

const getFinancials = async () => {
    const candidateIds = _.map(CANDIDATES, ({ fecId }) => fecId);
    const response = await axios.get(
        "https://api.open.fec.gov/v1/candidates/totals/",
        {
            params: {
                api_key: process.env.DATA_GOV_API_KEY,
                candidate_id: candidateIds,
            },
            paramsSerializer: params =>
                qs.stringify(params, { arrayFormat: "none" }),
        }
    );
    return response.data.results.map(fin => {
        const candidate = _.findKey(CANDIDATES, { fecId: fin.candidate_id });
        return { ...fin, candidate };
    });
};

exports.sourceNodes = async ({
    actions,
    createNodeId,
    createContentDigest,
}) => {
    const { createNode } = actions;

    try {
        // Articles
        const allArticles = await getNewsForAllCandidates(getArticles);
        allArticles.forEach(article => {
            const articleNodeMeta = {
                id: createNodeId(`${article.candidate}${article.url}`),
                parent: null,
                children: [],
                internal: {
                    type: "ArticleType",
                    mediaType: "application/json",
                    content: JSON.stringify(article),
                    contentDigest: createContentDigest(article),
                },
            };
            createNode({ ...article, ...articleNodeMeta });
        });

        // Cable TV mentions
        const allCable = await getNewsForAllCandidates(getCable);
        allCable.forEach(cable => {
            const cableNodeMeta = {
                id: createNodeId(`${cable.candidate}${cable.identifier}`),
                parent: null,
                children: [],
                internal: {
                    type: "CableType",
                    mediaType: "application/json",
                    content: JSON.stringify(cable),
                    contentDigest: createContentDigest(cable),
                },
            };
            createNode({ ...cable, ...cableNodeMeta });
        });

        // Headline articles
        const allHeadlines = await getHeadlines();
        allHeadlines.forEach(headline => {
            const headlineNodeMeta = {
                id: createNodeId(`${headline.url}${headline.datePublished}`),
                parent: null,
                children: [],
                internal: {
                    type: "HeadlineType",
                    mediaType: "application/json",
                    content: JSON.stringify(headline),
                    contentDigest: createContentDigest(headline),
                },
            };
            createNode({ ...headline, ...headlineNodeMeta });
        });

        // Candidate financials
        const allFinancials = await getFinancials();
        allFinancials.forEach(financial => {
            const financialNodeMeta = {
                id: createNodeId(financial.candidate_id),
                parent: null,
                children: [],
                internal: {
                    type: "FinancialType",
                    mediaType: "application/json",
                    content: JSON.stringify(financial),
                    contentDigest: createContentDigest(financial),
                },
            };
            createNode({ ...financial, ...financialNodeMeta });
        });
    } catch (err) {
        console.log("ERROR", err);
        process.exit(1);
    }
};
