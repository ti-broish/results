import React, { useState, useEffect } from 'react';

import ReactTooltip from 'react-tooltip';
import SubdivisionTableRow from './SubdivisionTableRow';
import { mapNodeType } from '../../ResultUnit';

import { useParams } from 'react-router-dom';

import styled from 'styled-components';
import { generateDisplayParties } from '../bulgaria_map/generateRegionData';
import {
  sortTableDistribution,
  sortTableVoters,
  sortTableTurnout,
  sortTableViolations,
} from './sortSubdivisionTable';

const StyledTooltip = styled(ReactTooltip)`
  background-color: white !important;
  opacity: 1 !important;
  color: black !important;
  border: none;
  padding: 0;
  margin: 0;
`;

export const SubdivisionTableDiv = styled.table`
  width: 100%;
  color: #666;
  font-size: 22px;

  td {
    padding: 5px 20px;
    box-sizing: border-box;
  }

  td:nth-child(1) {
    text-align: right;
    width: 280px;
  }

  td:nth-child(2) {
    width: calc(100% - 280px);
  }

  a {
    color: blue;
  }

  ${(props) =>
    props.embed
      ? `
        font-size: 15px;
        td:nth-child(1) {
            width: 160px;
        }
        td:nth-child(2) {
            width: calc(100% - 160px);
        }

        td {
            padding: 5px 5px;
        }
    `
      : null}
`;

const SubdivisionTableControls = styled.div`
  text-align: left;

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
    props.embed
      ? `
        font-size: 12px;
        button { 
            padding: 5px;
        }
    `
      : null}
`;

const SubdivisionControlsParty = styled.div`
  text-align: left;
  height: 40px;
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
    props.embed
      ? `
        font-size: 12px;
    `
      : null}
`;

