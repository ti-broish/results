import React from 'react'
import styled from 'styled-components'

const StyledLabel = styled.label`
  display: block;
  padding: 1em 0;
`

export function Label({ children, ...props }) {
  return <StyledLabel {...props}>{children}</StyledLabel>
}
