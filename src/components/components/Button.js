import React from 'react'
import styled from 'styled-components'

import { Link as RouterLink } from 'react-router-dom'
const StyledButton = styled.button`
  padding: 0.4em 1em;
  margin: 20px 5px;
  background: #38decb;
  border: none;
  color: #fff;
  border-radius: 3px;
  &:hover {
    opacity: 0.8;
  }
`

export function Button({ onClick, children, type = 'button' }) {
  return (
    <StyledButton onClick={onClick} type={type}>
      {children}
    </StyledButton>
  )
}
