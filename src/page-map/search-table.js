import React from 'react'
import {observer} from 'mobx-react'
import {
  Table, Button, Tooltip, Badge,
} from 'antd'


// 表格columns对象
// 网关接口：http://192.168.90.87:9985/gateway/api/detail/be_tag/8d439f1001f344edbddf37fb62862a74
const columns = [
  // 名称、数据类型、价值分、质量分、热度、创建人、使用状态、被API调用次数
  {
    title: '名称',
    dataIndex: 'name',
    key: 'name',
    render: name => (
      <Tooltip placement="top" title={name}>
        <span className="omit" style={{maxWidth: '150px'}}>
          {name}
        </span>
      </Tooltip>
    ),
  },
  {
    title: '数据类型',
    dataIndex: 'valueTypeName',
    key: 'valueTypeName',
    width: '12%',
  },
  {
    title: '价值分',
    dataIndex: 'worthScore',
    key: 'worthScore',
    sorter: true,
    width: '11%',
  },
  {
    title: '质量分',
    dataIndex: 'qualityScore',
    key: 'qualityScore',
    sorter: true,
    width: '11%',
  },
  {
    title: '热度',
    dataIndex: 'hotScore',
    key: 'hotScore',
    sorter: true,
    width: '11%',
  },
  {
    title: '创建人',
    dataIndex: 'creator',
    key: 'creator',
    width: '12%',
  },
  {
    title: '使用状态',
    dataIndex: 'isUsed',
    key: 'isUsed',
    width: '12%',
    render: isUsed => {
      const flag = Number(isUsed) === 1
      return flag ? <Badge color="green" text="使用中" />
        : <Badge color="blue" text="未使用" />
    },
  },
  {
    title: '被API调用次数',
    dataIndex: 'apiInvokeCount',
    key: 'apiInvokeCount',
    width: '13%',
    sorter: true,
  },
]

/**
 * @description 标签搜索 - 表格展示部分，包括”批量添加至场景按钮“
 * @author 三千
 * @date 2019-08-06
 * @export
 * @class SearchTable
 * @extends {React.Component}
 */
@observer
export default class SearchTable extends React.Component {
  render() {
    const {store} = this.props

    // 没有选中标签时，批量添加按钮置灰
    const btnDisabled = store.selectedTags || !store.selectedTags.length

    return (
      <div className="search-table white-block p24 mt16">
        {/* 批量添加按钮 */}
        <div>
          <Button 
            type="primary" 
            disabled={!btnDisabled}
            onClick={this.onButtonClick}
          >
            批量添加至场景
          </Button>
        </div>
        
        {/* 表格 */}
        <div className="mt8">
          <Table
            dataSource={store.tagList}
            columns={columns}
            pagination={{
              current: store.currentPage,
              pageSize: store.pageSize,
              total: store.totalCount,
              showTotal: () => `合计${store.totalCount}条记录`,
            }}
            rowSelection={{

            }}
          />
        </div>
      </div>
    )
  }

  // 点击批量添加按钮，显示弹框
  onButtonClick = () => {
    const {store} = this.props
    store.toggleModal(true)
  }
}
