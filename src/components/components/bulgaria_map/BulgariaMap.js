import React, { useRef, useState } from 'react'

import { useHistory } from 'react-router-dom'

import handleViewport from 'react-in-viewport'
import ReactTooltip from 'react-tooltip'
import styled from 'styled-components'
import { generateDisplayParties } from './generateRegionData'
import { generateRegionData, generateTooltipContent } from './helpers'
import regionPaths from './regionPaths'

// ----------------------------------------------------------------------------
// Const
// ----------------------------------------------------------------------------

// Controls are shown in order specified. showIf `always` will always show a
// button, otherwise you can give it a filter name to show dynamically

const PRIMARY_CONTROLS = [
  { title: `Водеща партия`, mode: `dominant`, showIf: `resultsAvailable` },
  { title: `Отделна партия`, mode: 'singleParty', showIf: `resultsAvailable` },
  { title: `Активност`, mode: `turnout`, showIf: `resultsAvailable` },
  { title: `Сигнали`, mode: `violations`, showIf: `violationsReported` },
  { title: `Секции`, mode: `sectionsWithResults`, showIf: `always` },
  { title: `Избиратели`, mode: `voters`, showIf: `always` },
  { title: `Видео`, mode: `video`, showIf: `streamsAvailable` },
]

const SECTION_CONTROLS = [
  { title: `Обработени`, mode: `processed`, showIf: `sectionsWithResults` },
  { title: `Рискови`, mode: `risk`, showIf: `always` },
  { title: `Покритие`, mode: `populated`, showIf: `populatedSections` },
]

const SINGLE_PARTY_SUBCONTROLS = [
  { title: `Процент`, mode: `percentage` },
  { title: `Гласове`, mode: `votes` },
]

// ----------------------------------------------------------------------------
// Utils
// ----------------------------------------------------------------------------

const filterControls = (controls, filters) => {
  return controls.filter((control) => {
    if (filters[control.showIf] === true || control.showIf === `always`) {
      return control
    }
  })
}

const renderPrimaryControls = (filters, mode, setMode) => {
  const controlsToShow = filterControls(PRIMARY_CONTROLS, filters)

  return controlsToShow.map((control) => (
    <button
      className={mode === control.mode ? 'selected' : ''}
      onClick={() => setMode(control.mode)}
    >
      {control.title}
    </button>
  ))
}

const renderSectionControls = (filters, sectionsMode, setSectionsMode) => {
  const controlsToShow = filterControls(SECTION_CONTROLS, filters)

  return controlsToShow.map((control) => (
    <button
      className={sectionsMode === control.mode ? 'selected' : ''}
      onClick={() => setSectionsMode(control.mode)}
    >
      {control.title}
    </button>
  ))
}

const renderPartyControls = (
  displayParties,
  singleParty,
  setSingleParty,
  singlePartyMode,
  setSinglePartyMode
) => {
  return (
    <>
      {displayParties?.map((party, idx) => (
        <button
          key={idx}
          className={singleParty === party.number ? 'selected' : ''}
          onClick={() => setSingleParty(party.number)}
        >
          {party.displayName}
        </button>
      ))}
      <div style={{ width: '100%' }}>
        {SINGLE_PARTY_SUBCONTROLS.map((subcontrol) => (
          <button
            className={singlePartyMode === subcontrol.mode ? 'selected' : ''}
            onClick={() => setSinglePartyMode(subcontrol.mode)}
          >
            {subcontrol.title}
          </button>
        ))}
      </div>
    </>
  )
}

// ----------------------------------------------------------------------------
// Sub-components
// ----------------------------------------------------------------------------

const StyledTooltip = styled(ReactTooltip)`
  background-color: white !important;
  opacity: 1 !important;
  color: black !important;
  border: none;
  padding: 0;
  margin: 0;
`

const BulgariaMapStyle = styled.div`
  path {
    fill: #ccc;
    stroke: white;
    stroke-width: 50px;
  }

  path:hover {
    cursor: pointer;
    filter: brightness(0.9);
  }

  path.no-data:hover {
    cursor: not-allowed;
  }
`

const PrimaryMapControls = styled.div`
  text-align: center;

  button {
    border: none;
    background: none;
    padding: 10px;

    &:hover {
      cursor: pointer;
    }

    &.selected {
      color: white;
      background-color: #444;
      border-radius: 10px;
    }
  }

  ${({ embed, homepage }) =>
    embed && !homepage
      ? `
        font-size: 10px;
        font-weight: bold;
        height: 32px;
    `
      : `
    
    `}
`

const SecondaryMapControls = styled.div`
  text-align: center;
  height: 40px;
  margin-bottom: -45px;
  position: relative;
  margin-top: 5px;

  button {
    border: none;
    background: none;
    padding: 5px;

    &:hover {
      cursor: pointer;
    }

    &.selected {
      color: white;
      background-color: #888;
      border-radius: 10px;
    }
  }

  ${({ embed, homepage }) =>
    embed && !homepage
      ? `
        font-size: 10px;
        font-weight: bold;
    `
      : `
    
    `}
`

