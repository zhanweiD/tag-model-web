import {Component, Fragment} from 'react'
import {observable, action, toJS} from 'mobx'
import {observer, inject} from 'mobx-react'
import {
  Button, Popconfirm, Tooltip, Table,
} from 'antd'
import NemoBaseInfo from '@dtwave/nemo-base-info'
import {Time} from '../common/util'
import OverviewCard from '../component-overview-card'
import Descr from '../component-detail-descr'

import TagConfiguration from '../tag-configuration'
import store from './store-obj-detail'
import DrawerRelfieldList from '../obj-detail-relfield'
import DrawerRelfieldAdd from './drawer-relfield-add'
import DrawerRelfieldEdit from './drawer-relfield-edit'

const {functionCodes} = window.__userConfig

@inject('bigStore')
@observer
export default class ObjDetail extends Component {
  @observable updateKey = undefined
  @observable curentItem = undefined

  constructor(props) {
    super(props)
    this.bigStore = props.bigStore

    this.tableCol = [
      {
        title: '数据表名称',
        key: 'dataTableName',
        dataIndex: 'dataTableName',
      }, {
        title: '数据源',
        key: 'dataDbName',
        dataIndex: 'dataDbName',
      }, {
        title: '数据源类型',
        key: 'storageTypeName',
        dataIndex: 'storageTypeName',
      }, {
        title: '已配置/未关联',
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
        title: '操作',
        render: (text, record) => (
          <Fragment>
            {(() => {
              const arr = []
              if (functionCodes.includes('asset_tag_delete_table')) {
                if (!record.isUsed) {
                  arr.push(
                    <Popconfirm
                      title="你确定要移除该数据表吗？"
                      onConfirm={() => store.delObjFieldRel(record.dataStorageId, record.dataTableName)}
                    >
                      <a className="mr8">移除</a>
                    </Popconfirm>
                  )
                } else {
                  arr.push(<Tooltip title="数据表中有标签使用中，不可移除"><span className="mr8 disabled">移除</span></Tooltip>)
                }
              }

              if (functionCodes.includes('asset_tag_edit_field')) {
                arr.push(<a className="mr8" onClick={() => this.toEditRelField(record)}>编辑字段</a>)
              }

              if (functionCodes.includes('asset_tag_conf_field_tag')) {
                arr.push(<a onClick={() => this.toggleTagConfiguration(record)}>标签配置</a>)
              }

              return arr
            })()}
          </Fragment>
        ),
      },
    ]
  }

  componentWillMount() {
    const {aId} = this.props
    store.id = aId
    store.getBaseInfo()
    store.getDailyCard()
    store.getList()
  }

  componentWillReceiveProps(nextProps) {
    if (this.updateKey !== nextProps.updateKey) {
      this.updateKey = nextProps.updateKey
      store.id = nextProps.aId
      store.getBaseInfo()
      store.getDailyCard()
      store.getList()
    }
  }

  @action toViewRelField() {
    store.modalVisible.viewRelField = true
  }

  @action toAddRelField() {
    store.modalVisible.addRelField = true
    store.getDacList()
  }

  @action toEditRelField(item) {
    store.getFieldList(item.dataStorageId, item.dataTableName)
    store.getRelDbField(item.dataStorageId, item.dataTableName)
    store.modalVisible.editRelField = true
    this.curentItem = item
  }

  @action toggleTagConfiguration(item) {
    store.modalVisible.tagConfiguration = !store.modalVisible.tagConfiguration
    if (item) this.curentItem = item
  }

  render() {
    const {
      objTypeCode: typeCode,
      objType,
      tagCount,
      name,
      enName,
      creator,
      createTime,
      descr,
      objRspList = [],
    } = store.baseInfo

    const baseInfo = [
      {
        title: '创建者',
        value: creator,
      }, {
        title: '创建时间',
        value: <Time timestamp={createTime} />,
      }, {
        title: '所属对象',
        value: objType,
      }, {
        title: '英文名',
        value: enName,
      }, {
        title: '标签个数',
        value: tagCount,
      },
    ]
    if (typeCode === 3) {
      baseInfo.splice(5, 0, {
        title: '关联的人/物',
        value: objRspList && objRspList.map(item => item.name).join('、'),
      })
    }

    const {
      dataSourceCount, tableCount, configuredField, associatedField,
    } = store.dailyCard
    const cards = [
      {
        title: '数据源数',
        tooltipText: '添加关联字段中，选择的数据源数',
        values: [dataSourceCount],
      },
      {
        title: '数据表数',
        tooltipText: '添加关联字段中，选择的数据表数',
        values: [tableCount],
      },
      {
        title: '已配置/已关联',
        tooltipText: '添加的关联字段中，已配置成标签的字段数/添加的关联字段总数',
        values: [configuredField, associatedField],
      },
    ]

    return (
      <div className="obj-detail">
        <div className="detail-info">
          <div className="d-head"> 
            <div className="FBH FBJ FBAC">
              <span>{name}</span>
              <div>
                <Button className="mr8" onClick={() => this.toViewRelField()}>已关联字段列表</Button>
                {
                  functionCodes.includes('asset_tag_rel_field') && (
                    <Button type="primary" onClick={() => this.toAddRelField()}>添加关联字段</Button>
                  )
                }
              </div>
            </div>
            <Descr text={descr} pr={230} className="mt8" />
          </div>
          <NemoBaseInfo dataSource={baseInfo} className="d-info" />
        </div>

        <div className="FBH bgf pt24 pb24">
          {
            cards.map((item, index) => (
              <div className="FB1" style={{borderLeft: index !== 0 ? '1px solid #E8E8E8' : ''}}>
                <OverviewCard {...item} />
              </div>
            ))
          }
        </div>

        <Table
          className="p24"
          style={{paddingTop: 0}}
          rowKey="id"
          onChange={store.handleChange}
          columns={this.tableCol}
          loading={store.tableLoading}
          dataSource={store.list.slice()}
          pagination={{
            pageSize: store.pagination.pageSize,
            current: store.pagination.currentPage,
            total: store.pagination.count,
            showTotal: () => `合计${store.pagination.count}条记录`,
          }}
        />

        <DrawerRelfieldAdd />
        <DrawerRelfieldEdit
          updateKey={store.relDbField.length}
          curentItem={this.curentItem}
          defStdlist={toJS(store.relDbField)}
        />
        <DrawerRelfieldList
          store={store}
          updateKey={store.modalVisible.viewRelField}
        />
        {
          (store.modalVisible.tagConfiguration && this.curentItem) && (
            <TagConfiguration
              visible={store.modalVisible.tagConfiguration}
              onClose={() => this.toggleTagConfiguration()}
              treeId={this.bigStore.id}
              objId={store.id}
              storageId={this.curentItem.dataStorageId}
              tableName={this.curentItem.dataTableName}
              onSuccess={() => {
                store.getList()
                this.bigStore.categoryStore.getCategoryList()
              }}
            />
          )
        }
      </div>
    )
  }
}
