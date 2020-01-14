import React from "react";

import Layout from "src/components/Layout";
import SEO from "src/components/seo";

import Trends from "src/components/Trends";
import JanDebateQualification from "src/components/JanDebateQualification";

const IndexPage = () => {
    return (
        <Layout>
            <SEO title="Home" />
            <Trends />
            <JanDebateQualification />
        </Layout>
    );
};

export default IndexPage;
