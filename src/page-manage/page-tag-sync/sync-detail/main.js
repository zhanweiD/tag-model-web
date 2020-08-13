import {Component, useEffect} from 'react'
import {Spin} from 'antd'
import {action, observable} from 'mobx'
import {observer} from 'mobx-react'
import OnerFrame from '@dtwave/oner-frame'
import {DetailHeader, TabRoute, Tag} from '../../../component'
import {Time} from '../../../common/util'
import ConfigInfo from './config-info'
import RunRecord from './run-record'

import store from './store'

const tabs = [
  {name: '配置信息', value: 0}, 
  {name: '运行记录', value: 1},
]

@observer
class SyncDetail extends Component {
  constructor(props) {
    super(props)
    const {match} = props
    store.syncId = match.params.id 

    store.projectId = props.projectId
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
    const {infoLoading, detail, syncId, projectId} = store

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

    // 不同状态的相应map
    const tagMap = {
      0: <Tag status="default" text="未完成" />,
      1: <Tag status="success" text="提交成功" />,
      2: <Tag status="error" text="提交失败" />,
      3: <Tag status="process" text="提交中" />,
      4: <Tag status="success" text="更新成功" />,
      5: <Tag status="error" text="更新失败" />,
      6: <Tag status="process" text="更新中" />,
      7: <Tag status="default" text="未完成" />,
    }

    return (
      <div className="page-sync-detail">
        <Spin spinning={infoLoading}>
          <DetailHeader
            name={detail.name}
            descr={detail.descr}
            baseInfo={baseInfo}
            tag={tagMap[detail.status] || null}
          />
        </Spin>
        <div className="list-content box-border">
          <TabRoute {...tabConfig} />
          <Content store={store} syncId={syncId} />
        </div>
      </div>
    )
  }
}


export default props => {
  const ctx = OnerFrame.useFrame()
  const projectId = ctx.useProjectId()

  useEffect(() => {
    ctx.useProject(false)
  }, [])

  return (
    <SyncDetail {...props} projectId={projectId} />
  )
}