// ----------------------------------------------------------------------------
// Component
// ----------------------------------------------------------------------------

export default handleViewport(
  ({
    inViewport,
    forwardedRef,
    mode,
    setMode,
    parties,
    results,
    regions,
    mapModesHidden,
    showViolationsOnly,
    embed,
    homepage,
    linkToMainSite,
    loadViolationsForRegion,
    filters,
    sectionsMode,
    setSectionsMode,
  }) => {
    const alreadyLoaded = useRef(false)
    if (inViewport) alreadyLoaded.current = true
    const shouldLoad = inViewport || alreadyLoaded.current

    const history = useHistory()
    const [singleParty, setSingleParty] = useState('')
    const [singlePartyMode, setSinglePartyMode] = useState('percentage')

    const regionData = generateRegionData(
      regions,
      parties,
      results,
      mode,
      singleParty,
      singlePartyMode,
      sectionsMode
    )

    const { displayParties } = generateDisplayParties(
      parties,
      results,
      6,
      null,
      null,
      '0'
    )

    const publicURL = process.env.PUBLIC_URL ? process.env.PUBLIC_URL : '/'

    const showControls = !mapModesHidden && !showViolationsOnly

    return (
      <>
        {showControls && (
          <>
            <PrimaryMapControls embed={embed} homepage={homepage}>
              {renderPrimaryControls(filters, mode, setMode)}
            </PrimaryMapControls>
            {mode === 'singleParty' && (
              <SecondaryMapControls embed={embed} homepage={homepage}>
                {renderPartyControls(
                  displayParties,
                  singleParty,
                  setSingleParty,
                  singlePartyMode,
                  setSinglePartyMode
                )}
              </SecondaryMapControls>
            )}
            {mode === 'sectionsWithResults' && (
              <SecondaryMapControls embed={embed} homepage={homepage}>
                {renderSectionControls(filters, sectionsMode, setSectionsMode)}
              </SecondaryMapControls>
            )}
          </>
        )}

        {mode !== 'video' && (
          <>
            <BulgariaMapStyle>
              <StyledTooltip
                multiline={true}
                html={true}
                border={true}
                borderColor={'#aaa'}
                arrowColor={'white'}
                effect={'solid'}
                place={'top'}
                backgroundColor={'#fff'}
                type={'dark'}
                id={'bulgariaMapTooltip'}
              />
              <svg
                id="bulgaria-map"
                style={{
                  width: '100%',
                  opacity: shouldLoad ? 1 : 0,
                  transition: 'opacity 1s ease',
                }}
                width="261.27612mm"
                height={embed ? 'auto' : '169.67859mm'}
                version="1.0"
                viewBox="0 0 26127.612 16967.859"
                pagecolor="#ffffff"
                bordercolor="#666666"
                borderopacity="1"
                objecttolerance="10"
                gridtolerance="10"
                guidetolerance="10"
                showgrid="false"
                fit-margin-top="0"
                fit-margin-left="0"
                fit-margin-right="0"
                fit-margin-bottom="0"
                ref={forwardedRef}
              >
                <g
                  id="Plan_x0020_1"
                  transform="translate(-1740.6745,-1498.0644)"
                >
                  {Object.keys(regionPaths)?.map((key, index) => {
                    const regionDataForKey = regionData[key]
                    const tooltipData = regionDataForKey
                      ? regionDataForKey.tooltipData
                      : null
                    const regionHasNoViolations =
                      tooltipData?.publishedViolations == 0

                    const clickHandler = () => {
                      if (linkToMainSite) {
                        const newHref = `https://tibroish.bg${publicURL}/${key}`
                        top.location.href = newHref
                      } else if (embed) {
                        history.push(`/embed/mini-results/${key}`)
                      } else if (showViolationsOnly) {
                        if (regionHasNoViolations) {
                          return
                        }
                        loadViolationsForRegion(key)
                      } else history.push(`/${key}`)
                    }
                    const color = regionDataForKey
                      ? regionDataForKey.color
                      : '#eee'

                    const region = regions.find(
                      (region) => region.id.toString() === key.toString()
                    )

                    const dynamicStyle = (key) => {
                      const style = {
                        fill: shouldLoad ? color : '#888',
                        transition: 'fill 1.5s ease',
                      }
                      // This is specifically added for the globe path only
                      // otherwise we cannot click on the continents as
                      // the SVG is bound by the vectors, rarger than full box
                      if (key === '32') style.pointerEvents = 'bounding-box'

                      return style
                    }

                    return (
                      <path
                        key={index}
                        onClick={clickHandler}
                        style={dynamicStyle(key)}
                        d={regionPaths[key].path}
                        data-tip={generateTooltipContent(
                          singleParty,
                          region,
                          tooltipData,
                          mode
                        )}
                        data-for={'bulgariaMapTooltip'}
                      />
                    )
                  })}
                </g>
              </svg>
            </BulgariaMapStyle>
            {mode === 'sectionsWithResults' && sectionsMode === 'risk' && (
              <p>* Данни за рискови секции от ОЧИ</p>
            )}
          </>
        )}
      </>
    )
  }
)
