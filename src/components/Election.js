import React, { useState, useEffect } from 'react';

import { Redirect, Route, Switch } from 'react-router-dom';
import axios from 'axios';

import Header from './layout/Header';
import Footer from './layout/Footer';
import LoadingScreen from './layout/LoadingScreen';

import ResultUnit from './ResultUnit.js';
import Global from './units/Global.js';

import { Wrapper } from './App';

export const ElectionContext = React.createContext();

export default props => {
    const [globalData, setGlobalData] = useState(null);

    const dataURL = process.env.DATA_URL? process.env.DATA_URL : '/json';

    useEffect(() => {
        axios.get(`${dataURL}/total.json`).then(res => {
            setGlobalData(res.data);
        });
    }, []);

    return(
        <ElectionContext.Provider value={{ globalData, dataURL }}>
            <Header title={!globalData? null : globalData.name}/>
            <Wrapper>
            {
                !globalData? <LoadingScreen/> :
                    <Switch>
                        <Route path={`/:unit`} component={ResultUnit}/>
                        <Route path={`/`} component={Global}/>
                        <Redirect to={`/`}/>
                    </Switch>
            }
            </Wrapper>
            <Footer/>
        </ElectionContext.Provider>
    );
};