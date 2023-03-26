import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import api from '../utils/api'
import { useParams } from 'react-router-dom'

export const ProtocolSummary = () => {
  const { protocolId } = useParams()
  const [protocolDetails, setProtocolDetails] = useState({})
  const [error, setError] = useState(null)

  useEffect(async () => {
    if (!localStorage || !protocolId) return
    let ignore = false
    const protocolsFromStorage =
      JSON.parse(localStorage.getItem('protocols')) || []
    const protocolFromStorage = protocolsFromStorage.find(
      (protocol) => protocol.id === protocolId
    )
    let protocolUrl = `protocols/${protocolId}`
    if (protocolFromStorage) {
      protocolUrl = `${protocolUrl}?secret=${encodeURIComponent(
        protocolFromStorage.secret
      )}`
    }
    try {
      const data = await api.get(protocolUrl)
      if (!ignore) {
        setProtocolDetails(data)
        setError(null)
      }
    } catch (error) {
      if (error.response?.status === 403 || error.response?.status === 401) {
        setError('Нямате достъп до този протокол')
      } else if (error.response?.status === 404) {
        setError('Не е намерен протокол с този номер')
      } else {
        setError(
          'Изникна неочаквана грешка при зареждането на протокола. Моля опитайте отново по-късно.'
        )
      }
    }

    return () => {
      ignore = true
    }
  }, [protocolId])

  if (error) {
    return <p>{error}</p>
  }

  const { id, statusLocalized, pictures, section, createdAt } = protocolDetails

  return (
    <ProtocolSummaryStyle>
      <div>
        <h1 style={{ wordBreak: 'break-word' }}>Протокол {id}</h1>
        {section && <p>Секция: {section.id}</p>}
        <p>Статус: {statusLocalized}</p>
        <p>Получен на: {new Date(createdAt).toLocaleString('bg-BG')}</p>
      </div>
      <div>
        {pictures?.map((picture) => (
          <img src={picture.url} alt="" />
        ))}
      </div>
    </ProtocolSummaryStyle>
  )
}

const ProtocolSummaryStyle = styled.div`
  padding: 10px;

  img {
    max-width: 100%;
  }
`
