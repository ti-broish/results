import React, { useState, useContext, useEffect } from 'react';

import Helmet from 'react-helmet';

import { useParams, useHistory } from 'react-router-dom';
import axios from 'axios';

import { ElectionContext } from './Election';
import ResultsTable from './components/ResultsTable';
import SubdivisionTable from './components/SubdivisionTable';
import LoadingScreen from './layout/LoadingScreen';

export default props => {
    const { meta, parties, dataURL } = useContext(ElectionContext);
    const [data, setData] = useState(null);
    const { unit } = useParams();
    const history = useHistory();

    useEffect(() => { window.scrollTo(0, 0);  }, []);
    useEffect(() => { refreshResults(); }, [unit]);

    const refreshResults = () => {
        setData(null);
        axios.get(`${dataURL}/${unit? unit : 'index'}.json`).then(res => {
            console.log(res.data);
            setData(res.data);
        }).catch(err => { if(!data) history.push('/') });
    };

    const formatNodesType = nodesType => {
        switch(nodesType) {
            case 'electionRegions': return 'Избирателни райони';
            case 'municipalities': return 'Общини';
            default: return 'Подразделения'; 
        }
    };

    return(
        !data? <LoadingScreen/> :
        <div>  
            <Helmet>
                <title>{meta.name}</title>
            </Helmet>
            <ResultsTable 
                results={data.results} 
                parties={parties} 
                totalValid={data.stats.validVotes} 
                totalInvalid={data.stats.invalidVotes}
                showThreshold={true}
            />
            <h1>{formatNodesType(data.nodesType)}</h1>
            <SubdivisionTable
                parties={parties}
                results={data.results}
                showNumbers
                subdivisions={data.nodes}
            />
        </div>

    );
}