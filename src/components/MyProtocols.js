import React from 'react'
import styled from 'styled-components'
import api from '../utils/api'
import { useEffect, useState } from 'react'
import { Link as RouterLink } from 'react-router-dom'
import { Link, LinkButton } from './components/Link'
import { ROUTES } from './routes'

const ProtocolsListStyle = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 50px;

  h2 {
    margin-bottom: 30px;
  }
`

export const MyProtocols = () => {
  const [protocols, setProtocols] = useState([])
  useEffect(async () => {
    try {
      const protocolsFromLocalStorage =
        JSON.parse(localStorage.getItem('protocols')) || []
      const protocolsDetails = await Promise.all(
        protocolsFromLocalStorage.map(async ({ id, secret, timestamp }) => {
          try {
            const data = await api.get(
              `protocols/${id}?secret=${encodeURIComponent(secret)}`
            )
            return {
              ...data,
              timestamp,
            }
          } catch (error) {
            console.error(error)
            return null
          }
        })
      )
      setProtocols(
        protocolsDetails
          .filter((x) => !!x)
          .sort((a, b) => a.timestamp - b.timestamp)
      )
    } catch (error) {
      console.error(error)
    }
  }, [])

  return (
    <ProtocolsListStyle>
      <Link to={ROUTES.submit}>
        <small>⟵ обратно</small>
      </Link>
      <h2>Моите Протоколи</h2>
      {protocols.length === 0 ? (
        <>
          <p>Не сте изпратили протоколи от това устройство</p>
          <LinkButton to={ROUTES.protocolForm}>Изпратете протокол</LinkButton>
        </>
      ) : (
        protocols.map((protocol) => (
          <div key={protocol.id}>
            <h2 style={{ wordBreak: 'break-word' }}>Протокол {protocol.id}</h2>
            <p>
              Изпратен на:{' '}
              {new Date(protocol.createdAt).toLocaleString('bg-BG')}
            </p>
            <p>Статус: {protocol.statusLocalized}</p>
            {protocol.pictures && protocol.pictures[0]?.url && (
              <RouterLink
                to={ROUTES.protocol.replace(':protocolId', protocol.id)}
              >
                <img src={protocol.pictures[0]?.url} alt="" height="200px" />
              </RouterLink>
            )}
            <br />
            <LinkButton
              to={ROUTES.protocol.replace(':protocolId', protocol.id)}
            >
              Вижте протокола
            </LinkButton>
          </div>
        ))
      )}
    </ProtocolsListStyle>
  )
}
