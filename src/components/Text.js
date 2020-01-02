import React from "react";
import PropTypes from "prop-types";
import styled from "@emotion/styled";
import { css } from "@emotion/core";

import colors from "src/colors";

const sharedStyles = () => css`
    line-height: 1.4;
    text-align: left;
    margin: 0;
`;

const Caption = styled.p`
    ${sharedStyles}
    font-family: Roboto, sans-serif;
    font-size: 12px;
    color: ${colors.grey500};
`;

const Header = ({ type, children }) => {
    let Component;
    if (type === "caption") {
        Component = Caption;
    }

    return <Component>{children}</Component>;
};

Header.propTypes = {
    type: PropTypes.oneOf(["caption"]).isRequired,
    children: PropTypes.node.isRequired,
};

export default Header;
