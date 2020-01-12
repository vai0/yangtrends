import React from "react";
import styled from "@emotion/styled";
import Link from "gatsby-link";

import colors from "src/colors";

const S = {};

S.Navbar = styled.nav`
    height: 60px;
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

S.Logo = styled(Link)`
    font-size: 18px;
    font-weight: 700;
    padding: 20px;
    text-decoration: none;
    color: ${colors.text};

    &:visited {
        color: ${colors.text};
    }
`;

S.Anchor = styled.a`
    font-size: 14px;
    padding: 0 20px;
`;

const Navbar = () => {
    return (
        <S.Navbar>
            <S.Group>
                <S.Logo to="/">yangtrends</S.Logo>
            </S.Group>
            {/* <S.Group>
                <S.Anchor href="#">Debate Qualification</S.Anchor>
                <S.Anchor href="#">Trends</S.Anchor>
            </S.Group>
            <S.Group></S.Group> */}
        </S.Navbar>
    );
};

export default Navbar;
