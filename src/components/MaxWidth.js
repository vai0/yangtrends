import React from "react";
import PropTypes from "prop-types";
import { css } from "@emotion/core";

const MaxWidth = ({ value, children }) => {
    return (
        <div
            css={css`
                max-width: ${value};
                margin: 0 auto;
            `}
        >
            {children}
        </div>
    );
};

MaxWidth.defaultProps = {
    value: "350px",
};

MaxWidth.propTypes = {
    value: PropTypes.string,
    children: PropTypes.node.isRequired,
};

export default MaxWidth;
