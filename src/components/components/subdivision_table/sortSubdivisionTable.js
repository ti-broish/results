import { formatCount, formatPercentage } from '../../Util';

const sortSignals = subdivisions => {
    let maxViolations = 0;
    let minViolations = 100000000000;

    subdivisions.forEach(subdivision => {
        const violationsCount = subdivision.stats.violationsCount;
        if(violationsCount) {
            if(subdivision.stats.violationsCount > maxViolations) maxViolations = violationsCount;
            else if(subdivision.stats.violationsCount < minViolations) minViolations = violationsCount;
        }
    });

    subdivisions.forEach(subdivision => {
        const violationsCount = subdivision.stats.violationsCount;
        if(!violationsCount) subdivision.violationPercentage = 0;
        else {
            subdivision.violationPercentage = (violationsCount - minViolations) / (maxViolations - minViolations);
        }
    });

    return subdivisions;
};

export const sortTableDistribution = (subdivisions, singleParty) => {
    if(singleParty === '') {
        subdivisions = subdivisions.sort((s1, s2) => s1.id - s2.id );
    } else {
        subdivisions = subdivisions.sort((s1, s2) => {
            const getPartyPercentage = subdivision => {
                const partyMap = {};
                for(var i = 0; i < subdivision.results.length; i += 2) {
                    partyMap[subdivision.results[i]] = subdivision.results[i+1];
                }

                if(!partyMap[singleParty])
                    return 0;
                else
                    return partyMap[singleParty] / subdivision.stats.validVotes;
            };

            return getPartyPercentage(s2) - getPartyPercentage(s1);
        });
    }

    return sortSignals(subdivisions);
};

export const sortTableVoters = (subdivisions) => {
    let highestCount = 0;
    for(const subdivision of subdivisions) {
        const currentCount = subdivision.stats.voters;

        if(currentCount > highestCount)
            highestCount = currentCount;
    }

    for(const subdivision of subdivisions) {
        const currentCount = subdivision.stats.voters;
        subdivision.percentage = currentCount / highestCount;
        subdivision.tooltipField = 'Избиратели в предварителните списъци';
        subdivision.tooltipValue = formatCount(subdivision.stats.voters);
    }

    subdivisions.sort((s1, s2) => s2.percentage - s1.percentage);

    return sortSignals(subdivisions);
};

export const sortTableTurnout = (subdivisions) => {
    let highestCount = 0;
    for(const subdivision of subdivisions) {
        const stats = subdivision.stats;
        const currentCount = (stats.validVotes + stats.invalidVotes) / stats.voters;

        if(currentCount > highestCount)
            highestCount = currentCount;
    }

    for(const subdivision of subdivisions) {
        const stats = subdivision.stats;
        const currentCount = (stats.validVotes + stats.invalidVotes) / stats.voters;
        subdivision.percentage = currentCount / highestCount;
        subdivision.tooltipField = 'Активност';
        subdivision.tooltipValue = `${formatPercentage(currentCount)}%`;
    }

    subdivisions.sort((s1, s2) => s2.percentage - s1.percentage);
    return sortSignals(subdivisions);
};
