import React, { lazy, Suspense } from 'react'

import { BrowserRouter, Redirect, Route, Switch } from 'react-router-dom'

import Election from './Election'

import styled from 'styled-components'
import Embed from './Embed'
import './recaptcha/recaptcha.css'

export const Wrapper = styled.div`
  max-width: 900px;
  margin: 20px auto 50px auto;
  padding: 0 1em;
  padding-bottom: 5rem;
`

const GlobalCSS = styled.div`
  font-family: 'Montserrat', sans-serif;
  font-weight: normal;
  background-color: white;

  box-sizing: border-box;
  *,
  *:before,
  *:after {
    box-sizing: inherit;
  }

  а,
  a:active,
  a:focus,
  a:visited {
    text-decoration: none;
    outline: none;
    -moz-outline-style: none;
  }

  .successfulMessage {
    color: green;
  }
  .unsuccessfulMessage {
    color: red;
  }
`

const GoogleReCaptchaProvider = lazy(() =>
  import('react-google-recaptcha-v3').then((module) => ({
    default: module.GoogleReCaptchaProvider,
  }))
)

export default (props) => {
  const publicURL = process.env.PUBLIC_URL ? process.env.PUBLIC_URL : '/'
  const reCaptchaKey = process.env.GOOGLE_RECAPTCHA_KEY

  const app = (
    <GlobalCSS>
      <BrowserRouter basename={publicURL}>
        <Switch>
          <Route path="/embed" component={Embed} />
          <Route path="/" component={Election} />
          <Redirect to="/" />
        </Switch>
      </BrowserRouter>
    </GlobalCSS>
  )

  return reCaptchaKey ? (
    <Suspense fallback={app}>
      <GoogleReCaptchaProvider reCaptchaKey={reCaptchaKey} language="bg">
        {app}
      </GoogleReCaptchaProvider>
    </Suspense>
  ) : (
    app
  )
}
