import React, { useRef } from 'react';

import { formatCount, formatPercentage } from '../../Util';

import handleViewport from 'react-in-viewport';

export default handleViewport(props => {
    const { inViewport, forwardedRef } = props;
    const alreadyLoaded = useRef(false);
    if(inViewport) alreadyLoaded.current = true;
    const shouldLoad = inViewport || alreadyLoaded.current;

    return (
        <tr ref={forwardedRef} style={{opacity: shouldLoad? 1 : 0}}>
            <td>{props.party.number === '0'? null : props.party.number}</td>
            <td>
                <span style={{color: `#${props.party.color}`}}>
                    {props.party.displayName}
                </span>
                <span className={'votes-count'}>
                    {!props.party.validVotes? null : formatCount(props.party.validVotes)}
                </span>
                
                <span style={{float: 'right'}}>
                    {!props.percentage? 'Няма данни' : `${formatPercentage(props.percentage)}%`}
                </span>
                
                <br/>

                <div>
                    <div className='vote-percent-bar' style={{
                        backgroundColor: `#${props.party.color}`,
                        transition: 'width 2s ease',
                        width: shouldLoad? `${props.barPercent * 100}%` : 0,
                        fontSize: '28px'
                    }}/>
                </div>
            </td>
        </tr>
    );
});