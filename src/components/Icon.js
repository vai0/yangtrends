import React from "react";
import { css } from "@emotion/core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faCheckCircle } from "@fortawesome/free-solid-svg-icons";

library.add(faCheckCircle);

const Icon = ({ name, color, ...otherProps }) => {
    const iconCss = css`
        color: ${color};
    `;
    return <FontAwesomeIcon css={iconCss} icon={name} {...otherProps} />;
};

export default Icon;
