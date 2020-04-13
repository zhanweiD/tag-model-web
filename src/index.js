import React from 'react'
import ReactDOM from 'react-dom'
import {
  HashRouter as Router,
  Route,
  Switch,
  Redirect,
} from 'react-router-dom'
import * as dict from './common/dict'

import Approval from './page-approval'
import Market from './page-market'
import ObjectConfig from './page-object-config'
import ObjectList from './page-object-list'
import ObjectModel from './page-object-model'
import Overview from './page-overview'
import Project from './page-project'
import Scene from './page-scene'
import TagModel from './page-tag-model'
import TagSchema from './page-tag-schema'
import TagWarehouse from './page-tag-warehouse'
import AimSource from './page-aim-source'

const njkData = {
  dict,
}

window.njkData = njkData


export default class Entry extends React.Component {
  render() {
    return (
      <Router>
        <Switch>
          <Route path="/overview" component={Overview} />
          <Route path="/approval" component={Approval} />
          <Route path="/market" component={Market} />
          <Route path="/object-list" component={ObjectList} />
          <Route path="/object-config" component={ObjectConfig} />
          <Route path="/object-model" component={ObjectModel} />
          <Route path="/project" component={Project} />
          <Route path="/scene" component={Scene} />
          <Route path="/tag-model" component={TagModel} />
          <Route path="/tag-schema" component={TagSchema} />
          <Route path="/tag-warehouse" component={TagWarehouse} />
          <Route path="/aim-source" component={AimSource} />

          <Redirect to="/overview" />
        </Switch>
      </Router>
    )
  }
}

ReactDOM.render(<Entry />, document.getElementById('root'))
