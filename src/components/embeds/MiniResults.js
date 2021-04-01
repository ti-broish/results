import React, { useState, useEffect } from 'react';

import axios from 'axios';


import LoadingScreen from '../layout/LoadingScreen';

import { ElectionContext } from '../Election';

import MiniResultsUnit from './MiniResultsUnit';
import MiniResultsGlobal from './MiniResultsGlobal';

import { Redirect, Route, Switch } from 'react-router-dom';

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
                <Switch>
                    <Route path={`/embed/mini-results/:unit`} component={MiniResultsUnit}/>
                    <Route path={`/embed/mini-results`} render={()=><MiniResultsGlobal globalData={globalData}/>}/>
                    <Redirect to={`/embed/mini-results`}/>
                </Switch>    
            </ElectionContext.Provider>
    );
};