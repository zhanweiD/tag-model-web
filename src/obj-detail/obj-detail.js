import {Component, Fragment} from 'react'
import {observable, action} from 'mobx'
import {observer} from 'mobx-react'
import {Button, Popconfirm, Tooltip, Table} from 'antd'
import NemoBaseInfo from '@dtwave/nemo-base-info'
import {Time} from '../common/util'
import store from './store-obj-detail'

@observer
export default class ObjDetail extends Component {
  @observable updateKey = undefined

  constructor(props) {
    super(props)
    this.bigStore = props.bigStore


    // id": 1,							--对象ID
		// 	"storageId": "jdsjsjksjk212dsd",	--存储ID
		// 	"storageName": "wangshu_test",		--存储名
		// 	"storageType": 4,					--数据源类型
    //       	"storageTypeName": "HIVE",			--数据源类型中文名
    //       	"tableName": "demo",				--表名
    //       	"configuredField": 100,				--已配置
    //       	"associatedField": 100,				--已关联
    //         "": 0	
            

    this.tableCol = [
      {
        title: '数据表名称',
        key: 'tableName',
        dataIndex: 'tableName',
      }, {
        title: '数据源',
        key: 'storageName',
        dataIndex: 'storageName',
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
              if (!record.isUsed) {
                arr.push(
                  <Popconfirm
                    title="你确定要移除该数据表吗？"
                    onConfirm={() => {}}
                  ><a className="mr8">移除</a></Popconfirm>
                )
              } else {
                arr.push(<Tooltip title="数据表中有标签使用中，不可移除"><span className="mr8 disabled">移除</span></Tooltip>)
              }
              arr.push(<a className="mr8" onClick={() => {}}>编辑字段</a>)
              arr.push(<a onClick={() => {}}>标签配置</a>)
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
    const {dataSourceCount, tableCount, configuredField, associatedField} = store.dailyCard
    
    
    const baseInfo = [
      {
        title: '创建者',
        value: creator,
      }, {
        title: '创建时间',
        value: <Time timestamp={createTime} />,
      }, {
        title: '所属分类',
        value: objType,
      }, {
        title: '英文名',
        value: enName,
      }, {
        title: '标签个数',
        value: tagCount,
      }, {
        title: '描述',
        value: descr,
      },
    ]

    if (typeCode === 3) {
      baseInfo.splice(4, 0, {
        title: '关联的人/物',
        value: objRspList && objRspList.map(item => item.name).join('、'),
      })
    }

    return (
      <div className="tag-detail">
        <div className="detail-info">
          <div className="d-head FBH FBJ">
            <div>
              <span className="mr10">{name}</span>
            </div>
            <div>
              <Button type="primary" className="mr8">添加关联字段</Button>
              <Button>已关联字段列表</Button>
            </div>
          </div>
          <NemoBaseInfo dataSource={baseInfo} className="d-info" />
        </div>
        <div>{dataSourceCount}</div>
        {/* // "dataSourceCount": 3,		--数据源数
    // "tableCount": 20,			--数据表数
		// "configuredField": 100,		--已配置字段数
    // "associatedField": 200		--已关联字段数 */}


        <Table
          className="p24"
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
      </div>
    )
  }
}
