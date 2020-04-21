import {Component} from 'react'
import {Spin} from 'antd'
import {action, observable} from 'mobx'
import {observer} from 'mobx-react'
import {DetailHeader, TabRoute} from '../../component'
import {Time} from '../../common/util'
import ConfigInfo from './config-info'
// import RunRecord from './run-record'

import store from './store'

const tabs = [
  {name: '配置信息', value: 0}, 
  // {name: '运行记录', value: 1},
]

@observer
export default class SourceDetail extends Component {
  constructor(props) {
    super(props)
    const {match} = props
    store.syncId = match.params.id 
  }

  componentWillMount() {
    store.getDetail()
    store.getConfigInfo()
  }

  @observable tabId = 0 // 当前详情tabID 

  @action.bound changeTab(id) {
    this.tabId = id
  }

  render() {
    const {infoLoading, detail} = store

    const baseInfo = [{
      title: '同步对象',
      value: detail.name,
    }, {
      title: '创建人',
      value: detail.cUserName,
    }, {
      title: '创建时间',
      value: <Time timestamp={detail.ctime} />,
    }, {
      title: '数据源类型',
      value: detail.storageTypeName,
    }, {
      title: '数据源',
      value: detail.storageName,
    }]

    const tabConfig = {
      tabs,
      currentTab: this.tabId,
      changeTab: this.changeTab,
      changeUrl: false,
    }

    const Content = [ConfigInfo][+this.tabId]

    return (
      <div className="page-sync-detail">
        <Spin spinning={infoLoading}>
          <DetailHeader
            name={detail.name}
            descr={detail.descr}
            baseInfo={baseInfo}
          />
        </Spin>
        <div className="list-content">
          <TabRoute {...tabConfig} />
          <Content store={store} />
        </div>
      </div>
    )
  }
}
