/**
 * @description 对象配置 - 数据表
 */
import {Component, Fragment} from 'react'
import {action, observable} from 'mobx'
import {observer, inject, Provider} from 'mobx-react'
import {
  Drawer, Steps, Popconfirm, Button,
} from 'antd'
import {ListContent, QuestionTooltip, AuthBox} from '../../component'
import FieldChooseAdd from './field-choose-add'
import FieldChooseEdit from './field-choose-edit'
import FieldConfirm from './field-confirm'
import FieldResult from './field-result'
import ConfigField from './config-field'

import store from './store'
import './index.styl'

const {Step} = Steps

@inject('bigStore')
@observer
export default class DataSheet extends Component {
  constructor(props) {
    super(props)
    this.bigStore = props.bigStore
    store.projectId = props.bigStore.projectId
    store.objId = props.bigStore.objId
    store.typeCode = props.bigStore.typeCode
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
      title: '已配置/已关联',
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
      width: 220,
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
            <span className="table-action-line" />
            <a href onClick={() => this.editRelField(record)}>编辑关联字段</a>
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

    if (objId !== next.objId) {
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

  @action.bound openDrawer(type) {
    const {openDrawer} = store
    store.drawerType = type
    if (type === 'add') {
      store.getDataSource()
    }
    openDrawer()
  }
  
  @action.bound editRelField(data) {
    store.editSelectedItem = data
    this.openDrawer('edit')
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
      drawerVisible,
      currentStep,
      closeDrawer,
      objId,
      projectId,
      drawerType,
      typeCode,
      list,
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
       
            onClick={() => this.openDrawer('add')} 
            disabled={list.length === 1}
          >
        添加关联表
          </Button>
          <QuestionTooltip tip="最多只能添加1张表" />
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
            onClick={() => this.openDrawer('add')} 
            disabled={list.length === 5}
          >
        添加关联表
          </Button>
          <QuestionTooltip tip="最多只能添加5张表" />
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

    const drawerConfig = {
      width: 560,
      title: drawerType === 'edit' ? '编辑关联字段' : '添加关联表',
      maskClosable: false,
      destroyOnClose: true,
      visible: drawerVisible,
      onClose: () => closeDrawer(),
    }

    return (
      <Provider dataSheetStore={store}>
        <div>
          <ListContent {...listConfig} />
          {
            drawerVisible && (
              <Drawer {...drawerConfig}>
                <div className="data-sheet-drawer">
                  <Steps current={currentStep} size="small" className="mb32">
                    <Step title="选择字段" />
                    <Step title="确认字段" />
                    <Step title="添加成功" />
                  </Steps>
                  <FieldChooseAdd store={store} show={currentStep === 0 && drawerType === 'add'} />
                  <FieldChooseEdit store={store} show={currentStep === 0 && drawerType === 'edit'} />
                  <FieldConfirm store={store} show={currentStep === 1} />
                  <FieldResult store={store} show={currentStep === 2} />
                </div>
              </Drawer>
            )
          }
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
