import React, { useEffect } from 'react'

import { useParams, useHistory } from 'react-router-dom'
import Aggregation from './units/Aggregation'
import Section from './units/Section'

export const mapNodeType = (nodesType) => {
  switch (nodesType) {
    case 'election':
      return ''
    case 'electionRegion':
      return 'Избирателен район'
    case 'municipality':
      return 'Община'
    case 'town':
      return 'Нас. място'
    case 'address':
      return 'Адрес'
    case 'section':
      return 'Секция'
    case 'district':
      return 'Район'
    case 'country':
      return 'Държава'
    default:
      return 'Подразделение'
  }
}

export const mapNodesType = (nodesType) => {
  switch (nodesType) {
    case 'electionRegions':
      return 'Избирателни райони'
    case 'municipalities':
      return 'Общини'
    case 'towns':
      return 'Населени места'
    case 'addresses':
      return 'Адреси'
    case 'sections':
      return 'Секции'
    case 'districts':
      return 'Райони'
    case 'countries':
      return 'Държави'
    default:
      return 'Подразделения'
  }
}

export const ResultUnit = (props) => {
  const { unit } = useParams()
  const history = useHistory()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const returnToMain = () => {
    history.push('/')
    return null
  }

  // Election regions are two digit units - i.e. 01, 02
  // Municipalities are four digit units - i.e. 0140, 0102
  // Countries are four digit units - i.e. 3201, 3202
  // City regions are six digit units - i.e. 234602, 244601
  // Sections are nine digit units - i.e. 014000037, 014000046

  return (
    <>
      {!unit || unit.length < 9 ? (
        <Aggregation />
      ) : unit.length === 9 ? (
        <Section />
      ) : (
        returnToMain()
      )}
    </>
  )
}

export const ResultUnitRoute = '/:unit'
