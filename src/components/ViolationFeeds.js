import React, { useEffect, useContext, useState } from 'react'
import Helmet from 'react-helmet'

import axios from 'axios'
import { useParams } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons'

import { Link } from 'react-router-dom'
import LoadingScreen from './layout/LoadingScreen'
import { ElectionContext } from './Election'
import { formatDateTime } from './Util'
import BulgariaMap from './components/bulgaria_map/BulgariaMap'

import styled from 'styled-components'

import { Fade } from 'react-reveal'

const ViolationFeed = styled.div`
  max-width: 600px;
  margin: 0 auto;
  padding: 10px;
`

const Violation = styled.div`
  border: 1px solid #ccc;
  margin: 15px 0;
  border-radius: 10px;
  padding: 10px 25px;
  box-shadow: 0 0 10px #ddd;
  border-bottom: 3px solid #bbb;
  color: #333;

  h4,
  p {
    margin: 5px 0;
  }
`

const ShowMoreButton = styled.button`
  cursor: pointer;
  width: 300px;
  margin: 0 auto;
  display: block;
  padding: 13px;
  border: 1px solid #ccc;
  background-color: #999;
  color: white;
  font-size: 17px;
  font-weight: bold;
  border-radius: 10px;
  border-top: 0px;
  border-bottom: 5px solid #666;

  &:hover {
    background-color: #aaa;
  }

  &:disabled {
    background-color: #888;
    color: #bbb;
    border-top: 5px solid white;
    border-bottom: 0px;
  }

  &:active {
    border-top: 5px solid white;
    border-bottom: 0px;
  }
`

const defaultRegionName = 'Последни сигнали'

export default (props) => {
  const { meta, parties, dataURL } = useContext(ElectionContext)

  const [violationData, setViolationData] = useState({
    items: null,
    moreToLoad: true,
  })
  const [regionName, setRegionName] = useState(defaultRegionName)
  const [loading, setLoading] = useState(false)

  const { unit } = useParams()

  useEffect(() => {
    getViolationFeeds(props.unit)
  }, [])

  const getMoreViolations = () => {
    setLoading(true)
    const lastViolation = violationData.items[violationData.items.length - 1].id
    axios
      .get(`${dataURL}/violations/feed?after=${lastViolation}`)
      .then((res) => {
        setViolationData({
          items: [...violationData.items, ...res.data],
          moreToLoad: res.data.length >= 50,
        })
        setLoading(false)
      })
  }

  const loadViolationsForRegion = (segment) => {
    const region = resultsData.nodes.find((node) => node.segment == segment)

    setLoading(true)
    setRegionName(region ? region.name : '')
    getViolationFeeds(segment)
  }

  const getViolationFeeds = (segment) => {
    const baseUrl = `${dataURL}/violations/feed`
    const url = segment ? baseUrl + `/${segment}` : baseUrl
    axios.get(url).then((res) => {
      setViolationData({
        items: res.data,
        moreToLoad: res.data.length >= 50,
      })
      setLoading(false)
    })
  }

  const resetViolations = () => {
    setRegionName(defaultRegionName)
    getViolationFeeds()
  }

  const renderViolation = (violation, i) => {
    let electionRegion = null
    if (violation.section) {
      electionRegion = violation.section.electionRegion
    } else if (
      violation.town.electionRegions &&
      violation.town.electionRegions.length === 1
    ) {
      electionRegion = violation.town.electionRegions[0]
    }
    //if section show

    return (
      <Fade key={violation.id} clear>
        <Violation>
          <h4>
            {violation.town.name}
            {violation.town.municipality
              ? ', Община ' + violation.town.municipality.name
              : ''}
            {violation.town.country && violation.town.country.isAbroad
              ? ', ' + violation.town.country.name
              : ''}
          </h4>
          <h4>
            {!electionRegion ? (
              ''
            ) : (
              <Link to={`/${electionRegion.code}`}>
                МИР {electionRegion.code}. {electionRegion.name}
              </Link>
            )}
            {electionRegion && violation.section ? ', ' : ''}
            {!violation.section ? (
              ''
            ) : (
              <>
                Секция{' '}
                <Link to={`/${violation.section.id}`}>
                  {violation.section.id}
                </Link>
              </>
            )}
          </h4>
          {!violation.section ? null : (
            <h5 style={{ margin: '5px 0' }}>{violation.section.place}</h5>
          )}
          {violation.createdAt ? (
            <h5 style={{ color: '#888', margin: '5px 0' }}>
              Получен: {formatDateTime(new Date(violation.createdAt))}
            </h5>
          ) : null}

          <p style={{ margin: '20px 0 20px 0' }}>{violation.publishedText}</p>
        </Violation>
      </Fade>
    )
  }

  return !violationData?.items ? (
    <LoadingScreen />
  ) : (
    <>
      {loading ? (
        <LoadingScreen />
      ) : violationData?.items.length > 0 ? (
        <ViolationFeed>
          {violationData.items.map(renderViolation)}
          {!violationData.moreToLoad ? null : (
            <ShowMoreButton disabled={loading} onClick={getMoreViolations}>
              {loading ? 'Зареждане...' : 'Покажи още'}
            </ShowMoreButton>
          )}
        </ViolationFeed>
      ) : (
        <h5>Няма публикувани сигнали</h5>
      )}
    </>
  )
}
