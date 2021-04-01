import React, { useContext } from 'react';

import { Link, useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';

import { ElectionContext } from '../Election';

import styled from 'styled-components';

const CrumbLink = styled(Link)`
    color: #666;
    font-size: 14px;
    text-decoration: none;
    font-weight: bold;

    ${props => props.embed? `
        font-size: 9px;
    ` : null}
`;

const pointyArrowHeightEmbed = 24;
const pointyArrowHeight = 30;

const PointyArrowBase = styled.span`
    display: inline-block;
    height: ${props => props.embed? pointyArrowHeightEmbed : pointyArrowHeight}px;
    box-sizing: border-box;
    vertical-align: top;
`;

const PointyArrowBack = styled(PointyArrowBase)`
    border-left: ${props => (props.embed? pointyArrowHeightEmbed : pointyArrowHeight) / 2}px solid #0000;
    border-top: ${props => (props.embed? pointyArrowHeightEmbed : pointyArrowHeight) / 2}px solid #eee;
    border-bottom: ${props => (props.embed? pointyArrowHeightEmbed : pointyArrowHeight) / 2}px solid #eee;
    margin-left: -11px;
`;

const PointyArrowMiddle = styled(PointyArrowBase)`
    background-color: #eee;
    padding: 6px;
`;

const PointyArrow = styled(PointyArrowBase)`
    border-left: ${props => (props.embed? pointyArrowHeightEmbed : pointyArrowHeight) / 2}px solid #eee;
    border-top: ${props => (props.embed? pointyArrowHeightEmbed : pointyArrowHeight) / 2}px solid #0000;
    border-bottom: ${props => (props.embed? pointyArrowHeightEmbed : pointyArrowHeight) / 2}px solid #0000;
`;

export default props => {
    const { unit } = useParams();
    const { election, globalData } = useContext(ElectionContext);

    const backUrl = 
        props.embed?   
            (props.data.crumbs? `/embed/mini-results/${props.data.crumbs[props.data.crumbs.length-1].unit}` : `/embed/mini-results`) :
            (props.data.crumbs? `/${props.data.crumbs[props.data.crumbs.length-1].unit}` : `/`);

    return(
        <div>
            <CrumbLink to={backUrl} embed={props.embed}>
                <PointyArrowMiddle style={{backgroundColor: '#0000'}} embed={props.embed}>
                    <FontAwesomeIcon icon={faArrowLeft}/> Назад
                </PointyArrowMiddle>
            </CrumbLink>
            <CrumbLink to={props.embed? `/embed/mini-results` : `/`} embed={props.embed}>
                <PointyArrowMiddle embed={props.embed}>
                    {globalData.name}
                </PointyArrowMiddle>
                <PointyArrow embed={props.embed}/>
            </CrumbLink>
            {
                !props.data.crumbs? null :
                props.data.crumbs.map(crumb =>
                    <CrumbLink to={props.embed? `/embed/mini-results/${crumb.unit}` : `/${crumb.unit}`} embed={props.embed}>
                        <PointyArrowBack embed={props.embed}/>
                        <PointyArrowMiddle embed={props.embed}>
                            {crumb.name}
                        </PointyArrowMiddle>
                        <PointyArrow embed={props.embed}/>
                    </CrumbLink>
                )
            }
            <CrumbLink to={props.embed? `/embed/mini-results/${unit}` : `/${unit}`} embed={props.embed}>
                <PointyArrowBack embed={props.embed}/>
                <PointyArrowMiddle embed={props.embed}>
                    {props.data.name}
                </PointyArrowMiddle>
                <PointyArrow embed={props.embed}/>
            </CrumbLink>
        </div>
    )
};