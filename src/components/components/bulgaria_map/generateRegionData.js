//takes current state and generates stats for every region

export const rgbGradient = (r1, g1, b1, r2, g2, b2, val) => {
  return `rgb(${(r2 - r1) * val + r1},${(g2 - g1) * val + g1},${
    (b2 - b1) * val + b1
  })`;
};

export const generateDisplayParties = (
  parties,
  results,
  count,
  firstPartyId,
  lastPartyId,
  removePartyId
) => {
  const tempParties = {};
  parties.forEach((party) => {
    tempParties[party.id] = { ...party, validVotes: null };
    if (party.id.toString() === '0') tempParties[party.id].color = 'ccc';
  });

  for (var i = 0; i < results.length; i += 2) {
    if (tempParties[results[i]])
      tempParties[results[i]].validVotes = results[i + 1];
  }

  let displayParties = Object.keys(tempParties).map((key) => {
    return { ...tempParties[key], number: key };
  });
  let displayPartiesTotal = 0;

  let firstParty;
  let lastParty;

  if (removePartyId) {
    displayParties = displayParties.filter(
      (party) => party.id.toString() !== removePartyId.toString()
    );
  }

  if (firstPartyId) {
    firstParty = displayParties.find(
      (party) => party.id.toString() === firstPartyId.toString()
    );
    displayParties = displayParties.filter(
      (party) => party.id.toString() !== firstPartyId.toString()
    );
    count = count - 1;
  }

  if (lastPartyId) {
    lastParty = displayParties.find(
      (party) => party.id.toString() === lastPartyId.toString()
    );
    displayParties = displayParties.filter(
      (party) => party.id.toString() !== lastPartyId.toString()
    );
    count = count - 1;
  }

  displayParties = displayParties
    .sort((a, b) => {
      if (!isNaN(a.validVotes) && !isNaN(b.validVotes)) {
        return b.validVotes - a.validVotes;
      } else if (isNaN(a.validVotes) && !isNaN(b.validVotes)) {
        return 100000;
      } else if (!isNaN(a.validVotes) && isNaN(b.validVotes)) {
        return -10000;
      } else return parseInt(a.number, 10) - parseInt(b.number, 10);
    })
    .slice(0, count);

  if (firstPartyId) displayParties = [firstParty, ...displayParties];
  if (lastPartyId) displayParties = [...displayParties, lastParty];

  displayParties.forEach((party) => (displayPartiesTotal += party.validVotes));

  return {
    displayParties: displayParties,
    displayPartiesTotal: displayPartiesTotal,
  };
};

export const generateRegionDataDominant = (regions, parties, results) => {
  const regionData = {};

  for (const region of regions) {
    regionData[region.id] = {};
    const { displayParties, displayPartiesTotal } = generateDisplayParties(
      parties,
      region.results,
      6,
      null,
      '0'
    );
    regionData[region.id].color = displayParties[0].validVotes
      ? `#${displayParties[0].color}`
      : '#eee';
    regionData[region.id].tooltipData = {
      displayParties: displayParties,
      displayPartiesTotal: displayPartiesTotal,
    };
  }

  return regionData;
};

export const generateRegionDataSingleParty = (
  singleParty,
  singlePartyMode,
  regions,
  parties,
  results
) => {
  const regionData = {};

  if (!singleParty) {
    for (const region of regions) {
      regionData[region.id] = {};
      regionData[region.id].color = '#ccc';
      regionData[region.id].tooltipData = {};
    }
  } else {
    const regionResults = {};

    for (const region of regions) {
      regionData[region.id] = {};
      regionResults[region.id] = generateDisplayParties(
        parties,
        region.results,
        10,
        null,
        '0'
      );
    }

    let highestResult = 0;
    let lowestResult = 1000000000;
    for (const region of regions) {
      const regionPartyResult = regionResults[region.id].displayParties.find(
        (party) => party.number === singleParty
      );
      if (regionPartyResult) {
        const currentResult =
          singlePartyMode === 'percentage'
            ? regionPartyResult.validVotes / region.stats.validVotes
            : singlePartyMode === 'votes'
            ? regionPartyResult.validVotes
            : 0;

        if (currentResult > highestResult) highestResult = currentResult;

        if (currentResult < lowestResult) lowestResult = currentResult;
      }
    }

    for (const region of regions) {
      const regionPartyResult = regionResults[region.id].displayParties.find(
        (party) => party.number === singleParty
      );
      if (regionPartyResult) {
        const currentResult =
          singlePartyMode === 'percentage'
            ? regionPartyResult.validVotes / region.stats.validVotes
            : singlePartyMode === 'votes'
            ? regionPartyResult.validVotes
            : 0;

        const percentage =
          (currentResult - lowestResult) / (highestResult - lowestResult);
        regionData[region.id].color = rgbGradient(
          255,
          0,
          0,
          0,
          255,
          0,
          percentage
        );
        regionData[region.id].tooltipData = {
          displayParties: regionResults[region.id].displayParties,
          displayPartiesTotal: regionResults[region.id].displayPartiesTotal,
        };
      }
    }
  }

  return regionData;
};

