import React from "react";
import PropTypes from "prop-types";
import { useTable } from "react-table";
import styled from "@emotion/styled";

import Margin from "src/components/Margin";
import MaxWidth from "src/components/MaxWidth";
import Text from "src/components/Text";

import { below } from "src/styles";

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
            :last-child {
                th {
                    border-bottom: 2px solid black;
                }
            }
        }

        tr td {
            border-bottom: 1px solid grey;
        }
    }
`;

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
                                    <tr {...row.getRowProps()}>
                                        {row.cells.map(cell => (
                                            <td {...cell.getCellProps()}>
                                                {cell.render("Cell")}
                                            </td>
                                        ))}
                                    </tr>
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
