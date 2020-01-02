import React from "react";
import { useStaticQuery, graphql } from "gatsby";

const Financials = () => {
    const {
        allFinancialType: { nodes },
    } = useStaticQuery(graphql`
        query {
            allFinancialType {
                nodes {
                    cash_on_hand_end_period
                    disbursements
                    receipts
                    candidate
                    coverage_end_date
                }
            }
        }
    `);

    return <div>Financials</div>;
};

export default Financials;
