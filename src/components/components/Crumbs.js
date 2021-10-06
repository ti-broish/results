import React from 'react';

import { Link, useParams, useHistory } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';

import styled from 'styled-components';

const CrumbLink = styled(Link)`
  color: #666;
  font-size: 14px;
  text-decoration: none;
  font-weight: bold;

  ${(props) =>
    props.embed
      ? `
        font-size: 9px;
    `
      : null}
`;

const CrumbButton = styled.button`
  color: #666;
  font-size: 14px;
  text-decoration: none;
  font-weight: bold;
  border: none;
  background: none;
  cursor: pointer;
  vertical-align: top;

  ${(props) =>
    props.embed
      ? `
        font-size: 9px;
    `
      : null}
`;

const pointyArrowHeightEmbed = 24;
const pointyArrowHeight = 30;

const PointyArrowBase = styled.span`
  display: inline-block;
  height: ${(props) =>
    props.embed ? pointyArrowHeightEmbed : pointyArrowHeight}px;
  box-sizing: border-box;
  vertical-align: top;
`;

const PointyArrowBack = styled(PointyArrowBase)`
  border-left: ${(props) =>
      (props.embed ? pointyArrowHeightEmbed : pointyArrowHeight) / 2}px
    solid #0000;
  border-top: ${(props) =>
      (props.embed ? pointyArrowHeightEmbed : pointyArrowHeight) / 2}px
    solid #eee;
  border-bottom: ${(props) =>
      (props.embed ? pointyArrowHeightEmbed : pointyArrowHeight) / 2}px
    solid #eee;
  margin-left: -11px;
`;

const PointyArrowMiddle = styled(PointyArrowBase)`
  background-color: #eee;
  padding: 6px;
`;

const PointyArrow = styled(PointyArrowBase)`
  border-left: ${(props) =>
      (props.embed ? pointyArrowHeightEmbed : pointyArrowHeight) / 2}px
    solid #eee;
  border-top: ${(props) =>
      (props.embed ? pointyArrowHeightEmbed : pointyArrowHeight) / 2}px
    solid #0000;
  border-bottom: ${(props) =>
      (props.embed ? pointyArrowHeightEmbed : pointyArrowHeight) / 2}px
    solid #0000;
`;

export default (props) => {
  const { unit } = useParams();
  const history = useHistory();

  return (
    <div>
      <CrumbButton onClick={history.goBack} embed={props.embed}>
        <PointyArrowMiddle
          style={{ backgroundColor: '#0000' }}
          embed={props.embed}
        >
          <FontAwesomeIcon icon={faArrowLeft} /> Назад
        </PointyArrowMiddle>
      </CrumbButton>
      {!props.data.crumbs
        ? null
        : props.data.crumbs.map((crumb, i) => (
            <CrumbLink
              key={i}
              to={
                props.embed
                  ? `/embed/mini-results/${crumb.segment}`
                  : `/${crumb.segment}`
              }
              embed={props.embed}
            >
              {i === 0 ? null : <PointyArrowBack embed={props.embed} />}
              <PointyArrowMiddle embed={props.embed}>
                {crumb.name}
              </PointyArrowMiddle>
              <PointyArrow embed={props.embed} />
            </CrumbLink>
          ))}
      <CrumbLink
        to={props.embed ? `/embed/mini-results/${unit}` : `/${unit}`}
        embed={props.embed}
      >
        <PointyArrowBack embed={props.embed} />
        <PointyArrowMiddle embed={props.embed}>
          {props.data.name}
        </PointyArrowMiddle>
        <PointyArrow embed={props.embed} />
      </CrumbLink>
    </div>
  );
};
