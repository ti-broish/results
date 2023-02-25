import React, { useState } from 'react'

import styled from 'styled-components'

const EmbedCode = styled.div`
  border: 1px solid #aaa;
  border-radius: 10px;
  padding: 20px;
  background-color: #666;
  color: white;
`

const CopyButton = styled.button`
  position: relative;
  border: none;
  border-bottom: 4px solid #444;
  padding: 10px 20px;
  background-color: #ddd;
  font-weight: bold;
  color: #333;
  border-radius: 10px;
  cursor: pointer;
  margin-top: 10px;

  &:active:enabled {
    border-bottom: 0;
    margin-top: 14px;
  }

  &:disabled {
    color: #aaa;
    cursor: auto;
    border-bottom-color: #aaa;
  }
`

export default (props) => {
  const [copied, setCopied] = useState(false)

  return (
    <div>
      <h3>Код за вграждане</h3>
      <EmbedCode>{props.code}</EmbedCode>
      <CopyButton
        disabled={copied}
        onClick={() => {
          const el = document.createElement('textarea')
          el.value = props.code
          document.body.appendChild(el)
          el.select()
          document.execCommand('copy')
          document.body.removeChild(el)
          setCopied(true)

          setTimeout(() => {
            setCopied(false)
          }, 5000)
        }}
      >
        {copied ? 'Копирано!' : 'Копирай'}
      </CopyButton>
    </div>
  )
}
