import React, { useRef } from 'react';

import handleViewport from 'react-in-viewport';
import styled from 'styled-components';

const SimpleLineStyle = styled.div`
    display: inline-block;
    background-color: #019D8C;
    height: 50px;
    transition: width 1s ease;

    &.thin { height: 20px; }
    &.ultra-thin { height: 15px; }
    &:hover { box-shadow: 0px 0px 3px #000; }
`;

export default handleViewport(props => {
    const { inViewport, forwardedRef } = props;
    const alreadyLoaded = useRef(false);
    if(inViewport) alreadyLoaded.current = true;
    const shouldLoad = inViewport || alreadyLoaded.current;

    const generateTooltip = (color) => {
        return (`
            <div>
                <h2 style="margin: 5px;">
                    ${props.tooltipTitle}
                </h2>
                <hr style="border-color: #aaa; border-top: none;"/>
                <table style="width: 100%;">
                <tbody>
                    <tr>
                        <td>${props.tooltipField}</td>
                        <td style="text-align: right;">${props.tooltipValue}</td> 
                    </tr>
                </tbody>
                </table>
            </div>
        `);
    };

    return(
        <div ref={forwardedRef}>
            <SimpleLineStyle 
                className={props.embed? 'ultra-thin' : props.thin? 'thin' : ''}
                style={{width: shouldLoad? `${props.percentage * 100}%` : 0}}
                data-tip={generateTooltip()}
                data-for={`subdivisionTableTooltip`}
            />
        </div>
    )
});