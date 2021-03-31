import React, { useRef } from 'react';

import { Fade } from 'react-reveal';
import { formatCount, formatPercentage } from '../Util';

import handleViewport from 'react-in-viewport';

export default handleViewport(props => {
    const { inViewport, forwardedRef } = props;
    const alreadyLoaded = useRef(false);
    if(inViewport) alreadyLoaded.current = true;
    const shouldLoad = inViewport || alreadyLoaded.current;

    return (
        <tr ref={forwardedRef} style={{opacity: shouldLoad? 1 : 0}}>
            <td>{props.party.number}</td>
            <td>
                <span style={{color: props.party.color}}>
                    {props.party.name}
                </span>
                <span style={{fontSize: '18px', marginLeft: '10px'}}>
                    {formatCount(props.party.validVotes)}
                </span>
                
                <span style={{float: 'right'}}>
                    {formatPercentage(props.percentage)}%
                </span>
                
                <br/>

                <div>
                    <div className='vote-percent-bar' style={{
                        backgroundColor: props.party.color,
                        transition: 'width 2s ease',
                        width: shouldLoad? `${props.barPercent * 100}%` : 0,
                        fontSize: '28px'
                    }}/>
                </div>
            </td>
        </tr>
    );
});