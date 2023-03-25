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
  ...props
}) {
  return (
    <div className="form-control">
      <Label>{label}</Label>
      <StyledTextarea name={name} {...register(name)} {...props} rows={5} />
      {errors.name && <p className="errorMsg">{errors.name.message}</p>}
    </div>
  )
}
