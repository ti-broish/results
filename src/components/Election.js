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

import styled from 'styled-components';
import ReactTooltip from 'react-tooltip';
import Embed from './Embed';

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

    return(
        <ElectionContext.Provider value={{ globalData, dataURL }}>
            <Header title={!globalData? null : globalData.name}/>
            <Wrapper>
            {
                !globalData? <LoadingScreen/> : [
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
                    />,
                    <Switch>
                        <Route path={`/:unit`} component={ResultUnit}/>
                        <Route path={`/`} component={Global}/>
                        <Redirect to={`/`}/>
                    </Switch>
                ]
            }
            </Wrapper>
            <Footer/>
        </ElectionContext.Provider>
    );
};