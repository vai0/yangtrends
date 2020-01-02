import React from "react";
import { useStaticQuery, graphql } from "gatsby";
import _ from "lodash";
import styled from "@emotion/styled";
import moment from "moment";

import Header from "src/components/Header";
import Section from "src/components/Section";
import Poll from "src/components/Poll";
import Margin from "src/components/Margin";

import { CANDIDATES, EARLY_STATES } from "src/constants";
import {
    isPollOfficial,
    isPollQualifying,
    isPollAboveThreshold,
} from "src/util";

const RAW_DATE_FORMAT = "M/D/YY H:mm";

const POLL_DATES = {
    start: moment("11/14/19 0:00", RAW_DATE_FORMAT),
    end: moment("1/10/20 23:59", RAW_DATE_FORMAT),
};

const S = {};

S.Polls = styled.div`
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-start;
`;

const JanDebateQualification = () => {
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

    const yangPolls = _(allPrimaryPollsCsv.nodes)
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
        .filter(({ endDate }) => {
            const date = moment(endDate, RAW_DATE_FORMAT);
            const { start, end } = POLL_DATES;
            return date.isSameOrAfter(start) && date.isSameOrBefore(end);
        })
        .filter(poll => isPollAboveThreshold(poll))
        .map(poll => {
            poll.official = isPollOfficial(poll);
            poll.qualifying = isPollQualifying(poll);
            return poll;
        })
        .value();

    const earlyStatePolls = yangPolls.filter(({ state }) =>
        EARLY_STATES.includes(state)
    );

    return (
        <Section>
            <Margin bottom="small">
                <Header type="h2">January Debate Polling Qualifications</Header>
            </Margin>
            <Margin bottom="small">
                <Header type="h3">Two early states 7% or more</Header>
            </Margin>
            <S.Polls>
                {earlyStatePolls.map(poll => (
                    <Poll {...poll} key={poll.id} />
                ))}
            </S.Polls>
            <Margin top="small" bottom="small">
                <Header type="h2" italic>
                    - OR -
                </Header>
            </Margin>
            <Margin bottom="small">
                <Header type="h3">Any four poll 5% or more</Header>
            </Margin>
            <S.Polls>
                {yangPolls.map(poll => (
                    <Poll {...poll} key={poll.id} />
                ))}
            </S.Polls>
        </Section>
    );
};

export default JanDebateQualification;
