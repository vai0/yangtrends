import React from "react";
import PropTypes from "prop-types";
import styled from "@emotion/styled";
import { css } from "@emotion/core";

import colors from "src/colors";
import { below } from "src/styles";

const sharedStyles = () => css`
    font-family: Roboto, sans-serif;
    line-height: 1.4;
    text-align: left;
    margin: 0;
`;

const Caption = styled.p`
    ${sharedStyles}
    font-size: 12px;
    color: ${colors.grey500};

    ${below("mobile")} {
        font-size: 10px;
    }
`;

const P1 = styled.p`
    ${sharedStyles}
    font-size: 16px;
    color: ${colors.grey800};

    ${below("mobile")} {
        font-size: 14px;
    }
`;

const Header = ({ type, children }) => {
    let Component;
    if (type === "caption") {
        Component = Caption;
    } else if (type === "p1") {
        Component = P1;
    }

    return <Component>{children}</Component>;
};

Header.propTypes = {
    type: PropTypes.oneOf(["p1", "caption"]).isRequired,
    children: PropTypes.node.isRequired,
};

export default Header;
