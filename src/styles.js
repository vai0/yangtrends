const BREAKPOINTS = {
    mobile: "576px",
    tablet: "768px",
};

export const below = device =>
    `@media screen and (max-width: ${BREAKPOINTS[device]})`;

export const above = device =>
    `@media screen and (min-width: ${BREAKPOINTS[device]})`;

export const hexToRgba = (hex, a) => {
    const arr = hex
        .replace(
            /^#?([a-f\d])([a-f\d])([a-f\d])$/i,
            (m, r, g, b) => "#" + r + r + g + g + b + b
        )
        .substring(1)
        .match(/.{2}/g)
        .map(x => parseInt(x, 16));
    return `rgba(${arr.join(",")}, ${a})`;
};
