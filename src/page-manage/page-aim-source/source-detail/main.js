import {Component, useEffect} from 'react'
import {Spin, Popconfirm, Badge, Select, Input} from 'antd'
import {action, observable} from 'mobx'
import {observer} from 'mobx-react'
import OnerFrame from '@dtwave/oner-frame'
import {
  DetailHeader, ListContent, TabRoute,
} from '../../../component'
import {Time} from '../../../common/util'
import ModalTagConfig from './modal'

import store from './store'

const tabs = [{name: '字段列表', value: 1}]
// -1 / null 全部、0  未映射  、1 已映射
const runStatus = [{
  name: '全部',
  value: -1,
}, {
  name: '未映射',
  value: 0,
}, {
  name: '已映射',
  value: 1,
}]

const {Option} = Select

@observer
class SourceDetail extends Component {
  constructor(props) {
    super(props)
    const {match} = props
    store.sourceId = match.params.id 
    store.projectId = props.projectId
  }

  @observable tabId = 1 // 当前详情tabID 

  columns = [{
    title: '字段名称',
    dataIndex: 'dataFieldName',
  }, {
    title: '字段类型',
    dataIndex: 'dataFieldType',
  }, {
    title: '字段描述',
    dataIndex: 'descr',
    render: text => text || '-',
  }, {
    title: '映射状态',
    dataIndex: 'status',
    render: text => (text ? <Badge color="#87d068" text="已映射" /> : <Badge color="#d9d9d9" text="未映射" />),

  }, {
    title: '标签状态',
    dataIndex: 'tagStatus',
    render: (text, record) => {
      if (record.tagName) {
        return text ? <Badge color="#87d068" text="已使用" /> : <Badge color="#d9d9d9" text="未使用" />
      }
      return '-'
    },
  }, { 
    title: '标签名称',
    dataIndex: 'tagName',
    render: text => text || '-',
  }, {
    title: '操作',
    dataIndex: 'action',
    width: 100,
    render: (text, record) => (
      <div>
        {(() => {
          if (record.tagStatus) {
            return <span className="disabled">取消映射</span>
          }

          if (record.status) {
            return (
              <Popconfirm placement="topRight" title="你确定要取消该字段的标签映射吗？" onConfirm={() => this.cancelConfig(record)}>
                <a href>取消映射</a>
              </Popconfirm>
            )
          }
          return <a href onClick={() => this.config(record)}>标签映射</a>
        })()}
      </div>
    ), 
  }]

  componentWillMount() {
    store.getDetail()
  }

  @action.bound config(data) {
    store.fieldDetail = data

    store.getObjList()
    store.visible = true
  }

  @action.bound cancelConfig(data) {
    store.cancelConfig({
      id: data.id,
    })
  } 

  @action.bound selectStatus(status) {
    this.status = status
    if (typeof status === 'undefined') {
      store.getList({
        status,
        dataFieldName: this.fieldName,
      })
    } else {
      store.getList({
        status,
        dataFieldName: this.fieldName,
      })
    }
  }

  @action.bound searchField(e) {
    const {value} = e.target
    this.fieldName = value
    store.getList({
      status: this.status,
      dataFieldName: value,
    })
  }

  render() {
    const {infoLoading, detail} = store

    const baseInfo = [{
      title: '同步对象',
      value: detail.objName,
    }, {
      title: '创建人',
      value: detail.cuserName,
    }, {
      title: '创建时间',
      value: <Time timestamp={detail.ctime} />,
    }, {
      title: '数据源类型',
      value: detail.storageType,
    }, {
      title: '数据源',
      value: detail.storageName,
    }, {
      title: '目的表',
      value: detail.dataTableName,
    }]

    const tabConfig = {
      tabs,
      currentTab: this.tabId,
      changeUrl: false,
    }

    const listConfig = {
      columns: this.columns,
      initParams: {id: store.sourceId, projectId: store.projectId},
      store, // 必填属性
    }

    return (
      <div className="page-source-detail">
        <Spin spinning={infoLoading}>
          <DetailHeader
            name={detail.name}
            descr={detail.descr}
            baseInfo={baseInfo}
          />
        </Spin>
        <div className="list-content box-border">
          <TabRoute {...tabConfig} />
          <div className="mb16 pl24 pt24">
            <span className="mr8">映射状态</span>
            <Select
              showSearch
              allowClear
              placeholder="请选择映射状态"
              style={{width: 200}}
              onChange={v => this.selectStatus(v)}
              optionFilterProp="children"
              className="mr16"
            >
              {
                runStatus.map(item => (
                  <Option key={item.value} value={item.value}>{item.name}</Option>
                ))
              }
            </Select>
            <span className="mr8">字段名称</span>
            <Input size="small" onChange={this.searchField} style={{width: 200}} placeholder="请输入字段名称" />
          </div>
          <ListContent {...listConfig} />
        </div>
        <ModalTagConfig store={store} />
      </div>
    )
  }
}

export default props => {
  const ctx = OnerFrame.useFrame()
  const projectId = ctx.useProjectId()

  useEffect(() => {
    ctx.useProject(false)
  }, [])

  return (
    <SourceDetail {...props} projectId={projectId} />
  )
}
