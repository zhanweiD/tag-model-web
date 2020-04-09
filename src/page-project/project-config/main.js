/**
 * @description 项目列表-项目配置
 */
import {Component} from 'react'
import {action, observable} from 'mobx'
import {observer, inject} from 'mobx-react'
import {withRouter} from 'react-router'
import {Spin} from 'antd'
import * as navListMap from '../../common/navList'
import {Time} from '../../common/util'
import {DetailHeader, TabRoute} from '../../component'
import MemberManger from './member-manger'
import ParamsConfig from './params-config'
import DataStorage from './data-storage'
import ResourceGroup from './resource-group'

import store from './store'

// 面包屑设置
// eslint-disable-next-line no-underscore-dangle

const navList = [
  navListMap.tagCenter,
  navListMap.common,
  navListMap.project,
  navListMap.projectConfig,
]

const tabs = [
  {name: '人员管理', value: 0}, 
  {name: '参数配置', value: 1},
  {name: '数据源', value: 2},
  {name: '资源组', value: 3},
]

@inject('frameChange')
@observer
class ProjectConfig extends Component {
  constructor(props) {
    super(props)
    const {match} = props
    store.projectId = match.params.projectId // 项目id
  }

  @observable tabId = 0 // 当前详情tabID 

  componentWillMount() {
    // 面包屑设置
    const {frameChange} = this.props
    frameChange('nav', navList)
    if (store.projectId) {
      store.getDetail()
      store.getAuthCode()
    }
  }

  @action.bound changeTab(id) {
    this.tabId = id
  }

  render() {
    const {
      projectDetail, projectId: id, projectDetailLoading, functionCodes,
    } = store

    const baseInfo = [{
      title: '创建者',
      value: projectDetail.cuserName,
    }, {
      title: '创建时间',
      value: <Time timestamp={projectDetail.ctime} />,
    }, {
      title: '修改时间',
      value: <Time timestamp={projectDetail.mtime} />,
    }, {
      title: '数据源类型',
      value: projectDetail.storageTypeName,
    }, {
      title: '数据源名称',
      value: projectDetail.dataStorageName,
    }, {
      title: '计算引擎',
      value: projectDetail.engineName,
    }, {
      title: '调度队列',
      value: projectDetail.queueName,
    }]

    const tabConfig = {
      tabs,
      currentTab: this.tabId,
      changeTab: this.changeTab,
      changeUrl: false,
    }

    const Content = [MemberManger, ParamsConfig, DataStorage, ResourceGroup][+this.tabId]

    return (
      <div className="project-config">
        <Spin spinning={projectDetailLoading}>
          <DetailHeader
            name={projectDetail.name}
            descr={projectDetail.descr}
            baseInfo={baseInfo}
          />
        </Spin>
       
        <div className="list-content">
          <TabRoute {...tabConfig} />
          <Content projectId={id} functionCodes={functionCodes} store={store} />
        </div>
      </div>
    )
  }
}

export default withRouter(ProjectConfig)
