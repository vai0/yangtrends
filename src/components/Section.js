import React from "react";
import PropTypes from "prop-types";
import styled from "@emotion/styled";

import { below } from "src/styles";

const Wrapper = styled.div`
    padding: 80px 0;

    ${below("mobile")} {
        padding: 40px 0;
    }
`;

const Section = ({ children }) => {
    return <Wrapper>{children}</Wrapper>;
};

Section.propTypes = {
    children: PropTypes.node.isRequired,
};

export default Section;
