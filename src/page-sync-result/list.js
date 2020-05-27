import {Component} from 'react'
import {toJS, action} from 'mobx'
import {observer, inject} from 'mobx-react'
import {Badge} from 'antd'
import * as navListMap from '../common/navList'
import {ListContent, projectProvider} from '../component'
import {Time} from '../common/util'
import seach from './search'

import store from './store'

const navList = [
  navListMap.tagCenter,
  navListMap.tagSync,
  {text: navListMap.syncResult.text},
]

@inject('frameChange')
@observer
class SyncResult extends Component {
  constructor(props) {
    super(props)
    const {spaceInfo} = window
    store.projectId = spaceInfo && spaceInfo.projectId
  }

  columns = [{
    title: '标签名称',
    dataIndex: 'tagName',
  }, {
    title: '标签标识',
    dataIndex: 'enName',
  }, {
    title: '数据类型',
    dataIndex: 'tagType',
  }, {
    title: '对象名称',
    dataIndex: 'objName',
  }, {
    title: '数据应用',
    dataIndex: 'storageName',
  }, {
    title: '同步计划',
    dataIndex: 'tagTransferSchemeName',
  }, {
    title: '最近一次更新时间',
    dataIndex: 'lastUpdateTime',
    render: text => <Time timestamp={text} />,
  }, {
    title: '使用状态',
    dataIndex: 'tagUsed',
    render: text => (text === '使用中' ? <Badge color="#87d068" text="使用中" /> : <Badge color="#d9d9d9" text="未使用" />),
  }]

  componentWillMount() {
    // 面包屑设置
    const {frameChange} = this.props
    frameChange('nav', navList)
    
    if (store.projectId) {
      store.getObjList()
      store.getStorageList()
      this.initData()
    }
  }

  // 初始化数据，一般情况不需要，此项目存在项目空间中项目的切换，全局性更新，较为特殊
  @action initData() {
    store.searchParams = {}
    store.pagination = {
      pageSize: 10,
      currentPage: 1,
    }
  }

  render() {
    const {objList, storageList, projectId} = store
    const listConfig = {
      columns: this.columns,
      initParams: {projectId},
      searchParams: seach({objList: toJS(objList), storageList: toJS(storageList)}),
      store, // 必填属性
    }

    return (
      <div className="page-sync-result">
        <div className="content-header">标签同步结果</div>
        <div className="list-content">
          <ListContent {...listConfig} />
        </div>
      </div>
     
    )
  }
}
export default projectProvider(SyncResult)