export const generateRegionDataTurnout = (regions, parties) => {
  const regionData = {};

  let lowestTurnout = 1000000000;
  let highestTurnout = 0;
  for (const region of regions) {
    const currentTurnout =
      (region.stats.validVotes + region.stats.invalidVotes) /
      region.stats.voters;

    if (currentTurnout > highestTurnout) highestTurnout = currentTurnout;

    if (currentTurnout < lowestTurnout) lowestTurnout = currentTurnout;
  }

  for (const region of regions) {
    const currentTurnout =
      (region.stats.validVotes + region.stats.invalidVotes) /
      region.stats.voters;

    const percentage =
      (currentTurnout - lowestTurnout) / (highestTurnout - lowestTurnout);
    regionData[region.id] = {};
    regionData[region.id].color = rgbGradient(
      202,
      253,
      200,
      0,
      255,
      0,
      percentage
    );
    regionData[region.id].tooltipData = { turnout: currentTurnout };
  }

  return regionData;
};

export const generateRegionDataVoters = (regions) => {
  const regionData = {};

  let lowestCount = 1000000000;
  let highestCount = 0;
  for (const region of regions) {
    const currentCount = region.stats.voters;

    if (currentCount > highestCount) highestCount = currentCount;

    if (currentCount < lowestCount) lowestCount = currentCount;
  }

  for (const region of regions) {
    const percentage =
      (region.stats.voters - lowestCount) / (highestCount - lowestCount);
    regionData[region.id] = {};
    regionData[region.id].color = rgbGradient(
      202,
      253,
      200,
      0,
      255,
      0,
      percentage
    );
    regionData[region.id].tooltipData = {
      voters: region.stats.voters,
      votes: region.stats.validVotes + region.stats.invalidVotes,
    };
  }

  return regionData;
};

export const generateRegionDataCoverage = (regions) => {
  const regionData = {};

  for (const region of regions) {
    const percentage =
      region.stats.sectionsWithProtocols / region.stats.sectionsCount;
    regionData[region.id] = {};
    regionData[region.id].color = rgbGradient(
      237,
      237,
      255,
      10,
      116,
      253,
      percentage
    );
    regionData[region.id].tooltipData = {
      sections: region.stats.sectionsCount,
      sectionsWithProtocols: region.stats.sectionsWithProtocols,
    };
  }

  return regionData;
};

export const generateRegionDataProcessed = (regions) => {
  const regionData = {};

  for (const region of regions) {
    const percentage =
      region.stats.sectionsWithResults / region.stats.sectionsCount;
    regionData[region.id] = {};
    regionData[region.id].color = rgbGradient(
      237,
      237,
      255,
      10,
      116,
      253,
      percentage
    );
    regionData[region.id].tooltipData = {
      sections: region.stats.sectionsCount,
      sectionsWithResults: region.stats.sectionsWithResults,
    };
  }

  return regionData;
};

export const generateRegionDataViolations = (regions) => {
  const regionData = {};

  let lowestCount = 1000000000;
  let highestCount = 0;
  for (const region of regions) {
    const currentCount = region.stats.violationsCount;

    if (currentCount > highestCount) highestCount = currentCount;

    if (currentCount < lowestCount) lowestCount = currentCount;
  }

  for (const region of regions) {
    const percentage =
      (region.stats.violationsCount - lowestCount) /
      (highestCount - lowestCount);
    regionData[region.id] = {};
    regionData[region.id].color = rgbGradient(
      202,
      253,
      200,
      0,
      255,
      0,
      percentage
    );
    regionData[region.id].tooltipData = {
      violationsCount: region.stats.violationsCount,
      publishedViolations: region.stats.publishedViolations,
      processedViolations: region.stats.processedViolations,
    };
  }

  return regionData;
};
