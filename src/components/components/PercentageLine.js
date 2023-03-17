import React, { useRef } from 'react'
import handleViewport from 'react-in-viewport'
import styled from 'styled-components'
import { formatCount, formatPercentage } from '../Util'
import {
  generatePopulated,
  generateProcessed,
  generateRisks,
} from './generateSectionSegments'

// ----------------------------------------------------------------------------
// Utils
// ----------------------------------------------------------------------------

const generateTooltip = (color, displayName, percentage, count) => {
  return `
      <div>
        <h2 style="margin: 5px; color: #${color}">
          ${displayName} 
          ${
            percentage &&
            `<span style="float: right; margin-left: 20px;">
                ${formatPercentage(percentage)}%
              </span>`
          }
            
        </h2>
        <hr style="border-color: #aaa; border-top: none;"/>
        <table style="width: 100%;">
        <tbody>
          <tr>
            <td style="padding-right: 20px;">Брой секции</td>
            <td style="text-align: right;">
              ${formatCount(count)}
            </td> 
          </tr>
        </tbody>
        </table>
      </div>
    `
}

const getDataForSectionsMode = (sectionsMode, stats) => {
  switch (sectionsMode) {
    case `populated`:
      return generatePopulated(stats)
    case `risk`:
      return generateRisks(stats)
    case `processed`:
      return generateProcessed(stats)
  }
}

// ----------------------------------------------------------------------------
// Sub-components
// ----------------------------------------------------------------------------

const ResultLineSegment = styled.div`
  display: inline-block;
  background-color: #777;
  height: 50px;
  transition: width 1s ease;
  width: 0;

  text-align: center;
  color: white;
  ${(props) => (props.embed ? `font-size: 11px;` : 'font-size: 16px;')}
  font-weight: bold;

  &.thin {
    height: 20px;
  }
  &.ultra-thin {
    height: 15px;
  }
  &:hover {
    box-shadow: 0px 0px 3px #000;
  }
`

// ----------------------------------------------------------------------------
// Component
// ----------------------------------------------------------------------------

export default handleViewport(
  ({ inViewport, forwardedRef, sectionsMode, stats, embed, thin }) => {
    const alreadyLoaded = useRef(false)
    if (inViewport) alreadyLoaded.current = true

    const segments = getDataForSectionsMode(sectionsMode, stats)

    return (
      <div className="results-line" ref={forwardedRef}>
        {[
          segments.map((segment, i) => {
            const { color, displayName, percentage, count } = segment
            return (
              <ResultLineSegment
                key={i}
                className={embed ? 'ultra-thin' : thin ? 'thin' : ''}
                style={{
                  backgroundColor: `${color}`,
                  width: `${percentage * 100}%`,
                }}
                data-tip={generateTooltip(
                  color,
                  displayName,
                  percentage,
                  count
                )}
                data-for={`subdivisionTableTooltip`}
              />
            )
          }),
        ]}
      </div>
    )
  }
)
