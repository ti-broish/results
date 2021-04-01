import React, { useEffect } from 'react';

import { useHistory, useParams } from 'react-router-dom';

import Region from '../units/Region.js';
import Admunit from '../units/Admunit.js';
import District from '../units/District.js';
import Section from '../units/Section.js';
import Source from './Source';

export default props => {
    const { unit } = useParams();
    const history = useHistory();

    useEffect(() => {window.scrollTo(0, 0);}, []);

    const returnToMain = () => {
        history.push('/');
        return null;
    };

    return(
        <div>
            {
                unit.length === 2
                ? <Region embed/> 
                : unit.length === 4
                ? <Admunit embed/>
                : unit.length === 6
                ? <District embed/>
                : unit.length === 9
                ? <Section embed/>
                : returnToMain()
            }
            <Source/>
        </div>
    )
};