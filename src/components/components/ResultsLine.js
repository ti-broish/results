import React from 'react';

import { formatCount, formatPercentage } from '../Util';

import styled from 'styled-components';

const LegendItem = styled.div`
    display: inline-block;
    vertical-align: top;
    margin: 0 6px;
    color: #bbb;
`;

const LegendItemColor = styled.div`
    width: 10px;
    height: 10px;
    display: inline-block;
    margin: 2px;
`;

const ResultLineSegment = styled.div`
    display: inline-block;
    background-color: #777;
    height: 50px;
    transition: width 1s ease;
    width: 0;

    &.thin { height: 20px; }
    &:hover { box-shadow: 0px 0px 3px #000; }
`;

import handleViewport from 'react-in-viewport';

export default handleViewport(props => {
    const { inViewport, forwardedRef } = props;
    console.log(inViewport);

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
    let displayPartiesTotalInvalid = 0;
    
    displayParties = displayParties.sort((a, b) => b.validVotes - a.validVotes).slice(0, 7);
    displayParties.forEach(party => {displayPartiesTotal += party.validVotes; displayPartiesTotalInvalid += party.invalidVotes});

    const generateTooltip = (color, partyName, percentage, validVotes, invalidVotes) => {
        return (`
            <div>
                <h2 style="margin: 5px; color: ${color}">
                    ${partyName} <span style="float: right;">${formatPercentage(percentage)}%</span>
                </h2>
                <hr style="border-color: #aaa; border-top: none;"/>
                <table style="width: 100%;">
                <tbody>
                    <tr>
                        <td>Действителни</td>
                        <td style="text-align: right;">${formatCount(validVotes)}</td> 
                    </tr>
                    <tr>
                        <td>Недействителни</td>
                        <td style="text-align: right;">${formatCount(invalidVotes)}</td> 
                    </tr>
                </tbody>
                </table>
            </div>
        `);
    };

    let firstParty = null;
    if(props.firstParty) {
        firstParty = displayParties.find(party => party.number === props.firstParty);
    }

    return(
        <div className='results-line' ref={forwardedRef}>
            {
                !firstParty? null : 
                    <ResultLineSegment 
                        className={props.thin? 'thin' : ''}
                        style={{
                            backgroundColor: firstParty.color,
                            width: inViewport? `${firstParty.validVotes / props.totalValid * 100}%` : 'calc(100% / 8)'
                        }}
                        data-tip={generateTooltip(firstParty.color, firstParty.name, firstParty.validVotes / props.totalValid, firstParty.validVotes, firstParty.invalidVotes)}
                    />  
            }
            {
                displayParties.map(party => {
                    const percentage = party.validVotes / props.totalValid;
                    if(firstParty && firstParty.number === party.number) return null;
                    else return(
                        <ResultLineSegment 
                            className={props.thin? 'thin' : ''}
                            style={{
                                backgroundColor: party.color,
                                width: inViewport? `${percentage * 100}%` : 'calc(100% / 8)'
                            }}
                            data-tip={generateTooltip(party.color, party.name, percentage, party.validVotes, party.invalidVotes)}
                        />
                    )  
                })
            }
            <ResultLineSegment 
                className={props.thin? 'thin' : ''}
                style={{width: inViewport? `${(props.totalValid - displayPartiesTotal) / props.totalValid * 100}%` : 'calc(100% / 8)'}}
                data-tip={generateTooltip('#ddd', 'Други', (props.totalValid - displayPartiesTotal) / props.totalValid, props.totalValid - displayPartiesTotal, props.totalInvalid - displayPartiesTotalInvalid)}
            />
            {!props.showLegend? null :
                <div className='legend'>
                {
                    displayParties.map(party => 
                        <LegendItem> 
                            <LegendItemColor style={{backgroundColor: party.color}}/>
                            {party.name}            
                        </LegendItem>
                    )
                }
                </div>
            }
        </div>
    )
});