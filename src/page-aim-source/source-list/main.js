import {Component} from 'react'
import {action} from 'mobx'
import {Button, Popconfirm} from 'antd'
import {ListContent} from '../../component'
import {Time} from '../../common/util'

import seach from './search'

import store from './store'

export default class SourceList extends Component {
  columns = [{
    title: '目的源名称',
    dataIndex: 'name',
  }, {
    title: '对象',
    dataIndex: 'name1',
  }, {
    title: '目的数据源',
    dataIndex: 'name1',
  }, {
    title: '数据源类型',
    dataIndex: 'name1',
  }, {
    title: '已映射/字段数',
    dataIndex: 'name1',
  }, {
    title: '已被使用',
    dataIndex: 'name1',
  }, {
    title: '创建时间',
    dataIndex: 'name1',
    render: text => <Time timestamp={text} />,
  }, {
    title: '操作',
    dataIndex: 'action',
    width: 120,
    render: (text, record) => (
      <div>
        <a href>标签映射</a>
        <span className="table-action-line" />
        <Popconfirm placement="topRight" title="你确定要删除该目的源吗？" onConfirm={() => this.delItem(record.id)}>
          <a href>删除</a>
        </Popconfirm>
      </div>
    ),
  }]

  /**
   * @description 打开弹窗
   * @param type 弹窗类型 编辑 / 添加(edit / add)
   */
  @action openModal = (type, data = {}) => {
    // store.detail = data
    // store.visible = true
    // store.modalType = type
    // store.getDataSource()
    // if (type === 'edit') {
    //   store.getEnginesSource(data.dataStorageId)
    // }
    // store.getGroups()
  }

  // 删除目的源
  delItem = id => {
    store.delList(id)
  }

  render() {
    const listConfig = {
      columns: this.columns,
      searchParams: seach(),
      beforeSearch: this.beforeSearch,
      buttons: [<Button type="primary" onClick={() => this.openModal('add')}>添加目的源</Button>],
      store, // 必填属性
    }

    return (
      <div className="page-aim-source">
        <div className="content-header">目的源管理</div>
        <div className="list-content">
          <ListContent {...listConfig} />
        </div>
      </div>
    )
  }
}
