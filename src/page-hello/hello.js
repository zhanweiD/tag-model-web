import {Component} from 'react'
import {observable, action, toJS} from 'mobx'
import {observer} from 'mobx-react'
import {Button, Table} from 'antd'

import HelloStore from './store-hello'

const store = new HelloStore()

@observer
export default class Hello extends Component {
  constructor(props) {
    super(props)

    this.tableCol = [
      {
        title: '中文名',
        key: 'name',
        dataIndex: 'name',
      }, {
        title: '质量分',
        key: 'age',
        dataIndex: 'age',
        width: 100,
      }, {
        title: '生命周期',
        key: 'address',
        dataIndex: 'address',
        width: 100,
      },
    ]


    this.tableCol2 = [
      {
        title: '中文名222',
        key: 'name',
        dataIndex: 'name',
      }, {
        title: '质量分222',
        key: 'age',
        dataIndex: 'age',
        width: 100,
      },
    ]
  }

  componentWillMount() {
    store.getList()
  }


  render() {
    return (
      <div className="page-hello m24">
        <h3>Table嵌套</h3>
        <Table
          style={{width: '100%'}}
          columns={this.tableCol}
          loading={store.tableLoading}
          dataSource={store.list.slice()}
          expandedRowRender={() => (
            <Table
              columns={this.tableCol2}
              dataSource={store.list2.slice()}
              pagination={false}
            />
          )}
          onExpand={(expanded, record) => store.list2.length === 0 && store.getList2(expanded, record)}
          pagination={{
            current: store.pagination.currentPage,
            total: store.pagination.count,
          }}
        />
      </div>
    )
  }
}
