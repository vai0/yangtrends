import React from "react";
import styled from "@emotion/styled";
import { css } from "@emotion/core";

import Container from "src/components/Container";
import Margin from "src/components/Margin";
import Section from "src/components/Section";
import Text from "src/components/Text";

import colors from "src/colors";

const S = {};
S.Footer = styled.footer`
    background: ${colors.grey100};
    font-family: Roboto, sans-serif;
    font-size: 12px;
    color: ${colors.grey700};
`;

const Footer = () => (
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
                        Created by a volunteer. Not affiliated with any
                        political campaign or political action committee.
                    </Text>
                </Margin>
                <Text type="caption">
                    © {new Date().getFullYear()} yangtrends
                </Text>
            </Container>
        </Section>
    </S.Footer>
);

export default Footer;
