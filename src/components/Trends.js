import React from "react";
import { useStaticQuery, graphql } from "gatsby";
import styled from "@emotion/styled";
import _ from "lodash";

import Header from "src/components/Header";
import Margin from "src/components/Margin";
import Section from "src/components/Section";
import Table from "src/components/Table";

import { below } from "src/styles";

import { formatDateShort, NOW, ONE_WEEK_AGO, TWO_WEEKS_AGO } from "src/util";
import { CANDIDATES } from "src/constants";

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

const MentionsTable = ({ data }) => {
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

const MentionsPerStationTable = ({ data }) => {
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

    console.log("mentionsPerStation :", data);

    return (
        <Table
            columns={columns}
            data={React.useMemo(() => data, [data])}
            caption={<>{cableSourceCaption(true)}</>}
        />
    );
};

const ArticlesTable = ({ data }) => {
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

const PollAveragesTable = ({ data }) => {
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

    console.log("pollAverages", data);

    return (
        <Table
            columns={columns}
            data={React.useMemo(() => data, [data])}
            caption="Sourced from FiveThirtyEight's presidential primary polls: https://github.com/fivethirtyeight/data/tree/master/polls"
        />
    );
};

const Trends = () => {
    console.log("TWO_WEEKS_AGO :", TWO_WEEKS_AGO);
    console.log("ONE_WEEK_AGO :", ONE_WEEK_AGO);
    console.log("NOW :", NOW);

    const {
        allPollAverageRowType,
        allCableMentionRowType,
        allArticleTableRowType,
        allStationMentionRowType,
    } = useStaticQuery(graphql`
        query {
            allPollAverageRowType {
                nodes {
                    national
                    official
                    period
                    unofficial
                    early
                }
            }
            allCableMentionRowType {
                nodes {
                    two
                    one
                    diff
                    candidate
                }
            }
            allArticleTableRowType {
                nodes {
                    candidate
                    diff
                    one
                    two
                }
            }
            allStationMentionRowType {
                nodes {
                    one
                    two
                    source
                    diff
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
                    <MentionsTable data={allCableMentionRowType.nodes} />
                </S.TableBlock>
                <S.TableBlock>
                    <Margin bottom="smallx">
                        <Header type="h3">Mentions per Station of Yang</Header>
                    </Margin>
                    <MentionsPerStationTable
                        data={allStationMentionRowType.nodes}
                    />
                </S.TableBlock>
            </S.TableRow>
            <S.TableRow>
                <S.TableBlock>
                    <Margin bottom="smallx">
                        <Header type="h3">Online Stories</Header>
                    </Margin>
                    <ArticlesTable data={allArticleTableRowType.nodes} />
                </S.TableBlock>
                <S.TableBlock>
                    <Margin bottom="small">
                        <Header type="h3">Yang's Polling Averages</Header>
                    </Margin>
                    <PollAveragesTable data={allPollAverageRowType.nodes} />
                </S.TableBlock>
            </S.TableRow>
        </Section>
    );
};

export default Trends;
