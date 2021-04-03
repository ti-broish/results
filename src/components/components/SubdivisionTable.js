import React, { useState, useContext, useEffect } from 'react';

import { useParams } from 'react-router-dom';
import ReactTooltip from 'react-tooltip';
import SubdivisionTableRow from './SubdivisionTableRow';

import styled from 'styled-components';

import { formatCount, formatPercentage } from '../Util';
import SubdivisionTableRowsWithGroupings from './SubdivisionTableRowsWithGroupings.js';

export const SubdivisionTableDiv = styled.table`
    width: 100%;
    color: #666;
    font-size: 22px;

    td {
        padding: 5px 20px;
        box-sizing: border-box;
    }

    td:nth-child(1) {
        text-align: right;
        width: 280px;
    }

    td:nth-child(2) {
        width: calc(100% - 280px);
    }

    a {
        color: blue;
    }

    ${props => props.embed?`
        font-size: 15px;
        td:nth-child(1) {
            width: 160px;
        }
        td:nth-child(2) {
            width: calc(100% - 160px);
        }

        td {
            padding: 5px 5px;
        }
    ` : null}
`;

const SubdivisionTableControls = styled.div`
    text-align: left;

    button {
        border: none;
        background: none;
        padding: 10px;

        &:hover {
            cursor: pointer;
        }

        &.selected {
            color: white;
            background-color: #444;
            border-radius: 10px;
        }
    }

    ${props => props.embed?`
        font-size: 12px;
        button { 
            padding: 5px;
        }
    ` : null}
`;

const SubdivisionControlsParty = styled.div`
    text-align: left;
    height: 40px;
    position: relative;
    margin-top: 5px;

    button {
        border: none;
        background: none;
        padding: 5px;

        &:hover {
            cursor: pointer;
        }

        &.selected {
            color: white;
            background-color: #888;
            border-radius: 10px;
        }
    }

    ${props => props.embed?`
        font-size: 12px;
    ` : null}
`;

const StyledTooltip = styled(ReactTooltip)`
    background-color: white !important;
    opacity: 1 !important;
    color: black !important;
    border: none;
    padding: 0;
    margin: 0;
`;

export default props => {
    const [mode, setMode] = useState('distribution');
    const [singleParty, setSingleParty] = useState('');
    const { unit } = useParams();

    let displayParties = [];

    useEffect(() => { ReactTooltip.rebuild(); }, [mode]);
    useEffect(() => { ReactTooltip.rebuild(); }, [singleParty]);

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

    const sorted = subdivisions => {
        if(mode === 'distribution') {
            if(singleParty === '') {
                subdivisions = subdivisions.sort((s1, s2) => s1.number - s2.number );
            } else {
                subdivisions = subdivisions.sort((s1, s2) => {
                    const getPartyPercentage = subdivision => {
                        const partyMap = {};
                        for(var i = 0; i < subdivision.results.length; i += 3) {
                            partyMap[subdivision.results[i]] = subdivision.results[i+1];
                        }

                        if(!partyMap[singleParty])
                            return 0;
                        else
                            return partyMap[singleParty] / subdivision.totalValid;
                    };

                    return getPartyPercentage(s2) - getPartyPercentage(s1);
                });
            }
        } else if(mode === 'voters') {
            let highestCount = 0;
            for(const subdivision of subdivisions) {
                const currentCount = subdivision.voters;

                if(currentCount > highestCount)
                    highestCount = currentCount;
            }

            for(const subdivision of subdivisions) {
                const currentCount = subdivision.voters;
                subdivision.percentage = currentCount / highestCount;
                subdivision.tooltipField = 'Избиратели';
                subdivision.tooltipValue = formatCount(subdivision.voters);
            }

            subdivisions.sort((s1, s2) => s2.percentage - s1.percentage);
        } else if(mode === 'turnout') {
            let highestCount = 0;
            for(const subdivision of subdivisions) {
                const currentCount = (subdivision.totalValid + subdivision.totalInvalid) / subdivision.voters;

                if(currentCount > highestCount)
                    highestCount = currentCount;
            }

            for(const subdivision of subdivisions) {
                const currentCount = (subdivision.totalValid + subdivision.totalInvalid) / subdivision.voters;
                subdivision.percentage = currentCount / highestCount;
                subdivision.tooltipField = 'Активност';
                subdivision.tooltipValue = `${formatPercentage(currentCount)}%`;
            }

            subdivisions.sort((s1, s2) => s2.percentage - s1.percentage);
        }

        return subdivisions;
    };
    
    const topLevelNode = props.subdivisions[0];
    console.log(topLevelNode);
    const midLevelNode = topLevelNode.nodes? topLevelNode.nodes[0] : null;
    const lowLevelNode = midLevelNode? midLevelNode.nodes? midLevelNode.nodes[0] : null : null;

    console.log(topLevelNode.nodesType);
    console.log(midLevelNode.nodesType);
    console.log(lowLevelNode.nodesType);

    return(
        <div>
            <StyledTooltip 
                multiline={true} 
                html={true}
                border={true}
                borderColor={'#aaa'}
                arrowColor={'white'}
                effect={'solid'}
                place={'top'}
                backgroundColor={'#fff'}
                type={"dark"}
                id={`subdivisionTableTooltip`}
            />
            {props.modesHidden? null :
            <SubdivisionTableControls embed={props.embed}>
                <button className={mode === 'distribution'? 'selected' : ''}  onClick={()=>setMode('distribution')}>Разпределение</button>
                <button className={mode === 'voters'? 'selected' : ''}  onClick={()=>setMode('voters')}>Избиратели</button>
                <button className={mode === 'turnout'? 'selected' : ''}  onClick={()=>setMode('turnout')}>Активност</button>
            </SubdivisionTableControls>}
            {props.modesHidden? null :
            <SubdivisionControlsParty embed={props.embed}>
            { 
                mode !== 'distribution'? null : [
                    'Подреди по партия: ',
                    <button className={singleParty === ''? 'selected' : ''} onClick={()=>setSingleParty('')}>Никоя</button>,
                    displayParties.map(party =>
                        <button className={singleParty === party.number? 'selected' : ''} onClick={()=>setSingleParty(party.number)}>
                            {party.name}
                        </button>
                    )
                ]
            }
            </SubdivisionControlsParty>}
            <SubdivisionTableDiv embed={props.embed}>
            <tbody>
            {
                props.groupings && mode === 'distribution' && singleParty === ''
                    ? <SubdivisionTableRowsWithGroupings
                        subdivisions={props.subdivisions}
                        groupings={props.groupings}
                        unit={unit}
                        singleParty={singleParty}
                        parties={props.parties}
                        embed={props.embed}
                    /> 
                    : sorted(props.subdivisions).map(subdivision => 
                        <SubdivisionTableRow 
                            subdivision={subdivision}
                            unit={unit}
                            parties={props.parties}
                            singleParty={singleParty}
                            mode={mode}
                            embed={props.embed}
                        />
                    )
            }
            </tbody>
            </SubdivisionTableDiv>
        </div>
    )
}