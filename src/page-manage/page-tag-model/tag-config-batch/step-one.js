import {Component} from 'react'
import {observer} from 'mobx-react'
import {Button, Select, Switch, Table, Badge} from 'antd'
import {action} from 'mobx'
import {tagConfigMethodMap} from '../util'
import {getDataTypeName} from '../../../common/util'

const {Option} = Select

@observer
export default class StepOne extends Component {
  constructor(props) {
    super(props)
    this.store = props.store
  }

  columns = [{
    title: '标签名称',
    dataIndex: 'name',
  }, {
    title: '唯一标识',
    dataIndex: 'enName',
  }, {
    title: '数据类型',
    dataIndex: 'valueType',
    render: text => getDataTypeName(text),
  }, {
    title: '配置状态',
    dataIndex: 'configStatus',
    render: text => (text ? <Badge color="#87d068" text="已配置" /> : <Badge color="#d9d9d9" text="待配置" />),
  }, {
    title: '标签状态',
    dataIndex: 'deployStatus',
    render: text => (
      <div>
        {
          text === 1 && <Badge color="#d9d9d9" text="待发布" />
        }

        {
          text === 2 && <Badge color="#87d068" text="已发布" />
        }
      </div>
    ),
  }]

  @action.bound nextStep() {
    this.store.nextStep()
  }

  @action.bound objectSelect(v) {
    this.store.objId = v
    this.store.getConfigTagList()
  }

  @action.bound boundMethodSelect(v) {
    this.store.boundMethodId = v
    this.store.getConfigTagList()
  }
  
  @action.bound switchChange(v) {
    this.store.isShowPublished = v
  }

  @action.bound onTableCheck(keys, rows) {
    // 表格 - 已选项
    // this.store.selectedRowKeys = rows

    // 表格 - 已选项key数组
    this.store.selectedRowKeys = keys
  }

  render() {
    const {show, closeDrawer, objectSelectList} = this.props
    const {objId, boundMethodId, selectedRowKeys, configTagList, isShowPublished} = this.store

    const dataSource = isShowPublished ? configTagList.filter(d => d.deployStatus === 2) : configTagList.filter(d => d.deployStatus < 2)

    const rowSelection = {
      selectedRowKeys,
      onChange: this.onTableCheck,
      getCheckboxProps: record => ({
        disabled: record.deployStatus === 2 || record.configStatus === 1,
      }),
    }

    const tableConfig = {
      rowSelection,
      columns: this.columns,
      dataSource,
      pagination: false,
      rowKey: 'id',
    }

    return (
      <div style={{display: show ? 'block' : 'none'}}>
        <div className="mb24">
          <span className="search-label">对象</span>
          <Select value={objId} style={{width: 240}} onChange={this.objectSelect} placeholder="请选择">
            {
              objectSelectList.map(
                ({value, name}) => (
                  <Option 
                    key={value} 
                    value={value}
                  >
                    {name}
                  </Option>
                )
              )
            }
          </Select>
          <span className="search-label ml16">绑定方式</span>
          <Select value={+boundMethodId} style={{width: 240}} onChange={this.boundMethodSelect}>
            {
              tagConfigMethodMap.map(
                ({name, value}) => (
                  <Option 
                    key={value} 
                    value={value}
                  >
                    {name}
                  </Option>
                )
              )
            }
          </Select>
          <span className="fs12 ml24 mr8">展示标签状态为已发布的标签</span>
          <Switch 
            checkedChildren="是" 
            unCheckedChildren="否"
            onChange={this.switchChange} 
          />
        </div>
        <div>
          <Table
            {...tableConfig}
          />
        </div>
        
        <div className="bottom-button">
          <Button style={{marginRight: 8}} onClick={() => closeDrawer()}>关闭</Button>
          <Button
            type="primary"
            style={{marginRight: 8}}
            onClick={this.nextStep}
            disabled={!selectedRowKeys.length}
          >
            下一步
          </Button>
        </div>
      </div>
    )
  }
}
