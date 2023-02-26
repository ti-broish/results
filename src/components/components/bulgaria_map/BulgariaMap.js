import React, { useState, useContext, useRef, useEffect } from 'react';

import { useHistory } from 'react-router-dom';

import styled from 'styled-components';
import ReactTooltip from 'react-tooltip';

const StyledTooltip = styled(ReactTooltip)`
  background-color: white !important;
  opacity: 1 !important;
  color: black !important;
  border: none;
  padding: 0;
  margin: 0;
`;

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
`;

const MapControls = styled.div`
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

  ${(props) =>
    props.embed && !props.homepage
      ? `
        font-size: 10px;
        font-weight: bold;
        height: 32px;
    `
      : `
    
    `}
`;

const MapControlsSingleParty = styled.div`
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

  ${(props) =>
    props.embed && !props.homepage
      ? `
        font-size: 10px;
        font-weight: bold;
    `
      : `
    
    `}
`;

import regionPaths from './regionPaths';

import {
  generateTooltipDominant,
  generateTooltipSingleParty,
  generateTooltipTurnout,
  generateTooltipVoters,
  generateNullTooltip,
  generateTooltipCoverage,
  generateTooltipProcessed,
  generateTooltipViolations,
} from './generateTooltipContent';

import {
  generateDisplayParties,
  generateRegionDataDominant,
  generateRegionDataSingleParty,
  generateRegionDataTurnout,
  generateRegionDataVoters,
  generateRegionDataCoverage,
  generateRegionDataProcessed,
  generateRegionDataViolations,
} from './generateRegionData';

import handleViewport from 'react-in-viewport';

export default handleViewport((props) => {
  const { inViewport, forwardedRef } = props;
  const alreadyLoaded = useRef(false);
  if (inViewport) alreadyLoaded.current = true;
  const shouldLoad = inViewport || alreadyLoaded.current;

  const history = useHistory();
  const [mode, setMode] = useState(
    props.showViolationsOnly || !props.resultsAvailable
      ? 'violations'
      : 'dominant'
  );
  const [singleParty, setSingleParty] = useState('');
  const [singlePartyMode, setSinglePartyMode] = useState('percentage');

  const generateRegionData = () => {
    switch (mode) {
      case 'dominant':
        return generateRegionDataDominant(
          props.regions,
          props.parties,
          props.results
        );
      case 'single-party':
        return generateRegionDataSingleParty(
          singleParty,
          singlePartyMode,
          props.regions,
          props.parties,
          props.results
        );
      case 'turnout':
        return generateRegionDataTurnout(
          props.regions,
          props.parties,
          props.results
        );
      case 'voters':
        return generateRegionDataVoters(props.regions);
      case 'coverage':
        return generateRegionDataCoverage(props.regions);
      case 'sectionsWithResults':
        return generateRegionDataProcessed(
          props.regions,
          props.parties,
          props.results
        );
      case 'violations':
        return generateRegionDataViolations(
          props.regions,
          props.parties,
          props.results
        );
      default:
        return generateRegionDataViolations(props.regions);
    }
  };

  const generateTooltipContent = (region, tooltipData) => {
    if (!tooltipData) return generateNullTooltip(region);
    switch (mode) {
      case 'dominant':
        return generateTooltipDominant(region, tooltipData);
      case 'single-party':
        return generateTooltipSingleParty(singleParty, region, tooltipData);
      case 'turnout':
        return generateTooltipTurnout(region, tooltipData);
      case 'voters':
        return generateTooltipVoters(region, tooltipData);
      case 'coverage':
        return generateTooltipCoverage(region, tooltipData);
      case 'sectionsWithResults':
        return generateTooltipProcessed(region, tooltipData);
      case 'violations':
        return generateTooltipViolations(region, tooltipData);
      default:
        return generateTooltipViolations(region, tooltipData);
    }
  };

  const regionData = generateRegionData();

  const { displayParties, displayPartiesTotal } = generateDisplayParties(
    props.parties,
    props.results,
    6,
    null,
    null,
    '0'
  );

  const setSelectedMode = (mode) => {
    setMode(mode);
    props.selectedMode(mode);
  };

  const publicURL = process.env.PUBLIC_URL ? process.env.PUBLIC_URL : '/';

  return (
    <>
      {props.mapModesHidden || props.showViolationsOnly ? null : (
        <MapControls embed={props.embed} homepage={props.homepage}>
          {props.resultsAvailable ? (
            <>
              <button
                className={mode === 'dominant' ? 'selected' : ''}
                onClick={() => setSelectedMode('dominant')}
              >
                Водеща партия
              </button>
              <button
                className={mode === 'single-party' ? 'selected' : ''}
                onClick={() => setSelectedMode('single-party')}
              >
                Отделна партия
              </button>
            </>
          ) : null}
          {/*<button className={mode === 'turnout'? 'selected' : ''} onClick={()=>setMode('turnout')}>Активност</button>*/}
          <button
            className={mode === 'violations' ? 'selected' : ''}
            onClick={() => setSelectedMode('violations')}
          >
            Сигнали
          </button>
          <button
            className={mode === 'voters' ? 'selected' : ''}
            onClick={() => setSelectedMode('voters')}
          >
            Избиратели
          </button>
          {/*<button className={mode === 'coverage'? 'selected' : ''} onClick={()=>setMode('coverage')}>Покритие</button>*/}
          <button
            className={mode === 'sectionsWithResults' ? 'selected' : ''}
            onClick={() => setSelectedMode('sectionsWithResults')}
          >
            Секции
          </button>
          <button
            disabled={true}
            className={mode === 'video' ? 'selected' : ''}
            onClick={() => setSelectedMode('video')}
          >
            Видео
          </button>
        </MapControls>
      )}

      {mode === 'video' ? null : (
        <>
          {props.mapModesHidden || props.showViolationsOnly ? null : mode ===
            'single-party' ? (
            <MapControlsSingleParty
              embed={props.embed}
              homepage={props.homepage}
            >
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
                <button
                  className={singlePartyMode === 'percentage' ? 'selected' : ''}
                  onClick={() => setSinglePartyMode('percentage')}
                >
                  Процент
                </button>
                <button
                  className={singlePartyMode === 'votes' ? 'selected' : ''}
                  onClick={() => setSinglePartyMode('votes')}
                >
                  Гласове
                </button>
              </div>
            </MapControlsSingleParty>
          ) : null}
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
              height={props.embed ? 'auto' : '169.67859mm'}
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
              <g id="Plan_x0020_1" transform="translate(-1740.6745,-1498.0644)">
                {Object.keys(regionPaths)?.map((key, index) => {
                  const regionDataForKey = regionData[key];
                  const tooltipData = regionDataForKey
                    ? regionDataForKey.tooltipData
                    : null;
                  const regionHasNoViolations =
                    tooltipData?.publishedViolations == 0;

                  const clickHandler = () => {
                    if (props.linkToMainSite) {
                      const newHref = `https://tibroish.bg${publicURL}/${key}`;
                      top.location.href = newHref;
                    } else if (props.embed) {
                      history.push(`/embed/mini-results/${key}`);
                    } else if (props.showViolationsOnly) {
                      if (regionHasNoViolations) {
                        return;
                      }
                      props.loadViolationsForRegion(key);
                    } else history.push(`/${key}`);
                  };
                  const color = regionDataForKey
                    ? regionDataForKey.color
                    : '#eee';

                  const region = props.regions.find(
                    (region) => region.id.toString() === key.toString()
                  );

                  const dynamicStyle = (key) => {
                    const style = {
                      fill: shouldLoad ? color : "#888",
                      transition: "fill 1.5s ease"
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
                      data-tip={generateTooltipContent(region, tooltipData)}
                      data-for={'bulgariaMapTooltip'}
                    />
                  );
                })}
              </g>
            </svg>
          </BulgariaMapStyle>
        </>
      )}
    </>
  );
});
