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
    let partiesObj = {};
    props.parties.forEach(party => { partiesObj[party.id] = { displayName: party.displayName, color: party.color}});

    for(var i = 0; i < props.results.length; i += 2) {
        partiesObj[props.results[i]].validVotes = props.results[i+1];
    }

    const keyToParty = key => { return {...partiesObj[key], number: key}};
    let displayParties = Object.keys(partiesObj).map(keyToParty).filter(party => parseInt(party.number) !== 0);
    const nikogo = keyToParty(0);

    let displayPartiesTotal = 0;
    
    displayParties = displayParties.sort((a, b) => {
        if(!isNaN(a.validVotes) && !isNaN(b.validVotes)) {
            return b.validVotes - a.validVotes;
        } else if(isNaN(a.validVotes) && !isNaN(b.validVotes)) {
            return 100000;
        } else if(!isNaN(a.validVotes) && isNaN(b.validVotes)) {
            return -10000;
        } else return parseInt(a.number, 10) - parseInt(b.number, 10);
    }).slice(0, 6);
    displayParties.push(nikogo);
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
                <ResultsTableRow party={{
                        number: '',
                        displayName: 'Други',
                        validVotes: props.totalValid - displayPartiesTotal,
                        color: 'rgb(102, 102, 102)'
                    }} 
                    percentage={(props.totalValid - displayPartiesTotal) / props.totalValid} 
                    barPercent={(props.totalValid - displayPartiesTotal) / displayParties[0].validVotes}
                />
            </tbody>
        </ResultsTableDiv>
    )
};