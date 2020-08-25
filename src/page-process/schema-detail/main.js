/**
 * @description 加工方案详情
 */
import {Component, useEffect} from 'react'
import {observable, action} from 'mobx'
import {observer} from 'mobx-react'

import {Spin, NoData} from 'antd'
import OnerFrame from '@dtwave/oner-frame'
import {
  Tag,
  TabRoute,
  DetailHeader, 
} from '../../component'
import ConfigInfo from './config-info'
import RunRecord from './run-record'
import {Time, codeInProduct} from '../../common/util'

import store from './store'
// import runStore from './store-run-record'

const tabs = [
  {name: '配置信息', value: 0}, 
  {name: '运行记录', value: 1},
]
@observer
class SchemaDetail extends Component {
  constructor(props) {
    super(props)
    const {match, projectId} = props
    store.projectId = projectId
    // runStore.projectId = projectId 
    store.processeId = match.params.id // 方案id
  }

  @observable tabId = 0 // 当前详情tabID 

  @action.bound changeTab(id) {
    this.tabId = id
  }


  componentWillMount() {
    if (store.processeId) {
      store.getDetail()
    }
  }

  @action.bound submit() {
    store.submitScheme({
      id: this.processeId,
    })
  }

  getTabCode = () => {
    if (codeInProduct('tag_derivative:tql_submit_log[r]')) {
      return [{name: '配置信息', value: 0}, 
        {name: '运行记录', value: 1}]
    }

    return [{name: '配置信息', value: 0}]
  }

  render() {
    const {loading, detail, processeId, projectId} = store

    // 详情信息
    const baseInfo = [{
      title: '方案类型',
      value: 'TQL',
    }, {
      title: '所属对象',
      value: detail.objName,
    }, {
      title: '创建人',
      value: detail.cuserName,
    }, {
      title: '创建时间',
      value: <Time timestamp={detail.createTime} />,
    }, {
      title: '物理表',
      value: detail.tableName,
    }]

    const tabConfig = {
      tabs: this.getTabCode(),
      currentTab: this.tabId,
      changeTab: this.changeTab,
      changeUrl: false,
    }

    // 不同状态的相应map --方案状态 0 未完成、1 提交成功 2 提交失败
    const tagMap = {
      0: <Tag status="default" text="未完成" />,
      1: <Tag status="success" text="提交成功" />,
      2: <Tag status="error" text="提交失败" />,
    }

    const Content = [ConfigInfo, RunRecord][+this.tabId]

    return (

      <div className="processe-detail">
        { processeId ? (
          <Spin spinning={loading}>
            <div>
              <DetailHeader 
                name={detail.name}
                descr={detail.descr}
                btnMinWidth={160}
                baseInfo={baseInfo}
                tag={tagMap[detail.status]}
              />
            </div>
            <TabRoute {...tabConfig} />
            {/* <ConfigInfo store={store} /> */}
            <div className="list-content box-border">
              <Content store={store} processeId={processeId} projectId={projectId} />
            </div>
          </Spin>
        )
          : (
            <NoData text="暂无数据" />
          )
        }
       
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
    <SchemaDetail {...props} projectId={projectId} />
  )
}
