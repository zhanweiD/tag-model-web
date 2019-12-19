/* eslint-disable react/jsx-closing-tag-location */
import {Component} from 'react'
import {action} from 'mobx'
import {observer, inject} from 'mobx-react'
import {Button, Table} from 'antd'
import {ModalForm} from '../../component'
import {relStatusMap, configStatusMap, tagStatusMap} from '../util'

@inject('bigStore')
@observer
export default class FieldChoose extends Component {
  constructor(props) {
    super(props)
    this.bigStore = props.bigStore
    this.store = props.store
  }

  componentWillMount() {
    const {show} = this.props

    if (show) {
      const {editSelectedItem} = this.store
      this.store.storageId = editSelectedItem.dataStorageId
      this.store.tableName = editSelectedItem.dataTableName
      this.store.majorKeyField = editSelectedItem.mappingKey
      this.store.getReledFieldList()
    }
  }

  columns = [
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
    },
  ]

  // 选择字段
  @action.bound selectFieldTable(selectedRowKeys, selectedRows) {
    this.store.selectedRowKeys = selectedRowKeys
    this.store.selectedRows = selectedRows
  }

  render() {
    const {show} = this.props

    const {
      fieldListLoading,
      fieldTableList,
      selectedRowKeys,
      editSelectedItem,
    } = this.store

    const {objDetail} = this.bigStore

    const {
      dataStorageName, 
      dataTableName, 
      mappingKey,
    } = editSelectedItem

    const content = [{
      label: '数据源',
      labelTooltip: '在数据源管理被授权，且在元数据中被采集进来的数据源',
      key: 'dataStorageId',
      component: 'select',
      initialValue: dataStorageName,
      control: {
        disabled: true,
      },
    }, {
      label: '数据表',
      labelTooltip: '同一个数据源下的数据表不能被重复选择',
      key: 'dataTableName',
      component: 'select',
      initialValue: dataTableName,
      control: {
        disabled: true,
      },
    }, {
      label: '关联的主键',
      key: 'majorKey', 
      hide: !this.bigStore.objDetail.objPk, // 关系对象未设置对象主键；关联的主键input 隐藏
      component: 'select',
      initialValue: mappingKey,
      control: {
        disabled: true,
      },
    }, 
    // {
    //   label: objDetail.objRspList && objDetail.objRspList[0].name,
    //   key: objDetail.objRspList && objDetail.objRspList[0].id,
    //   hide: objDetail.objTypeCode === 4, 
    //   component: 'select',
    //   initialValue: entity1Key,
    //   rules: [
    //     '@requiredSelect',
    //   ],
    //   control: {
    //     options: fieldList,
    //     placeholder: '请选择',
    //     onSelect: v => this.selectEntityKey(v, 1, objDetail.objRspList[0].id),
    //   },
    // }, {
    //   label: objDetail.objRspList && objDetail.objRspList[1].name,
    //   key: objDetail.objRspList && objDetail.objRspList[1].id,
    //   hide: this.bigStore.objDetail.objTypeCode === 4, 
    //   component: 'select',
    //   initialValue: entity2Key,
    //   rules: [
    //     '@requiredSelect',
    //   ],
    //   control: {
    //     options: fieldList,
    //     placeholder: '请选择',
    //     onSelect: v => this.selectEntityKey(v, 2, objDetail.objRspList[1].id),
    //   },
    // }
    ]

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
      rowKey: 'dataFieldName',
    }

    const formConfig = {
      selectContent: content,
      wrappedComponentRef: form => { this.form = form ? form.props.form : form },
    }

    return (
      <div style={{display: show ? 'block' : 'none'}}>
        <ModalForm {...formConfig} />

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
