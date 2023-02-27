import React from 'react'
import { Route, Switch, Redirect } from 'react-router'
import MiniResults from './embeds/MiniResults'
import ViolationsEmbed from './embeds/ViolationsEmbed'
import EmbedShowcase from './embeds/Showcase'

export default (props) => {
  return (
    <div>
      <Switch>
        <Route path={`/embed/violations`} component={ViolationsEmbed} />
        <Route path={`/embed/mini-results`} component={MiniResults} />
        <Route path={`/embed/showcase`} component={EmbedShowcase} />
        <Redirect to={`/embed/showcase`} />
      </Switch>
    </div>
  )
}
