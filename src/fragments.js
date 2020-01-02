import React from "react";
import { graphql } from "gatsby";

export const CableFields = graphql`
    fragment CableFields on CableType {
        id
        candidate
        publicdate
        title
        contributor
    }
`;
