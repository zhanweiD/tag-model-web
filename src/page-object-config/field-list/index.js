/**
 * @description 对象配置 - 字段列表
 */
import {Component} from 'react'
import {action} from 'mobx'
import {observer, inject} from 'mobx-react'
import {Popconfirm} from 'antd'
import {ListContent} from '../../component'
import {tagStatusMap, configStatusMap} from '../util'
import DrawerTagConfig from './drawer'
import seach from './search'

import store from './store'

@inject('bigStore')
@observer
export default class FieldList extends Component {
  constructor(props) {
    super(props)
    this.bigStore = props.bigStore
    store.projectId = props.bigStore.projectId
    store.objId = props.bigStore.objId
    store.typeCode = props.bigStore.typeCode
  }

  componentWillMount() {
    store.getDataSource()
  }

  componentWillReceiveProps(next) {
    const {objId} = this.props
    store.objId = next.objId

    if (objId !== next.objId) {
      store.getList({
        currentPage: 1,
        objId: next.objId,
      })
    }
  }

  columns = [
    {
      key: 'dataFieldName',
      title: '字段名称',
      dataIndex: 'dataFieldName',
    }, {
      key: 'dataDbName',
      title: '数据源',
      dataIndex: 'dataDbName',
    }, {
      key: 'dataDbTypeName',
      title: '数据源类型',
      dataIndex: 'dataDbTypeName',
    }, {
      key: 'dataTableName',
      title: '数据表名称',
      dataIndex: 'dataTableName',
    }, {
      key: 'isConfigured',
      title: '配置状态',
      dataIndex: 'isConfigured',
      render: v => configStatusMap(+v),
    }, {
      key: 'status',
      title: '标签状态',
      dataIndex: 'status',
      render: v => tagStatusMap(+v),
    }, {
      key: 'name',
      title: '标签名称',
      dataIndex: 'name',
    }, {
      key: 'action',
      title: '操作',
      width: 130,
      dataIndex: 'action',
      render: (text, record) => (
        <div className="FBH FBAC">
          <Popconfirm placement="topRight" title="确定移除？" onConfirm={() => this.removeList(record)}>
            <a href>移除</a>
          </Popconfirm>
          <span className="table-action-line" />
          <a href onClick={() => this.openModal(record)}>标签配置</a>
        </div>
      ),
    },
  ]

  @action removeList(data) {
    const t = this
    const params = {
      storageId: data.dataStorageId,
      tableName: data.dataTableName,
      fieldName: data.dataFieldName,
    }

    store.removeList(params, () => {
      t.bigStore.getObjDetail()
      t.bigStore.getObjCard()
      store.getList()
    })
  }

  @action openModal(data) {
    store.modalInfo.visible = true
    store.isEnum = data.isEnum
    store.modalInfo.detail = data
    store.getTagTree()
  }

  /**
  * @description 选择数据源；请求数据源下数据表
  * @param {*} storageId 数据源id
  */
  @action.bound selectDataSource(storageId) {
    store.tableName = undefined

    if (storageId) {
      store.getDataSheet({
        storageId,
      })
    }
  }

  render() {
    const {
      objId, projectId, dataSourceList, dataSheetList, tableName,
    } = store

    const searchParams = {
      tableName,
      dataSourceList,
      dataSheetList,
      selectDataSource: this.selectDataSource,
    }

    const listConfig = {
      columns: this.columns,
      searchParams: seach(searchParams),
      initParams: {objId, projectId},
      store, // 必填属性
    }

    return (
      <div>
        <ListContent {...listConfig} />
        <DrawerTagConfig store={store} />
      </div>
    )
  }
}
