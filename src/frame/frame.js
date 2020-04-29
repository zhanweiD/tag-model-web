import {Component} from 'react'
import {action} from 'mobx'
import {observer} from 'mobx-react'
import {withRouter} from 'react-router-dom'
// 国际化
import {LocaleProvider, Layout, Select} from 'antd'
import zhCN from 'antd/lib/locale-provider/zh_CN'
import {DtFrame} from '@dtwave/uikit'

// 公用CSS模块
import 'antd/dist/antd.less'
import '@dtwave/oner-flexbox/flexbox.css'
import storage from '../common/nattyStorage'
import '../common/util.styl'

import store from './store'

const {Content} = Layout
const {Option} = Select

@observer
class Frame extends Component {
  componentWillMount() {
    const {page} = this.props
    // 项目纬度
    if (page === 'space') {
      window.spaceInfo = {}

      store.getProjectList()
    }
  }

  renderNav() {
    const {page, location, pageUrl} = this.props

    if (page !== 'space' || store.projectList.length === 0) return null

    if (pageUrl && location.pathname !== pageUrl) return null

    return (
      <Select
        showSearch
        style={{width: 180}}
        placeholder="请选择项目"
        optionFilterProp="children"
        onChange={this.selectProject}
        value={store.projectId}
      >
        {
          store.projectList.map(d => <Option key={d.id} value={d.id}>{d.name}</Option>)
        }
      </Select>
    )
  }

  // 点击项目空间
  @action selectProject = value => {
    if (this.projectId !== value) {
      storage.set('tag_projectId', value)
      store.projectId = value
      if (window.spaceInfo) {
        window.spaceInfo.projectId = +value
      }
      const {location, history} = this.props
      const url = location.pathname.split('/')
      if (url && url[1]) {
        history.push(`/${url[1]}`)
      }
    }
  }

  componentWillUnmount() {
    store.projectId = undefined
  }

  render() {
    const {children} = this.props
    return (
      <LocaleProvider locale={zhCN}>
        <DtFrame
          {...this.props}
          removeNode
          ref={frame => this.dtFrame = frame}
          navExtra={this.renderNav()}
          system="asset_tag"
          onCollapsedChange={() => {
            setTimeout(() => {
              window.dispatchEvent(new Event('resize'))
            }, 200)
          }}
        >
          <Layout className="frame-layout">
            <Content className="frame-content" key={store.projectId}>
              {children}
            </Content>
          </Layout>
        </DtFrame>
      </LocaleProvider>
    )
  }
}

export default withRouter(Frame)
