import {Component} from 'react'
import {observer} from 'mobx-react'
import {ListContent} from '../../component'
import {Time} from '../../common/util'
import seach from './search'

import store from './store'

@observer
export default class SyncResult extends Component {
  columns = [{
    title: '标签名称',
    dataIndex: 'name',
  }, {
    title: '标签标识',
    dataIndex: 'objName',
  }, {
    title: '数据类型',
    dataIndex: 'storageName',
  }, {
    title: '数据应用',
    dataIndex: 'storageType',
  }, {
    title: '同步计划',
    dataIndex: 'tagUsedCount',
  }, {
    title: '最近一次更新时间',
    dataIndex: 'lastSubmitTime',
    render: text => <Time timestamp={text} />,
  }, {
    title: '使用状态',
    dataIndex: 'lastStatus',
  }]


  render() {
    const listConfig = {
      columns: this.columns,
      searchParams: seach(),
      store, // 必填属性
    }

    return (
      <div className="page-sync-list">
        <div className="content-header">标签同步结果</div>
        <div className="list-content">
          <ListContent {...listConfig} />
        </div>
      </div>
     
    )
  }
}
