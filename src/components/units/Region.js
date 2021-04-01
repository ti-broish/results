import React, { useEffect, useState, useContext } from 'react';

import Helmet from 'react-helmet';
import axios from 'axios';
import { useParams, useHistory } from 'react-router-dom';
import { Link } from 'react-router-dom';
import LoadingScreen from '../layout/LoadingScreen';

import ResultsTable from '../components/ResultsTable';
import ResultsLine from '../components/ResultsLine';

import { ElectionContext } from '../Election'; 
import SubdivisionTable from '../components/SubdivisionTable';
import Crumbs from '../components/Crumbs';

export default props => {
    const { dataURL, globalData } = useContext(ElectionContext);
    const { unit } = useParams();
    const history = useHistory();

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
                <h1 style={props.embed? {fontSize: '15px'} : {}}>{data.number}. {data.name}</h1>
                <ResultsTable
                    results={data.results} 
                    parties={globalData.parties} 
                    totalValid={data.validVotes} 
                    totalInvalid={data.invalidVotes}
                    embed={props.embed}
                />
                <h1 style={props.embed? {fontSize: '15px'} : {}}>{Object.keys(data.admunits).length === 1? 'Райони' : 'Общини'}</h1>
                {
                    Object.keys(data.admunits).length === 1?
                        <SubdivisionTable
                            parties={globalData.parties}
                            results={globalData.results}
                            subdivisions={Object.keys(data.admunits[Object.keys(data.admunits)[0]].districts).map(key => {
                                const district = data.admunits[Object.keys(data.admunits)[0]].districts[key];
                                return {
                                    number: Object.keys(data.admunits)[0] + key,
                                    name: district.name,
                                    results: district.results,
                                    totalValid: district.validVotes,
                                    totalInvalid: district.invalidVotes,
                                    voters: district.voters,
                                };
                            })}
                            embed={props.embed}
                        /> :
                        <SubdivisionTable
                            parties={globalData.parties}
                            results={globalData.results}
                            subdivisions={Object.keys(data.admunits).map(key => {
                                return {
                                    number: key,
                                    name: data.admunits[key].name,
                                    results: data.admunits[key].results,
                                    totalValid: data.admunits[key].validVotes,
                                    totalInvalid: data.admunits[key].invalidVotes,
                                    voters: data.admunits[key].voters,
                                };
                            })}
                            embed={props.embed}
                        />
                }
            </div>
    );
};