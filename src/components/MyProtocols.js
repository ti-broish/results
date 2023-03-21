import React from 'react'
import styled from 'styled-components'
import api from '../utils/api'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
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
          const data = await api.get(`protocols/${id}?secret=${secret}`)
          return {
            ...data,
            timestamp,
          }
        })
      )
      setProtocols(protocolsDetails.sort((a, b) => a.timestamp - b.timestamp))
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
          <Link to={ROUTES.protocolForm}>Изпратете протокол</Link>
        </>
      ) : (
        protocols.map((protocol) => (
          <div key={protocol.id}>
            <h2>Протокол {protocol.id}</h2>
            <p>
              Изпратен на:{' '}
              {new Date(protocol.createdAt).toLocaleString('bg-BG')}
            </p>
            <p>Статус: {protocol.statusLocalized}</p>
            <Link to={ROUTES.protocol.replace(':protocolId', protocol.id)}>
              {protocol.pictures && protocol.pictures[0]?.url && (
                <img src={protocol.pictures[0]?.url} alt="" height="200px" />
              )}
              Вижте протокола
            </Link>
          </div>
        ))
      )}
    </ProtocolsListStyle>
  )
}
