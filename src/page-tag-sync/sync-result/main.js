import {Component} from 'react'
import {observer} from 'mobx-react'
import {Badge} from 'antd'
import {ListContent} from '../../component'
import {Time} from '../../common/util'
import seach from './search'

import store from './store'

@observer
export default class SyncResult extends Component {
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
    title: '数据源名称',
    dataIndex: 'storageName',
  }, {
    title: '同步计划',
    dataIndex: 'tagTransferSchemeName',
  }, {
    title: '最近一次更新时间',
    dataIndex: 'lastSubmitTime',
    render: text => <Time timestamp={text} />,
  }, {
    title: '使用状态',
    dataIndex: 'lastStatus',
    render: text => (text ? <Badge color="#87d068" text="使用中" /> : <Badge color="#d9d9d9" text="未使用" />),
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
