import {Component} from 'react'
import {observable, action} from 'mobx'
import {observer} from 'mobx-react'
import {Table} from 'antd'
import {SearchForm} from './search-form'

import store from './store-scene-tags'

@observer
export default class Scene extends Component {
  searchForm = null

  columns = [{
    title: '名称',
    key: 'key1',
    dataIndex: 'key1',
  }, {
    title: '数据类型',
    key: 'key2',
    dataIndex: 'key2',
  }, {
    title: '价值分',
    key: 'key3',
    dataIndex: 'key3',
    sorter: true,
  }, {
    title: '质量分',
    key: 'key4',
    dataIndex: 'key4',
    sorter: true,
  }, {
    title: '热度',
    key: 'key5',
    dataIndex: 'key5',
    sorter: true,
  }, {
    title: '创建人',
    key: 'key6',
    dataIndex: 'key6',
  }, {
    title: '使用状态',
    key: 'key7',
    dataIndex: 'key7',
  }, {
    title: '被API调用次数 ',
    key: 'key8',
    dataIndex: 'key8',
    sorter: true,
  }]

  @action handleChange(e) {
    this.searchStr = JSON.stringify(e)
  }

  @action handleTableChange = pagination => {
    // this.store.param.currentPage = pagination.current
  }


  // 搜索
  @action handleSearch() {
    // const values = JSON.parse(this.searchStr)
    // const {store} = this.props
    // // 筛选条件
    // store.searchKey = values.searchKey
    // store.standardType = values.standardType
    // store.chargerId = values.chargerId
    // // 列表
    // store.pagination.currentPage = 1
    // store.pagination.pageSize = 10
    // store.getList()
  }

  // 重置
  @action handleReset() {
    // const {store} = this.props
    // this.searchForm && this.searchForm.resetFields()
    // this.searchStr = '{}'
    // store.searchKey = ''
    // store.standardType = ''
    // store.chargerId = ''

    // store.pagination.currentPage = 1
    // store.pagination.pageSize = 10
    // store.getList()
  }

  render() {
    return (
      <div className="scene-tags p16">
        <SearchForm 
          ref={form => this.searchForm = form}
          onChange={() => this.handleChange(this.searchForm.getFieldsValue())}
          onSearch={() => this.handleSearch()}
          onReset={() => this.handleReset()}
        />
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
