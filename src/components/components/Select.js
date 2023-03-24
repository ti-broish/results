import React from 'react'
import styled from 'styled-components'

const StyledSelect = styled.select`
  display: block;
  font-size: 18px;
  border: 1px solid #eee;
  line-height: 40px;
  height: 40px;
  max-width: 100%;
  @media screen and (min-width: 750px) {
    width: 450px;
  }
`

export function Select({
  children,
  name,
  value,
  onChange,
  disabled = false,
  ...props
}) {
  return (
    <StyledSelect
      name={name}
      onChange={onChange}
      value={value}
      disabled={disabled}
      {...props}
    >
      {children}
    </StyledSelect>
  )
}
