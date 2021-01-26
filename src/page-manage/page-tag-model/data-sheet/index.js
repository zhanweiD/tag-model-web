import intl from 'react-intl-universal'
/**
 * @description 对象配置 - 数据表
 */
import {Component} from 'react'
import {action, observable, toJS} from 'mobx'
import {observer, inject, Provider} from 'mobx-react'
import {Popconfirm, Button} from 'antd'
import {ListContent, Authority, OmitTooltip} from '../../../component'

import ConfigField from './config-field'
import ModalAddTable from './modal-add-table'
import DrawerDatasheet from './drawer-datasheet'
import EditWhereCondition from './editWhereCondition'

import store from './store'
import './index.styl'

@inject('bigStore')
@observer
class DataSheet extends Component {
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
      title: intl
        .get('ide.src.page-manage.page-tag-model.data-sheet.index.3fht0cqc4ht')
        .d('数据表名称'),
      key: 'dataTableName',
      dataIndex: 'dataTableName',
      fixed: 'left',
      render: (text, record) => (
        <div>
          <a href onClick={() => this.openDrawerDatasheet(record)}>
            <OmitTooltip maxWidth={250} text={text} />
          </a>
        </div>
      ),
    },

    {
      title: intl
        .get('ide.src.business-component.tag-relate.dag-box.9mzk7452ggp')
        .d('数据源'),
      key: 'dataStorageName',
      dataIndex: 'dataStorageName',
      render: v => <OmitTooltip maxWidth={250} text={v} />,
    },
    {
      title: intl
        .get('ide.src.page-config.workspace-config.main.1b0l5lpgghm')
        .d('数据源类型'),
      key: 'storageTypeName',
      dataIndex: 'storageTypeName',
      width: 150,
    },
    {
      title: intl
        .get('ide.src.page-manage.page-tag-model.data-sheet.index.ezv6dabtsu')
        .d('已配置/字段数'),
      key: 'configuredField',
      dataIndex: 'configuredField',
      width: 150,
      render: (text, record) => (
        <div>{`${text}/${record.associatedField}`}</div>
      ),
    },

    {
      title: intl
        .get('ide.src.page-manage.page-tag-model.data-sheet.index.t92gg012q38')
        .d('已有标签被使用'),
      key: 'isUsed',
      dataIndex: 'isUsed',
      width: 120,
      render: text => (
        <div>
          {text
            ? intl.get('ide.src.component.form-component.03xp8ux32s3a').d('是')
            : intl.get('ide.src.component.form-component.h7p1pcijouf').d('否')}
        </div>
      ),
    },
    {
      key: 'action',
      title: intl
        .get('ide.src.page-common.approval.approved.main.1tcpwa6mu1')
        .d('操作'),
      dataIndex: 'action',
      width: 250,
      fixed: 'right',
      render: (text, record) => (
        <div>
          <Authority authCode="tag_model:update_table[cud]">
            {record.isUsed || record.status === 1 || record.configuredField ? (
              <span className="disabled">
                {intl
                  .get('ide.src.page-config.workspace-config.main.i53j7u2d9hs')
                  .d('移除')}
              </span>
            ) : (
              <Popconfirm
                placement="topRight"
                title={intl
                  .get(
                    'ide.src.page-manage.page-tag-model.data-sheet.index.ljiw9occ1j'
                  )
                  .d('你确定要移除该数据表吗？')}
                onConfirm={() => this.removeList(record)}
              >
                <a href>
                  {intl
                    .get(
                      'ide.src.page-config.workspace-config.main.i53j7u2d9hs'
                    )
                    .d('移除')}
                </a>
              </Popconfirm>
            )}
          </Authority>
          <Authority authCode="tag_model:config_table_tag[c]">
            <a
              href
              className="ml16"
              onClick={() => this.openWhereCondition(record)}
            >
              {intl
                .get('ide.src.component.label-item.label-item.slnqvyqvv7')
                .d('编辑')}
            </a>
          </Authority>
          {this.bigStore.objDetail && this.bigStore.objDetail.type !== 0 ? (
            <Authority authCode="tag_model:config_table_tag[c]">
              <a
                href
                className="ml16"
                onClick={() => this.openTagConfig(record)}
              >
                {intl
                  .get(
                    'ide.src.page-manage.page-tag-model.data-sheet.index.ovoicz21id'
                  )
                  .d('配置标签')}
              </a>
            </Authority>
          ) : null}
        </div>
      ),
    },
  ]

  // 简单关系
  columns1 = [
    {
      title: intl
        .get('ide.src.page-manage.page-tag-model.data-sheet.index.3fht0cqc4ht')
        .d('数据表名称'),
      key: 'dataTableName',
      dataIndex: 'dataTableName',
      fixed: 'left',
      render: (text, record) => (
        <div>
          <a href onClick={() => this.openDrawerDatasheet(record)}>
            <OmitTooltip maxWidth={250} text={text} />
          </a>
        </div>
      ),
    },

    {
      title: intl
        .get('ide.src.business-component.tag-relate.dag-box.9mzk7452ggp')
        .d('数据源'),
      key: 'dataStorageName',
      dataIndex: 'dataStorageName',
      render: v => <OmitTooltip maxWidth={250} text={v} />,
    },
    {
      title: intl
        .get('ide.src.page-config.workspace-config.main.1b0l5lpgghm')
        .d('数据源类型'),
      key: 'storageTypeName',
      dataIndex: 'storageTypeName',
      width: 150,
    },
    {
      key: 'action',
      title: intl
        .get('ide.src.page-common.approval.approved.main.1tcpwa6mu1')
        .d('操作'),
      dataIndex: 'action',
      width: 150,
      fixed: 'right',
      render: (text, record) => (
        <div>
          <Authority authCode="tag_model:update_table[cud]">
            {record.isUsed || record.status === 1 || record.configuredField ? (
              <span className="disabled">
                {intl
                  .get('ide.src.page-config.workspace-config.main.i53j7u2d9hs')
                  .d('移除')}
              </span>
            ) : (
              <Popconfirm
                placement="topRight"
                title={intl
                  .get(
                    'ide.src.page-manage.page-tag-model.data-sheet.index.ljiw9occ1j'
                  )
                  .d('你确定要移除该数据表吗？')}
                onConfirm={() => this.removeList(record)}
              >
                <a href>
                  {intl
                    .get(
                      'ide.src.page-config.workspace-config.main.i53j7u2d9hs'
                    )
                    .d('移除')}
                </a>
              </Popconfirm>
            )}
          </Authority>
          <Authority authCode="tag_model:config_table_tag[c]">
            <a
              href
              className="ml16"
              onClick={() => this.openWhereCondition(record)}
            >
              {intl
                .get('ide.src.component.label-item.label-item.slnqvyqvv7')
                .d('编辑')}
            </a>
          </Authority>
          {this.bigStore.objDetail && this.bigStore.objDetail.type !== 0 ? (
            <Authority authCode="tag_model:config_table_tag[c]">
              <a
                href
                className="ml16"
                onClick={() => this.openTagConfig(record)}
              >
                {intl
                  .get(
                    'ide.src.page-manage.page-tag-model.data-sheet.index.ovoicz21id'
                  )
                  .d('配置标签')}
              </a>
            </Authority>
          ) : null}
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

  @action.bound openWhereCondition(data) {
    store.editSelectDetail = data
    store.tableName = data.dataTableName
    store.storageId = data.dataStorageId
    const {typeCode, objDetail} = this.bigStore
    if (+typeCode === 4) {
      store.bothTypeCode = 2 // 实体
      store.modelEditModal = true
    } else if (typeof objDetail.type === 'undefined') {
      this.bigStore.getObjDetail(res => {
        store.bothTypeCode = res.type
        store.modelEditModal = true
      }) // 复杂关系 vs 简单关系
    } else {
      store.bothTypeCode = objDetail.type
      store.modelEditModal = true
    }
    store.getDataSource()
    store.getDataSheetDetail()
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
        <Button type="primary" onClick={() => this.openModal()}>
          {intl
            .get(
              'ide.src.page-manage.page-tag-model.data-sheet.index.76fxoibbzic'
            )
            .d('添加数据表')}
        </Button>
      </Authority>
    )

    const listConfig = {
      columns: relationType ? this.columns : this.columns1,
      // columns: this.columns,
      scroll: {x: 1000},
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
          <EditWhereCondition store={store} />
          {this.tagConfigVisible && (
            <ConfigField
              visible={this.tagConfigVisible}
              onClose={this.closeTagConfig}
              onSuccess={this.tagConfigSuccess}
            />
          )}

          {this.drawerDatasheetVisible && (
            <DrawerDatasheet
              store={store}
              visible={this.drawerDatasheetVisible}
              onClose={this.closedrawerDatasheet}
            />
          )}
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
export default DataSheet
