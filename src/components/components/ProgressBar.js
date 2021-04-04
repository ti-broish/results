import React from 'react';

import styled from 'styled-components';

import { formatPercentage } from '../Util';

const ProgressBar = styled.div`
    height: 10px;
    display: inline-block;
`;

const ProgressTitle = styled.h1`
    margin: 0;
    font-weight: normal;
    color: #555;
`;

const ProgressDescription = styled.p`
    margin: 0;
    color: #999;
    font-size: 13px;
`;

export default props => {
    return (
        <div style={{padding: '0 100px'}}>
            <ProgressTitle>
                {props.title}
                <span style={{float: 'right'}}>{formatPercentage(props.percentage)}%</span>
            </ProgressTitle>
            <ProgressBar style={{backgroundColor: props.color, width: `${props.percentage * 100}%`}}/>
            <ProgressBar style={{backgroundColor: props.emptyColor, width: `${(1-props.percentage) * 100}%`}}/>
            <ProgressDescription>{props.description}</ProgressDescription>
        </div>
    );
};