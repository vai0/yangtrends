import React from "react";
import { useStaticQuery, graphql } from "gatsby";
import styled from "@emotion/styled";
import _ from "lodash";

import Header from "src/components/Header";
import Margin from "src/components/Margin";
import Section from "src/components/Section";
import Table from "src/components/Table";

import { below } from "src/styles";

import {
    formatDateShort,
    NOW,
    ONE_WEEK_AGO,
    TWO_WEEKS_AGO,
    isEarlyState,
    isPollOfficial,
    getYangPolls,
    moment,
} from "src/util";
import { CANDIDATES, CABLE_SOURCES, CABLE_SOURCE_IDS } from "src/constants";

const MONTHS = [
    { month: 3, year: 2019 },
    { month: 4, year: 2019 },
    { month: 5, year: 2019 },
    { month: 6, year: 2019 },
    { month: 7, year: 2019 },
    { month: 8, year: 2019 },
    { month: 9, year: 2019 },
    { month: 10, year: 2019 },
    { month: 11, year: 2019 },
    { month: 0, year: 2020 },
];

const S = {};
S.TopHeader = styled.div`
    max-width: 150px;
`;
S.TableRow = styled.div`
    display: flex;
    justify-content: space-around;
    flex-wrap: wrap;
`;
S.TableBlock = styled.div`
    max-width: 480px;
    padding: 0 20px;
    padding-bottom: 80px;

    ${below("mobile")} {
        padding: 0;
        padding-bottom: 40px;
    }
`;

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

const getDigitalCount = ({ all, cand, fromDate, toDate }) => {
    return all
        .filter(({ candidate }) => candidate === cand)
        .filter(({ datePublished }) => {
            const date = moment(datePublished);
            return date.isSameOrAfter(fromDate) && date.isSameOrBefore(toDate);
        }).length;
};

const cableSourceCaption = yangQuery => (
    <>
        Sourced from Internet Archive’s television news archive via the GDELT
        project with query "{yangQuery ? CANDIDATES.yang.q : "candidates"} AND
        publicdate:[
        {`${TWO_WEEKS_AGO} TO ${NOW}`}] AND mediatype:movies"
    </>
);
const candidateQueries = _(CANDIDATES)
    .values()
    .map(({ q }) => q)
    .join(", ");

