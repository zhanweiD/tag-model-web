import {Component} from 'react'
import {observer} from 'mobx-react'
import {Table} from 'antd'

@observer
export default class SyncTagList extends Component {
  columns = [{
    title: '标签名称',
    dataIndex: 'name',
  }, {
    title: '唯一标识',
    dataIndex: 'name',
  }, {
    title: '数据类型',
    dataIndex: 'name',
  }, {
    title: '目标字段名',
    dataIndex: 'name',
  }, {
    title: '目标表字段数据类型',
    dataIndex: 'name',
  }, {
    title: '操作',
    dataIndex: 'action',
    render: record => <a href>移除</a>,
  }]

  render() {
    const listConfig = {
      // loading,
      // dataSource: this.getFilterData(),
      dataSource: [],
      rowKey: 'id',
      columns: this.columns,
      pagination: false,
      scroll: {y: 'calc(100% - 98)'},
    }
    return (
      <div className="FB1 sync-tag-list">
        <Table {...listConfig} />
      </div>
    )
  }
}
