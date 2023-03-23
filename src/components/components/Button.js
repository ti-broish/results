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
  cursor: pointer;
  &:hover {
    opacity: 0.8;
  }
  &:active {
    box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.5);
  }
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`

export function Button({ onClick, children, type = 'button', ...props }) {
  return (
    <StyledButton onClick={onClick} type={type} {...props}>
      {children}
    </StyledButton>
  )
}
