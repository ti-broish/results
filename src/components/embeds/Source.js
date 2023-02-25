import React from 'react'

import styled from 'styled-components'

const SourceStyle = styled.div`
  background-color: white;
  display: block;
  position: fixed;
  right: 0;
  //left: 0;
  text-align: center;
  bottom: 0;
  padding: 5px;

  p {
    margin: 0;
    font-weight: bold;
    color: #333;

    a {
      color: blue;
    }
  }
`

export default (props) => {
  const publicURL = process.env.PUBLIC_URL ? process.env.PUBLIC_URL : ''
  return (
    <SourceStyle>
      <p>
        Източник:{' '}
        <a href="https://tibroish.bg">
          <img
            style={{ height: '25px', verticalAlign: 'middle' }}
            src={`${publicURL}/brand/source_logo.png`}
          />
        </a>
      </p>
    </SourceStyle>
  )
}
