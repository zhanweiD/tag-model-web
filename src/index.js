import intl from 'react-intl-universal'
import React from 'react'
import ReactDOM from 'react-dom'
import {HashRouter as Router, Route, Switch, Redirect} from 'react-router-dom'

import i18nZh from '../lang/zh-CN'
import i18nEn from '../lang/en-US'
import {getCookie} from './common/util'
import * as dict from './common/dict'


import Frame from './frame'
import Overview from './page-overview'
import Manage from './page-manage'
import Process from './page-process'
import Common from './page-common'
import Config from './page-config'

require('intl/locale-data/jsonp/en.js')
require('intl/locale-data/jsonp/zh.js')

const njkData = {
  dict,
}

const language = getCookie('language') || 'zh-CN'
intl.init({
  currentLocale: language,
  locales: {
    'zh-CN': i18nZh,
    'en-US': i18nEn,
  },
  warningHandler: (message, detail) => {
    console.warn(detail)
  },
}).then(() => {})

const quickEntrance = [
  {
    tip: intl.get('ide.src.common.navList.0ujwqvq35vi').d('审批管理'),
    icon: 'approver',
    url: '/tag-model/index.html#/common/approval',
  },

  {
    tip: intl
      .get('ide.src.component.project-provider.project-provider.odc0bazjvxn')
      .d('后台配置'),
    icon: 'setting',
    url: '/tag-model/index.html#/config/environment',
  },

  {
    tip: intl
      .get('ide.src.component.project-provider.project-provider.454zmtzq66v')
      .d('项目管理'),
    url: '/project/index.html#/project',
    icon: 'project',
  },
]

window.njkData = njkData

const commonConfig = {
  theme: 'ocean',
  logoText: intl.get('ide.src.common.navList.rf1adwfz5e').d('标签中心'),
  showAllProduct: true,
  showHeaderNav: true,
  quickEntrance,
  showSider: true,
  showProject: true,
  onUserChange: () => (window.location.href = `${window.__keeper.pathHrefPrefix
      || '/'}/overview`), // 用户信息变更跳转到首页，防止权限问题
}
const urlHea = window.location.hash.split('/')[1]
let title = intl.get('ide.src.common.navList.rf1adwfz5e').d('标签中心')
if (urlHea === 'config') {
  title = intl
    .get('ide.src.component.project-provider.project-provider.odc0bazjvxn')
    .d('后台配置')
} else if (urlHea === 'process') {
  title = intl.get('ide.src.common.navList.9asijq2ikmn').d('标签加工')
} else if (urlHea === 'common') {
  title = intl.get('ide.src.index.0vfs5wb1tdjl').d('审批中心')
} else if (urlHea === 'overview') {
  title = intl.get('ide.src.common.navList.rf1adwfz5e').d('标签中心')
} else {
  title = intl.get('ide.src.common.navList.yj7vyhgzmw8').d('标签管理')
}
document.title = title

const frameComp = (Comp, cofig) => {
  return function frameHocComp() {
    return (
      <Frame {...commonConfig} {...cofig}>
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
        {/* <Route path="/manage" component={frameComp(Manage, {productCode: 'tag_model'})} /> */}
        <Route
          path="/manage"
          component={frameComp(Manage, {
            productCode: 'tag_model',
            showProject: false,
          })}
        />

        {/* 标签加工 */}
        <Route
          path="/process"
          component={frameComp(Process, {productCode: 'tag_derivative'})}
        />

        {/* 公共模块 */}
        <Route
          path="/common"
          component={frameComp(Common, {
            productCode: 'tag_common',
            showSider: false,
            showProject: true,
          })}
        />

        {/* 配置 */}
        <Route
          path="/config"
          component={frameComp(Config, {
            productCode: 'tag_config',
            showSider: true,
            showProject: true,
          })}
        />

        {/* 总览 */}
        <Route
          path="/overview"
          component={frameComp(Overview, {
            // productCode: 'tag_model',
            productCode: 'tag_overview',
            showSider: false,
            showProject: false,
          })}
        />

        <Redirect to="/overview" />
      </Switch>
    </Router>
  )
}

ReactDOM.render(<Entry />, document.getElementById('root'))
