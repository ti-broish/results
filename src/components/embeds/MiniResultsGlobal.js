import React, { useState } from 'react';

import { useLocation } from 'react-router-dom';

import BulgariaMap from '../components/BulgariaMap';
import ResultsTable from '../components/ResultsTable';
import SubdivisionTable from '../components/SubdivisionTable';
import Source from './Source';

import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChartBar, faCity, faLayerGroup, faMap } from '@fortawesome/free-solid-svg-icons';

const EmbedButton = styled.button`
    border: none;
    background: none;
    color: #666;
    text-align: center;
    cursor: pointer;
    padding: 6px;

    &.active {
        color: white;
        background-color: #666;
        border-radius: 10px;
    }
`;

const useQuery = () => {
    return new URLSearchParams(useLocation().search);
}

export default props => {
    const [embedMode, setEmbedMode] = useState('map');
    const [mapModesOpen, setMapModesOpen] = useState(false);
    const [subdivisionModesOpen, setSubdivisionModesOpen] = useState(false);

    const query = useQuery();
    const mapOnly = query.get("mapOnly")? true : false;
    const resultsOnly = query.get("resultsOnly")? true : false;

    return(
        <div>
            {mapOnly || resultsOnly? null :
            <div style={{position: 'fixed', left: 0, top: 0, padding: '5px'}}>
                <EmbedButton className={embedMode === 'map'? 'active' : ''}  onClick={() => setEmbedMode('map')}>
                    <FontAwesomeIcon icon={faMap}/>
                </EmbedButton>
                <EmbedButton className={embedMode === 'bars'? 'active' : ''}  onClick={() => setEmbedMode('bars')}>
                    <FontAwesomeIcon icon={faChartBar}/>
                </EmbedButton>
                <EmbedButton className={embedMode === 'regions'? 'active' : ''} onClick={() => setEmbedMode('regions')}>
                    <FontAwesomeIcon icon={faCity}/>
                </EmbedButton>
            </div>}

            {resultsOnly? null : 
            <div>
                {embedMode !== 'map'? null :
                <div style={{position: 'fixed', top: 0, right: 0, padding: '5px'}}>
                    <EmbedButton className={mapModesOpen? 'active' : ''} onClick={() => setMapModesOpen(!mapModesOpen)}>
                        <FontAwesomeIcon icon={faLayerGroup}/>
                    </EmbedButton>
                </div>}
                {embedMode !== 'regions'? null :
                <div style={{position: 'fixed', top: 0, right: 0, padding: '5px'}}>
                    <EmbedButton className={subdivisionModesOpen? 'active' : ''} onClick={() => setSubdivisionModesOpen(!subdivisionModesOpen)}>
                        <FontAwesomeIcon icon={faLayerGroup}/>
                    </EmbedButton>
                </div>}
            </div>}    
            <div style={{height: (embedMode === 'map' && mapModesOpen)? '43px' : '75px', textAlign: 'center'}}>
                <div style={{padding: '5px', fontWeight: 'bold'}}>
                    {props.globalData.name}
                </div>
            </div>
            {
                !resultsOnly && (mapOnly || embedMode === 'map')
                ?
                    <BulgariaMap 
                        regions={props.globalData.regions} 
                        parties={props.globalData.parties}
                        results={props.globalData.results}
                        mapModesHidden={!mapModesOpen}
                        embed
                    /> 
                :  resultsOnly || embedMode === 'bars'
                ?   <ResultsTable 
                        results={props.globalData.results} 
                        parties={props.globalData.parties} 
                        totalValid={props.globalData.validVotes} 
                        totalInvalid={props.globalData.invalidVotes}
                        showThreshold={props.globalData.electionType === 'national-parliament'}
                        embed
                    />
                : embedMode === 'regions'
                ?   <SubdivisionTable
                        parties={props.globalData.parties}
                        results={props.globalData.results}
                        showNumbers
                        subdivisions={Object.keys(props.globalData.regions).map(key => {
                            return {
                                number: key,
                                name: props.globalData.regions[key].name,
                                results: props.globalData.regions[key].results,
                                totalValid: props.globalData.regions[key].validVotes,
                                totalInvalid: props.globalData.regions[key].invalidVotes,
                                voters: props.globalData.regions[key].voters,
                            };
                        })}
                        modesHidden={!subdivisionModesOpen}
                        embed
                    />
                : null
            }             
            <div style={{height: '30px', display: 'block'}}/>   
            <Source/>
        </div>
    );
};