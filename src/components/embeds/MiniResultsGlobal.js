import React, { useContext, useEffect, useState } from 'react'

import axios from 'axios'
import { useLocation } from 'react-router-dom'

import BulgariaMap from '../components/bulgaria_map/BulgariaMap'
import ResultsTable from '../components/results_table/ResultsTable'
import SubdivisionTable from '../components/subdivision_table/SubdivisionTable'
import Source from './Source'

import {
  faChartBar,
  faCity,
  faLayerGroup,
  faMap,
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import styled from 'styled-components'
import { populateWithFakeResults } from '../units/helpers'

const EmbedButton = styled.button`
  border: none;
  background: none;
  color: #666;
  text-align: center;
  cursor: pointer;
  padding: 6px;

  &.active {
    color: white;
    background-color: #666;
    border-radius: 10px;
  }
`

import { aggregateData } from '../units/Aggregation'

const useQuery = () => {
  return new URLSearchParams(useLocation().search)
}

import ProgressBar from '../components/ProgressBar'
import { ElectionContext } from '../Election'
import LoadingScreen from '../layout/LoadingScreen'

export default (props) => {
  const chooseModeBasedOnApiResponse = () => {
    if (!resultsAvailable) {
      if (violationsReported) {
        return 'violations'
      }
      return 'sectionsWithResults'
    }
    return 'dominant'
  }

  const { meta, parties, dataURL } = useContext(ElectionContext)
  const [embedMode, setEmbedMode] = useState('map')
  const [mapModesOpen, setMapModesOpen] = useState(false)
  const [subdivisionModesOpen, setSubdivisionModesOpen] = useState(false)
  const [mode, setMode] = useState('violations')
  const [resultsAvailable, setResultsAvailable] = useState(false)
  const [violationsReported, setViolationsReported] = useState(false)
  const [streamsAvailable, setStreamsAvailable] = useState(false)
  const [sectionsWithResults, setSectionsWithResults] = useState(false)
  const [populatedSections, setPopulatedSections] = useState(false)
  const [sectionsMode, setSectionsMode] = useState('risk')

  const query = useQuery()
  const mapOnly = query.get('mapOnly') ? true : false
  const resultsOnly = query.get('resultsOnly') ? true : false
  const linkToMainSite = query.get('linkToMainSite') ? true : false
  const homepage = query.get('homepage') ? true : false

  const [data, setData] = useState(null)

  // Set to true to populate with fake data
  const devMode = false

  useEffect(() => {
    setData(null)
    axios
      .get(`${dataURL}/results/index.json`)
      .then((res) => {
        if (devMode) {
          res.data = populateWithFakeResults(res.data, parties)
        }
        setData(res.data)
        setResultsAvailable(res.data?.results.length > 0)
        setViolationsReported(res.data?.stats.violationsCount > 0)
        setStreamsAvailable(res.data?.stats.streamsCount > 0)
        setSectionsWithResults(res.data?.stats.sectionsWithResults > 0)
        setPopulatedSections(res.data?.stats.populated > 0)
      })
      .catch((err) => {
        console.log(err)
        if (!data) history.push('/')
      })
  }, [])

  useEffect(() => {
    setMode(chooseModeBasedOnApiResponse())
  }, [resultsAvailable, violationsReported])

  return !data ? (
    <LoadingScreen />
  ) : (
    <div>
      {!mapOnly && !resultsOnly && (
        <div style={{ position: 'fixed', left: 0, top: 0, padding: '5px' }}>
          <EmbedButton
            className={embedMode === 'map' ? 'active' : ''}
            onClick={() => setEmbedMode('map')}
          >
            <FontAwesomeIcon icon={faMap} />
          </EmbedButton>
          <EmbedButton
            className={embedMode === 'bars' ? 'active' : ''}
            onClick={() => setEmbedMode('bars')}
          >
            <FontAwesomeIcon icon={faChartBar} />
          </EmbedButton>
          <EmbedButton
            className={embedMode === 'regions' ? 'active' : ''}
            onClick={() => setEmbedMode('regions')}
          >
            <FontAwesomeIcon icon={faCity} />
          </EmbedButton>
        </div>
      )}

      {!resultsOnly && (
        <div>
          {embedMode === 'map' && (
            <div
              style={{ position: 'fixed', top: 0, right: 0, padding: '5px' }}
            >
              <EmbedButton
                className={mapModesOpen ? 'active' : ''}
                onClick={() => setMapModesOpen(!mapModesOpen)}
              >
                <FontAwesomeIcon icon={faLayerGroup} />
              </EmbedButton>
            </div>
          )}
          {embedMode === 'regions' && (
            <div
              style={{ position: 'fixed', top: 0, right: 0, padding: '5px' }}
            >
              <EmbedButton
                className={subdivisionModesOpen ? 'active' : ''}
                onClick={() => setSubdivisionModesOpen(!subdivisionModesOpen)}
              >
                <FontAwesomeIcon icon={faLayerGroup} />
              </EmbedButton>
            </div>
          )}
        </div>
      )}
      <div
        style={{
          height: embedMode === 'map' && mapModesOpen ? '43px' : '75px',
          textAlign: 'center',
        }}
      >
        <div style={{ padding: '5px', fontWeight: 'bold' }}>{meta.name}</div>
      </div>
      <ProgressBar
        percentage={data.stats.sectionsWithResults / data.stats.sectionsCount}
        color={'#5a5aff'}
        emptyColor={'rgb(189, 189, 249)'}
        title={'Обработени секции'}
        description={
          'Тази линия показва процентът от секции, за които имаме получени и обработени резултати'
        }
        embed
        homepage={homepage}
      />
      {!resultsOnly && (mapOnly || embedMode === 'map') ? (
        [
          <BulgariaMap
            regions={data.nodes}
            parties={parties}
            results={data.results}
            mapModesHidden={!mapModesOpen}
            linkToMainSite={linkToMainSite}
            filters={{
              resultsAvailable,
              violationsReported,
              streamsAvailable,
              sectionsWithResults,
              populatedSections,
            }}
            mode={mode}
            setMode={setMode}
            sectionsMode={sectionsMode}
            setSectionsMode={(sectionsMode) => setSectionsMode(sectionsMode)}
            homepage={homepage}
            embed
          />,
        ]
      ) : resultsOnly || embedMode === 'bars' ? (
        <ResultsTable
          results={data.results}
          parties={parties}
          totalValid={data.stats.validVotes}
          totalInvalid={data.stats.invalidVotes}
          showThreshold={data.type === 'election'}
          embed
        />
      ) : embedMode === 'regions' ? (
        <SubdivisionTable
          parties={parties}
          results={data.results}
          resultsAvailable={resultsAvailable}
          showNumbers
          subdivisions={data.nodes.map(aggregateData)}
          modesHidden={!subdivisionModesOpen}
          selectedMode={mode}
          sectionsMode={sectionsMode}
          embed
        />
      ) : null}
      <div style={{ height: '30px', display: 'block' }} />
      {!homepage && <Source />}
    </div>
  )
}
