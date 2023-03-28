import React from 'react'
import styled from 'styled-components'
import { Label } from './Label'

const StyledTextarea = styled.textarea`
  padding: 20px;
  width: 100%;
  border: 1px solid #eee;
  max-width: 100%;
  @media screen and (min-width: 750px) {
    width: 450px;
  }
`

export function Textarea({
  name,
  label,
  children,
  errors,
  register,
  required = false,
  minLength,
  ...props
}) {
  const pattern = minLength > 0 ? `.{${minLength},}` : undefined
  return (
    <div className="form-control">
      <Label>
        {label}
        {required && <span style={{ color: 'red', marginLeft: '2px' }}>*</span>}
      </Label>
      <StyledTextarea
        name={name}
        {...register(name, { required, minLength, pattern })}
        {...props}
        minLength={minLength}
        required={required}
        rows={5}
      />
      {errors.name && <p className="errorMsg">{errors.name.message}</p>}
    </div>
  )
}
