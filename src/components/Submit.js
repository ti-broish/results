import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { Link } from './components/Link'
import { ROUTES } from './routes'

const HorizontalLinks = styled.div`
  display: flex;
  flex-direction: column;
`

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
    <HorizontalLinks>
      <Link to={ROUTES.protocolForm}>Изпрати протокол</Link>
      <Link to={ROUTES.violationForm}>Подай сигнал</Link>
      {hasViolations && (
        <>
          <Link to={ROUTES.myViolations}>Моите сигнали</Link>
        </>
      )}
      {hasProtcols && (
        <>
          <Link to={ROUTES.myProtocols}>Моите протоколи</Link>
        </>
      )}
    </HorizontalLinks>
  )
}

export const SubmitRoute = '/submit'
