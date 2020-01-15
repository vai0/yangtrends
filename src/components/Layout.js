import React from "react";
import PropTypes from "prop-types";
import { Global } from "@emotion/core";
import styled from "@emotion/styled";
import { css } from "@emotion/core";
import emotionNormalize from "emotion-normalize";

import "typeface-roboto";
import "typeface-merriweather";
import "typeface-inconsolata";

import Container from "src/components/Container";
import Navbar from "src/components/Navbar";
import Footer from "src/components/Footer";

import colors from "src/colors";

const S = {};

S.Wrapper = styled.div`
    color: ${colors.text};
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

                    a {
                        color: ${colors.text};

                        &:visited {
                            color: ${colors.text};
                        }
                    }
                `}
            />
            <S.Wrapper>
                <Navbar />
                <Container>
                    <main>{children}</main>
                </Container>
                <Footer />
            </S.Wrapper>
        </>
    );
};

Layout.propTypes = {
    children: PropTypes.node.isRequired,
};

export default Layout;
