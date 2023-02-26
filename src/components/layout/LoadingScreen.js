import React from 'react'

export default (props) => {
  const publicURL = process.env.PUBLIC_URL ? process.env.PUBLIC_URL : ''
  return (
    <div style={{ textAlign: 'center' }}>
      <h1 style={{ color: '#aaa' }}>Зареждане</h1>
      <img style={{ width: '400px' }} src={`${publicURL}/svg/loading.svg`} />
    </div>
  )
}
