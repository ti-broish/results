import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import api from '../utils/api'
import { useParams } from 'react-router-dom'
import { Link } from './components/Link'
import { ROUTES } from './routes'

export const ViolationSummary = () => {
  const { violationId } = useParams()
  const [violationDetails, setViolationDetails] = useState({})
  const [error, setError] = useState(null)
  const [ownViolation, setOwnViolation] = useState(false)

  useEffect(async () => {
    if (!localStorage || !violationId) return
    let ignore = false
    const violationsFromStorage =
      JSON.parse(localStorage.getItem('violations')) || []
    const violationFromStorage = violationsFromStorage.find(
      (violation) => violation.id === violationId
    )
    let violationUrl = `violations/${violationId}`
    if (violationFromStorage) {
      setOwnViolation(true)
      violationUrl = `${violationUrl}?secret=${encodeURIComponent(
        violationFromStorage.secret
      )}`
    }
    try {
      const data = await api.get(violationUrl)
      if (!ignore) {
        setViolationDetails(data)
        setError(null)
      }
    } catch (error) {
      if (error.response?.status === 403 || error.response?.status === 401) {
        setError('Нямате достъп до този сигнал')
      } else if (error.response?.status === 404) {
        setError('Не е намерен сигнал с този номер')
      } else {
        setError(
          'Изникна неочаквана грешка при зареждането на сигнала. Моля опитайте отново по-късно.'
        )
      }
    }

    return () => {
      ignore = true
    }
  }, [violationId])

  if (error) {
    return <p>{error}</p>
  }

  const {
    id,
    statusLocalized,
    description,
    publishedText,
    pictures,
    section,
    createdAt,
  } = violationDetails

  return (
    <>
      {ownViolation && (
        <Link to={ROUTES.submit}>
          <small>⟵ обратно</small>
        </Link>
      )}
      <ViolationSummaryStyle>
        <div>
          <h1 style={{ wordBreak: 'break-word' }}>Сигнал {id}</h1>
          {section && <p>Секция: {section.id}</p>}
          <p>Статус: {statusLocalized}</p>
          <p>Получен на: {new Date(createdAt).toLocaleString('bg-BG')}</p>
          <p>{description || publishedText}</p>
        </div>
        <div>
          {pictures?.map((picture, index) => (
            <img src={picture.url} alt="" key={index} />
          ))}
        </div>
      </ViolationSummaryStyle>
    </>
  )
}

const ViolationSummaryStyle = styled.div`
  padding: 10px;

  img {
    max-width: 100%;
  }
`
