import {Component} from 'react'
import {observable, action, runInAction, toJS} from 'mobx'
import {Provider} from 'mobx-react'

// 国际化
import {LocaleProvider, Layout} from 'antd'
import zhCN from 'antd/lib/locale-provider/zh_CN'
import {DtFrame} from '@dtwave/uikit'

// 公用CSS模块
import 'antd/dist/antd.less'
import '@dtwave/oner-flexbox/flexbox.css'
import '../common/util.styl'

const {Content} = Layout

export default class Frame extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <LocaleProvider locale={zhCN}>
        <DtFrame
          {...this.props}
          ref={frame => this.dtFrame = frame}
          system="asset_tag"
          onCollapsedChange={() => {
            setTimeout(() => {
              window.dispatchEvent(new Event('resize'))
            }, 200)
          }}
        >
          <Layout className="frame-layout">
            <Content className="frame-content">
              {this.props.children}
            </Content>
          </Layout>
        </DtFrame>
      </LocaleProvider>
    )
  }

  // url中hash值可能不只1个，兼容
  getSelectedKey() {
    const me = this
    const hashItem = me.props.leftMenu.find(item => location.hash.indexOf(item.key) > -1)
    return [hashItem ? hashItem.key : me.props.leftMenu[0].key]
  }

  clickLeftMenu(key) {
    const me = this
    if (me.props.clickLeftMenu) {
      // 如果父级需要自己控制点击导航
      me.props.clickLeftMenu({
        prevKey: me.getSelectedKey()[0],
        nextKey: key,
      })
    } else {
      location.hash = `/${key}`
    }
  }
}
