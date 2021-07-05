import React, { useState, useEffect } from 'react';

import axios from 'axios';


import LoadingScreen from '../layout/LoadingScreen';

import { ElectionContext } from '../Election';

import MiniResultsUnit from './MiniResultsUnit';
import MiniResultsGlobal from './MiniResultsGlobal';

import { Redirect, Route, Switch } from 'react-router-dom';

export default props => {
    const [meta, setMeta] = useState(null);

    const dataURL = process.env.DATA_URL? process.env.DATA_URL : '/json';

    useEffect(() => {
        axios.get(`${dataURL}/meta.json`).then(res => {
            setMeta(res.data);
        });
    }, []);

    return (
        !meta? <LoadingScreen/> : 
            <ElectionContext.Provider value={{ meta, parties: meta.parties, dataURL }}>
                <Switch>
                    <Route path={`/embed/mini-results/:unit`} component={MiniResultsUnit}/>
                    <Route path={`/embed/mini-results`} render={()=><MiniResultsGlobal meta={meta}/>}/>
                    <Redirect to={`/embed/mini-results`}/>
                </Switch>    
            </ElectionContext.Provider>
    );
};