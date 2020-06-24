import {Component} from 'react'
import {Spin} from 'antd'
import {action, observable} from 'mobx'
import {observer, inject} from 'mobx-react'
import * as navListMap from '../../common/navList'
import {DetailHeader, TabRoute} from '../../component'
import {Time} from '../../common/util'
import ConfigInfo from './config-info'
import RunRecord from './run-record'

import store from './store'

const tabs = [
  {name: '配置信息', value: 0}, 
  {name: '运行记录', value: 1},
]

const navList = [
  navListMap.tagCenter,
  navListMap.tagSync,
  navListMap.syncPlan,
  {text: navListMap.syncDetail.text},
]

// @inject('frameChange')
@observer
export default class SyncDetail extends Component {
  constructor(props) {
    super(props)
    const {match} = props
    store.syncId = match.params.id 
    
    const {spaceInfo} = window
    store.projectId = spaceInfo && spaceInfo.projectId
  }

  componentWillMount() {
    // 面包屑设置
    // const {frameChange} = this.props
    // frameChange('nav', navList)
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
      value: detail.objName,
    }, {
      title: '创建人',
      value: detail.cuserName,
    }, {
      title: '创建时间',
      value: <Time timestamp={detail.createTime} />,
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

    const Content = [ConfigInfo, RunRecord][+this.tabId]

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
