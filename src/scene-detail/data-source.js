import {Component} from 'react'
import {observable, action, toJS} from 'mobx'
import {observer} from 'mobx-react'
import {Table} from 'antd'

export default class DataSource extends Component {
  componentWillMount() {
  }

  columns = [{
    title: '所属分类',
    key: 'key1',
    dataIndex: 'key1',
  }, {
    title: '对象名称',
    key: 'key2',
    dataIndex: 'key2',
  }, {
    title: '所属类目',
    key: 'key3',
    dataIndex: 'key3',
    sorter: true,
  }, {
    title: '标签中文名',
    key: 'key4',
    dataIndex: 'key4',
    sorter: true,
  }, {
    title: '标签英文名',
    key: 'key5',
    dataIndex: 'key5',
    sorter: true,
  }, {
    title: '目的字段',
    key: 'key6',
    dataIndex: 'key6',
  }]

  @action handleTableChange = pagination => {
    // this.store.param.currentPage = pagination.current
  }

  render() {
    return (
      <div className="data-source m16">
        <Table 
          columns={this.columns} 
          dataSource={[]} 
          onChange={this.handleTableChange}
          pagination={{
            // pageSize: store.pagination.pageSize,
            // current: store.pagination.currentPage,
            // total: store.pagination.count,
            // showTotal: () => `合计${store.pagination.count}条记录`,
          }}
        />
      </div>
    )
  }
}
