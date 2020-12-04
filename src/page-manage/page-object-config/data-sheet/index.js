/**
 * @description 对象配置 - 数据表
 */
import {Component} from 'react'
import {action, observable, toJS} from 'mobx'
import {observer, inject, Provider} from 'mobx-react'
import {
  Popconfirm, Button,
} from 'antd'
import {ListContent, Authority, OmitTooltip} from '../../../component'

import ConfigField from './config-field'
import ModalAddTable from './modal-add-table'
import DrawerDatasheet from './drawer-datasheet'

import store from './store'
import './index.styl'

@inject('bigStore')
@observer
export default class DataSheet extends Component {
  constructor(props) {
    super(props)
    const {bigStore} = props
    this.bigStore = bigStore
    store.projectId = bigStore.projectId
    store.objId = bigStore.objId
    store.typeCode = bigStore.typeCode
    store.relationType = bigStore.objDetail.type
  }

  @observable tagConfigVisible = false
  @observable drawerDatasheetVisible = false

  columns = [
    {
      title: '数据表名称',
      key: 'dataTableName',
      dataIndex: 'dataTableName',
      width: 200,
      fixed: 'left',
      render: (text, record) => (
        <div>
          <a href onClick={() => this.openDrawerDatasheet(record)}>{text}</a>
        </div>
      ),
    }, {
      title: '数据源',
      key: 'dataStorageName',
      dataIndex: 'dataStorageName',
      width: 250,
      // render: text => <OmitTooltip maxWidth={250} text={text} />,
    }, {
      title: '数据源类型',
      key: 'storageTypeName',
      dataIndex: 'storageTypeName',
      width: 150,
    }, {
      title: '已配置/字段数',
      key: 'configuredField',
      dataIndex: 'configuredField',
      width: 150,
      render: (text, record) => (
        <div>{`${text}/${record.associatedField}`}</div>
      ),
    }, {
      title: '已有标签被使用',
      key: 'isUsed',
      dataIndex: 'isUsed',
      width: 100,
      render: text => <div>{text ? '是' : '否'}</div>,
    }, {
      key: 'action',
      title: '操作',
      dataIndex: 'action',
      width: 250,
      fixed: 'right',
      render: (text, record) => (
        <div>
          <Authority authCode="tag_model:update_table[cud]">
            {
              (record.isUsed || record.status === 1 || record.configuredField) ? <span className="disabled">移除</span> : (
                <Popconfirm placement="topRight" title="你确定要移除该数据表吗？" onConfirm={() => this.removeList(record)}>
                  <a href>移除</a>
                </Popconfirm>
              )
            }
          </Authority>
          {
            this.bigStore.objDetail && this.bigStore.objDetail.type !== 0 ? (
              <Authority authCode="tag_model:config_table_tag[c]">
                <a href className="ml16" onClick={() => this.openTagConfig(record)}>生成标签</a>
              </Authority>
            ) : null
          }
        
        </div>
      ),
    },
  ]

  // 简单关系
  columns1 = [
    {
      title: '数据表名称',
      key: 'dataTableName',
      dataIndex: 'dataTableName',
      render: (text, record) => (
        <div>
          <a href onClick={() => this.openDrawerDatasheet(record)}>{text}</a>
        </div>
      ),
    }, {
      title: '数据源',
      key: 'dataStorageName',
      dataIndex: 'dataStorageName',
      width: 300,
      // render: text => <OmitTooltip maxWidth={250} text={text} />,
    }, {
      title: '数据源类型',
      key: 'storageTypeName',
      dataIndex: 'storageTypeName',
      width: 200,
    }, {
      key: 'action',
      title: '操作',
      dataIndex: 'action',
      width: 150,
      fixed: 'right',
      render: (text, record) => (
        <div>
          <Authority authCode="tag_model:update_table[cud]">
            {
              (record.isUsed || record.status === 1 || record.configuredField) ? <span className="disabled">移除</span> : (
                <Popconfirm placement="topRight" title="你确定要移除该数据表吗？" onConfirm={() => this.removeList(record)}>
                  <a href>移除</a>
                </Popconfirm>
              )
            }
          </Authority>
          {
            this.bigStore.objDetail && this.bigStore.objDetail.type !== 0 ? (
              <Authority authCode="tag_model:config_table_tag[c]">
                <a href className="ml16" onClick={() => this.openTagConfig(record)}>生成标签</a>
              </Authority>
            ) : null
          }
        </div>
      ),
    },
  ]

