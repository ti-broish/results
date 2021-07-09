import React, { useEffect, useState, useContext } from "react";

import Helmet from "react-helmet";
import axios from "axios";
import { useParams, useHistory } from "react-router-dom";
import { mapNodeType } from "../ResultUnit";
import LoadingScreen from "../layout/LoadingScreen";

import ResultsTable from "../components/results_table/ResultsTable";

import { ElectionContext } from "../Election";
import Crumbs from "../components/Crumbs";

import Player from "../embeds/Player";

import styled from "styled-components";

const SectionDetailsTable = styled.table`
  margin: 20px 0;
  width: 100%;
  font-size: 20px;

  tr {
    //margin: 50px 0;
  }

  td {
    padding: 5px 0;
    font-size: 18px;
    width: 50%;

    &:nth-child(1) {
      font-weight: bold;
      color: #999;
    }
  }

  ${(props) =>
    props.embed
      ? `
        td { 
            font-size: 12px;
            padding: 5px;
        }
    `
      : null}
`;

export default (props) => {
  const history = useHistory();
  const { dataURL, globalData, parties } = useContext(ElectionContext);
  const { unit } = useParams();

  const [data, setData] = useState(null);

  useEffect(() => {
    axios
      .get(`${dataURL}/${unit}.json`)
      .then((res) => {
        setData(res.data);
      })
      .catch((err) => {
        if (!data) history.push("/");
      });
  }, []);

  return !data ? (
    <LoadingScreen />
  ) : (
    <div id="section-data">
      <Helmet>
        <title>Секция {data.segment}</title>
      </Helmet>
      <Crumbs data={data} embed={props.embed} />
      <h1 style={props.embed ? { fontSize: "15px" } : {}}>
        Секция {data.segment}
      </h1>
      <ResultsTable
        results={data.results}
        parties={parties}
        totalValid={data.stats.validVotes}
        totalInvalid={data.stats.invalidVotes}
        embed={props.embed}
      />
      <h2>Местоположение</h2>
      <SectionDetailsTable embed={props.embed}>
        <tbody>
          <tr>
            <td>Код</td>
            <td>{data.segment}</td>
          </tr>
          {data.crumbs.map((crumb, i) =>
            i === 0 ? null : (
              <tr>
                <td>{mapNodeType(crumb.type)}</td>
                <td>{crumb.name}</td>
              </tr>
            )
          )}
          <tr>
            <td>Нас. място</td>
            <td>{data.town.name}</td>
          </tr>
          <tr>
            <td>Адрес</td>
            <td>{data.place}</td>
          </tr>
        </tbody>
      </SectionDetailsTable>
      <h2>Допълнителни данни</h2>
      <SectionDetailsTable>
        <tbody>
          <tr>
            <td>Избиратели</td>
            <td>{data.stats.voters}</td>
          </tr>
          <tr>
            <td>Действителни гласове</td>
            <td>{data.stats.validVotes}</td>
          </tr>
          <tr>
            <td>Недействителни гласове</td>
            <td>{data.stats.invalidVotes}</td>
          </tr>
          <tr>
            <td>Сигнали</td>
            <td>{data.stats.violations}</td>
          </tr>
        </tbody>
      </SectionDetailsTable>
      <h2>Видеонаблюдение</h2>
      <Player section={data.segment}/>
    </div>
  );
};
