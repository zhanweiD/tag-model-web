import {Component} from 'react'
import {observer} from 'mobx-react'
import {Layout, ConfigProvider} from 'antd'
import zhCn from 'antd/lib/locale-provider/zh_CN'
import OnerFrame from '@dtwave/oner-frame'
import 'antd/dist/antd.less'
import '@dtwave/oner-flexbox/flexbox.css'
import '../common/common.styl'
import '../common/cover.styl'
import './frame.styl'

const {Content} = Layout
@observer
class Frame extends Component {
  render() {
    const me = this
    return (
      <ConfigProvider locale={zhCn}>
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
