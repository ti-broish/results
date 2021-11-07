import { formatCount, formatPercentage } from '../../Util';

export const generateNullTooltip = (region) => {
  return `
        <div>
            <h2 style="margin: 5px;">${region.name}</h2>
            <hr style="border-color: #aaa; border-top: none;"/>
            <p>Няма данни (все още)</p>
            </table>
        </div>
    `;
};

export const generateTooltipDominant = (region, tooltipData) => {
  const { displayParties, displayPartiesTotal } = tooltipData;

  return `
        <div>
            <h2 style="margin: 5px;">${region.name}</h2>
            <hr style="border-color: #aaa; border-top: none;"/>
            <table style="width: 100%;">
            <tbody>
                ${displayParties
                  .map(
                    (party, idx) => `
                    <tr key=${idx} style="color: #${party.color};">
                        <td style="padding-right: 20px;">${
                          party.displayName
                        }</td>
                        ${
                          party.validVotes
                            ? `
                                <td style="text-align: right; padding-right: 20px;">${formatCount(
                                  party.validVotes
                                )}</td>
                                <td style=\"text-align: right;\">${formatPercentage(
                                  party.validVotes / region.stats.validVotes
                                )}%</td>
                            `
                            : `
                                <td colspan="2">Няма данни</td>
                            `
                        }
                    </tr>
                `
                  )
                  .reduce((s, a) => s + a, '')}
                <tr style="color: #666;">
                    <td>Други</td>
                    ${
                      region.stats.validVotes
                        ? `
                            <td style="text-align: right; padding-right: 20px;">${formatCount(
                              region.stats.validVotes - displayPartiesTotal
                            )}</td>
                            <td style="text-align: right;">${formatPercentage(
                              (region.stats.validVotes - displayPartiesTotal) /
                                region.stats.validVotes
                            )}%</td>
                        `
                        : `
                            <td colspan="2">Няма данни</td>
                        `
                    }

                </tr>
            </tbody>
            </table>
        </div>
    `;
};

export const generateTooltipSingleParty = (
  singleParty,
  region,
  tooltipData
) => {
  if (!singleParty) {
    return `
            <div>
                <h2 style="margin: 5px;">${region.name}</h2>
                <hr style="border-color: #aaa; border-top: none;"/>
                <p>Моля изберете партия</p>
            </div>
        `;
  } else {
    const partyResult = tooltipData.displayParties.find(
      (party) => party.number === singleParty
    );
    return `
            <div>
                <h2 style="margin: 5px;">${region.name}</h2>
                <hr style="border-color: #aaa; border-top: none;"/>
                <table style="width: 100%;">
                <tbody>
                    <tr>
                        <td>Партия</td>
                        <td style="color: #${
                          partyResult.color
                        }; padding-left: 20px;">${partyResult.displayName}</td>
                    </tr>
                    <tr>
                        <td>Гласове</td>
                        <td style="color: #${
                          partyResult.color
                        }; text-align: right; padding-left: 20px;">
                        ${
                          partyResult.validVotes
                            ? `${formatCount(partyResult.validVotes)} &nbsp;`
                            : `Няма данни`
                        }
                        </td>
                    </tr>
                    <tr>
                        <td>Процент</td>
                        <td style="color: #${
                          partyResult.color
                        }; text-align: right; padding-left: 20px;">
                        ${
                          partyResult.validVotes
                            ? `${formatPercentage(
                                partyResult.validVotes / region.stats.validVotes
                              )}%`
                            : `Няма данни`
                        }
                        </td>
                    </tr>
                </tbody>
                </table>
            </div>
        `;
  }
};

export const generateTooltipTurnout = (region, tooltipData) => {
  return `
        <div>
            <h2 style="margin: 5px;">${region.name}</h2>
            <hr style="border-color: #aaa; border-top: none;"/>
            <table style="width: 100%;">
            <tbody>
                <tr>
                ${
                  tooltipData.turnout
                    ? `
                        <td style="padding-right: 20px;">Активност</td>
                        <td style="text-align: right;">
                            ${formatPercentage(tooltipData.turnout)}%
                        </td>
                    `
                    : `
                        <td colspan="2">Няма данни</td>
                    `
                }
                </tr>
            </tbody>
            </table>
        </div>   
    `;
};

