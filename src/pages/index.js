import React from "react";

import Layout from "src/components/Layout";
import SEO from "src/components/seo";

import Trends from "src/components/Trends";
import DebatePolls from "src/components/DebatePolls";

const IndexPage = () => {
    return (
        <Layout>
            <SEO title="Home" />
            <Trends />
            <DebatePolls />
        </Layout>
    );
};

export default IndexPage;
