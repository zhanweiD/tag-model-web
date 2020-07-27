import {Component} from 'react'
import {Tabs, Button, Radio, Card, Input} from 'antd'
import {action, toJS} from 'mobx'
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
  
  columns = [
    {
      key: 'fieldName',
      title: '字段名称',
      dataIndex: 'fieldName',
    }, {
      key: 'fieldType',
      title: '字段类型',
      dataIndex: 'fieldType',
    }, {
      key: 'tagFieldId',
      title: '配置状态',
      dataIndex: 'tagFieldId',
      render: text => (text ? '已配置' : '未配置'),
    }, {
      key: 'status',
      title: '发布状态',
      dataIndex: 'status',
      render: text => (text === 2 ? '已发布' : '未发布'),
    }, 
  ]

  // tab 切换
  // @action handleChange = v => {
  //   const {allList, noConList, configList} = this.store
  //   switch (v.target.value) {
  //     case 1:
  //       this.store.list = allList
  //       break
  //     case 2:
  //       this.store.list = configList
  //       break
  //     case 0:
  //       this.store.list = noConList
  //       break
  //     default:
  //       this.store.list = allList
  //       break
  //   }
  //   // this.store.status = v.target.value
  //   this.store.recordObj = {}
  // }

  // 字段搜索
  @action searchFiled = v => {
    this.store.dataFieldName = v
    this.store.getList()
    this.store.recordObj = {}
  }
 
  // 选中字段
  @action selectField = obj => {
    const {fieldType} = obj
    if (fieldType === 'tinyint' || fieldType === 'int' || fieldType === 'smallint' || fieldType === 'bigint') {
      obj.valueType = 2
    } else if (fieldType === 'float' || fieldType === 'double' || fieldType === 'decimal(10,2)') {
      obj.valueType = 3
    } else if (fieldType === 'string' || fieldType === 'varchar' || fieldType === 'char') {
      obj.valueType = 4
    } else if (fieldType === 'timestamp' || fieldType === 'date') {
      obj.valueType = 5
    }

    this.store.recordObj = obj
    this.store.tagBaseInfo = {}
    this.store.release = obj.status === 2
    this.store.isEnum = !!obj.isEnum
    this.store.isNewTag = !obj.tagFieldId
    this.store.isConfig = obj.tagFieldId

    this.store.getTagCateSelectList() // 获取标签类目列表
    if (obj.tagFieldId) this.store.getTagBaseDetail()
    if (this.store.form) this.store.form.resetFields()
  } 

  // 显示全部，隐藏已发布
  @action showAll = () => {
    const {list, pagination} = this.store
    this.store.list = list.filter(item => item.status !== 2)
    pagination.totalCount = this.store.list.length
    this.store.recordObj = {}
  }

  render() {
    const {
      allList,
      configNum,
      processId,
      fieldName,
      tableLoading,
      tabChange,
      tabValue,
    } = this.store

    const listConfig = {
      initParams: {
        id: processId,
        fieldName,
      },
      tableLoading,
      onRow: record => ({
        onClick: () => this.selectField(record),
      }),
      columns: this.columns,
      // initGetDataByParent: true, // 初始请求 在父层组件处理。列表组件componentWillMount内不再进行请求
      store: this.store, // 必填属性
    }

    return (
      <div className="config-table">
        <Radio.Group value={tabValue} onChange={v => tabChange(v.target.value)}>
          <Radio.Button value={1}>{`全部(${allList.length})`}</Radio.Button>
          <Radio.Button value={2}>{`已配置(${configNum})`}</Radio.Button>
          <Radio.Button value={0}>{`待配置(${allList.length - configNum})`}</Radio.Button>
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