export const generateTooltipVoters = (region, tooltipData) => {
  return `
        <div>
            <h2 style="margin: 5px;">${region.name}</h2>
            <hr style="border-color: #aaa; border-top: none;"/>
            <table style="width: 100%;">
            <tbody>
                <tr>
                    <td style="padding-right: 20px;">Избиратели</td>
                    <td style="text-align: right;">${formatCount(
                      tooltipData.voters
                    )}</td>
                </tr>
                <tr>
                    <td style="padding-right: 20px;">Гласували</td>
                    <td style="text-align: right;">
                    ${
                      tooltipData.voters
                        ? `${formatCount(tooltipData.votes)}`
                        : `Няма данни`
                    }
                    
                    </td>
                </tr>
                <tr>
                    <td style="padding-right: 20px;">Активност</td>
                    <td style="text-align: right;">
                    ${
                      tooltipData.voters
                        ? `${formatPercentage(
                            tooltipData.votes / tooltipData.voters
                          )}%`
                        : `Няма данни`
                    }
                    </td>
                </tr>
            </tbody>
            </table>
        </div>  
    `;
};

export const generateTooltipCoverage = (region, tooltipData) => {
  return `
        <div>
            <h2 style="margin: 5px;">${region.name}</h2>
            <hr style="border-color: #aaa; border-top: none;"/>
            <table style="width: 100%;">
            <tbody>
                <tr>
                    <td style="padding-right: 20px;">Общо секции</td>
                    <td style="text-align: right;">${formatCount(
                      tooltipData.sections
                    )}</td>
                </tr>
                <tr>
                    <td style="padding-right: 20px;">Покрити секции</td>
                    <td style="text-align: right;">
                    ${formatCount(tooltipData.sectionsWithProtocols)}
                    </td>
                </tr>
                <tr>
                    <td style="padding-right: 20px;">Покритие (%)</td>
                    <td style="text-align: right;">
                    ${
                      tooltipData.sections
                        ? `${formatPercentage(
                            tooltipData.sectionsWithProtocols /
                              tooltipData.sections
                          )}%`
                        : `Няма данни`
                    }
                    </td>
                </tr>
            </tbody>
            </table>
        </div>  
    `;
};

export const generateTooltipProcessed = (region, tooltipData) => {
  return `
        <div>
            <h2 style="margin: 5px;">${region.name}</h2>
            <hr style="border-color: #aaa; border-top: none;"/>
            <table style="width: 100%;">
            <tbody>
                <tr>
                    <td style="padding-right: 20px;">Общо секции</td>
                    <td style="text-align: right;">${formatCount(
                      tooltipData.sections
                    )}</td>
                </tr>
                <tr>
                    <td style="padding-right: 20px;">Секции с резултати</td>
                    <td style="text-align: right;">
                    ${formatCount(tooltipData.sectionsWithResults)}
                    </td>
                </tr>
                <tr>
                    <td style="padding-right: 20px;">Обработени (%)</td>
                    <td style="text-align: right;">
                    ${
                      tooltipData.sections
                        ? `${formatPercentage(
                            tooltipData.sectionsWithResults /
                              tooltipData.sections
                          )}%`
                        : `Няма данни`
                    }
                    </td>
                </tr>
            </tbody>
            </table>
        </div>  
    `;
};

export const generateTooltipViolations = (region, tooltipData) => {
  return `
        <div>
            <h2 style="margin: 5px;">${region.name}</h2>
            <hr style="border-color: #aaa; border-top: none;"/>
            <table style="width: 100%;">
            <tbody>
                <tr>
                    <td style="padding-right: 20px;">Общ брой сигнали</td>
                    <td style="text-align: right;">
                    
                    ${
                      tooltipData.violationsCount
                        ? `${formatCount(tooltipData.violationsCount)}`
                        : `Няма данни`
                    }</td>
                </tr>
                <tr>
                    <td style="padding-right: 20px;">Обработени сигнали</td>
                    <td style="text-align: right;">
                    ${
                      tooltipData.publishedViolations
                        ? `${formatCount(tooltipData.publishedViolations)}`
                        : `Няма данни`
                    }
                    
                    </td>
                </tr>
                <tr>
                    <td style="padding-right: 20px;">Публикувани сигнали</td>
                    <td style="text-align: right;">
                    ${
                      tooltipData.processedViolations
                        ? `${formatCount(tooltipData.processedViolations)}`
                        : `Няма данни`
                    }
                    </td>
                </tr>
            </tbody>
            </table>
        </div>  
    `;
};
