import React, { useState, useEffect } from 'react';

import { Redirect, Route, Switch } from 'react-router-dom';
import axios from 'axios';

import Header from './layout/Header';
import Footer from './layout/Footer';
import LoadingScreen from './layout/LoadingScreen';

import ResultUnit from './ResultUnit.js';

import { Wrapper } from './App';

export const ElectionContext = React.createContext();

export default props => {
    const [meta, setMeta] = useState(null);

    const dataURL = process.env.DATA_URL? process.env.DATA_URL : '/json';

    useEffect(() => {
        axios.get(`${dataURL}/meta.json`).then(res => {
            setMeta(res.data);
        });
    }, []);

    return(
        <ElectionContext.Provider value={{ meta, parties: !meta? null : meta.parties, dataURL }}>
            <Header title={!meta? null : meta.name}/>
            <Wrapper>
            {
                !meta? <LoadingScreen/> :
                    <Switch>
                        <Route path={[`/:unit`, `/`]} component={ResultUnit}/>
                        <Redirect to={`/`}/>
                    </Switch>
            }
            </Wrapper>
            <Footer/>
        </ElectionContext.Provider>
    );
};