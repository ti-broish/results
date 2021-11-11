import React, { useState, useEffect } from 'react';

import {
  Redirect,
  Route,
  Switch,
  useHistory,
  useLocation,
} from 'react-router-dom';
import axios from 'axios';

import Header from './layout/Header';
import Footer from './layout/Footer';
import LoadingScreen from './layout/LoadingScreen';

import ResultUnit from './ResultUnit.js';

import { Wrapper } from './App';
import Violations from './Violations';
import Videos from './Videos';

import styled from 'styled-components';

const NavigationTabsBackground = styled.div`
  background-color: #ddd;
  width: 100%;
  border-bottom: 1px solid #bbb;
`;

const NavigationTabs = styled.nav`
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
  padding-top: 10px;
`;

const NavigationTab = styled.button`
  width: calc(100% / 3);
  border: none;
  background: none;
  cursor: pointer;
  background-color: #f0f0f0;
  padding: 10px;
  margin-bottom: -1px;
  //border: 1px solid #ccc;
  border-top: 1px solid #ccc;
  border-right: 1px solid #bbb;
  border-collapse: collapse;
  color: #666;

  &:first-of-type {
    border-left: 1px solid #ccc;
    border-radius: 10px 0 0 0;
  }

  &:last-of-type {
    border-radius: 0 10px 0 0;
  }

  &.selected {
    background-color: #fff;
    border-bottom: 1px solid white;
    color: #444;
  }

  &:disabled {
    cursor: auto;
    color: #aaa;
    background-color: #ccc;
  }
`;

export const ElectionContext = React.createContext();

export default (props) => {
  const [meta, setMeta] = useState(null);

  const dataURL = process.env.DATA_URL ? process.env.DATA_URL : '/json';

  const history = useHistory();
  const location = useLocation();

  useEffect(() => {
    axios.get(`${dataURL}/results/meta.json`).then((res) => {
      setMeta(res.data);
    });
  }, []);

  const isElectionDayOver = () => {
    return false;
    if (!meta) return false;
    else return Date.now() - new Date(meta.endOfElectionDayTimestamp) > 0;
  };

  const showAfterElectionDate = (component) => {
    if (isElectionDayOver()) return component;
    else return <Redirect to="/violations" />;
  };

  const getLocation = () => {
    const loc = location.pathname.split('/');
    if (loc[1] === 'violations') return 'violations';
    if (loc[1] === 'videos') return 'videos';
    else return '/';
  };

  return (
    <ElectionContext.Provider
      value={{ meta, parties: !meta ? null : meta.parties, dataURL }}
    >
      <Header title={!meta ? null : meta.name} />
      <NavigationTabsBackground>
        <NavigationTabs>
          <NavigationTab
            disabled={!isElectionDayOver()}
            onClick={() => history.push('/')}
            className={getLocation() === '/' ? 'selected' : ''}
          >
            Резултати
          </NavigationTab>
          <NavigationTab
            onClick={() => history.push('/violations')}
            className={getLocation() === 'violations' ? 'selected' : ''}
          >
            Сигнали
          </NavigationTab>
          <NavigationTab
            disabled={!isElectionDayOver()}
            onClick={() => history.push('/videos')}
            className={getLocation() === 'videos' ? 'selected' : ''}
          >
            Видео
          </NavigationTab>
        </NavigationTabs>
      </NavigationTabsBackground>
      <Wrapper>
        {!meta ? (
          <LoadingScreen />
        ) : (
          <Switch>
            <Route
              path="/videos"
              render={() => showAfterElectionDate(<Videos />)}
            />
            <Route path="/violations" component={Violations} />
            <Route
              path={[`/:unit`, `/`]}
              render={() => showAfterElectionDate(<ResultUnit />)}
            />
            <Redirect to={`/`} />
          </Switch>
        )}
      </Wrapper>
      <Footer />
    </ElectionContext.Provider>
  );
};
