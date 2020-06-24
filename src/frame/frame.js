import {Component} from 'react'
import {action} from 'mobx'
import {observer} from 'mobx-react'
import {withRouter} from 'react-router-dom'
import {ConfigProvider, Layout, Select} from 'antd'
import zhCN from 'antd/lib/locale-provider/zh_CN'
// import {DtFrame} from '@dtwave/uikit'
import OnerFrame from '@dtwave/oner-frame'

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
  // componentWillMount() {
  //   const {page} = this.props
  //   // 项目纬度
  //   if (page === 'space') {
  //     window.spaceInfo = {}

  //     store.getProjectList()
  //   }
  // }

  // componentWillUnmount() {
  //   store.projectId = undefined
  // }

  // renderNav() {
  //   const {page, location, pageUrl} = this.props

  //   if (page !== 'space' || store.projectList.length === 0) return null

  //   if (pageUrl && location.pathname !== pageUrl) return null

  //   return (
  //     <Select
  //       showSearch
  //       style={{width: 180}}
  //       placeholder="请选择项目"
  //       optionFilterProp="children"
  //       onSelect={this.selectProject}
  //       value={store.projectId}
  //     >
  //       {
  //         store.projectList.map(d => <Option key={d.id} value={d.id}>{d.name}</Option>)
  //       }
  //     </Select>
  //   )
  // }

  // // 点击项目空间
  // @action selectProject = value => {
  //   console.log(value)
  //   if (this.projectId !== value) {
  //     storage.set('tag_projectId', value)
  //     store.projectId = value
  //     if (window.spaceInfo) {
  //       window.spaceInfo.projectId = +value
  //     }
  //     const {location, history} = this.props
  //     const url = location.pathname.split('/')
  //     if (url && url[1]) {
  //       history.push(`/${url[1]}`)
  //     }
  //   }
  // }

  // componentWillUnmount() {
  //   store.projectId = undefined
  // }

  render() {
    const {children} = this.props
    console.log(this.props)
    return (
      <ConfigProvider locale={zhCN}>
        <OnerFrame
          {...this.props}
          // removeNode
          // ref={frame => this.dtFrame = frame}
          // navExtra={this.renderNav()}
          // system="asset_tag"
          // onCollapsedChange={() => {
          //   setTimeout(() => {
          //     window.dispatchEvent(new Event('resize'))
          //   }, 200)
          // }}
        >
          <Layout className="frame-layout">
            <Content className="frame-content" key={store.projectId}>
              {children}
            </Content>
          </Layout>
        </OnerFrame>
      </ConfigProvider>
    )
  }
}

export default withRouter(Frame)
