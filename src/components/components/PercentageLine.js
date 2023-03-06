import React, { useRef } from 'react'
import handleViewport from 'react-in-viewport'
import styled from 'styled-components'
import { formatCount, formatPercentage } from '../Util'

// ----------------------------------------------------------------------------
// Const
// ----------------------------------------------------------------------------

const RISKS = [
  {
    displayName: `Висок риск`,
    name: `High`,
    color: `#9C1414`,
  },
  {
    displayName: `Среден риск`,
    name: `Medium`,
    color: `#F7B00D`,
  },
  {
    displayName: `Нисък риск`,
    name: `Low`,
    color: `#0a7399`,
  },
]

// ----------------------------------------------------------------------------
// Utils
// ----------------------------------------------------------------------------

const generateTooltip = (color, riskName, percentage, count) => {
  return `
      <div>
        <h2 style="margin: 5px; color: #${color}">
          ${riskName} 
          ${
            percentage
              ? `<span style="float: right; margin-left: 20px;">${formatPercentage(
                  percentage
                )}%</span>`
              : ``
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

const riskWithPercentages = ({ highRisk, midRisk, sectionsCount }) => {
  const percentage = {
    High: highRisk / sectionsCount,
    Medium: midRisk / sectionsCount,
    Low: (sectionsCount - (highRisk + midRisk)) / sectionsCount,
  }

  const count = {
    High: highRisk,
    Medium: midRisk,
    Low: sectionsCount - (highRisk + midRisk),
  }

  return RISKS.map((risk) => {
    risk.percentage = percentage[risk.name]
    risk.count = count[risk.name]

    return risk
  })
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

export default handleViewport((props) => {
  const { inViewport, forwardedRef } = props
  const alreadyLoaded = useRef(false)
  if (inViewport) alreadyLoaded.current = true

  return (
    <div className="results-line" ref={forwardedRef}>
      {[
        riskWithPercentages(props).map((risk, i) => {
          return (
            <ResultLineSegment
              key={i}
              className={props.embed ? 'ultra-thin' : props.thin ? 'thin' : ''}
              style={{
                backgroundColor: `${risk.color}`,
                width: `${risk.percentage * 100}%`,
              }}
              data-tip={generateTooltip(
                risk.color,
                risk.displayName,
                risk.percentage,
                risk.count
              )}
              data-for={`subdivisionTableTooltip`}
            />
          )
        }),
      ]}
    </div>
  )
})
