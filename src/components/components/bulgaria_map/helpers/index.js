import {
  generateTooltipDominant,
  generateTooltipSingleParty,
  generateTooltipTurnout,
  generateTooltipVoters,
  generateNullTooltip,
  generateTooltipCoverage,
  generateTooltipProcessed,
  generateTooltipViolations,
} from '../generateTooltipContent'

import {
  generateRegionDataDominant,
  generateRegionDataSingleParty,
  generateRegionDataTurnout,
  generateRegionDataVoters,
  generateRegionDataCoverage,
  generateRegionDataProcessed,
  generateRegionDataViolations,
} from '../generateRegionData'

export const generateRegionData = (
  props,
  mode,
  singleParty,
  singlePartyMode,
  sectionsMode
) => {
  const { regions, parties, results } = props

  switch (mode) {
    case 'dominant':
      return generateRegionDataDominant(regions, parties, results)
    case 'single-party':
      return generateRegionDataSingleParty(
        singleParty,
        singlePartyMode,
        regions,
        parties,
        results
      )
    case 'turnout':
      return generateRegionDataTurnout(regions, parties, results)
    case 'voters':
      return generateRegionDataVoters(regions)
    case 'coverage':
      return generateRegionDataCoverage(regions)
    case 'sectionsWithResults':
      return generateRegionDataProcessed(
        sectionsMode,
        regions,
        parties,
        results
      )
    case 'violations':
      return generateRegionDataViolations(regions, parties, results)
    default:
      return generateRegionDataViolations(regions)
  }
}

export const generateTooltipContent = (
  singleParty,
  region,
  tooltipData,
  mode
) => {
  if (!tooltipData) return generateNullTooltip(region)
  switch (mode) {
    case 'dominant':
      return generateTooltipDominant(region, tooltipData)
    case 'single-party':
      return generateTooltipSingleParty(singleParty, region, tooltipData)
    case 'turnout':
      return generateTooltipTurnout(region, tooltipData)
    case 'voters':
      return generateTooltipVoters(region, tooltipData)
    case 'coverage':
      return generateTooltipCoverage(region, tooltipData)
    case 'sectionsWithResults':
      return generateTooltipProcessed(region, tooltipData)
    case 'violations':
      return generateTooltipViolations(region, tooltipData)
    default:
      return generateTooltipViolations(region, tooltipData)
  }
}
