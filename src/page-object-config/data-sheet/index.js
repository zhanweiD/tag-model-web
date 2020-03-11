/**
 * @description 对象配置 - 数据表
 */
import {Component, Fragment} from 'react'
import {action, observable, toJS} from 'mobx'
import {observer, inject, Provider} from 'mobx-react'
import {
  Popconfirm, Button,
} from 'antd'
import {ListContent, AuthBox} from '../../component'

import ConfigField from './config-field'
import ModalAddTable from './modal-add-table'

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
  }

  @observable tagConfigVisible = false

  columns = [
    {
      title: '数据表名称',
      key: 'dataTableName',
      dataIndex: 'dataTableName',
    }, {
      title: '数据源',
      key: 'dataStorageName',
      dataIndex: 'dataStorageName',
    }, {
      title: '数据源类型',
      key: 'storageTypeName',
      dataIndex: 'storageTypeName',
    }, {
      title: '已配置/字段数',
      key: 'configuredField',
      dataIndex: 'configuredField',
      render: (text, record) => (
        <div>{`${text}/${record.associatedField}`}</div>
      ),
    }, {
      title: '已有标签被使用',
      key: 'isUsed',
      dataIndex: 'isUsed',
      render: text => <div>{text ? '是' : '否'}</div>,
    }, {
      key: 'action',
      title: '操作',
      dataIndex: 'action',
      width: 150,
      render: (text, record) => (
        <div>
          <AuthBox
            code="asset_tag_project_obj_table_field"
            myFunctionCodes={this.bigStore.functionCodes}
            isButton={false}
          >
            {
              (record.isUsed || record.status === 2) ? <span className="disabled">移除</span> : (
                <Popconfirm placement="topRight" title="你确定要移除该数据表吗？" onConfirm={() => this.removeList(record)}>
                  <a href>移除</a>
                </Popconfirm>
              )
            }
          </AuthBox>
          <AuthBox
            code="asset_tag_project_field_tag"
            myFunctionCodes={this.bigStore.functionCodes}
            isButton={false}
          >
            <span className="table-action-line" />
            <a href onClick={() => this.openTagConfig(record)}>标签配置</a>
          </AuthBox>
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
      store.objId = next.objId
      // 重置列表默认参数
      store.initParams.objId = next.objId
      
      store.getList({
        currentPage: 1,
        objId: next.objId,
      })
    }
  }

  // 初始化数据，一般情况不需要，此项目存在项目空间中项目的切换，全局性更新，较为特殊
  @action initData() {
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

  @action.bound closeTagConfig() {
    this.tagConfigVisible = false
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
      typeCode,
    } = store

    // typeCode = 3 关系对象；typeCode = 4 实体对象；
    const buttons = +typeCode === 3 ? (
      <Fragment>
        <AuthBox
          code="asset_tag_project_obj_table_field" 
          myFunctionCodes={this.bigStore.functionCodes}
          isButton={false}
        >
          <Button 
            type="primary" 
       
            onClick={() => this.openModal()} 
          >
            添加数据表
          </Button>
        </AuthBox>
       
      </Fragment>
    ) : (
      <Fragment>
        <AuthBox
          code="asset_tag_project_obj_table_field" 
          myFunctionCodes={this.bigStore.functionCodes}
          isButton={false}
        >
          <Button 
            type="primary" 
            onClick={() => this.openModal()} 
          >
            添加数据表
          </Button>
        </AuthBox>
      </Fragment>
    )

    const listConfig = {
      columns: this.columns,
      initParams: {objId, projectId},
      buttons: [buttons],
      paginationConfig: {
        hideOnSinglePage: true, // 只有一页时隐藏
      }, 
      store, // 必填属性
    }

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
        </div>
      </Provider>
    )
  }
}
