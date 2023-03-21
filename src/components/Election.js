import React, { useState, useEffect } from 'react'

import { Redirect, Route, Switch } from 'react-router-dom'
import axios from 'axios'

import Header from './layout/Header'
import Footer from './layout/Footer'

import { ResultUnit, ResultUnitRoute } from './ResultUnit.js'

import { Wrapper } from './App'

import { ViolationForm, ViolationFormRoute } from './ViolationForm'
import { ProtocolForm, ProtocolFormRoute } from './ProtocolForm'
import { Submit, SubmitRoute } from './Submit'
import { ProtocolSummary, ProtocolSummaryRoute } from './ProtocolSummary'
import { MyProtocols, MyProtocolsRoute } from './MyProtocols'
import { MyViolations, MyViolationsRoute } from './MyViolations'

export const ElectionContext = React.createContext()

export default () => {
  const [meta, setMeta] = useState(null)

  const dataURL = process.env.DATA_URL ? process.env.DATA_URL : '/json'

  useEffect(() => {
    axios.get(`${dataURL}/results/meta.json`).then((res) => {
      setMeta(res.data)
    })
  }, [])

  return (
    <ElectionContext.Provider
      value={{ meta, parties: !meta ? null : meta.parties, dataURL }}
    >
      <Header title={!meta ? null : meta.name} />
      <Wrapper>
        <Switch>
          <Route path={SubmitRoute} component={Submit} />
          <Route path={ProtocolFormRoute} component={ProtocolForm} />
          <Route path={MyProtocolsRoute} exact component={MyProtocols} />
          <Route path={MyViolationsRoute} exact component={MyViolations} />
          <Route path={ProtocolSummaryRoute} component={ProtocolSummary} />
          <Route path={ViolationFormRoute} component={ViolationForm} />
          <Route path={[ResultUnitRoute, `/`]} render={() => <ResultUnit />} />
          <Redirect to={`/`} />
        </Switch>
      </Wrapper>
      <Footer />
    </ElectionContext.Provider>
  )
}
