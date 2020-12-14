import {Component} from 'react'
import {observer, inject} from 'mobx-react'
import {
  observable, action, toJS, computed,
} from 'mobx'
import _ from 'lodash'
import {Table, Input, Tooltip, Popconfirm} from 'antd'
import {SearchOutlined} from '@ant-design/icons'
import {getDataTypeName} from '../../../../common/util'


@inject('bigStore')
@observer
export default class CateTree extends Component {
  columns = [
    {
      title: '标签名称',
      dataIndex: 'name',
    }, {
      title: '唯一标识',
      dataIndex: 'enName',
    }, {
      title: '数据类型',
      dataIndex: 'valueType',
      render: text => getDataTypeName(text),
    }, {
      title: '是否枚举',
      dataIndex: 'isEnum',
      render: text => (text === 1 ? '是' : '否'),
    }, {
      title: '枚举显示值',
      dataIndex: 'enumValue',
    }, {
      title: '业务逻辑',
      dataIndex: 'descr',
    }, {
      title: '操作',
      dataIndex: 'action',
      render: (text, record) => {
        if (record.isUsed) {
          return <Tooltip title="使用中的对象, 不可移除"><span className="disabled">移除</span></Tooltip>
        }
        return (
          <Popconfirm placement="topRight" title="确定移除？" onConfirm={() => this.removeTag(record.id)}>
            <a href>移除</a>
          </Popconfirm>
        )
      },  
    },
  ]

  @observable inputValue

  @action removeTag(id) {
    const {bigStore} = this.props
    bigStore.checkedKeys = bigStore.checkedKeys.filter(e => e !== String(id))
    bigStore.tagDetaiList = bigStore.tagDetaiList.filter(e => e.id !== id)
  }

  @action.bound onChange(e) {
    this.inputValue = e.target.value
  }

  @computed get filterData() {
    const {bigStore: {tagDetaiList}} = this.props

    return this.inputValue ? tagDetaiList.filter(item => item.name.indexOf(this.inputValue) > -1) : tagDetaiList
  }

  render() {
    const {bigStore: {tagDetaiList, tagDetailTableLoading}} = this.props

    return (
      <div className="FB1 ml16">
        <Input
          allowClear
          value={this.inputValue}
          onChange={this.onChange}
          onSearch={this.onSearch}
          className="mb8"
          size="small"
          placeholder="请输入对象关键字"
          style={{width: 300}}
          suffix={<SearchOutlined />}
        />
        <div className="select-object-table">
          <Table
            loading={tagDetailTableLoading}
            columns={this.columns}
            dataSource={this.filterData.slice()}
            pagination={false}
          />
        </div>
      </div>
    )
  }
}
