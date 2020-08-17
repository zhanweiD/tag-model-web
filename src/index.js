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

const commonConfig = {
  theme: 'ocean', 
  logoText: '标签中心',
  showAllProduct: true,
  showHeaderNav: true,
  quickEntrance,
  showSider: true,
  showProject: true,
}

const frameComp = (Comp, cofig) => {
  return function frameHocComp() {
    return (
      <Frame
        {...commonConfig}
        {...cofig}
      >
        <Comp />
      </Frame>
    )
  }
}

function Entry() {
  return (
    <Router>
      <Switch>
        {/* 标签管理 */}
        <Route path="/manage" component={frameComp(Manage, {productCode: 'tag_model'})} />
       
        {/* 标签加工 */}
        <Route path="/process" component={frameComp(Process, {productCode: 'tag_derivative'})} />

        {/* 公共模块 */}
        <Route
          path="/common"
          component={frameComp(Common, {
            productCode: 'tag_common',
            showSider: false,
            showProject: false,
          })}
        />

        {/* 配置 */}
        <Route
          path="/config"
          component={frameComp(Config, {
            productCode: 'tag_config',
            showSider: false,
            showProject: false,
          })}
        />

        {/* 总览 */}
        <Route
          path="/overview"
          component={frameComp(Overview, {
            productCode: 'be_tag',
            showSider: false,
            showProject: false})}
        />
        <Redirect to="/overview" />
      </Switch>
    </Router>          
  )
}

ReactDOM.render(<Entry />, document.getElementById('root'))
