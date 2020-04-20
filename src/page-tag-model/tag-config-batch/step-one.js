import {Component} from 'react'
import {observer} from 'mobx-react'
import {Button, Select, Switch, Table} from 'antd'
import {action} from 'mobx'
import {tagConfigMethodMap} from '../util'

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
    dataIndex: 'name',
  }, {
    title: '数据类型',
    dataIndex: 'name',
  }, {
    title: '配置状态',
    dataIndex: 'name',
  }, {
    title: '标签状态',
    dataIndex: 'name',
  }]

  @action.bound nextStep() {
    this.store.nextStep()
  }

  @action.bound objectSelect(v) {
    this.store.objId = v
  }

  @action.bound boundMethodSelect(v) {
    this.store.boundMethodId = v
  }
  
  @action.bound switchChange(v) {
    this.store.isShowPublished = v
  }

  @action.bound onTableCheck(keys, rows) {
    // 表格 - 已选项
    this.store.selectedRows = rows

    // 表格 - 已选项key数组
    this.store.rowKeys = keys
  }

  render() {
    const {show, closeDrawer} = this.props
    const {objId, objList, boundMethodId, selectedRowKeys} = this.store

    const rowSelection = {
      selectedRowKeys,
      onChange: this.onTableCheck,
      // getCheckboxProps: record => ({
      //   disabled: record.name === 'Disabled User', // Column configuration not to be checked
      //   name: record.name,
      // }),
    }

    const tableConfig = {
      rowSelection,
      columns: this.columns,
      dataSource: [],
    }

    return (
      <div style={{display: show ? 'block' : 'none'}}>
        <div className="mb24">
          <span className="search-label">对象</span>
          <Select value={objId} style={{width: 240}} onChange={this.objectSelect}>
            <Option value="">全部</Option>
            {
              objList.map(
                ({projectId, projectName}) => (
                  <Option 
                    key={projectId} 
                    value={projectId}
                  >
                    {projectName}
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
          >
            下一步
          </Button>
        </div>
      </div>
    )
  }
}
