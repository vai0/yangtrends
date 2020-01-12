const BREAKPOINTS = {
    mobile: "576px",
    tablet: "768px",
};

export const below = device =>
    `@media screen and (max-width: ${BREAKPOINTS[device]})`;