import React, { useEffect } from 'react';

import { useParams, useHistory } from 'react-router-dom';

import Region from './units/Region.js';
import Admunit from './units/Admunit.js';
import District from './units/District.js';
import Section from './units/Section.js';

export default props => {
    const { unit } = useParams();
    const history = useHistory();

    useEffect(() => {window.scrollTo(0, 0);}, []);

    const returnToMain = () => {
        console.log('returning to main');
        console.log(unit);
        history.push('/');
        return null;
    };

    return(
        <div>
            {
                unit.length === 2
                ? <Region/> 
                : unit.length === 4
                ? <Admunit/>
                : unit.length === 6
                ? <District/>
                : unit.length === 9
                ? <Section/>
                : returnToMain()
            }
        </div>
    )
};