import React, { useRef } from 'react'

import handleViewport from 'react-in-viewport'
import { Link } from 'react-router-dom'

import PercentageLine from '../PercentageLine.js'
import ResultsLine from '../ResultsLine.js'
import SimpleLine from '../SimpleLine'

import {
  faExclamationCircle,
  faExclamationTriangle,
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import styled from 'styled-components'

import { formatCount } from '../../Util'
import { rgbGradient } from '../bulgaria_map/generateRegionData.js'

const SubdivisionTableRowStyle = styled.tr`
  ${(props) =>
    props.type === 'top'
      ? `

        //background-color: #666;
        //color: white;
        font-weight: bold;
        //font-size: 32px;
        text-align: left;

    `
      : props.type === 'middle'
      ? `

        text-align: left;
        //background-color: #ddd;
        //padding-left: 80px;

    `
      : props.type === 'bottom'
      ? `



    `
      : ``}
`

export default handleViewport((props) => {
  const { inViewport, forwardedRef } = props
  const alreadyLoaded = useRef(false)
  if (inViewport) alreadyLoaded.current = true
  const shouldLoad = inViewport || alreadyLoaded.current

  const generateTooltip = (text, count) => {
    return `
            <div>
              <table style="width: 100%;">
              <tbody>
                <tr>
                  <td>${text}</td>
                  <td style="text-align: right; padding-left: 20px;">
                    ${formatCount(count)}
                  </td> 
                </tr>
              </tbody>
              </table>
            </div>
        `
  }

  return props.type === 'middle' || props.type === 'top' ? (
    <>
      <SubdivisionTableRowStyle
        ref={forwardedRef}
        style={{ opacity: shouldLoad ? 1 : 0, transition: 'opacity 1s ease' }}
        type={props.type}
      >
        <td
          colSpan={2}
          style={{
            textAlign: 'left',
            paddingLeft: props.type === 'middle' ? '80px' : '20px',
            paddingRight: 0,
          }}
        >
          {props.type === 'top' ? (
            <b>{props.subdivision.name}</b>
          ) : (
            props.subdivision.name
          )}
        </td>
      </SubdivisionTableRowStyle>
    </>
  ) : (
    <>
      <SubdivisionTableRowStyle
        ref={forwardedRef}
        style={{ opacity: shouldLoad ? 1 : 0, transition: 'opacity 1s ease' }}
        type={props.type}
      >
        <td>
          {!props.subdivision.segment ? (
            props.subdivision.name
          ) : (
            <>
              {props.subdivision.stats.highRisk > 0 && (
                <span
                  style={{
                    color: `rgb(255, 0, 0)`,
                  }}
                  data-tip={generateTooltip(
                    `Високорискови секции`,
                    props.subdivision.stats.highRisk
                  )}
                  data-for={`subdivisionTableTooltip`}
                >
                  <FontAwesomeIcon icon={faExclamationCircle} />{' '}
                </span>
              )}

              {props.subdivision.stats.midRisk > 0 && (
                <span
                  style={{
                    color: `rgb(255, 157, 0)`,
                  }}
                  data-tip={generateTooltip(
                    `Среднорискови секции`,
                    props.subdivision.stats.midRisk
                  )}
                  data-for={`subdivisionTableTooltip`}
                >
                  <FontAwesomeIcon icon={faExclamationCircle} />{' '}
                </span>
              )}

              {props.subdivision.stats.violationsCount > 0 && (
                <span
                  style={{
                    color: rgbGradient(
                      255,
                      255,
                      0,
                      255,
                      0,
                      0,
                      props.subdivision.violationPercentage
                    ),
                  }}
                  data-tip={generateTooltip(
                    `Сигнали`,
                    props.subdivision.stats.violationsCount
                  )}
                  data-for={`subdivisionTableTooltip`}
                >
                  <FontAwesomeIcon icon={faExclamationTriangle} />{' '}
                </span>
              )}

              <Link
                to={
                  props.embed
                    ? `/embed/mini-results/${props.subdivision.segment}`
                    : `/${props.subdivision.segment}`
                }
              >
                {props.showNumbers ? props.subdivision.number : null}{' '}
                {props.subdivision.name}
              </Link>
            </>
          )}
        </td>
        <td>
          {props.mode === 'distribution' && (
            <ResultsLine
              name={props.subdivision.name}
              results={props.subdivision.results}
              parties={props.parties}
              totalValid={props.subdivision.stats.validVotes}
              totalInvalid={props.subdivision.stats.invalidVotes}
              firstParty={props.singleParty === '' ? null : props.singleParty}
              embed={props.embed}
              thin
            />
          )}
          {props.mode === 'sectionsWithResults' && (
            <PercentageLine
              embed={props.embed}
              highRisk={props.subdivision.stats.highRisk}
              midRisk={props.subdivision.stats.midRisk}
              sectionsCount={props.subdivision.stats.sectionsCount}
              thin
            />
          )}
          {props.mode !== 'distribution' &&
            props.mode !== 'sectionsWithResults' && (
              <SimpleLine
                percentage={props.subdivision.percentage}
                tooltipTitle={props.subdivision.name}
                tooltipField={props.subdivision.tooltipField}
                tooltipValue={props.subdivision.tooltipValue}
                embed={props.embed}
                thin
              />
            )}
        </td>
      </SubdivisionTableRowStyle>
    </>
  )
})
