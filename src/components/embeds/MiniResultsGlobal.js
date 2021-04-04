import React, { useState, useEffect, useContext } from 'react';

import { useLocation } from 'react-router-dom';
import axios from 'axios';

import BulgariaMap from '../components/bulgaria_map/BulgariaMap';
import ResultsTable from '../components/results_table/ResultsTable';
import SubdivisionTable from '../components/subdivision_table/SubdivisionTable';
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

import { aggregateData } from '../units/Aggregation';
import { populateWithFakeResults } from '../units/Aggregation';

const useQuery = () => {
    return new URLSearchParams(useLocation().search);
}

import { ElectionContext } from '../Election';
import LoadingScreen from '../layout/LoadingScreen';

export default props => {
    const { meta, parties, dataURL } = useContext(ElectionContext);
    const [embedMode, setEmbedMode] = useState('map');
    const [mapModesOpen, setMapModesOpen] = useState(false);
    const [subdivisionModesOpen, setSubdivisionModesOpen] = useState(false);

    const query = useQuery();
    const mapOnly = query.get("mapOnly")? true : false;
    const resultsOnly = query.get("resultsOnly")? true : false;

    const [data, setData] = useState(null);

    useEffect(() => {
        setData(null);
        axios.get(`${dataURL}/index.json`).then(res => {
            res.data = populateWithFakeResults(res.data, parties);
            setData(res.data);
        }).catch(err => { console.log(err); if(!data) history.push('/'); });
    }, []);

    return(
        !data? <LoadingScreen/> :
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
                    {meta.name}
                </div>
            </div>
            {
                !resultsOnly && (mapOnly || embedMode === 'map')
                ?
                    <BulgariaMap 
                        regions={data.nodes} 
                        parties={parties}
                        results={data.results} 
                        mapModesHidden={!mapModesOpen}
                        embed
                    />
                :  resultsOnly || embedMode === 'bars'
                ?   <ResultsTable 
                        results={data.results} 
                        parties={parties} 
                        totalValid={data.stats.validVotes} 
                        totalInvalid={data.stats.invalidVotes}
                        showThreshold={data.type === 'election'}
                        embed
                    />
                : embedMode === 'regions'
                ?   <SubdivisionTable
                        parties={parties}
                        results={data.results}
                        showNumbers
                        subdivisions={data.nodes.map(aggregateData)}
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