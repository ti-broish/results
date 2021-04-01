import React, { useRef } from 'react';

import { Link } from 'react-router-dom';
import handleViewport from 'react-in-viewport';

import ResultsLine from './ResultsLine';

export default handleViewport(props => {
    const { inViewport, forwardedRef } = props;
    const alreadyLoaded = useRef(false);
    if(inViewport) alreadyLoaded.current = true;
    const shouldLoad = inViewport || alreadyLoaded.current;

    return(
        <tr ref={forwardedRef} style={{opacity: shouldLoad? 1 : 0, transition: 'opacity 1s ease'}}>
            <td>
                <Link to={
                    props.embed
                    ? `/embed/mini-results/${props.unit?props.unit:''}${props.subdivision.number}`
                    : `/${props.unit?props.unit:''}${props.subdivision.number}`
                }>    
                    {props.showNumbers? props.subdivision.number : null} {props.subdivision.name}
                </Link>
            </td>
            <td>
                <ResultsLine
                    results={props.subdivision.results} 
                    parties={props.parties}
                    totalValid={props.subdivision.totalValid} 
                    totalInvalid={props.subdivision.totalInvalid}
                    firstParty={props.singleParty === ''? null : props.singleParty}
                    thin
                    embed={props.embed}
                />
            </td>
        </tr>
    )
});