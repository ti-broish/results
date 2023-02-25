import React, { useEffect } from 'react'

import { useHistory, useParams } from 'react-router-dom'

import Aggregation from '../units/Aggregation'
import Section from '../units/Section.js'
import Source from './Source'

export default (props) => {
  const { unit } = useParams()
  const history = useHistory()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const returnToMain = () => {
    history.push('/embed/mini-results')
    return null
  }

  return (
    <div>
      {!unit || unit.length < 9 ? (
        <Aggregation embed />
      ) : unit.length === 9 ? (
        <Section embed />
      ) : (
        returnToMain()
      )}
      <Source />
    </div>
  )
}
