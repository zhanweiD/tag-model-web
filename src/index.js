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
import Config from './page-config'

const njkData = {
  dict,
}

const quickEntrance = [
  {
    tip: '审批管理',
    icon: 'approver',
    url: '/tag-model/index.html#/common/approval',
  },
  {
    tip: '后台配置',
    icon: 'setting',
    url: '/tag-model/index.html#/config/environment',
  },
  {
    tip: '项目管理',
    url: '/project/index.html',
    icon: 'project',
  },
]

window.njkData = njkData

function Entry() {
  return (
    <Frame 
      productCode="be_tag" 
      theme="ocean" 
      logoText="标签中心" 
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

          {/* 公共模块 */}
          <Route path="/config" component={Config} />

          <Redirect to="/overview" />
        </Switch>
      </Router>    
    </Frame>
      
  )
}

ReactDOM.render(<Entry />, document.getElementById('root'))
