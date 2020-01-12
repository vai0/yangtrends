import React from "react";
import { useStaticQuery, graphql } from "gatsby";
import { useTable } from "react-table";
import styled from "@emotion/styled";
import _ from "lodash";
import moment from "moment";

import Header from "src/components/Header";
import Margin from "src/components/Margin";
import MaxWidth from "src/components/MaxWidth";
import Section from "src/components/Section";
import Text from "src/components/Text";

import { formatDateShort, NOW, ONE_WEEK_AGO, TWO_WEEKS_AGO } from "src/util";
import { CANDIDATES, CABLE_SOURCES, CABLE_SOURCE_IDS } from "src/constants";
import { below } from "src/styles";

const S = {};
S.TableWrapper = styled.div`
    display: flex;
    justify-content: center;

    table {
        border-spacing: 0;
        font-family: Roboto, sans-serif;
        font-size: 16px;

        ${below("mobile")} {
            font-size: 14px;
        }

        tr {
            :last-child {
                td {
                    border-bottom: 0;
                }
            }
        }

        th,
        td {
            margin: 0;
            padding: 0.5rem;
            border-bottom: 1px solid black;
            text-align: left;

            :last-child {
                border-right: 0;
            }
        }

        thead tr {
            :last-child {
                th {
                    border-bottom: 2px solid black;
                }
            }
        }

        tr td {
            border-bottom: 1px solid grey;
        }
    }
`;
S.TopHeader = styled.div`
    max-width: 150px;
`;

const getCableCount = ({ all, cand, fromDate, toDate }) => {
    const cableForCand = all
        .filter(({ candidate }) => candidate === cand)
        .filter(({ publicdate }) => {
            const date = moment(publicdate);
            return date.isSameOrAfter(fromDate) && date.isSameOrBefore(toDate);
        });
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

const getDigitalCount = ({ all, cand, fromDate, toDate }) => {
    return all
        .filter(({ candidate }) => candidate === cand)
        .filter(({ datePublished }) => {
            const date = moment(datePublished);
            return date.isSameOrAfter(fromDate) && date.isSameOrBefore(toDate);
        }).length;
};

const getMentionsPerStation = ({ all, source, fromDate, toDate }) => {
    const yangMentions = _.filter(all, { candidate: "yang" });
    return _.mapValues(CABLE_SOURCES, ({ id }) =>
        _(yangMentions)
            .filter({ contributor: id })
            .filter(({ publicdate }) => {
                const date = moment(publicdate);
                return (
                    date.isSameOrAfter(fromDate) && date.isSameOrBefore(toDate)
                );
            })
            .size()
    )[source];
};

const Table = ({ columns, data, caption }) => {
    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow,
    } = useTable({
        columns,
        data,
    });

    return (
        <>
            <Margin bottom="smallx">
                <S.TableWrapper>
                    <table {...getTableProps()}>
                        <thead>
                            {headerGroups.map(headerGroup => (
                                <tr {...headerGroup.getHeaderGroupProps()}>
                                    {headerGroup.headers.map(header => (
                                        <th {...header.getHeaderProps()}>
                                            {header.render("Header")}
                                        </th>
                                    ))}
                                </tr>
                            ))}
                        </thead>
                        <tbody {...getTableBodyProps()}>
                            {rows.map(row => {
                                prepareRow(row);
                                return (
                                    <tr {...row.getRowProps()}>
                                        {row.cells.map(cell => (
                                            <td {...cell.getCellProps()}>
                                                {cell.render("Cell")}
                                            </td>
                                        ))}
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </S.TableWrapper>
            </Margin>
            <MaxWidth value="350px">
                <Text type="caption">{caption}</Text>
            </MaxWidth>
        </>
    );
};

const MentionsTable = ({ allCable, caption }) => {
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
                        Header: formatDateShort(TWO_WEEKS_AGO),
                        accessor: "two",
                    },
                    {
                        Header: formatDateShort(ONE_WEEK_AGO),
                        accessor: "one",
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

    const data = React.useMemo(
        () =>
            _(CANDIDATES)
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
                        two: two.main,
                        one: one.main,
                        diff: diff.main,
                    };
                })
                .orderBy(["one"], ["desc"])
                .value(),
        []
    );

    return <Table columns={columns} data={data} caption={caption} />;
};

const MentionsPerStationTable = ({ allCable, caption }) => {
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
                    Header: formatDateShort(TWO_WEEKS_AGO),
                    accessor: "two",
                },
                {
                    Header: formatDateShort(ONE_WEEK_AGO),
                    accessor: "one",
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

    const data = React.useMemo(
        () =>
            _(CABLE_SOURCES)
                .keys()
                .map(source => {
                    const { name } = CABLE_SOURCES[source];
                    const two = getMentionsPerStation({
                        all: allCable.nodes,
                        source,
                        fromDate: TWO_WEEKS_AGO,
                        toDate: ONE_WEEK_AGO,
                    });
                    const one = getMentionsPerStation({
                        all: allCable.nodes,
                        source,
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
                .value(),
        []
    );

    return <Table columns={columns} data={data} caption={caption} />;
};

const ArticlesTable = ({ allArticles, caption }) => {
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
                        Header: formatDateShort(TWO_WEEKS_AGO),
                        accessor: "two",
                    },
                    {
                        Header: formatDateShort(ONE_WEEK_AGO),
                        accessor: "one",
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

    const data = React.useMemo(
        () =>
            _(CANDIDATES)
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
                        fromDate: TWO_WEEKS_AGO,
                        toDate: ONE_WEEK_AGO,
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
                .value(),
        []
    );

    return <Table columns={columns} data={data} caption={caption} />;
};

const Trends = () => {
    const { allCableType, allArticleType } = useStaticQuery(graphql`
        query {
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

    const cableSourceCaption = yangQuery => (
        <>
            Sourced from Internet Archive’s television news archive via the
            GDELT project with query "
            {yangQuery ? CANDIDATES.yang.q : "candidates"} AND publicdate:[
            {`${TWO_WEEKS_AGO} TO ${NOW}`}] AND mediatype:movies"
        </>
    );
    const candidateQueries = _(CANDIDATES)
        .values()
        .map(({ q }) => q)
        .join(", ");

    return (
        <Section>
            <Margin bottom="small">
                <Header type="h2">Trends</Header>
            </Margin>
            <Margin bottom="small">
                <Header type="h3">Cable TV Mentions</Header>
            </Margin>
            <Margin bottom="large">
                <MentionsTable
                    allCable={allCableType}
                    allArticles={allArticleType}
                    caption={
                        <>
                            {cableSourceCaption()}, where "candidates" is
                            replaced with the following for each candidate -{" "}
                            {candidateQueries}. The results only include the
                            following sources: {CABLE_SOURCE_IDS.join(", ")}
                        </>
                    }
                />
            </Margin>
            <Margin bottom="small">
                <Header type="h3">Mentions per Station of Yang</Header>
            </Margin>
            <Margin bottom="large">
                <MentionsPerStationTable
                    allCable={allCableType}
                    caption={
                        <>
                            {cableSourceCaption(true)}. The results are filtered
                            to only include sources from{" "}
                            {CABLE_SOURCE_IDS.join(", ")}.
                        </>
                    }
                />
            </Margin>
            <Margin bottom="small">
                <Header type="h3">Online Stories</Header>
            </Margin>
            <Margin bottom="large">
                <ArticlesTable
                    allArticles={allArticleType}
                    caption={
                        <>
                            Sourced from Contextual Web Search's News API.
                            Candidate queries - {candidateQueries}
                        </>
                    }
                />
            </Margin>
        </Section>
    );
};

export default Trends;