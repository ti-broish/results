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
    const protocolFromStorage = protocolsFromStorage.filter(
      (protocol) => protocol.id === protocolId
    )
    if (!protocolFromStorage) {
      setError('Протоколът не е намерен')
      return
    }
    try {
      const data = await api.get(`protocols/${id}?secret=${secret}`)
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

  const { id, statusLocalized, pictures, section, createdAt } = protocolDetails

  return (
    <ProtocolSummaryStyle>
      <div>
        {pictures.map((picture) => (
          <img src={picture.url} alt="" />
        ))}
      </div>
      <div>
        <h1>Протокол {id}</h1>
        <p>Получен на: {new Date(createdAt).toLocaleString('bg-BG')}</p>
        {section && <p>Секция: {section.id}</p>}
        <p>Статус: {statusLocalized}</p>
      </div>
    </ProtocolSummaryStyle>
  )
}

const ProtocolSummaryStyle = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  border: 1px solid #ccc;
  border-radius: 5px;
  padding: 10px;
`

export const ProtocolSummaryRoute = '/protocols/:protocolId'
