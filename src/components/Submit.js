import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { LinkButton } from './components/Link'
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
      <LinkButton to={ROUTES.protocolForm}>Изпрати протокол</LinkButton>
      <LinkButton to={ROUTES.violationForm}>Подай сигнал</LinkButton>
      {hasViolations && (
        <>
          <LinkButton to={ROUTES.myViolations}>Моите сигнали</LinkButton>
        </>
      )}
      {hasProtcols && (
        <>
          <LinkButton to={ROUTES.myProtocols}>Моите протоколи</LinkButton>
        </>
      )}
    </HorizontalLinks>
  )
}

export const SubmitRoute = '/submit'