export default (props) => {
  const { unit } = useParams();
  const [depthMode, setDepthMode] = useState('showAll');
  const [mode, setMode] = useState(
    props.resultsAvailable ? 'distribution' : 'violations'
  );
  const [singleParty, setSingleParty] = useState('');

  useEffect(() => {
    ReactTooltip.rebuild();
  }, [mode]);
  useEffect(() => {
    ReactTooltip.rebuild();
  }, [singleParty]);
  useEffect(() => {
    ReactTooltip.rebuild();
  }, [depthMode]);
  useEffect(() => {
    ReactTooltip.rebuild();
    setMode(getSelectedMode());
  }, [props?.selectedMode]);

  const getSelectedMode = () => {
    const mode = props?.selectedMode;
    switch (mode) {
      case 'violations':
      case 'voters':
      case 'turnout':
        return mode;
      default:
        'distribution';
    }
  };
  const calculateMaxDepth = () => {
    let topNode = props.subdivisions[0];
    if (!topNode.nodes) return 1;
    let middleNode = topNode.nodes[0];
    if (!middleNode.nodes) return 2;
    else return 3;
  };

  const getTopNodeType = () => {
    return props.subdivisions[0].type;
  };

  const getMiddleNodeType = () => {
    let topNode = props.subdivisions[0];
    if (!topNode.nodes) return null;
    return topNode.nodes[0].type;
  };

  const getBottomNodeType = () => {
    let topNode = props.subdivisions[0];
    if (!topNode.nodes) return null;
    let middleNode = topNode.nodes[0];
    if (!middleNode.nodes) return null;
    return middleNode.nodes[0].type;
  };

  const maxDepth = calculateMaxDepth();

  const sorted = (subdivisions) => {
    switch (mode) {
      case 'distribution':
        return sortTableDistribution(subdivisions, singleParty);
      case 'voters':
        return sortTableVoters(subdivisions);
      case 'turnout':
        return sortTableTurnout(subdivisions);
      case 'violations':
        return sortTableViolations(subdivisions);
    }
  };

  const renderAll = (subdivisions, curDepth) => {
    const type =
      maxDepth === 3
        ? curDepth === 3
          ? 'top'
          : curDepth === 2
          ? 'middle'
          : 'bottom'
        : maxDepth === 2
        ? curDepth === 2
          ? 'top'
          : 'bottom'
        : 'bottom';

    return sorted(subdivisions)?.map((subdivision) => [
      renderSubdivision(subdivision, type),
      curDepth <= 1 ? null : renderAll(subdivision.nodes, curDepth - 1),
    ]);
  };

  const renderSubdivisions = (subdivisions) => {
    return sorted(subdivisions)?.map(renderSubdivision);
  };

  const renderSubdivision = (subdivision, type) => {
    return (
      <SubdivisionTableRow
        key={subdivision.id}
        subdivision={subdivision}
        singleParty={singleParty}
        unit={unit}
        parties={props.parties}
        mode={mode}
        embed={props.embed}
        type={type}
      />
    );
  };

  const getTopNodes = () => {
    return [...props.subdivisions];
  };

  const getMiddleNodes = () => {
    const nodes = [];
    props.subdivisions.forEach((node) =>
      node.nodes.forEach((node) => nodes.push(node))
    );
    return nodes;
  };

  const getBottomNodes = () => {
    const nodes = [];
    props.subdivisions.forEach((node) => {
      node.nodes.forEach((node) => {
        node.nodes.forEach((node) => {
          nodes.push(node);
        });
      });
    });
    return nodes;
  };

  const { displayParties } = generateDisplayParties(
    props.parties,
    props.results,
    6,
    null,
    null,
    '0'
  );

  return (
    <div>
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
        id={'subdivisionTableTooltip'}
      />
      <div>
        {props.modesHidden ? null : (
          <>
            <SubdivisionTableControls
              embed={props.embed}
              style={{ marginBottom: '10px' }}
            >
              {maxDepth > 1 ? (
                <>
                  Покажи:
                  <button
                    className={depthMode === 'showAll' ? 'selected' : ''}
                    onClick={() => setDepthMode('showAll')}
                  >
                    Всичко
                  </button>
                  <button
                    className={depthMode === 'showTopNodes' ? 'selected' : ''}
                    onClick={() => setDepthMode('showTopNodes')}
                  >
                    {mapNodeType(getTopNodeType())}
                  </button>{' '}
                </>
              ) : null}
              {maxDepth >= 2 ? (
                <button
                  className={depthMode === 'showMiddleNodes' ? 'selected' : ''}
                  onClick={() => setDepthMode('showMiddleNodes')}
                >
                  {mapNodeType(getMiddleNodeType())}
                </button>
              ) : null}
              {maxDepth >= 3 ? (
                <button
                  className={depthMode === 'showBottomNodes' ? 'selected' : ''}
                  onClick={() => setDepthMode('showBottomNodes')}
                >
                  {mapNodeType(getBottomNodeType())}
                </button>
              ) : null}
            </SubdivisionTableControls>

            <SubdivisionTableControls embed={props.embed}>
              {props.resultsAvailable ? (
                <>
                  <button
                    className={mode === 'distribution' ? 'selected' : ''}
                    onClick={() => setMode('distribution')}
                  >
                    Разпределение
                  </button>

                  <button
                    className={mode === 'turnout' ? 'selected' : ''}
                    onClick={() => {
                      //if(maxDepth != 1 && depthMode === 'showAll') setDepthMode('showBottomNodes');
                      setMode('turnout');
                    }}
                  >
                    Активност
                  </button>

                  <button
                    className={mode === 'violations' ? 'selected' : ''}
                    onClick={() => {
                      setMode('violations');
                    }}
                  >
                    Сигнали
                  </button>

                  <button
                    className={mode === 'voters' ? 'selected' : ''}
                    onClick={() => {
                      //if(maxDepth != 1 && depthMode === 'showAll') setDepthMode('showBottomNodes');
                      setMode('voters');
                    }}
                  >
                    Избиратели
                  </button>
                </>
              ) : null}
            </SubdivisionTableControls>
            <SubdivisionControlsParty embed={props.embed}>
              {mode !== 'distribution' ? null : (
                <>
                  Подреди по партия:
                  <button
                    className={singleParty === '' ? 'selected' : ''}
                    onClick={() => {
                      setSingleParty('');
                    }}
                  >
                    {' '}
                    Никоя
                  </button>{' '}
                  {displayParties?.map((party, index) => (
                    <button
                      key={index}
                      style={{ fontSize: '12px' }}
                      className={singleParty === party.number ? 'selected' : ''}
                      onClick={() => {
                        //if(maxDepth != 1 && depthMode === 'showAll') setDepthMode('showBottomNodes');
                        setSingleParty(party.number);
                      }}
                    >
                      {party.displayName}
                    </button>
                  ))}
                </>
              )}
            </SubdivisionControlsParty>
          </>
        )}
      </div>
      <SubdivisionTableDiv embed={props.embed}>
        <tbody>
          {depthMode === 'showAll'
            ? renderAll(props.subdivisions, maxDepth)
            : depthMode === 'showTopNodes'
            ? renderSubdivisions(getTopNodes())
            : depthMode === 'showMiddleNodes'
            ? renderSubdivisions(getMiddleNodes())
            : depthMode === 'showBottomNodes'
            ? renderSubdivisions(getBottomNodes())
            : null}
        </tbody>
      </SubdivisionTableDiv>
    </div>
  );
};
