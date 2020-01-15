import React from "react";
import PropTypes from "prop-types";
import { useTable } from "react-table";
import styled from "@emotion/styled";
import _ from "lodash";

import Margin from "src/components/Margin";
import MaxWidth from "src/components/MaxWidth";
import Text from "src/components/Text";

import { below, hexToRgba } from "src/styles";
import colors from "src/colors";

const S = {};
S.TableWrapper = styled.div`
    display: flex;
    justify-content: center;

    table {
        border-spacing: 0;
        font-family: Roboto, sans-serif;
        font-size: 16px;

        ${below("mobile")} {
            font-size: 14px;
        }

        tr {
            :last-child {
                td {
                    border-bottom: 0;
                }
            }
        }

        th,
        td {
            margin: 0;
            padding: 0.5rem;
            border-bottom: 1px solid black;
            text-align: left;

            :last-child {
                border-right: 0;
            }
        }

        thead tr {
            font-size: 14px;

            :last-child {
                th {
                    border-bottom: 2px solid black;
                }
            }
        }

        th {
            text-align: center;

            &:first-of-type {
                text-align: left;
            }
        }

        tr td {
            text-align: center;
            border-bottom: 1px solid grey;
            font-family: Inconsolata, Consolas, Monaco, monospace;

            &:first-of-type {
                text-align: left;
                font-weight: 700;
                font-family: Roboto, sans-serif;
                font-size: 14px;
            }
        }
    }
`;

S.Td = styled.td`
    background: ${({ isPositive, isNegative }) => {
        let color;
        if (isPositive) {
            color = hexToRgba(colors.green, 0.075);
        } else if (isNegative) {
            color = hexToRgba(colors.red, 0.075);
        }
        return color;
    }};
    color: ${({ isYang }) => isYang && colors.blue};
`;

S.Tr = styled.tr`
    background: ${({ isYang }) => isYang && hexToRgba(colors.blue, 0.05)};
`;

const Td = ({ children }) => {
    const { value } = children.props.cell;
    const isDiff = children.props.column.id === "diff";
    const isYang = _.isString(value) && value.toLowerCase().includes("yang");
    let isPositive;
    let isNegative;
    let inner = value;

    if (_.isNumber(value) && isDiff) {
        if (value > 0) {
            inner = `+${value}`;
            isPositive = true;
        } else if (value < 0) {
            isNegative = true;
        }
    }

    return (
        <S.Td isPositive={isPositive} isNegative={isNegative} isYang={isYang}>
            {inner}
        </S.Td>
    );
};

const Tr = ({ children }) => {
    const isYang = _.some(children, ({ props }) => {
        const { value } = props.children.props.cell;
        return _.isString(value) && value.toLowerCase().includes("yang");
    });

    return <S.Tr isYang={isYang}>{children}</S.Tr>;
};

const Table = ({ columns, data, caption }) => {
    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow,
    } = useTable({
        columns,
        data,
    });

    return (
        <>
            <Margin bottom="smallx">
                <S.TableWrapper>
                    <table {...getTableProps()}>
                        <thead>
                            {headerGroups.map(headerGroup => (
                                <tr {...headerGroup.getHeaderGroupProps()}>
                                    {headerGroup.headers.map(header => (
                                        <th {...header.getHeaderProps()}>
                                            {header.render("Header")}
                                        </th>
                                    ))}
                                </tr>
                            ))}
                        </thead>
                        <tbody {...getTableBodyProps()}>
                            {rows.map(row => {
                                prepareRow(row);
                                return (
                                    <Tr {...row.getRowProps()}>
                                        {row.cells.map(cell => (
                                            <Td {...cell.getCellProps()}>
                                                {cell.render("Cell")}
                                            </Td>
                                        ))}
                                    </Tr>
                                );
                            })}
                        </tbody>
                    </table>
                </S.TableWrapper>
            </Margin>
            <MaxWidth value="350px">
                <Text type="caption">{caption}</Text>
            </MaxWidth>
        </>
    );
};

Table.propTypes = {
    columns: PropTypes.array.isRequired,
    data: PropTypes.array.isRequired,
    caption: PropTypes.node,
};

export default Table;
