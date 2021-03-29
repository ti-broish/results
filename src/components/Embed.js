import React from 'react';
import { Route, Switch, Redirect } from 'react-router';
import TestEmbed from './embeds/TestEmbed';
import EmbedShowcase from './embeds/Showcase';

export default props => {
    return (
        <div>
            <Switch>
                <Route path={`/embed/test-embed`} component={TestEmbed}/>
                <Route path={`/embed/showcase`} component={EmbedShowcase}/>
                <Redirect to={`/embed/showcase`}/>
            </Switch>
        </div>
    );
};