import React from "react";
import { useStaticQuery, graphql } from "gatsby";

const Headlines = () => {
    const {
        allHeadlineType: { nodes },
    } = useStaticQuery(graphql`
        query {
            allHeadlineType {
                nodes {
                    id
                    url
                    name
                    datePublished
                    image {
                        thumbnail {
                            contentUrl
                        }
                    }
                    provider {
                        name
                    }
                }
            }
        }
    `);

    return <div>Headlines</div>;
};

export default Headlines;
