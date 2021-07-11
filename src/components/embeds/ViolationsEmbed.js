import React, { useState, useEffect } from 'react';
import LoadingScreen from '../layout/LoadingScreen';

import axios from 'axios';

import Violations from '../Violations';
import Source from './Source';

import { ElectionContext } from '../Election';

export default props => {
    const [meta, setMeta] = useState(null);

    const dataURL = process.env.DATA_URL? process.env.DATA_URL : '/json';

    useEffect(() => {
        axios.get(`${dataURL}/results/meta.json`).then(res => {
            setMeta(res.data);
        });
    }, []);
    
    return(
        !meta? <LoadingScreen/> :
            <ElectionContext.Provider value={{ meta, parties: meta.parties, dataURL }}>
                <Violations/>
                <Source/>
            </ElectionContext.Provider>
    );
};