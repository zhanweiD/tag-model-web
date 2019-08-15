import React from 'react'
import {observer} from 'mobx-react'
import {action} from 'mobx'
import {
  Table, Badge, Tooltip, Icon,
} from 'antd'

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
        <Tooltip placement="top" title="字段绑定的标签是否被使用">
          <Icon type="question-circle" className="ml4" />
        </Tooltip>
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

// 配置标签 - 选择字段
@observer
export default class StepOne extends React.Component {
  render() {
    const {store} = this.props

    function repeatArray(arr, n) {
      const result = []
      for (let i = 0; i < n; i++) {
        const values = arr.map(d => ({...d, id: Math.random()}))
        result.push(...values)
      }
      return result
    }

    const arr = repeatArray(store.tableList, 10)

    return (
      <div>
        <div className="fs16 mb8 ml2" style={{color: 'rgba(0,0,0,0.85)'}}>字段列表</div>
        <Table
          columns={columns}
          // dataSource={store.tableList}
          // rowKey="dataFieldName"
          dataSource={arr}
          rowKey="id"
          rowSelection={{
            onChange(selectedRowKeys) {
              console.log(selectedRowKeys)
            },
            getCheckboxProps(value) {
              return {
                defaultChecked: false,
                disabled: +value.isUsed === 1,
              }
            },
          }}
          pagination={false}
          // scroll={{x: false, y: 500}}
        />
      </div>
    )
  }
}
