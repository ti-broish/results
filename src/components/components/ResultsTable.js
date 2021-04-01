import React from 'react';

import { formatCount, formatPercentage } from '../Util';

import styled from 'styled-components';

const ResultsTableDiv = styled.table`
    width: 100%;
    color: #666;
    font-size: 28px;

    td {
        padding: 5px 20px;
        box-sizing: border-box;
    }

    tr {
        transition: opacity 2s ease;
    }

    .vote-percent-bar {
        height: 10px;
        background-color: #eee;
        transition: width 2s ease;
        width: 0;
    }

    .vote-percent-remaining {
        display: inline-block;
        border-top: none;
        box-sizing: border-box;
        margin: 5px 0;
        border-color: #ccc;
    }

    td:nth-child(1) {
        text-align: right;
        width: 72px;
    }

    td:nth-child(2) {
        width: calc(100% - 72px);
    }

    .threshold-row {
        font-size: 12px;
        color: #777;

        hr {
            border-color: #aaa;
            border-top: none;
        }
    }

    .votes-count {
        font-size: 18px;
        margin-left: 10px;
    }

    ${props => props.embed? `
        font-size: 18px;
        .votes-count {
            font-size: 12px;
        }
        td {
            padding: 5px 5px;
        }
        .threshold-row {
            font-size: 8px;
        }
    ` : null}
`;

import ResultsTableRow from './ResultsTableRow';

export default props => {

    let displayParties = [];

    for(var i = 0; i < props.results.length; i += 3) {
        displayParties.push({
            number: props.results[i],
            validVotes: props.results[i+1],
            invalidVotes: props.results[i+2],
            ...props.parties[props.results[i]]
        });
    }

    let displayPartiesTotal = 0;
    
    displayParties = displayParties.sort((a, b) => b.validVotes - a.validVotes).slice(0, 7);
    displayParties.forEach(party => displayPartiesTotal += party.validVotes);
    
    let thresholdPlaced = false;

    return(
        <ResultsTableDiv embed={props.embed}>
            <tbody>
                {
                    displayParties.map(party => {
                        const percentage = party.validVotes / props.totalValid;
                        const barPercent = party.validVotes / displayParties[0].validVotes;
                        return ([
                            percentage < 0.04 && !thresholdPlaced && props.showThreshold?
                            <tr className='threshold-row'>
                                <td colSpan="2" style={{textAlign: 'center'}}>
                                    В парламента
                                    <hr/>
                                    Извън парламента
                                </td>
                                {thresholdPlaced = true}
                            </tr> : null,
                                <ResultsTableRow party={party} percentage={percentage} barPercent={barPercent}/>
                            
                        ])
                        
                    })
                }
                <tr>
                    <td></td>
                    <td>
                        Други
                        <span style={{fontSize: '18px', marginLeft: '10px'}}>
                            {formatCount(props.totalValid - displayPartiesTotal)}
                        </span>
                        
                        <span style={{float: 'right'}}>
                            {formatPercentage((props.totalValid - displayPartiesTotal)/props.totalValid)}%
                        </span>
                    </td>
                </tr>
            </tbody>
        </ResultsTableDiv>
    )
};