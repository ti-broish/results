import React from 'react'

export default ({ name, label, value, options, onChange, register }) => (
  <div className="form-control">
    <label>{label}</label>
    <div>
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
    </div>
  </div>
)
