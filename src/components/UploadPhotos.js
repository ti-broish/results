import { useFormContext } from 'react-hook-form'
import React from 'react'
import styled from 'styled-components'

const StyledDiv = styled.div`
  label.label input[type='file'] {
    position: absolute;
    top: -1000px;
  }
  .label {
    cursor: pointer;
    border: 1px solid #cccccc;
    border-radius: 5px;
    padding: 5px 15px;
    margin: 5px;
    background: #dddddd;
    display: inline-block;
  }
  .label:hover {
    background: #5cbd95;
  }
  .label:active {
    background: #9fa1a0;
  }
  .label:invalid + span {
    color: #000000;
  }
  .label:valid + span {
    color: #ffffff;
  }
`

export default function UploadPhotos() {
  const methods = useFormContext()

  return (
    <StyledDiv>
      <label className="label">
        {' '}
        <input
          name="photoUpload"
          type="file"
          accept="image/*"
          multiple
          {...methods.register('file')}
        />
        <span>Качете снимки</span>
      </label>
    </StyledDiv>
  )
}
