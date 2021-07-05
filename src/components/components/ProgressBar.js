import React from 'react';

import styled from 'styled-components';

import { formatPercentage } from '../Util';

const ProgressBar = styled.div`
    height: 10px;
    display: inline-block;

    ${props => props.embed? `
        height: 5px;
    ` : null}
`;

const ProgressTitle = styled.h1`
    margin: 0;
    font-weight: normal;
    color: #555;

    ${props => props.embed? `
        font-size: 14px;
    ` : null}
`;

const ProgressDescription = styled.p`
    margin: 0;
    color: #999;
    font-size: 13px;
`;

export default props => {
    return (
        <div style={props.embed? {
            //position: 'fixed',
            //left: 0, right: 0,
            //top: '50px',
            padding: '0 100px', paddingTop: '20px'
        } : {
            padding: '0 100px', paddingTop: '20px'
        }}>
            <ProgressTitle embed={props.embed}>
                {props.title}
                <span style={{float: 'right'}}>{formatPercentage(props.percentage)}%</span>
            </ProgressTitle>
            <ProgressBar embed={props.embed} style={{backgroundColor: props.color, width: `${props.percentage * 100}%`}}/>
            <ProgressBar embed={props.embed} style={{backgroundColor: props.emptyColor, width: `${(1-props.percentage) * 100}%`}}/>
            {props.embed? null : <ProgressDescription embed={props.embed}>{props.description}</ProgressDescription>}
        </div>
    );
};