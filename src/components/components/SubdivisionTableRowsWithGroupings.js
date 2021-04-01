import React from 'react';

import {Link } from 'react-router-dom';
import ResultsLine from './ResultsLine.js';
import SimpleLine from './SimpleLine';
import SubdivisionTableGroupingRow from './SubdivisionTableGroupingRow.js';

export default props => {
    const subdivisionsWithoutGroup = [];

    props.subdivisions.forEach(subdivision => {
        let contained = false;
        props.groupings.forEach(grouping => {
            if(grouping.units.includes(subdivision.number)) {
                contained = true;
            }
        });

        if(!contained) {
            subdivisionsWithoutGroup.push(subdivision.number);
        }
    });

    return([
        props.groupings.map(grouping => [
            <tr><td colSpan={2} style={{textAlign: 'left'}}><b>{grouping.name}</b></td></tr>,
            grouping.units.map(unitKey => {
                const subdivision = props.subdivisions.find(sn => sn.number.toString() === unitKey.toString());
                return(
                    <SubdivisionTableGroupingRow
                        subdivision={subdivision}
                        unit={props.unit}
                        parties={props.parties}
                        singleParty={props.singleParty}
                        mode={props.mode}
                        embed={props.embed}
                    />
                );
            })
        ]),
        subdivisionsWithoutGroup.length === 0? null : [
            <tr><td><b>Неизяснен адрес</b></td><td></td></tr>,
            subdivisionsWithoutGroup.map(unitKey => {
                const subdivision = props.subdivisions.find(sn => sn.number.toString() === unitKey.toString());
                return(
                    <SubdivisionTableGroupingRow
                        subdivision={subdivision}
                        unit={props.unit}
                        parties={props.parties}
                        singleParty={props.singleParty}
                        mode={props.mode}
                        embed={props.embed}
                    />
                ); 
            })
        ]
    ]);
};