import React from 'react'
import styled from 'styled-components'
import { Label } from './Label'

const StyledInput = styled.input`
  line-height: 40px;
  height: 40px;
  font-size: 18px;
  padding: 0.4em 1em;
  border: 1px solid #eee;
  width: 100%;
  max-width: 100%;
  @media screen and (min-width: 750px) {
    width: 450px;
  }
  ::placeholder {
    color: #ccc;
  }
`

export function Input({
  name,
  label,
  children,
  errors,
  register,
  type = 'text',
  required = false,
  pattern,
  ...props
}) {
  return (
    <div className="form-control">
      <Label>
        {label}
        {required && <span style={{ color: 'red', marginLeft: '2px' }}>*</span>}
      </Label>
      <StyledInput
        {...(register ? register(name, { required, pattern }) : {})}
        pattern={pattern}
        {...props}
        type={type}
        name={name}
      />
      {errors && errors.name && (
        <p className="errorMsg">{errors.name.message}</p>
      )}
    </div>
  )
}
