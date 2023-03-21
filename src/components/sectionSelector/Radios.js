import React from 'react'
import styled from 'styled-components'

const Options = styled.div`
  padding: 1em 0;
`

export default ({ name, label, value, options, onChange, register }) => (
  <div className="form-control">
    <label>{label}</label>
    <Options>
      {options.map((option) => (
        <label key={option.value} className="radioLabel">
          <input
            {...register(name)}
            type="radio"
            name={name}
            value={option.value}
            checked={option.value === value}
            onChange={(e) => e.target.checked && onChange(option.value)}
          />
          {option.label}
        </label>
      ))}
    </Options>
  </div>
)
