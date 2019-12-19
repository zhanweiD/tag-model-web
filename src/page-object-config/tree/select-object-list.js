/**
 * @description 对象配置 - 选择对象 - 已配置标签列表
 */
import {Component} from 'react'
import {observer, inject} from 'mobx-react'
import {observable, action} from 'mobx'
import {
  Table, Input, Popconfirm, Tooltip,
} from 'antd'
import {Time} from '../../common/util'
import {usedStatusMap} from '../util'

const {Search} = Input

@inject('bigStore')
@observer
export default class ObjectList extends Component {
  constructor(props) {
    super(props)
    this.store = props.bigStore
  }

  @observable searchKey = undefined

  columns = [
    {
      title: '对象名称',
      dataIndex: 'name',
      key: 'miao',
    },
    {
      title: '对象描述',
      dataIndex: 'descr',
      key: 'descr',
    },
    {
      title: '对象类目',
      dataIndex: 'objCatName',
      key: 'objCatName',
    },
    {
      title: '添加人',
      dataIndex: 'creator',
      key: 'creator',
    },
    {
      title: '添加时间',
      dataIndex: 'createTime',
      key: 'createTime',
      render: text => <Time timestamp={text} />,
    },
    {
      title: '使用状态',
      dataIndex: 'isUsed',
      key: 'isUsed',
      render: v => usedStatusMap(+v),
    },
    {
      title: '数据表数',
      dataIndex: 'tableCount',
      key: 'tableCount',
    },
    {
      title: '标签数',
      dataIndex: 'tagCount',
      key: 'tagCount',
    },
    {
      key: 'action',
      title: '操作',
      width: 100,
      dataIndex: 'action',
      render: (text, record) => {
        if (record.isUsed) {
          return <Tooltip title="使用中的对象, 不可移除"><span className="disabled">移除</span></Tooltip>
        }
        return (
          <Popconfirm placement="topRight" title="确定移除？" onConfirm={() => this.remove(record)}>
            <a href>移除</a>
          </Popconfirm>
        )
      },      
    },
  ]

  @action.bound onChange(e) {
    const {onSearch} = this.props
    const {value} = e.target

    this.searchKey = value
    onSearch(value)
  }

  @action.bound remove(data) {
    const {remove} = this.props
    remove(data)
  }

  getFilterData() {
    const {filteredData, searchData} = this.props

    if (this.searchKey) {
      return searchData.slice()
    } 
    return filteredData.slice()
  }

  //  // 存储搜索数据
  //  beforeFetch = type => {
  //    this.setState({
  //      searchKey: undefined,
  //      type,
  //    }, () => this.getTreeFetch())
  //  }

  render() {
    const {selectedObjLoading: loading} = this.store
    const listConfig = {
      loading,
      dataSource: this.getFilterData(),
      rowKey: 'id',
      columns: this.columns,
      pagination: false,
    }

    return (
      <div className="FB1 select-object-list">
        <Search
          placeholder="请输入对象关键字"
          onSearch={this.onSearch}
          onChange={this.onChange}
          style={{width: 300}}
          className="mb8"
          // value={searchKey}
        />
        <div className="select-object-table">
          <Table {...listConfig} />
        </div>
      </div>
    )
  }
}
