import React, { useEffect, useContext, useState } from 'react';

import axios from 'axios';

import { Link } from 'react-router-dom';
import LoadingScreen from './layout/LoadingScreen';
import { ElectionContext } from './Election';
import { formatDateTime } from './Util';

import styled from 'styled-components';

import { Fade } from 'react-reveal';

const ViolationFeed = styled.div`
    max-width: 600px;
    margin: 0 auto; 
    padding: 10px;
`;

const Violation = styled.div`
    border: 1px solid #ccc;
    margin: 15px 0;
    border-radius: 10px;
    padding: 10px 25px;
    box-shadow: 0 0 10px #ddd;
    border-bottom: 3px solid #bbb;

    h4, p {
        margin: 10px 0;
    }
`;

const ShowMoreButton = styled.button`
    cursor: pointer;
    width: 300px;
    margin: 0 auto;
    display: block;
    padding: 13px;
    border: 1px solid #ccc;
    background-color: #999;
    color: white;
    font-size: 17px;
    font-weight: bold;
    border-radius: 10px;
    border-top: 0px;
    border-bottom: 5px solid #666;

    &:hover {
        background-color: #aaa;
    }

    &:disabled {
        background-color: #888;
        color: #bbb;
        border-top: 5px solid white;
        border-bottom: 0px;
    }

    &:active {
        border-top: 5px solid white;
        border-bottom: 0px;
    }
`;

export default props => {
    const { meta, parties, dataURL } = useContext(ElectionContext);
    const [data, setData] = useState({
        items: null,
        moreToLoad: true,
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        axios.get(`${dataURL}/violations/feed`).then(res => {
            console.log(res.data);
            setData({
                items: res.data,
                moreToLoad: res.data.length >= 50
            });
        });
    }, []);

    const getMoreViolations = () => {
        setLoading(true);
        const lastViolation = data.items[data.items.length-1].id;
        axios.get(`${dataURL}/violations/feed?after=${lastViolation}`).then(res => {
            setData({
                items: [...data.items, ...res.data],
                moreToLoad: res.data.length >= 50
            });
            setLoading(false);
        });
    };

    const renderViolation = (violation, i) => {
        let electionRegion = null;
        if(violation.section) {
            electionRegion = violation.section.electionRegion;
        } else if(violation.town.electionRegions && violation.town.electionRegions.length === 1) {
            electionRegion = violation.town.electionRegions[0];
        }
        //if section show 
        
        return(
            <Fade clear>
                <Violation key={violation.id}>
                    <h4>
                        {violation.town.name}
                        {violation.town.municipality? ', Община ' + violation.town.municipality.name : ''}
                        {violation.town.country && violation.town.country.isAbroad? ', ' + violation.town.country.name : ''}
                    </h4>
                    <h4>
                        {!electionRegion? '' : 
                            <Link to={`/${electionRegion.code}`}>
                                МИР {electionRegion.code}. {electionRegion.name}
                            </Link>
                        }
                    </h4>
                    <h5>Подадено на: {formatDateTime(new Date(violation.createdAt))}</h5>
                    
                    {/*<h4>Секция {violation.section.id}</h4>
                    <h5>{violation.section.electionRegion.code} {violation.section.electionRegion.name}</h5>
                    <h5>{violation.town.name}</h5>
                <p>{violation.section.place}</p>*/}
                    <p>{violation.publishedText}</p>
                </Violation>
            </Fade>
        );
    };

    return(
        !data.items? <LoadingScreen/> :
        <ViolationFeed>
            <h1 style={{textAlign: 'center'}}>Последни сигнали</h1>
            {data.items.map(renderViolation)}
            {
                !data.moreToLoad? null :
                    <ShowMoreButton disabled={loading} onClick={getMoreViolations}>
                        {loading? 'Зареждане...' : 'Покажи още'}
                    </ShowMoreButton>
            }
        </ViolationFeed>
    );
};