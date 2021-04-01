import React, { useState, useEffect } from 'react';

import axios from 'axios';


import LoadingScreen from '../layout/LoadingScreen';

import { ElectionContext } from '../Election';

import ReactTooltip from 'react-tooltip';

import MiniResultsUnit from './MiniResultsUnit';
import MiniResultsGlobal from './MiniResultsGlobal';

import { Redirect, Route, Switch } from 'react-router-dom';

import styled from 'styled-components';

const StyledTooltip = styled(ReactTooltip)`
    background-color: white !important;
    opacity: 1 !important;
    color: black !important;
    border: none;
    padding: 0;
    margin: 0;
`;

export default props => {
    const [globalData, setGlobalData] = useState(null);

    const dataURL = process.env.DATA_URL? process.env.DATA_URL : '/json';

    useEffect(() => {
        axios.get(`${dataURL}/total.json`).then(res => {
            setGlobalData(res.data);
        });
    }, []);

    return (
        !globalData? <LoadingScreen/> : 
            <ElectionContext.Provider value={{ globalData, dataURL }}>
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
                <Switch>
                    <Route path={`/embed/mini-results/:unit`} component={MiniResultsUnit}/>
                    <Route path={`/embed/mini-results`} render={()=><MiniResultsGlobal globalData={globalData}/>}/>
                    <Redirect to={`/embed/mini-results`}/>
                </Switch>    
            </ElectionContext.Provider>
    );
};