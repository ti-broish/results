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

export function Link({ to, children }) {
  return <StyledLink to={to}>{children}</StyledLink>
}
