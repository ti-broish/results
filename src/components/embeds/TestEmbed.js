import React, { useState, useEffect } from 'react';

import axios from 'axios';

import BulgariaMap from '../components/BulgariaMap';
import ResultsTable from '../components/ResultsTable';
import SubdivisionTable from '../components/SubdivisionTable';
import Source from './Source';
import LoadingScreen from '../layout/LoadingScreen';

import { ElectionContext } from '../Election';

import ReactTooltip from 'react-tooltip';

import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChartBar, faCity, faMap } from '@fortawesome/free-solid-svg-icons';

const StyledTooltip = styled(ReactTooltip)`
    background-color: white !important;
    opacity: 1 !important;
    color: black !important;
    border: none;
    padding: 0;
    margin: 0;
`;

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

export default props => {
    const [globalData, setGlobalData] = useState(null);
    const [embedMode, setEmbedMode] = useState('map');

    const dataURL = process.env.DATA_URL? process.env.DATA_URL : '/json';

    useEffect(() => {
        axios.get(`${dataURL}/total.json`).then(res => {
            setGlobalData(res.data);
        });
    }, []);

    return (
        !globalData? <LoadingScreen/> : 
            <ElectionContext.Provider value={{ globalData, dataURL }}>
                <div style={{textAlign: 'center'}}>
                    <EmbedButton className={embedMode === 'map'? 'active' : ''}  onClick={() => setEmbedMode('map')}>
                        <FontAwesomeIcon icon={faMap}/>
                    </EmbedButton>
                    <EmbedButton className={embedMode === 'bars'? 'active' : ''}  onClick={() => setEmbedMode('bars')}>
                        <FontAwesomeIcon icon={faChartBar}/>
                    </EmbedButton>
                    <EmbedButton className={embedMode === 'regions'? 'active' : ''} onClick={() => setEmbedMode('regions')}>
                        <FontAwesomeIcon icon={faCity}/>
                    </EmbedButton>
                </div>
                <StyledTooltip 
                    multiline={true} 
                    html={true}
                    border={true}
                    borderColor={'#aaa'}
                    arrowColor={'white'}
                    effect={'solid'}
                    place={'top'}
                    scrollHide={false}
                    backgroundColor={'#fff'}
                    type={"dark"}
                />
                {
                    embedMode === 'map'
                    ?
                        <BulgariaMap 
                            regions={globalData.regions} 
                            parties={globalData.parties}
                            results={globalData.results}
                            embed
                        /> 
                    :  embedMode === 'bars'
                    ?   <ResultsTable 
                            results={globalData.results} 
                            parties={globalData.parties} 
                            totalValid={globalData.validVotes} 
                            totalInvalid={globalData.invalidVotes}
                            showThreshold={globalData.electionType === 'national-parliament'}
                        />
                    : embedMode === 'regions'
                    ?   <SubdivisionTable
                            parties={globalData.parties}
                            results={globalData.results}
                            showNumbers
                            subdivisions={Object.keys(globalData.regions).map(key => {
                                return {
                                    number: key,
                                    name: globalData.regions[key].name,
                                    results: globalData.regions[key].results,
                                    totalValid: globalData.regions[key].validVotes,
                                    totalInvalid: globalData.regions[key].invalidVotes,
                                    voters: globalData.regions[key].voters,
                                };
                            })}
                        />
                    : null
                }                
                <Source/>
            </ElectionContext.Provider>
    );
};