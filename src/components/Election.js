import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Redirect, Route, Switch } from 'react-router-dom'
import { Wrapper } from './App'
import Footer from './layout/Footer'
import Header from './layout/Header'
import { MyProtocols } from './MyProtocols'
import { MyViolations } from './MyViolations'
import { ProtocolForm } from './ProtocolForm'
import { ProtocolSummary } from './ProtocolSummary'
import { ResultUnit } from './ResultUnit.js'
import { RightsAndObligations } from './RightsAndObligations'
import { ROUTES } from './routes.js'
import { Submit } from './Submit'
import { ViolationForm } from './ViolationForm'
import { ViolationSummary } from './ViolationSummary'

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
          <Route path={ROUTES.submit} component={Submit} />
          <Route path={ROUTES.protocolForm} component={ProtocolForm} />
          <Route path={ROUTES.violationForm} component={ViolationForm} />
          <Route path={ROUTES.myProtocols} exact component={MyProtocols} />
          <Route path={ROUTES.myViolations} exact component={MyViolations} />
          <Route path={ROUTES.protocol} component={ProtocolSummary} />
          <Route path={ROUTES.violation} component={ViolationSummary} />
          <Route
            path={ROUTES.rightsAndObligations}
            component={RightsAndObligations}
          />

          <Route
            path={[ROUTES.resultUnit, `/`]}
            render={() => <ResultUnit />}
          />
          <Redirect to={`/`} />
        </Switch>
      </Wrapper>
      <Footer />
    </ElectionContext.Provider>
  )
}
