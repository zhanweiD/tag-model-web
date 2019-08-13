import React from 'react'
import {observer} from 'mobx-react'
import {action, extendObservable} from 'mobx'
import {
  Table, Button, Tooltip, Badge,
} from 'antd'


// 表格columns对象
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
    sortDirections: ['ascend', 'descend'],
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
  state = {
    randomKey: Math.random(), // 触发强制更新
  }

  render() {
    const {store} = this.props
    const {randomKey} = this.state
    
    // 没有选择某个对象名称（不含全部），或，所有页面都没有选中标签时，批量添加按钮置灰
    const btnDisabled = !store.filterObjId
      || !Object.keys(store.selectedTags).length 
      || Object.values(store.selectedTags).every(d => !d.length)

    // 当前页的选中项id数组
    const selectedRowKeys = (store.selectedTags[store.currentPage] || []).map(tag => tag.id)

    return (
      <div className="search-table white-block p24 mt16" key={randomKey}>
        {/* 批量添加按钮 */}
        <div>
          <Button 
            type="primary" 
            disabled={btnDisabled}
            onClick={this.onButtonClick}
          >
            批量添加至场景
          </Button>
        </div>
        
        {/* 表格 */}
        <div className="mt8">
          <Table
            loading={store.loading}
            dataSource={store.tagList}
            columns={columns}
            pagination={{
              current: +store.currentPage,
              pageSize: +store.pageSize,
              total: +store.totalCount,
              showTotal: () => `合计${store.totalCount}条记录`,
            }}
            rowKey="id"
            rowSelection={{
              selectedRowKeys,
              onChange: this.onSelectChange,
              getCheckboxProps() {
                return {
                  defaultChecked: false,
                  disabled: !store.filterObjId, // 对象名称选择“全部”时，不可选择
                }
              },
            }}
            onChange={this.onTableChange}
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

  // 强制更新
  forceUpdate() {
    this.setState({
      randomKey: Math.random(),
    })
  }

  // 选中表格项
  @action.bound onSelectChange(selectedRowKeys, selectedRows) {
    const {store} = this.props

    // 更新当前页选中的标签项
    if (!store.selectedTags[store.currentPage]) {
      // 这里添加新属性时，不会触发更新，强制更新一下
      extendObservable(store.selectedTags, {
        [store.currentPage]: selectedRows,
      })
      this.forceUpdate()
    } else {
      store.selectedTags[store.currentPage] = selectedRows
    }
  }

  // 表格变化（切页、排序）
  @action.bound onTableChange(pagination, filters, sorter) {
    const {store} = this.props

    const {current, pageSize} = pagination
    const {field, order} = sorter

    store.currentPage = current
    store.pageSize = pageSize
    store.sortKey = field
    store.sortOrder = order

    store.getTagList()
  }
}
