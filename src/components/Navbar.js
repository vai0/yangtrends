import React from "react";
import styled from "@emotion/styled";
import Link from "gatsby-link";

import Container from "src/components/Container";

import colors from "src/colors";
import yangLogo from "src/images/yang-icon.png";

const S = {};

S.Navbar = styled.nav`
    background: rgba(255, 255, 255, 0.9);
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-family: Roboto, sans-serif;
    position: sticky;
    top: 0;
`;

S.Group = styled.div`
    display: flex;
    align-items: center;
`;

S.LogoWrapper = styled(Link)`
    font-size: 18px;
    font-weight: 700;
    padding: 20px;
    text-decoration: none;
    color: ${colors.text};
    display: flex;
    align-items: flex-end;
    position: relative;

    &:visited {
        color: ${colors.text};
    }
`;

S.LogoImage = styled.img`
    margin-right: 2px;
    width: 20px;
`;

S.Anchor = styled.a`
    font-size: 14px;
    padding: 0 20px;
`;

const Navbar = () => {
    return (
        <S.Navbar>
            <Container>
                <S.Group>
                    <S.LogoWrapper to="/">
                        <S.LogoImage src={yangLogo} />
                        yangtrends
                    </S.LogoWrapper>
                </S.Group>
            </Container>
        </S.Navbar>
    );
};

export default Navbar;
