import React from 'react'
import { Label } from '../components/Label'
import { Select } from '../components/Select'

export default ({
  name,
  label,
  value,
  placeholder,
  options,
  onChange,
  register,
  errors,
  required,
}) => (
  <div>
    {label && (
      <Label>
        {label}
        {required && <span style={{ color: 'red', marginLeft: '2px' }}>*</span>}
      </Label>
    )}
    <div>
      <Select
        {...register(name)}
        name={name}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={options.length === 0}
      >
        {(options.length !== 1 || !required) && (placeholder || label) && (
          <option value="">-- {placeholder || label} --</option>
        )}
        {options.map((option) => (
          <option key={option.key || option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </Select>
      {errors && <p style={{ color: 'red' }}>{errors.message}</p>}
    </div>
  </div>
)
