import {Component} from 'react'
import {observer} from 'mobx-react'
import {Layout, ConfigProvider} from 'antd'
// import zhCn from 'antd/lib/locale-provider/zh_CN'
import OnerFrame from '@dtwave/oner-frame'
import 'antd/dist/antd.less'
import '@dtwave/oner-flexbox/flexbox.css'

import zhCN from 'antd/es/locale/zh_CN'
import enUS from 'antd/es/locale/en_US'
import {getCookie} from '../common/util'

import '../common/common.styl'
import '../common/cover.styl'
import './frame.styl'

const {Content} = Layout
const language = getCookie('language') || 'zh-CN'
@observer
class Frame extends Component {
  render() {
    const me = this
    return (
      <ConfigProvider locale={language === 'en-US' ? enUS : zhCN} componentSize="small">
        <OnerFrame {...this.props}>
          <Layout style={{height: '100%'}}>
            <Content className="tag-content">{me.props.children}</Content>
          </Layout>
        </OnerFrame>
      </ConfigProvider>
    )
  }
}

export default Frame
