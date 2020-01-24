import React from "react";
import { useStaticQuery, graphql } from "gatsby";
import _ from "lodash";
import styled from "@emotion/styled";

import Header from "src/components/Header";
import Section from "src/components/Section";
import Poll from "src/components/Poll";
import Margin from "src/components/Margin";
import MaxWidth from "src/components/MaxWidth";
import Text from "src/components/Text";

import {
    isPollOfficial,
    isPollQualifying,
    isEarlyState,
    getYangPolls,
    moment,
} from "src/util";
import { below } from "src/styles";

const RAW_DATE_FORMAT = "M/D/YY H:mm";

const POLL_DATES = {
    start: moment("12/13/19 0:00", RAW_DATE_FORMAT),
    end: moment("02/06/20 23:59", RAW_DATE_FORMAT),
};

const S = {};
S.Polls = styled.div`
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-start;

    ${below("mobile")} {
        justify-content: center;
    }
`;

// sorts qualifying, official, then unofficial, each by endDate asc
const sortPolls = polls => {
    const qualifyingPolls = _(polls)
        .filter("qualifying")
        .orderBy(({ createdAt }) => moment(createdAt, "M/DD/YY HH:mm").unix(), [
            "desc",
        ])
        .value();
    const officialPolls = _(polls)
        .filter(({ official, qualifying }) => !qualifying && official)
        .orderBy(({ createdAt }) => moment(createdAt, "M/DD/YY HH:mm").unix(), [
            "desc",
        ])
        .value();
    const unofficial = _(polls)
        .filter(({ official, qualifying }) => !official && !qualifying)
        .orderBy(({ createdAt }) => moment(createdAt, "M/DD/YY HH:mm").unix(), [
            "desc",
        ])
        .value();
    return [...qualifyingPolls, ...officialPolls, ...unofficial];
};

const DebatePolls = () => {
    const { allPrimaryPollsCsv } = useStaticQuery(graphql`
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
            allPollstersCsv {
                nodes {
                    pollsterRatingId: Pollster_Rating_ID
                    pollster: Pollster
                }
            }
        }
    `);

    const cleanedPolls = getYangPolls(allPrimaryPollsCsv.nodes);
    const allPolls = _(cleanedPolls)
        .filter(({ createdAt }) => {
            const date = moment(createdAt, RAW_DATE_FORMAT);
            const { start, end } = POLL_DATES;
            return date.isSameOrAfter(start) && date.isSameOrBefore(end);
        })
        .map(poll => ({
            ...poll,
            official: isPollOfficial(poll),
            qualifying: isPollQualifying(poll),
        }))
        .value();

    const earlyStatePolls = allPolls
        .filter(({ state }) => isEarlyState(state))
        .map(poll => ({
            ...poll,
            qualifying: isPollQualifying(poll, true),
        }));

    const allPollsSorted = sortPolls(allPolls);
    const earlyStatePollsSorted = sortPolls(earlyStatePolls);

    return (
        <Section>
            <Margin bottom="small">
                <Header type="h2">February Debate Poll Requirements</Header>
            </Margin>
            <Margin bottom="small">
                <Margin bottom="smallx">
                    <Header type="h3">
                        Two official early state polls 7% or more
                    </Header>
                </Margin>
                <Text type="p1" center>
                    (Iowa excluded)
                </Text>
            </Margin>
            <S.Polls>
                {earlyStatePollsSorted.map(poll => (
                    <Poll {...poll} key={poll.id} />
                ))}
            </S.Polls>
            <Margin top="small" bottom="small">
                <Header type="h2" italic>
                    - OR -
                </Header>
            </Margin>
            <Margin bottom="small">
                <Margin bottom="smallx">
                    <Header type="h3">Four official polls 5% or more</Header>
                </Margin>
                <Text type="p1" center>
                    (Iowa excluded)
                </Text>
            </Margin>
            <Margin bottom="medium">
                <S.Polls>
                    {allPollsSorted.map(poll => (
                        <Poll {...poll} key={poll.id} />
                    ))}
                </S.Polls>
            </Margin>
            <Margin bottom="smallx">
                <MaxWidth value="600px">
                    <Text type="p1">
                        Polls must be released between{" "}
                        {POLL_DATES.start.format("MMM Do, YYYY")} and{" "}
                        {POLL_DATES.end.format("MMM Do, YYYY")} 11:59 ET
                    </Text>
                </MaxWidth>
            </Margin>
            <MaxWidth>
                <Text type="caption">
                    Sourced from FiveThirtyEight's presidential primary polls:
                    https://github.com/fivethirtyeight/data/tree/master/polls
                </Text>
            </MaxWidth>
        </Section>
    );
};

export default DebatePolls;
