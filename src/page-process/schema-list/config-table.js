import {Component} from 'react'
import {Tabs, Button, Radio, Card, Input} from 'antd'
import {action} from 'mobx'
import {inject, observer} from 'mobx-react'

import {ListContent} from '../../component'

const {Search} = Input
@inject('store')
@observer
export default class ConfigDrawerOne extends Component {
  constructor(props) {
    super(props)
    this.store = props.store
  }

  componentDidMount() {
    this.store.saveList = this.store.list
    this.store.list.forEach(item => {
      if (item.status) this.store.configNum++
    })
  }
  
  columns = [
    {
      key: 'dataFieldName',
      title: '字段名称',
      dataIndex: 'dataFieldName',
    }, {
      key: 'dataFieldType',
      title: '字段类型',
      dataIndex: 'dataFieldType',
    }, {
      key: 'status',
      title: '配置状态',
      dataIndex: 'status',
      render: text => (text ? '已配置' : '未配置'),
    }, {
      key: 'tagStatus',
      title: '发布状态',
      dataIndex: 'tagStatus',
      render: text => (text ? '已发布' : '未发布'),
    }, 
  ]

  // tab 切换
  @action handleChange = v => {
    this.store.status = v.target.value
    this.store.getList()
  }

  // 字段搜索
  @action searchFiled = v => {
    this.store.dataFieldName = v
    this.store.getList()
  }
 
  // 选中字段
  @action selectField = obj => {
    this.store.recordObj = obj
    this.store.release = obj.tagStatus
    this.store.isConfig = obj.status
    console.log(obj)
  } 

  // 显示全部，隐藏已发布
  @action showAll = () => {
    this.store.getList()
  }

  render() {
    const {
      list,
      configNum,
      projectId,
      sourceId,
      status,
      dataFieldName,
    } = this.store

    const listConfig = {
      initParams: {
        projectId,
        id: sourceId,
        status,
        dataFieldName,
      },
      onRow: record => ({
        onClick: () => this.selectField(record),
      }),
      columns: this.columns,
      // initGetDataByParent: true, // 初始请求 在父层组件处理。列表组件componentWillMount内不再进行请求
      store: this.store, // 必填属性
    }
    return (
      <div className="config-table">
        <Radio.Group defaultValue={-1} onChange={this.handleChange}>
          <Radio.Button value={-1}>{`全部(${list.length})`}</Radio.Button>
          <Radio.Button value={1}>{`已配置(${configNum})`}</Radio.Button>
          <Radio.Button value={0}>{`待配置(${list.length - configNum})`}</Radio.Button>
        </Radio.Group>
        <Card 
          size="small" 
          title="字段列表" 
          extra={<a href onClick={this.showAll}>显示全部</a>} 
          style={{width: 525, height: 600, marginTop: '16px'}}
        >
          <Search
            placeholder="请输入字段名称查询"
            onSearch={value => this.searchFiled(value)}
            style={{margin: '4px 0 16px 0'}}
          />
          <div className="list-content not-p">
            <ListContent {...listConfig} />
          </div>
        </Card>
      </div>
    )
  }
}
