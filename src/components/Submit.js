import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ROUTES } from './routes'

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
      <Link to={ROUTES.protocolForm}>Изпрати протокол</Link>
      <br />
      <Link to={ROUTES.violationForm}>Подай сигнал</Link>
      {hasViolations && (
        <>
          <br />
          <Link to={ROUTES.myViolations}>Моите сигнали</Link>
        </>
      )}
      {hasProtcols && (
        <>
          <br />
          <Link to={ROUTES.myProtocols}>Моите протоколи</Link>
        </>
      )}
    </>
  )
}

export const SubmitRoute = '/submit'
