import React from 'react'
import { Link } from 'react-router-dom'

export const Submit = () => (
  <>
    <Link to="/protocol/new">Изпрати протокол</Link>
    <br />
    <Link to="/violation/new">Подай сигнал</Link>
  </>
)
