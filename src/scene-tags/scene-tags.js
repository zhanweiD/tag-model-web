import {Component} from 'react'
import {observable, action} from 'mobx'
import {observer, inject} from 'mobx-react'
import {Table} from 'antd'

import {navListMap} from '../common/constants'
import {SearchForm} from './search-form'

import store from './store-scene-tags'

@inject('frameChange')
@observer
export default class Scene extends Component {
  constructor(props) {
    super(props)
    
    const {
      match: {
        params,
      },
    } = props

    store.sceneId = params.id
  }

  searchForm = null

  columns = [{
    title: '名称',
    dataIndex: 'name',
  }, {
    title: '数据类型',
    dataIndex: 'type',
  }, {
    title: '价值分',
    dataIndex: 'worthScore',
    sorter: true,
  }, {
    title: '质量分',
    dataIndex: 'qualityScore',
    sorter: true,
  }, {
    title: '热度',
    dataIndex: 'hotScore',
    sorter: true,
  }, {
    title: '创建人',
    dataIndex: 'cUser',
  }, {
    title: '使用状态',
    dataIndex: 'used',
    render: text => (text ? '是' : '否'),
  }, {
    title: '被API调用次数 ',
    dataIndex: 'apiInvokeCount',
    sorter: true,
  }]

  componentWillMount() {
    const {frameChange} = this.props

    frameChange('nav', [
      navListMap.assetMgt,
      {text: '名称待定'},
    ])
    
    store.getList()
  }

  @action handleChange(e) {
    this.searchStr = JSON.stringify(e)
  }

  @action handleTableChange = (pagination, filters, sorter) => {
    store.params.currentPage = pagination.current
    store.params.pageSize = pagination.pageSize
    store.getList()
  }


  // 搜索
  @action handleSearch() {
    const values = JSON.parse(this.searchStr)

    // 筛选条件
    store.params = {
      ...values,
    }
    // 列表
    store.params.currentPage = 1
    store.params.pageSize = 10
    store.getList()
  }

  // 重置
  @action handleReset() {
    if (this.searchForm) this.searchForm.resetFields()
    this.searchStr = '{}' 
    Object.keys(store.params).forEach(key => store.params[key] = '')
    store.params.currentPage = 1
    store.params.pageSize = 10
    store.getList()
  }

  componentWillUnmount() {
    this.handleReset()
  }

  render() {
    const {
      tagInfo: {
        data,
        pagination,
        loading,
      },
    } = store
    return (
      <div className="scene-tags p16">
        <SearchForm 
          ref={form => this.searchForm = form}
          onChange={() => this.handleChange(this.searchForm.getFieldsValue())}
          onSearch={() => this.handleSearch()}
          onReset={() => this.handleReset()}
        />
        <Table 
          className="bgf"
          loading={loading}
          columns={this.columns} 
          dataSource={data.slice()} 
          onChange={this.handleTableChange}
          pagination={{
            pageSize: pagination.pageSize,
            current: pagination.currentPage,
            total: pagination.total,
            showTotal: () => `合计${pagination.total}条记录`,
          }}
        />
      </div>
    )
  }
}
