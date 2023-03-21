import React from 'react'
import styled from 'styled-components'
import api from '../utils/api'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ROUTES } from './routes'

const ViolationsListStyle = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 50px;

  h2 {
    margin-bottom: 30px;
  }
`

export const MyViolations = () => {
  const [violations, setViolations] = useState([])
  useEffect(async () => {
    try {
      const violationsFromLocalStorage =
        JSON.parse(localStorage.getItem('violations')) || []
      const violationsDetails = await Promise.all(
        violationsFromLocalStorage.map(async ({ id, secret, timestamp }) => {
          const data = await api.get(`violations/${id}?secret=${secret}`)
          return {
            ...data,
            timestamp,
          }
        })
      )
      setViolations(violationsDetails.sort((a, b) => a.timestamp - b.timestamp))
    } catch (error) {
      console.error(error)
    }
  }, [])

  return (
    <ViolationsListStyle>
      <Link to={ROUTES.submit}>
        <small>⟵ обратно</small>
      </Link>
      <h2>Моите Сигнали</h2>
      {violations.length === 0 ? (
        <>
          <p>Не сте подали сигнали от това устройство</p>
          <Link to={ROUTES.violationForm}>Подайте сигнал</Link>
        </>
      ) : (
        violations.map((violation) => (
          <div key={violation.id}>
            <h2>Сигнал {violation.id}</h2>
            <p>
              Изпратен на:{' '}
              {new Date(violation.createdAt).toLocaleString('bg-BG')}
            </p>
            <p>Статус: {violation.statusLocalized}</p>
            <Link to={`/violations/${violation.id}`}>
              <p>{violation.description || violation.publishedText}</p>
              {violation.pictures && violation.pictures[0]?.url && (
                <img src={violation.pictures[0]?.url} alt="" height="200px" />
              )}
              Вижте сигнала
            </Link>
          </div>
        ))
      )}
    </ViolationsListStyle>
  )
}
