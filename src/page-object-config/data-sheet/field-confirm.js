import {Component} from 'react'
import {action, toJS} from 'mobx'
import {observer, inject} from 'mobx-react'
import {Button, Table, Popconfirm} from 'antd'
import {relStatusMap, configStatusMap, tagStatusMap} from '../util'

@inject('bigStore')
@observer
export default class FieldConfirm extends Component {
  constructor(props) {
    super(props)
    this.bigStore = props.bigStore
    this.store = props.store
  }

  columnsAdd = [
    {
      key: 'field',
      title: '字段',
      dataIndex: 'field',
    }, {
      key: 'field',
      title: '字段名称',
      dataIndex: 'field',
    }, {
      key: 'type',
      title: '字段类型',
      dataIndex: 'type',
    }, {
      key: 'action',
      title: '操作',
      dataIndex: 'action',
      render: (text, record) => (
        <Popconfirm placement="topRight" title="确定移除？" onConfirm={() => this.removeField(record.field)}>
          <a href>移除</a>
        </Popconfirm>
      ),
    },
  ]

  columnsEdit = [
    {
      key: 'dataFieldName',
      title: '字段',
      dataIndex: 'dataFieldName',
    }, {
      key: 'dataFieldType',
      title: '字段类型',
      dataIndex: 'dataFieldType',
    }, {
      key: 'id',
      title: '关联状态',
      dataIndex: 'id',
      render: v => relStatusMap(v ? 1 : 0),
    }, {
      key: 'isConfigured',
      title: '标签配置状态',
      dataIndex: 'isConfigured',
      render: v => configStatusMap(+v),
    }, {
      key: 'status',
      title: '标签状态',
      dataIndex: 'status',
      render: v => tagStatusMap(+v),
    }, {
      key: 'action',
      title: '操作',
      dataIndex: 'action',
      render: (text, record) => (
        record.status === 2 ? <span className="disabled">移除</span> : (
          <Popconfirm placement="topRight" title="确定移除？" onConfirm={() => this.removeFieldEdit(record.dataFieldName)}>
            <a href>移除</a>
          </Popconfirm>
        )
      ),
    },
  ]

  @action removeField(field) {
    const {selectedRows, selectedRowKeys} = this.store
    this.store.selectedRows = selectedRows.filter(d => d.field !== field)
    this.store.selectedRowKeys = selectedRowKeys.filter(d => d !== field)
  }

  @action removeFieldEdit(field) {
    const {selectedRows, selectedRowKeys} = this.store
    this.store.selectedRows = selectedRows.filter(d => d.dataFieldName !== field)
    this.store.selectedRowKeys = selectedRowKeys.filter(d => d !== field)
  }

  @action.bound submit() {
    const t = this
    const {typeCode, drawerType} = this.store

    if (drawerType === 'add') {
      if (+typeCode === 4) {
        this.store.saveEntityField(() => {
          t.bigStore.getObjDetail()
          t.bigStore.getObjCard()
          t.store.getList({
            objId: t.store.objId,
            currentPage: 1,
          })
        })
      } else {
        this.store.saveRelField(() => {
          t.bigStore.getObjDetail()
          t.bigStore.getObjCard()
          t.store.getList({
            objId: t.store.objId,
            currentPage: 1,
          })
        })
      }
    }

    if (drawerType === 'edit') {
      if (+typeCode === 4) {
        this.store.updateEntityField(() => {
          t.bigStore.getObjDetail()
          t.bigStore.getObjCard()
          t.store.getList({
            objId: t.store.objId,
            currentPage: 1,
          })
        })
      } else {
        this.store.updateRelField(() => {
          t.bigStore.getObjDetail()
          t.bigStore.getObjCard()
          t.store.getList({
            objId: t.store.objId,
            currentPage: 1,
          })
        })
      }
    }
  }

  render() {
    const {show} = this.props
    const {
      selectedRows, confirmLoading, drawerType, fieldTableList,
    } = this.store

    const listConfig = {
      columns: drawerType === 'edit' ? this.columnsEdit : this.columnsAdd,
      dataSource: selectedRows.slice(),
      pagination: false,
    }
    return (
      <div style={{display: show ? 'block' : 'none'}}>
        <div className="mb8 fs12">
          <span style={{color: 'rgba(0, 0, 0, .45)'}}>已选字段/字段总数 ：</span>
          <span style={{color: '#0078FF'}}>
            {selectedRows.length}
              /
          </span>
          <span style={{color: 'rgba(0, 0, 0, .45)'}}>{fieldTableList.length}</span>
        </div>
        <Table {...listConfig} />
        <div className="bottom-button">
          <Button className="mr8" onClick={this.store.lastStep}>上一步</Button>
          <Button 
            type="primary"
            className="mr8"
            disabled={!selectedRows.length} 
            onClick={this.submit}
            loading={confirmLoading}
          >
            确认
          </Button>
        </div>
      </div>
    )
  }
}
