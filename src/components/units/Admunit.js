import React, { useState, useEffect, useContext } from 'react';

import Helmet from 'react-helmet';
import axios from 'axios';
import { useParams, useHistory } from 'react-router-dom';
import { Link } from 'react-router-dom';
import LoadingScreen from '../layout/LoadingScreen';
import ResultsTable from '../components/ResultsTable';
import ResultsLine from '../components/ResultsLine';
import Crumbs from '../components/Crumbs';

import { ElectionContext } from '../Election';

import SubdivisionTable from '../components/SubdivisionTable';

export default props => {
    const { unit } = useParams();
    const history = useHistory();
    const { dataURL, globalData } = useContext(ElectionContext);

    const [data, setData] = useState(null);

    const refreshResults = () => {
        axios.get(`${dataURL}/${unit}.json`).then(res => {
            setData(res.data);
        }).catch(err => { if(!data) history.push('/') });
    };

    useEffect(() => {
        refreshResults();
    }, []);

    return(
        !data? <LoadingScreen/> :
            <div>
                <Helmet>
                    <title>{data.name}</title>
                </Helmet>
                <Crumbs data={data} embed={props.embed}/>
                <h1 style={props.embed? {fontSize: '15px'} : {}}>
                    {!data.abroad? 'Община' : null}
                    {data.name}
                </h1>
                <ResultsTable
                    results={data.results} 
                    parties={globalData.parties} 
                    totalValid={data.validVotes} 
                    totalInvalid={data.invalidVotes}
                    embed={props.embed}
                />
                <h1 style={props.embed? {fontSize: '15px'} : {}}>Райони/секции</h1>
                <SubdivisionTable
                    parties={globalData.parties}
                    results={globalData.results}
                    groupings={Object.keys(data.towns).map(key => { 
                        const town = data.towns[key];
                        let units = [];
                        
                        for(const districtKey of Object.keys(data.towns[key].districts)) {
                            if(districtKey !== '00') units.push(districtKey);
                            else {
                                units = units.concat(data.towns[key].districts[districtKey].sections.map(sectionKey => districtKey + sectionKey));
                            }
                        }
                        
                        return { name: town.name, units };
                    })}
                    subdivisions={Object.keys(data.districts).map(key => 
                        key === '00'
                        ? Object.keys(data.districts[key].sections).map(sectionKey => { 
                            const section = data.districts[key].sections[sectionKey];
                            return {
                                number: key + sectionKey,
                                name: `Секция ${sectionKey}`,
                                results: section.results,
                                totalValid: section.validVotes,
                                totalInvalid: section.invalidVotes,
                                voters: section.voters,
                            }
                            })
                        : [{
                            number: key,
                            name: data.districts[key].name,
                            results: data.districts[key].results,
                            totalValid: data.districts[key].validVotes,
                            totalInvalid: data.districts[key].invalidVotes,
                            voters: data.districts[key].voters,
                        }]
                    ).reduce((arr, acc) => acc.concat(arr), [])}
                    embed={props.embed}
                />
            </div>
    );
};