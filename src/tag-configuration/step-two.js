import React from 'react'
import {observer} from 'mobx-react'
import {action} from 'mobx'
import {
  Table, Badge, Divider, Alert, Spin, Button,
} from 'antd'
import QuestionTooltip from '../component-question-tooltip'
import {getDataTypeByCode} from '../common/util'
import ModalTagEdit from './modal-tag-edit'

const columns = [
  {
    title: '中文名',
    key: 'name',
    dataIndex: 'name',
  },
  {
    title: '英文名',
    key: 'enName',
    dataIndex: 'enName',
  },
  {
    title: '数据类型',
    key: 'valueType',
    dataIndex: 'valueType',
    render: v => getDataTypeByCode(v), // 1: 离散型 2：整数型 3: 小数型 4: 文本型 5: 日期型
  },
  {
    title: '是否枚举',
    key: 'isEnum',
    dataIndex: 'isEnum',
    render: v => (+v === 1 ? '是' : '否'),
  },
  {
    title: '枚举显示值',
    key: 'enumValue',
    dataIndex: 'enumValue',
  },
  {
    title: '所属类目',
    key: 'pathIds',
    dataIndex: 'pathIds',
    // render: v => v TODO:
  },
  {
    title: '业务逻辑',
    key: 'descr',
    dataIndex: 'descr',
  },
  {
    title: '关联的字段',
    key: 'dataFieldName',
    dataIndex: 'dataFieldName',
  },
  {
    title: '确认结果',
    key: 'result',
    dataIndex: 'result',
    render: (v, record) => (
      +record.isTrue === 1 
        ? <Badge color="#52C41A" text={v} /> 
        : <Badge color="#F5222D" text={v} />
    ),
  },
  {
    title: '操作',
    key: 'operation',
    // dataIndex: 'isUsed',
    render: (v, record) => {
      return (
        <span>
          <a>移除</a>
          <Divider type="vertical" />
          <a>编辑</a>
        </span>
      )
    },
  },
]

// 标签配置 - 填写配置信息
@observer
export default class StepTwo extends React.Component {
  render() {
    const {store} = this.props
    const {secondTableList, secondSelectedRows} = store

    // “选择所属类目”按钮
    const btnDisabled = !secondSelectedRows.length

    // 提示信息内容的数值
    const blueCount = secondTableList.filter(item => +item.isTrue === 1).length
    const redCount = secondTableList.filter(item => +item.isTrue !== 1).length

    return (
      <div>
        <Spin spinning={false}>
          {/* TODO: 提示信息框，如果被关掉，那么下次校验后还显示吗？ */}
          <Alert 
            type="info"
            showIcon
            closable
            message={(
              <span className="fs12">
                选择结果：可创建标签
                <span style={{color: '#1890FF'}}>{blueCount}</span>
                个，创建失败
                <span style={{color: '#F5222D'}}>{redCount}</span>
                个
              </span>
            )}
          />

          {/* 标题和按钮 */}
          <div className="mb8 ml2 mt24">
            <span className="fs16 mr8" style={{color: 'rgba(0,0,0,0.85)'}}>标签列表</span>
            <Button 
              type="primary" 
              className="mr4"
              disabled={btnDisabled}
            >
              选择所属类目
            </Button>
            <QuestionTooltip tip="若您不选择标签所属类目，那么标签将被放在该对象的默认类目中" />
          </div>

          {/* 表格 */}
          <Table
            rowKey="tagId"
            columns={columns}
            dataSource={store.secondTableList}
            rowSelection={{
              onChange: this.onRowSelect,
            }}
          />

          {/* 编辑标签弹框 */}
          <ModalTagEdit
            data={{}}
          />
        </Spin>
      </div>
    )
  }

  // 选择行
  @action.bound onRowSelect(selectedRowKeys, selectedRows) {
    const {store} = this.props

    store.secondSelectedRows = selectedRows
  }

  // 移除
  @action removeItem(index) {
    const {store} = this.props

  }

  // 编辑，弹框
  @action showEditModal(index) {
    const {store} = this.props
    
  }


}
