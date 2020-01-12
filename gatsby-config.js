const colors = require("./src/colors");

module.exports = {
    siteMetadata: {
        title: "yangtrends",
        description: "Follow the latest trends for Andrew Yang's presidency",
        author: "Justin Chi",
    },
    plugins: [
        "gatsby-plugin-root-import",
        "gatsby-plugin-react-helmet",
        {
            resolve: "gatsby-source-filesystem",
            options: {
                name: "polls",
                path: `${__dirname}/src/content/polls`,
            },
        },
        "gatsby-transformer-sharp",
        "gatsby-transformer-csv",
        "gatsby-plugin-sharp",
        {
            resolve: "gatsby-plugin-manifest",
            options: {
                name: "yangtrends",
                short_name: "yangtrends",
                start_url: "/",
                background_color: colors.blue,
                theme_color: colors.blue,
                display: "minimal-ui",
                icon: "src/images/favicon-yang.png",
            },
        },
        {
            resolve: "gatsby-plugin-emotion",
        },
        "gatsby-plugin-offline",
        {
            resolve: "gatsby-plugin-google-analytics",
            options: {
                trackingId: "UA-94088018-2",
                head: false,
                anonymize: true,
                respectDNT: true,
                pageTransitionDelay: 0,
                sampleRate: 5,
                siteSpeedSampleRate: 10,
                cookieDomain: "yangtrends.org",
            },
        },
        {
            resolve: "gatsby-plugin-sentry",
            options: {
                dsn:
                    "https://82f99653a0884b37ac0fd60537dd73b9@sentry.io/1227594",
                environment: process.env.NODE_ENV,
                enabled: (() =>
                    ["production"].includes(process.env.NODE_ENV))(),
            },
        },
    ],
};
