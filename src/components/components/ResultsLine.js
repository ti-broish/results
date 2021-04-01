import React, { useRef } from 'react';

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
    &.ultra-thin { height: 15px; }
    &:hover { box-shadow: 0px 0px 3px #000; }
`;

import handleViewport from 'react-in-viewport';

export default handleViewport(props => {
    const { inViewport, forwardedRef } = props;
    const alreadyLoaded = useRef(false);
    if(inViewport) alreadyLoaded.current = true;
    const shouldLoad = inViewport || alreadyLoaded.current;

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
    
    let firstParty = props.firstParty? props.firstParty : null;

    displayParties = displayParties.sort((a, b) => {
        if(firstParty && firstParty === a.number) return b.validVotes - 1000000000000;
        else if(firstParty && firstParty === b.number) return 1000000000000 - a.validVotes;
        else return b.validVotes - a.validVotes
    }).slice(0, 7);
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

    return(
        <div className='results-line' ref={forwardedRef}>
            {
                displayParties.map((party, i) => {
                    const percentage = party.validVotes / props.totalValid;
                    return(
                        <ResultLineSegment 
                            key={i}
                            className={props.embed? 'ultra-thin' : props.thin? 'thin' : ''}
                            style={{
                                backgroundColor: party.color,
                                width: shouldLoad? `${percentage * 100}%` : 'calc(100% / 8)'
                            }}
                            data-tip={generateTooltip(party.color, party.name, percentage, party.validVotes, party.invalidVotes)}
                        />
                    );  
                })
            }
            <ResultLineSegment 
                key={7}
                className={props.embed? 'ultra-thin' : props.thin? 'thin' : ''}
                style={{width: shouldLoad? `${(props.totalValid - displayPartiesTotal) / props.totalValid * 100}%` : 'calc(100% / 8)'}}
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