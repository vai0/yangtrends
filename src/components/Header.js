import React from "react";
import PropTypes from "prop-types";
import styled from "@emotion/styled";
import { css } from "@emotion/core";

import { below } from "src/styles";

const sharedStyles = ({ italic }) => css`
    font-family: Merriweather, serif;
    font-weight: 700;
    line-height: 1.2;
    text-align: center;
    margin: 0;
    font-style: ${italic && "italic"};
`;

const H2 = styled.h2`
    ${sharedStyles}
    font-size: 48px;

    ${below("mobile")} {
        font-size: 28px;
    }
`;

const H3 = styled.h3`
    ${sharedStyles}
    font-size: 24px;

    ${below("mobile")} {
        font-size: 20px;
    }
`;

const Header = ({ type, italic, children }) => {
    let Component;
    if (type === "h2") {
        Component = H2;
    } else if (type === "h3") {
        Component = H3;
    }

    return <Component italic={italic}>{children}</Component>;
};

Header.propTypes = {
    type: PropTypes.oneOf(["h2", "h3"]).isRequired,
    italic: PropTypes.bool,
    children: PropTypes.node.isRequired,
};

export default Header;
