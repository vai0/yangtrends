import React from "react";
import PropTypes from "prop-types";
import styled from "@emotion/styled";

import Icon from "src/components/Icon";

import { formatDateRange } from "src/util";
import colors from "src/colors";

import { above, below } from "src/styles";

const roundOne = num => Math.round(parseFloat(num) * 10) / 10;

const S = {};
S.Poll = styled.div`
    font-family: Roboto;
    width: 240px;
    padding: 20px;
    border: 1px solid transparent;
    color: ${colors.grey900};

    opacity: ${({ official }) => (official ? "1" : "0.3")};

    ${above("mobile")} {
        &:hover {
            opacity: 1;
            border: 1px solid ${colors.grey200};
        }
    }

    ${below("mobile")} {
        padding: 10px;
        width: 160px;
    }
`;

S.Header = styled.div`
    display: flex;
    align-content: center;
    font-size: 28px;
    font-family: Merriweather, serif;
    margin-bottom: 5px;

    ${below("mobile")} {
        font-size: 20px;
    }
`;

S.Percent = styled.div`
    font-weight: 900;
`;

S.Check = styled.div`
    display: flex;
    align-items: center;
    margin-left: 0.5em;
`;

S.Info = styled.div`
    line-height: 1.5;
`;

S.State = styled.div`
    font-size: 18px;
    font-weight: 700;

    ${below("mobile")} {
        font-size: 16px;
    }
`;

S.SubInfo = styled.div`
    font-size: 14px;

    ${below("mobile")} {
        font-size: 12px;
    }
`;

S.Official = styled.div`
    color: ${colors.blue};
    font-weight: 700;
`;

S.Unofficial = styled.div`
    font-weight: 700;
`;

const Poll = ({
    startDate,
    endDate,
    pct,
    state,
    pollsterName,
    sponsors,
    qualifying,
    official,
}) => {
    return (
        <S.Poll qualifying={qualifying} official={official}>
            <S.Header>
                <S.Percent>{roundOne(pct)}% </S.Percent>
                {qualifying && (
                    <S.Check>
                        <Icon name="check-circle" color={colors.green} />
                    </S.Check>
                )}
            </S.Header>
            <S.Info>
                <S.State>{state || "National"}</S.State>
                <S.SubInfo>
                    {official ? (
                        <S.Official>official</S.Official>
                    ) : (
                        <S.Unofficial>unofficial</S.Unofficial>
                    )}
                    <div>{formatDateRange(startDate, endDate, "M/D/YY")}</div>
                    <div>{`${sponsors} ${sponsors &&
                        pollsterName &&
                        `—`} ${pollsterName}`}</div>
                </S.SubInfo>
            </S.Info>
        </S.Poll>
    );
};

Poll.propTypes = {
    startDate: PropTypes.string.isRequired,
    endDate: PropTypes.string.isRequired,
    pct: PropTypes.string.isRequired,
    state: PropTypes.string.isRequired,
    pollsterName: PropTypes.string.isRequired,
    sponsors: PropTypes.string,
    qualifying: PropTypes.bool,
    official: PropTypes.bool,
};

export default Poll;
