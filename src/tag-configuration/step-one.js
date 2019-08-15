import React from 'react'
import {observer} from 'mobx-react'
import {action} from 'mobx'
import {
  Table, Badge,
} from 'antd'
import QuestionTooltip from '../component-question-tooltip'

const columns = [
  {
    title: '字段',
    key: 'dataFieldName',
    dataIndex: 'dataFieldName',
  },
  {
    title: '字段类型',
    key: 'dataFieldType',
    dataIndex: 'dataFieldType',
  },
  {
    title: '配置状态',
    key: 'isConfigured',
    dataIndex: 'isConfigured',
    render: v => (
      +v === 1 
        ? <Badge color="#52C41A" text="已配置" /> 
        : <Badge color="rgba(0,0,0,0.25)" text="未配置" />
    ),
  },
  {
    title: (
      <span>
        使用状态
        <QuestionTooltip tip="字段绑定的标签是否被使用" />
      </span>
    ),
    key: 'isUsed',
    dataIndex: 'isUsed',
    render: v => (
      +v === 1 
        ? <Badge color="#1890FF" text="使用中" /> 
        : <Badge color="rgba(0,0,0,0.25)" text="未使用" />
    ),
    width: '11%',
  },
]

// 标签配置 - 选择字段
@observer
export default class StepOne extends React.Component {
  componentDidMount() {
    console.log('--- componentDidMount --- ', 'StepOne')
  }

  render() {
    const {store} = this.props

    // function repeatArray(arr, n) {
    //   const result = []
    //   for (let i = 0; i < n; i++) {
    //     const values = arr.map(d => ({...d, id: Math.random()}))
    //     result.push(...values)
    //   }
    //   return result
    // }

    // const arr = repeatArray(store.initialList, 10)

    return (
      <div>
        <div className="fs16 mb8 ml2" style={{color: 'rgba(0,0,0,0.85)'}}>
          字段列表
        </div>
        <Table
          // loading={{false}}
          columns={columns}
          dataSource={store.initialList}
          rowKey="dataFieldName"
          // dataSource={arr}
          // rowKey="id"
          rowSelection={{
            onChange: this.onRowSelect,
            getCheckboxProps(value) {
              return {
                // TODO: 如果是从第二步返回，那么这里要考虑第二步选中过的就默认选中，并且不可配置
                defaultChecked: false,
                disabled: +value.isUsed === 1,
              }
            },
          }}
          pagination={false}
          // TODO:表格滚动
          // scroll={{x: false, y: 500}}
          // style={{
          //   height: 500,
          // }}
        />
      </div>
    )
  }

  // 选择行，更新store中选择的字段
  @action.bound onRowSelect(selectedRowKeys, selectedRows) {
    const {store} = this.props

    console.log(selectedRowKeys)

    // TODO: 如果是从第二步返回，那么这里要考虑第二步选中过的就默认选中，并且不可配置
    store.secondTableList = selectedRows
  }
}
