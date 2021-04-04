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

    text-align: center;
    color: white;
    ${props => props.embed? `font-size: 11px;`: 'font-size: 16px;'}
    font-weight: bold;

    &.thin { height: 20px; }
    &.ultra-thin { height: 15px; }
    &:hover { box-shadow: 0px 0px 3px #000; }
`;

import handleViewport from 'react-in-viewport';
import { generateDisplayParties } from './bulgaria_map/generateRegionData';

export default handleViewport(props => {
    const { inViewport, forwardedRef } = props;
    const alreadyLoaded = useRef(false);
    if(inViewport) alreadyLoaded.current = true;
    const shouldLoad = inViewport || alreadyLoaded.current;

    const results = props.results? props.results : [];
    
    const partyCount = props.parties.length;
    const { displayParties, displayPartiesTotal } = generateDisplayParties(props.parties, results, partyCount, props.firstParty, '0');

    const generateTooltip = (color, partyName, percentage, validVotes, invalidVotes) => {
        return (`
            <div>
                <h2 style="margin: 5px; color: #${color}">
                    ${partyName} 
                    ${percentage? `<span style="float: right; margin-left: 20px;">${formatPercentage(percentage)}%</span>` : ``}
                    
                </h2>
                <hr style="border-color: #aaa; border-top: none;"/>
                <table style="width: 100%;">
                <tbody>
                ${
                    validVotes? `
                        <tr>
                            <td style="padding-right: 20px;">Гласове</td>
                            <td style="text-align: right;">${formatCount(validVotes)}</td> 
                        </tr>
                    ` : `
                        <tr>
                            <td colspan="2">Няма данни</td>
                        </tr>
                    `
                }
                    
                </tbody>
                </table>
            </div>
        `);
    };

    return(
        <div className='results-line' ref={forwardedRef}>
            {
                !results || results.length === 0?
                    <ResultLineSegment 
                        key={7}
                        className={props.embed? 'ultra-thin' : props.thin? 'thin' : ''}
                        style={{width: '100%'}}
                        data-tip={generateTooltip('#ddd', props.name)}
                        data-for={`subdivisionTableTooltip`}
                        embed={props.embed}
                    >
                        Няма данни
                    </ResultLineSegment> : [
                        displayParties.map((party, i) => {
                            const percentage = party.validVotes / props.totalValid;
                            return(
                                <ResultLineSegment 
                                    key={i}
                                    className={props.embed? 'ultra-thin' : props.thin? 'thin' : ''}
                                    style={{
                                        backgroundColor: `#${party.color}`,
                                        width: shouldLoad? `${percentage * 100}%` : `calc(100% / ${partyCount+1})`
                                    }}
                                    data-tip={generateTooltip(party.color, party.displayName, percentage, party.validVotes, party.invalidVotes)}
                                    data-for={`subdivisionTableTooltip`}
                                />
                            );  
                        }),
                        <ResultLineSegment 
                            key={7}
                            className={props.embed? 'ultra-thin' : props.thin? 'thin' : ''}
                            style={{width: shouldLoad? `${(props.totalValid - displayPartiesTotal) / props.totalValid * 100}%` : `calc(100% / ${partyCount+1})`}}
                            data-tip={generateTooltip('#ddd', 'Други', (props.totalValid - displayPartiesTotal) / props.totalValid, props.totalValid - displayPartiesTotal, props.totalInvalid)}
                            data-for={`subdivisionTableTooltip`}
                        />
                    ]
            }        
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