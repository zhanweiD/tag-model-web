import {Component} from 'react'
import {observer} from 'mobx-react'
import {Layout, ConfigProvider} from 'antd'
import zhCn from 'antd/lib/locale-provider/zh_CN'
import OnerFrame from '@dtwave/oner-frame'
import 'antd/dist/antd.less'
import '@dtwave/oner-flexbox/flexbox.css'
import '../common/common.styl'
import './frame.styl'
import store from './store'

const {Content} = Layout
@observer
class Frame extends Component {
  render() {
    const me = this
    return (
      <ConfigProvider locale={zhCn}>
        <OnerFrame {...this.props}>
          {
            store.functionCodeDone ? (
              <Layout>
                <Content className="tag-content">{me.props.children}</Content>
              </Layout>
            ) : <div />
          }
        
        </OnerFrame>
      </ConfigProvider>
    )
  }
}

export default Frame
