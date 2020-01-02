import React from "react";
import PropTypes from "prop-types";
import styled from "@emotion/styled";
import { css } from "@emotion/core";

const Wrapper = styled.div`
    margin: 0 auto;
    max-width: 1000px;
    padding: 0 20px;
`;

const Container = ({ children, otherCss }) => {
    return (
        <Wrapper
            css={css`
                ${otherCss}
            `}
        >
            {children}
        </Wrapper>
    );
};

Container.propTypes = {
    children: PropTypes.node.isRequired,
};

export default Container;