const MentionsTable = ({ allCable }) => {
    const columns = React.useMemo(
        () => [
            {
                Header: "",
                id: "cand",
                columns: [
                    {
                        Header: "Candidate",
                        accessor: "candidate",
                    },
                ],
            },
            {
                Header: (
                    <S.TopHeader>Cable TV clips the week of ...</S.TopHeader>
                ),
                id: "mentions",
                columns: [
                    {
                        Header: formatDateShort(ONE_WEEK_AGO),
                        accessor: "one",
                    },
                    {
                        Header: formatDateShort(TWO_WEEKS_AGO),
                        accessor: "two",
                    },
                ],
            },
            {
                Header: "",
                id: "diff",
                columns: [
                    {
                        Header: "Diff",
                        accessor: "diff",
                    },
                ],
            },
        ],
        []
    );

    const data = _(CANDIDATES)
        .keys()
        .map(cand => {
            const { name } = CANDIDATES[cand];
            const two = getCableCount({
                all: allCable.nodes,
                cand,
                fromDate: TWO_WEEKS_AGO,
                toDate: ONE_WEEK_AGO,
            });
            const one = getCableCount({
                all: allCable.nodes,
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

    console.log("mentionsTable :", data);

    return (
        <Table
            columns={columns}
            data={React.useMemo(() => data, [data])}
            caption={
                <>
                    {cableSourceCaption()}, where "candidates" is replaced with
                    the following for each candidate - {candidateQueries}.
                </>
            }
        />
    );
};

const MentionsPerStationTable = ({ allCable }) => {
    const columns = [
        {
            Header: "",
            id: "source",
            columns: [
                {
                    Header: "Station",
                    accessor: "source",
                },
            ],
        },
        {
            Header: <S.TopHeader>Cable TV clips the week of ...</S.TopHeader>,
            id: "mentions",
            columns: [
                {
                    Header: formatDateShort(ONE_WEEK_AGO),
                    accessor: "one",
                },
                {
                    Header: formatDateShort(TWO_WEEKS_AGO),
                    accessor: "two",
                },
            ],
        },
        {
            Header: "",
            id: "diff",
            columns: [
                {
                    Header: "Diff",
                    accessor: "diff",
                },
            ],
        },
    ];

    const trackedStations = _(CABLE_SOURCES)
        .keys()
        .map(source => {
            const { id, name } = CABLE_SOURCES[source];
            const two = getStationCount({
                all: allCable.nodes,
                cand: "yang",
                source: id,
                fromDate: TWO_WEEKS_AGO,
                toDate: ONE_WEEK_AGO,
            });
            const one = getStationCount({
                all: allCable.nodes,
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
        all: allCable.nodes,
        cand: "yang",
        fromDate: TWO_WEEKS_AGO,
        toDate: ONE_WEEK_AGO,
    });

    const otherOne = getOtherStationCount({
        all: allCable.nodes,
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

    console.log("mentionsPerStation :", data);

    return (
        <Table
            columns={columns}
            data={React.useMemo(() => data, [data])}
            caption={<>{cableSourceCaption(true)}</>}
        />
    );
};

const ArticlesTable = ({ allArticles }) => {
    const columns = React.useMemo(
        () => [
            {
                Header: "",
                id: "cand",
                columns: [
                    {
                        Header: "Candidate",
                        accessor: "candidate",
                    },
                ],
            },
            {
                Header: (
                    <S.TopHeader>Online stories the week of ...</S.TopHeader>
                ),
                id: "digital",
                columns: [
                    {
                        Header: formatDateShort(ONE_WEEK_AGO),
                        accessor: "one",
                    },
                    {
                        Header: formatDateShort(TWO_WEEKS_AGO),
                        accessor: "two",
                    },
                ],
            },
            {
                Header: "",
                id: "diff",
                columns: [
                    {
                        Header: "Diff",
                        accessor: "diff",
                    },
                ],
            },
        ],
        []
    );

    const data = _(CANDIDATES)
        .keys()
        .map(cand => {
            const { name } = CANDIDATES[cand];

            const two = getDigitalCount({
                all: allArticles.nodes,
                cand,
                fromDate: TWO_WEEKS_AGO,
                toDate: ONE_WEEK_AGO,
            });
            const one = getDigitalCount({
                all: allArticles.nodes,
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

    console.log("articlesTable :", data);

    return (
        <Table
            columns={columns}
            data={React.useMemo(() => data, [data])}
            caption={
                <>
                    Sourced from Contextual Web Search's News API. Candidate
                    queries - {candidateQueries}
                </>
            }
        />
    );
};

const PollAveragesTable = ({ allPolls }) => {
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

    const yangPolls = getYangPolls(allPolls);
    const national = _.filter(yangPolls, { state: "" });
    const early = _.filter(yangPolls, ({ state }) => isEarlyState(state));
    const official = _.filter(yangPolls, poll => isPollOfficial(poll));
    const unofficial = _.filter(yangPolls, poll => !isPollOfficial(poll));

    const columns = React.useMemo(
        () => [
            {
                Header: "Period",
                accessor: "period",
            },

            {
                Header: "National",
                accessor: "national",
            },
            {
                Header: "Early States",
                accessor: "early",
            },
            {
                Header: "Official",
                accessor: "official",
            },
            {
                Header: "Unofficial",
                accessor: "unofficial",
            },
        ],
        []
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

            const formattedMonth = moment(month + 1, "M").format("MMM");
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

    console.log("pollsTable :", invertedData);

    return (
        <Table
            columns={columns}
            data={React.useMemo(() => invertedData, [invertedData])}
            caption="Sourced from FiveThirtyEight's presidential primary polls: https://github.com/fivethirtyeight/data/tree/master/polls"
        />
    );
};

const Trends = () => {
    console.log("TWO_WEEKS_AGO :", TWO_WEEKS_AGO);
    console.log("ONE_WEEK_AGO :", ONE_WEEK_AGO);
    console.log("NOW :", NOW);

    const {
        allCableType,
        allArticleType,
        allPrimaryPollsCsv,
    } = useStaticQuery(graphql`
        query {
            allPrimaryPollsCsv {
                nodes {
                    state
                    startDate: start_date
                    endDate: end_date
                    pollsterRatingId: pollster_rating_id
                    pollsterName: display_name
                    sponsorIds: sponsor_ids
                    sponsors
                    createdAt: created_at
                    candidateId: candidate_id
                    pollId: poll_id
                    pct
                    id
                }
            }
            allCableType {
                nodes {
                    id
                    candidate
                    publicdate
                    title
                    contributor
                }
            }
            allArticleType {
                nodes {
                    id
                    candidate
                    title
                    url
                    datePublished
                    provider {
                        name
                    }
                }
            }
        }
    `);

    return (
        <Section>
            <Margin bottom="medium">
                <Header type="h2">Trends</Header>
            </Margin>
            <S.TableRow>
                <S.TableBlock>
                    <Margin bottom="smallx">
                        <Header type="h3">Cable TV Mentions</Header>
                    </Margin>
                    <MentionsTable
                        allCable={allCableType}
                        allArticles={allArticleType}
                    />
                </S.TableBlock>
                <S.TableBlock>
                    <Margin bottom="smallx">
                        <Header type="h3">Mentions per Station of Yang</Header>
                    </Margin>
                    <MentionsPerStationTable allCable={allCableType} />
                </S.TableBlock>
            </S.TableRow>
            <S.TableRow>
                <S.TableBlock>
                    <Margin bottom="smallx">
                        <Header type="h3">Online Stories</Header>
                    </Margin>
                    <ArticlesTable allArticles={allArticleType} />
                </S.TableBlock>
                <S.TableBlock>
                    <Margin bottom="small">
                        <Header type="h3">Yang's Polling Averages</Header>
                    </Margin>
                    <PollAveragesTable allPolls={allPrimaryPollsCsv.nodes} />
                </S.TableBlock>
            </S.TableRow>
        </Section>
    );
};

export default Trends;