  componentWillMount() {
    this.initData()
  }

  componentWillReceiveProps(next) {
    const {objId} = this.props
    if (+objId !== +next.objId) {
      store.objId = +next.objId
      // 重置列表默认参数
      store.initParams.objId = +next.objId
      
      store.getList({
        currentPage: 1,
        objId: +next.objId,
      })
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

  @action removeList(data) {
    const t = this
    const params = {
      storageId: data.dataStorageId,
      tableName: data.dataTableName,
    }
    store.removeList(params, () => {
      t.bigStore.getObjDetail()
      t.bigStore.getObjCard()
      store.getList({
        objId: store.objId,
      })
    })
  }

  @action.bound openModal() {
    const {typeCode, objDetail} = this.bigStore

    if (+typeCode === 4) {
      store.bothTypeCode = 2 // 实体
      store.modalVisible = true
    } else if (typeof objDetail.type === 'undefined') {
      this.bigStore.getObjDetail(res => {
        store.bothTypeCode = res.type
        store.modalVisible = true
      }) // 复杂关系 vs 简单关系
    } else {
      store.bothTypeCode = objDetail.type 
      store.modalVisible = true
    }

    store.getDataSource()
  }

  @action.bound openTagConfig(data) {
    store.editSelectedItem = data
    this.tagConfigVisible = true
  }

  @action.bound openDrawerDatasheet(data) {
    store.editSelectedItem = data // 对象id
    store.tableName = toJS(data.dataTableName)
    store.storageId = toJS(data.dataStorageId)
    store.storageName = toJS(data.dataStorageName)
    // store.majorKeyField = toJS(data.mappingKey)
    this.drawerDatasheetVisible = true
    console.log(data, 'data')
  }

  @action.bound closeTagConfig() {
    this.tagConfigVisible = false
  }

  @action.bound closedrawerDatasheet() {
    this.drawerDatasheetVisible = false
  }

  @action.bound tagConfigSuccess() {
    store.getList({
      objId: store.objId,
    })
  }

  render() {
    const {
      objId,
      projectId,
      relationType,
      storageId,
      drawerDatasheetVisible,
      // typeCode,
    } = store
    // typeCode = 3 关系对象；typeCode = 4 实体对象；
    const buttons = (
      <Authority authCode="tag_model:update_table[cud]">
        <Button 
          type="primary" 
          onClick={() => this.openModal()}
        >
      添加数据表
        </Button>
      </Authority>
    )

    const listConfig = {
      columns: relationType ? this.columns : this.columns1,
      // columns: this.columns,
      initParams: {objId, projectId},
      buttons: [buttons],
      paginationConfig: {
        hideOnSinglePage: true, // 只有一页时隐藏
      }, 
      store, // 必填属性
    }

    // const drawerDatasheetConfig = {
    //   visible: this.drawerDatasheetVisible,
    //   onclose: this.closedrawerDatasheet(),
    //   objId: drawerDatasheetObjId,
    //   store,
    // }

    return (
      <Provider dataSheetStore={store}>
        <div>
          <ListContent {...listConfig} />
          <ModalAddTable store={store} />
          {
            this.tagConfigVisible && (
              <ConfigField 
                visible={this.tagConfigVisible} 
                onClose={this.closeTagConfig}
                onSuccess={this.tagConfigSuccess}
              />
            )
          }
          {
            this.drawerDatasheetVisible && (
              <DrawerDatasheet 
                store={store}
                visible={this.drawerDatasheetVisible}
                onClose={this.closedrawerDatasheet}
              />
            )
          } 
        </div>
      </Provider>
    )
  }
}

// export default props => {
//   const ctx = OnerFrame.useFrame()
//   useEffect(() => {
//     ctx.useProject(true, null, {visible: false})
//   }, [])
//   const projectId = ctx.useProjectId()
//   return (
//     <DataSheet projectId={projectId} {...props} />
//   )
// }
