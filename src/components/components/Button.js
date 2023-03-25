import React from 'react'
import styled from 'styled-components'

const StyledButton = styled.button`
  display: block;
  padding: 1em 1.4em;
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
