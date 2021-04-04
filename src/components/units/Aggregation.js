import React, { useState, useContext, useEffect } from 'react';

import Helmet from 'react-helmet';

import { useParams, useHistory } from 'react-router-dom';
import axios from 'axios';

import { ElectionContext } from '../Election';
import ResultsTable from '../components/results_table/ResultsTable';
import SubdivisionTable from '../components/subdivision_table/SubdivisionTable';
import BulgariaMap from '../components/bulgaria_map/BulgariaMap';
import LoadingScreen from '../layout/LoadingScreen';
import Crumbs from '../components/Crumbs';

import { mapNodeType, mapNodesType } from '../ResultUnit';



export const aggregateData = data => {
    if(!data.stats && data.nodes) {
        data.stats =  {
            invalidVotes: 0,
            sectionsCount: 0,
            sectionsWithProtocols: 0,
            sectionsWithResults: 0,
            validVotes: 0,
            violationsCount: 0,
            voters: 0,
        };
        
        for(const node of data.nodes) {
            aggregateData(node);

            data.stats.invalidVotes += node.stats.invalidVotes;
            data.stats.sectionsCount += node.stats.sectionsCount;
            data.stats.sectionsWithProtocols += node.stats.sectionsWithProtocols;
            data.stats.sectionsWithResults += node.stats.sectionsWithResults;
            data.stats.validVotes += node.stats.validVotes;
            data.stats.violationsCount += node.stats.violationsCount;
            data.stats.voters += node.stats.voters;
        }
    }

    if((!data.results || data.results.length === 0) && data.nodes) {
        const partyResults = {};

        for(const node of data.nodes) {
            aggregateData(node);

            for(let i = 0; i < node.results.length; i += 2) {
                if(!partyResults[node.results[i]]) partyResults[node.results[i]] = 0;
                partyResults[node.results[i]] += node.results[i + 1];
            }
        }

        data.results = [];
        Object.keys(partyResults).forEach(key => {
            data.results.push(key);
            data.results.push(partyResults[key]);
        });
    }

    return data;
};

const fakeResults = (deviation, voters, parties) => {
    const results = [];
    let turnout = Math.random() * 0.10 - 0.05 + 0.6;

    let partyAverages = {
        0: 0.10,
        1: 0.01,
        4: 0.2,
        5: 0.01,
        9: 0.09,
        11: 0.12,
        18: 0.05,
        21: 0.01,
        24: 0.02,
        28: 0.25,
        29: 0.10,
    };

    let votesSum = 0;

    parties.forEach(party => {
        results.push(party.id);
        const multiplier = 1 - deviation + deviation * 2 * Math.random();
        const votes = multiplier * partyAverages[party.id] * voters * turnout;
        results.push(Math.floor(votes));
        votesSum += Math.floor(votes);
    });

    if(votesSum > voters * turnout) {
        turnout += (votesSum - voters * turnout) / voters;
        turnout *= 1 + 0.05 * Math.random();
    }

    return { results, voters, turnout };
};

export const populateWithFakeResults = (data, parties) => {
    if(data.stats) {
        const deviation = data.type === 'election'? 0.15 : data.type === 'electionRegion'? 0.4 : 0.15;
        const { results, voters, turnout } = fakeResults(deviation, 10000 + 10000 * Math.random(), parties);
        data.results = results;
        data.stats.voters = voters;
        data.stats.validVotes = voters * turnout;
        data.stats.violationsCount = Math.random() < 0.3? 0 : (10 + 1000 * Math.random());
    }
    if(data.nodes)
        data.nodes.forEach(node => populateWithFakeResults(node, parties));
    return data;
};

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
            //res.data = populateWithFakeResults(res.data, parties);
            setData(res.data);
        }).catch(err => { console.log(err); if(!data) history.push('/'); });
    };

    return(
        !data? <LoadingScreen/> :
        <div>  
            <Helmet>
                <title>{meta.name}</title>
            </Helmet>
            {data.type === 'election'? null : <Crumbs data={data} embed={props.embed}/>}
            <h1 style={props.embed? {fontSize: '15px'} : {}}>
                {
                    data.type === 'election'
                    ? null
                    : data.type === 'electionRegion'
                    ? `${data.id}. ${data.name}`
                    : `${mapNodeType(data.type)} ${data.name}`
                }
            </h1>
            {
                data.type !== 'election'? null :
                    <BulgariaMap 
                        regions={data.nodes} 
                        parties={parties}
                        results={data.results} 
                    />
            }
            <ResultsTable 
                results={data.results} 
                parties={parties} 
                totalValid={data.stats.validVotes} 
                totalInvalid={data.stats.invalidVotes}
                showThreshold={data.type === 'election'}
                embed={props.embed}
            />
            <h1 style={props.embed? {fontSize: '15px'} : {}}>{mapNodesType(data.nodesType)}</h1>
            <SubdivisionTable
                parties={parties}
                results={data.results}
                showNumbers
                subdivisions={data.nodes.map(aggregateData)}
                embed={props.embed}
            />
        </div>

    );
}