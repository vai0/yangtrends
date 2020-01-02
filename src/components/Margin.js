import React from "react";
import PropTypes from "prop-types";
import styled from "@emotion/styled";
import _ from "lodash";

import { below } from "src/styles";

const sizeToPx = {
    smallx: { desktop: "20px", mobile: "10px" },
    small: { desktop: "40px", mobile: "20px" },
    medium: { desktop: "60px", mobile: "30px" },
    large: { desktop: "80px", mobile: "40px" },
};

const sizes = _.keys(sizeToPx);

const Component = styled.div`
    margin-top: ${({ top }) => top && sizeToPx[top].desktop};
    margin-right: ${({ right }) => right && sizeToPx[right].desktop};
    margin-bottom: ${({ bottom }) => bottom && sizeToPx[bottom].desktop};
    margin-left: ${({ left }) => left && sizeToPx[left].desktop};

    ${below("mobile")} {
        margin-top: ${({ top }) => top && sizeToPx[top].mobile};
        margin-right: ${({ right }) => right && sizeToPx[right].mobile};
        margin-bottom: ${({ bottom }) => bottom && sizeToPx[bottom].mobile};
        margin-left: ${({ left }) => left && sizeToPx[left].mobile};
    }
`;

const Margin = ({ children, top, right, bottom, left }) => {
    return (
        <Component top={top} right={right} bottom={bottom} left={left}>
            {children}
        </Component>
    );
};

Margin.propTypes = {
    top: PropTypes.oneOf(sizes),
    right: PropTypes.oneOf(sizes),
    bottom: PropTypes.oneOf(sizes),
    left: PropTypes.oneOf(sizes),
    children: PropTypes.node.isRequired,
};

export default Margin;
