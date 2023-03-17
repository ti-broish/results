import React from 'react'

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
      <label className="inputLabel">
        {label}
        {required && <span style={{ color: 'red', marginLeft: '2px' }}>*</span>}
      </label>
    )}
    <div>
      <select
        {...register(name)}
        className="form-control"
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
      </select>
      {errors && <p style={{ color: 'red' }}>{errors.message}</p>}
    </div>
  </div>
)
