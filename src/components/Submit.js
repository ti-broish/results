import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { MyProtocolsRoute } from './MyProtocols'
import { MyViolationsRoute } from './MyViolations'
import { ProtocolFormRoute } from './ProtocolForm'
import { ViolationFormRoute } from './ViolationForm'

export const Submit = () => {
  const [hasViolations, setHasViolations] = useState(false)
  const [hasProtcols, setHasProtocols] = useState(false)

  useEffect(() => {
    if (!localStorage) {
      return
    }

    const protocols = localStorage.getItem('protocols')
    const violations = localStorage.getItem('violations')
    setHasProtocols(protocols && protocols.length > 0)
    setHasViolations(violations && violations.length > 0)
  }, [])
  return (
    <>
      <Link to={ProtocolFormRoute}>Изпрати протокол</Link>
      <br />
      <Link to={ViolationFormRoute}>Подай сигнал</Link>
      {hasViolations && (
        <>
          <br />
          <Link to={MyViolationsRoute}>Моите сигнали</Link>
        </>
      )}
      {hasProtcols && (
        <>
          <br />
          <Link to={MyProtocolsRoute}>Моите протоколи</Link>
        </>
      )}
    </>
  )
}

export const SubmitRoute = '/submit'
