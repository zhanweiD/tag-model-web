/* eslint-disable react/jsx-closing-tag-location */
import {Component} from 'react'
import {action} from 'mobx'
import {observer, inject} from 'mobx-react'
import {Button, Table} from 'antd'
import {ModalForm} from '../../component'

@inject('bigStore')
@observer
export default class FieldChooseAdd extends Component {
  constructor(props) {
    super(props)
    this.bigStore = props.bigStore
    this.store = props.store
  }

  columns = [
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
    },
  ]

  @action submit = () => {
    this.form.validateFields(err => {
      this.store.fieldListLoading = true
      if (!err) {
        _.delay(() => {
          this.store.fieldTableList = this.store.fieldList.filter(d => !d.disabled)
          this.store.fieldListLoading = false
        }, 100)
      }
    })
  }

  @action.bound initData() {
    this.store.majorKeyField = undefined
    this.store.entity1Key = undefined
    this.store.entity2Key = undefined
    this.store.selectedRowKeys.clear()
    this.store.selectedRows.clear()
    this.store.fieldTableList.clear()

    if (this.store.typeCode === '3') {
      this.form.resetFields(['entity1Key', 'entity2Key'])
      this.store.entity1Key = undefined
      this.store.entity2Key = undefined
    }
  }

  /**
   * @description 选择数据源；请求数据源下数据表
   * @param {*} storageId 数据源id
   */
  @action.bound selectDataSource(storageId) {
    this.store.storageId = storageId
    this.store.tableName = undefined

    this.form.resetFields(['dataTableName', 'majorKey'])

    this.initData()

    this.store.getDataSheet()
  }

  /**
   * @description 选择数据表；请求数据表下字段列表
   * @param {*} tableName 数据表名
   */
  @action.bound selectDataSheet(tableName) {
    this.store.tableName = tableName
    this.form.resetFields(['majorKey'])
    this.initData()
    this.store.getFieldList()
  }

  @action.bound selectMajorKey(field) {
    this.store.majorKeyField = field
    this.store.fieldList = this.store.fieldList.map(d => {
      if (d.value === field) {
        return {
          ...d,
          fieldType: 'majorKey',
          disabled: true,
        }
      }

      if (d.fieldType === 'majorKey') {
        return {
          ...d,
          name: d.name,
          value: d.value,
          disabled: false,
        }
      }
      return d
    })
  }

  @action.bound selectEntityKey(field, index, objId) {
    this.store.fieldList = this.store.fieldList.map(d => {
      if (d.value === field) {
        return {
          ...d,
          disabled: true,
          objId,
        }
      }

      if (d.objId === objId) {
        return {
          ...d,
          name: d.name,
          value: d.value,
          disabled: false,
        }
      }
      return d
    })

    this.store[`entity${index}Key`] = field
  }

  // 选择字段
  @action.bound selectFieldTable(selectedRowKeys, selectedRows) {
    this.store.selectedRowKeys = selectedRowKeys
    this.store.selectedRows = selectedRows
  }

  getFormContent() {
    const {
      dataSourceSelectList,
      dataSheetSelectList,
      fieldList,
      storageId,
      tableName,
      majorKeyField,
      entity1Key,
      entity2Key,
    } = this.store
    const {objDetail} = this.bigStore

    const content = [{
      label: '数据源',
      labelTooltip: '在数据源管理被授权，且在元数据中被采集进来的数据源',
      key: 'dataStorageId',
      component: 'select',
      initialValue: storageId,
      rules: [
        '@requiredSelect',
      ],
      control: {
        options: dataSourceSelectList,
        onSelect: v => this.selectDataSource(v),
      },
    }, {
      label: '数据表',
      labelTooltip: '同一个数据源下的数据表不能被重复选择',
      key: 'dataTableName',
      component: 'select',
      initialValue: tableName,
      rules: [
        '@requiredSelect',
      ],
      control: {
        options: dataSheetSelectList,
        onSelect: v => this.selectDataSheet(v),
      },
    }, {
      label: '关联的主键',
      key: 'majorKey', 
      hide: !objDetail.objPk, // 关系对象未设置对象主键；关联的主键input 隐藏
      component: 'select',
      initialValue: majorKeyField,
      rules: [
        '@requiredSelect',
      ],
      control: {
        options: fieldList,
        onSelect: v => this.selectMajorKey(v),
      },
    }, {
      label: objDetail.objRspList && objDetail.objRspList[0].name,
      // key: objDetail.objRspList && objDetail.objRspList[0].id,
      key: 'entity1Key',
      hide: objDetail.objTypeCode === 4, 
      component: 'select',
      initialValue: entity1Key,
      rules: [
        '@requiredSelect',
      ],
      control: {
        options: fieldList,
        placeholder: `请选择${objDetail.objRspList && objDetail.objRspList[0].name}关联的主键`,
        onSelect: v => this.selectEntityKey(v, 1, objDetail.objRspList[0].id),
      },
    }, {
      label: objDetail.objRspList && objDetail.objRspList[1].name,
      // key: objDetail.objRspList && objDetail.objRspList[1].id,
      key: 'entity2Key',
      hide: this.bigStore.objDetail.objTypeCode === 4, 
      component: 'select',
      initialValue: entity2Key,
      rules: [
        '@requiredSelect',
      ],
      control: {
        options: fieldList,
        placeholder: `请选择${objDetail.objRspList && objDetail.objRspList[1].name}关联的主键`,
        onSelect: v => this.selectEntityKey(v, 2, objDetail.objRspList[1].id),
      },
    }]

    return content
  }

  render() {
    const {show} = this.props
    const {fieldListLoading, fieldTableList, selectedRowKeys} = this.store

    const rowSelection = {
      selectedRowKeys,
      onChange: this.selectFieldTable,
    }

    const listConfig = {
      columns: this.columns,
      loading: fieldListLoading,
      dataSource: fieldTableList.slice(),
      pagination: false,
      rowSelection,
      rowKey: 'field',
    }

    const formConfig = {
      selectContent: this.getFormContent(),
      wrappedComponentRef: form => { this.form = form ? form.props.form : form },
    }

    return (
      <div style={{display: show ? 'block' : 'none'}}>
        <ModalForm {...formConfig} />
        <div className="mb24 far"><Button type="primary" onClick={this.submit}>确认</Button></div>
        <Table {...listConfig} />
        <div className="bottom-button">
          <Button style={{marginRight: 8}} onClick={() => this.store.closeDrawer()}>取消</Button>
          <Button
            type="primary"
            disabled={!selectedRowKeys.length}
            style={{marginRight: 8}}
            onClick={this.store.nextStep}
          >
            下一步
          </Button>
        </div>
      </div>
    )
  }
}
