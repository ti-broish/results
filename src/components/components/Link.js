import React from 'react'
import styled from 'styled-components'

import { Link as RouterLink } from 'react-router-dom'
const StyledLink = styled(RouterLink)`
  color: #38decb;
  font-size: 16px;
  text-decoration: none;
  font-weight: bold;
  margin: 0.4em 0;
  padding: 0.4em 0;

  &:hover {
    opacity: 0.8;
  }
`

const StyledLinkButton = styled(RouterLink)`
  display: inline-block;
  text-decoration: none;
  width: min-content;
  min-width: 220px;
  padding: 1em 1.4em;
  margin: 1em 0;
  background-color: #38decb;
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
  &:visited {
    color: #fff;
  }
`

export function Link({ to, children, ...props }) {
  return (
    <StyledLink to={to} {...props}>
      {children}
    </StyledLink>
  )
}

export function LinkButton({ to, children, ...props }) {
  return (
    <StyledLinkButton to={to} {...props}>
      {children}
    </StyledLinkButton>
  )
}
