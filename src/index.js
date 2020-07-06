import React from 'react'
import ReactDOM from 'react-dom'
import {
  HashRouter as Router,
  Route,
  Switch,
  Redirect,
} from 'react-router-dom'
import * as dict from './common/dict'

import Frame from './frame'
import Overview from './page-overview'
import Manage from './page-manage'
import Process from './page-process'
import Common from './page-common'

const njkData = {
  dict,
}

const quickEntrance = [
  {
    tip: '后台配置',
    icon: 'setting',
  },
]


window.njkData = njkData

function Entry() {
  return (
    <Frame 
      productCode="be_tag" 
      theme="ocean" 
      logoText="标签模型" 
      showAllProduct 
      showSider
      showHeaderNav 
      showProject
      quickEntrance={quickEntrance}
    >
      <Router>
        <Switch>
          {/* 总览 */}
          <Route path="/overview" component={Overview} />

          {/* 标签管理 */}
          <Route path="/manage" component={Manage} />

          {/* 标签加工 */}
          <Route path="/process" component={Process} />

          {/* 公共模块 */}
          <Route path="/common" component={Common} />

          <Redirect to="/overview" />
        </Switch>
      </Router>    
    </Frame>
      
  )
}

ReactDOM.render(<Entry />, document.getElementById('root'))
