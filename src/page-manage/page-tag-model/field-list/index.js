/**
 * @description 对象配置 - 字段列表
 */
import {Component} from 'react'
import {action, toJS} from 'mobx'
import {observer, inject} from 'mobx-react'
import {ListContent, QuestionTooltip, Authority} from '../../../component'
import {tagStatusMap, configStatusMap} from '../util'
import DrawerTagConfig from './drawer'
import seach from './search'

import store from './store'
import './index.styl'

@inject('bigStore')
@observer
export default class FieldList extends Component {
  constructor(props) {
    super(props)
    this.bigStore = props.bigStore
    store.projectId = props.bigStore.projectId
    store.objId = props.bigStore.objId
    store.typeCode = props.bigStore.typeCode
    store.objType = props.objType

    store.dataSheetList = []
  }

  componentWillMount() {
    store.getDataSource()
    this.initData()
    store.checkKeyWord()
  }

  componentWillReceiveProps(next) {
    const {objId} = this.props
    
    if (+objId !== +next.objId) {
      store.objId = next.objId

      store.getDataSource() // 请求数据源
      this.initData()
      // // 请求列表数据
      // store.getList({
      //   currentPage: 1,
      //   objId: next.objId,
      // })
      // // 重置搜索框
      // if (this.table) {
      //   this.table.handleReset()
      // }
    }
  }

  // 初始化数据，一般情况不需要，此项目存在项目空间中项目的切换，全局性更新，较为特殊
  @action initData() {
    store.list.clear()
    store.searchParams = {}
    store.pagination = {
      pageSize: 10,
      currentPage: 1,
    }
  }

  columns = [
    {
      key: 'dataFieldName',
      title: '字段名称',
      dataIndex: 'dataFieldName',
      fixed: 'left',
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
      width: 300,
    }, {
      key: 'isConfigured',
      title: '配置状态',
      dataIndex: 'isConfigured',
      render: v => configStatusMap(+v),
    }, {
      key: 'status',
      title: (
        <span>
          标签状态
          <QuestionTooltip tip="字段绑定的标签是否发布" />
        </span>
      ),
      dataIndex: 'status',
      render: v => tagStatusMap(+v),
    }, {
      key: 'name',
      title: '标签名称',
      dataIndex: 'name',
      render: text => text || '-',
    }, {
      key: 'action',
      title: '操作',
      width: 160,
      dataIndex: 'action',
      fixed: 'right',
      render: (text, record) => (
        <div className="FBH FBAC">
          <Authority
            authCode="tag_model:config_field_tag[c]"
          >
            {
              record.status === 2 
                ? <span className="disabled">生成标签</span> 
                : <a href onClick={() => this.openModal(record)}>生成标签</a>
            }

            {
              record.status === 1 ? <a href className="ml16" onClick={() => store.revokeConfig(record.tagId)}>取消配置</a> : null
            }
            {
              record.status === 2 ? <a disabled href className="ml16">取消配置</a> : null
            }
          </Authority>
        </div>
      ),
    },
  ]
  columns1 = [
    {
      key: 'dataFieldName',
      title: '字段名称',
      dataIndex: 'dataFieldName',
      fixed: 'left',
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
      width: 300,
    }, {
      key: 'isConfigured',
      title: '配置状态',
      dataIndex: 'isConfigured',
      render: v => configStatusMap(+v),
    }, {
      key: 'status',
      title: (
        <span>
          标签状态
          <QuestionTooltip tip="字段绑定的标签是否发布" />
        </span>
      ),
      dataIndex: 'status',
      render: v => tagStatusMap(+v),
    }, {
      key: 'name',
      title: '标签名称',
      dataIndex: 'name',
      render: text => text || '-',
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
      store.getList({
        objId: store.objId,
      })
    })
  }

  @action openModal(data) {
    store.modalInfo.visible = true
    store.isEnum = data.isEnum
    store.modalInfo.detail = data
    store.getTagTree()
    store.getTagTypeList(data)
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
      objId, projectId, dataSourceList, dataSheetList, tableName, objType,
    } = store

    const searchParams = {
      tableName,
      dataSourceList,
      dataSheetList,
      selectDataSource: this.selectDataSource,
    }
    const listConfig = {
      columns: objType === 0 ? this.columns1 : this.columns,
      searchParams: seach(searchParams),
      initParams: {objId, projectId},
      scroll: {x: 1300},
      // paginationConfig: {
      //   hideOnSinglePage: true, // 只有一页时隐藏
      // }, 
      store, // 必填属性
    }

    return (
      <div className="filed-list">
        <ListContent {...listConfig} key={objId} />
        <DrawerTagConfig store={store} />
      </div>
    )
  }
}
