import React, { useContext, useEffect, useState } from 'react'

import Helmet from 'react-helmet'

import axios from 'axios'
import { useHistory, useParams } from 'react-router-dom'

import BulgariaMap from '../components/bulgaria_map/BulgariaMap'
import Crumbs from '../components/Crumbs'
import ResultsTable from '../components/results_table/ResultsTable'
import SubdivisionTable from '../components/subdivision_table/SubdivisionTable'
import { ElectionContext } from '../Election'
import LoadingScreen from '../layout/LoadingScreen'

import { mapNodesType, mapNodeType } from '../ResultUnit'
import Videos from '../Videos'
import ViolationFeeds from '../ViolationFeeds'
import { populateWithFakeResults } from './helpers'

export const aggregateData = (data) => {
  if (data.nodes) {
    for (const node of data.nodes) {
      aggregateData(node)
    }
  }

  if (!data.stats) {
    data.stats = {
      invalidVotes: 0,
      sectionsCount: 0,
      sectionsWithProtocols: 0,
      sectionsWithResults: 0,
      validVotes: 0,
      violationsCount: 0,
      voters: 0,
    }

    if (data.nodes) {
      for (const node of data.nodes) {
        data.stats.invalidVotes += node.stats.invalidVotes
        data.stats.sectionsCount += node.stats.sectionsCount
        data.stats.sectionsWithProtocols += node.stats.sectionsWithProtocols
        data.stats.sectionsWithResults += node.stats.sectionsWithResults
        data.stats.validVotes += node.stats.validVotes
        data.stats.violationsCount += node.stats.violationsCount
        data.stats.voters += node.stats.voters
        data.stats.processedViolations += node.stats.processedViolations
      }
    }
  }

  if ((!data.results || data.results.length === 0) && data.nodes) {
    const partyResults = {}

    for (const node of data.nodes) {
      for (let i = 0; i < node.results.length; i += 2) {
        if (!partyResults[node.results[i]]) partyResults[node.results[i]] = 0
        partyResults[node.results[i]] += node.results[i + 1]
      }
    }

    data.results = []
    Object.keys(partyResults).forEach((key) => {
      data.results.push(key)
      data.results.push(partyResults[key])
    })
  }

  return data
}

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
  const [data, setData] = useState(null)
  const [resultsAvailable, setResultsAvailable] = useState(false)
  const [selectedMode, setSelectedMode] = useState('violations')
  const [violationsReported, setViolationsReported] = useState(false)
  const [streamsAvailable, setStreamsAvailable] = useState(false)
  const [sectionsWithResults, setSectionsWithResults] = useState(false)
  const [populatedSections, setPopulatedSections] = useState(false)
  const { unit } = useParams()
  const history = useHistory()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])
  useEffect(() => {
    refreshResults()
  }, [unit])
  useEffect(() => {
    setSelectedMode(chooseModeBasedOnApiResponse())
  }, [resultsAvailable, violationsReported])

  const refreshResults = () => {
    // Set to true, to populate with fake data
    const devMode = false

    setData(null)
    setResultsAvailable(false)
    axios
      .get(`${dataURL}/results/${unit ? unit : 'index'}.json`)
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
  }

  return !data ? (
    <LoadingScreen />
  ) : (
    <>
      <Helmet>
        <title>{meta.name}</title>
      </Helmet>
      {data.type !== 'election' && (
        <>
          <Crumbs data={data} embed={props.embed} />
          <h1 style={props.embed ? { fontSize: '15px' } : {}}>
            {data.type === 'electionRegion'
              ? `${data.id}. ${data.name}`
              : `${mapNodeType(data.type)} ${data.name}`}
          </h1>
        </>
      )}

      {data.type === 'election' && (
        <BulgariaMap
          regions={data.nodes}
          parties={parties}
          results={data.results}
          filters={{
            resultsAvailable,
            violationsReported,
            streamsAvailable,
            sectionsWithResults,
            populatedSections,
          }}
          mode={selectedMode}
          setMode={(mode) => setSelectedMode(mode)}
        />
      )}

      {selectedMode === 'video' ? (
        <Videos />
      ) : (
        <>
          {resultsAvailable && selectedMode == 'dominant' && (
            <ResultsTable
              results={data.results}
              parties={parties}
              totalValid={data.stats.validVotes}
              totalInvalid={data.stats.invalidVotes}
              showThreshold={data.type === 'election'}
              embed={props.embed}
            />
          )}

          <h1 style={props.embed ? { fontSize: '15px' } : {}}>
            {mapNodesType(data.nodesType)}
          </h1>
          <SubdivisionTable
            parties={parties}
            results={data.results}
            resultsAvailable={resultsAvailable}
            showNumbers
            subdivisions={data.nodes.map(aggregateData)}
            embed={props.embed}
            selectedMode={selectedMode}
          />

          {selectedMode == 'violations' && (
            <>
              <h1 style={props.embed ? { fontSize: '15px' } : {}}>Сигнали</h1>
              <ViolationFeeds unit={unit}></ViolationFeeds>
            </>
          )}
        </>
      )}
    </>
  )
}
