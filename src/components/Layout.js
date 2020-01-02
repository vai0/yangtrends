import React from "react";
import PropTypes from "prop-types";
import { Global } from "@emotion/core";
import styled from "@emotion/styled";
import { css } from "@emotion/core";
import emotionNormalize from "emotion-normalize";

import "typeface-roboto";
import "typeface-merriweather";

import Container from "src/components/Container";
import Margin from "src/components/Margin";
import Navbar from "src/components/Navbar";
import Section from "src/components/Section";
import Text from "src/components/Text";

import colors from "src/colors";

const S = {};

S.Wrapper = styled.div`
    color: ${colors.text};
`;

S.Footer = styled.footer`
    background: ${colors.grey100};
    font-family: Roboto, sans-serif;
    font-size: 12px;
    color: ${colors.grey700};
`;

const Layout = ({ children }) => {
    return (
        <>
            <Global
                styles={css`
                    ${emotionNormalize}
                    *,
                    *::after,
                    *::before {
                        box-sizing: border-box;
                        -moz-osx-font-smoothing: grayscale;
                        -webkit-font-smoothing: antialiased;
                        font-smoothing: antialiased;
                    }
                `}
            />
            <S.Wrapper>
                <Navbar />
                <Container>
                    <main>{children}</main>
                </Container>
                <S.Footer>
                    <Section>
                        <Container
                            otherCss={css`
                                display: flex;
                                justify-content: center;
                                align-items: center;
                                flex-direction: column;
                            `}
                        >
                            <Margin bottom="smallx">
                                <Text type="caption">
                                    Created by a volunteer. Not affiliated with
                                    any political campaign or political action
                                    committee.
                                </Text>
                            </Margin>
                            <Text type="caption">
                                © {new Date().getFullYear()} yanghub
                            </Text>
                        </Container>
                    </Section>
                </S.Footer>
            </S.Wrapper>
        </>
    );
};

Layout.propTypes = {
    children: PropTypes.node.isRequired,
};

export default Layout;
