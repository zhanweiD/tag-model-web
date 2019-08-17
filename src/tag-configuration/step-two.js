/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react'
import {observer} from 'mobx-react'
import {action, observable, toJS} from 'mobx'
import {
  Table, Badge, Divider, Alert, Spin, Button,
} from 'antd'
import QuestionTooltip from '../component-question-tooltip'
import {getDataTypeByCode} from '../common/util'
import ModalTagEdit from './modal-tag-edit'
import ModalCateSelect from './modal-cate-select'

// 标签配置 - 填写配置信息
@observer
export default class StepTwo extends React.Component {
  @observable tagModalVisible = false // 标签编辑弹框

  @observable cateModalVisible = false // 类目选择弹框

  @observable editingTagIndex = -1 // 被选中编辑的标签的索引

  constructor(props) {
    super(props)

    const {store} = props

    this.columns = [
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
        render: pathIds => {
          pathIds = pathIds || []
          const lastId = pathIds[pathIds.length - 1]
          return store.cateMap[lastId] || ''
        },
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
        render: (v, record, index) => {
          return (
            <span>
              <a onClick={() => this.removeItem(index, record)}>移除</a>
              <Divider type="vertical" />
              <a onClick={() => this.showEditModal(index, record)}>编辑</a>
            </span>
          )
        },
      },
    ]
  }

  componentDidMount() {
    const {store} = this.props
    // 加载所属类目列表 TODO: 类目需要随时更新吗
    store.getCateList()
  }

  render() {
    const {store} = this.props
    const {secondTableList, secondSelectedRows} = store

    const {
      tagModalVisible, cateModalVisible, editingTagIndex,
      columns,
    } = this

    // 被选中编辑的标签对象
    const editingTag = secondTableList[editingTagIndex] || {}

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
              onClick={() => this.showCateModal()}
            >
              选择所属类目
            </Button>
            <QuestionTooltip tip="若您不选择标签所属类目，那么标签将被放在该对象的默认类目中" />
          </div>

          {/* 表格 */}
          <Table
            rowKey="dataFieldName"
            columns={columns}
            dataSource={store.secondTableList}
            rowSelection={{
              selectedRowKeys: store.secondSelectedRows.map(item => item.dataFieldName),
              onChange: this.onRowSelect,
            }}
          />

          {/* 编辑标签弹框 */}
          {
            tagModalVisible && (
              <ModalTagEdit
                tagDetail={toJS(editingTag)} // 传进去时toJS一下
                visible={tagModalVisible}
                onCancel={this.closeEditModal}
                onOk={this.handleTagEditConfirm}
                cateList={store.cateList}
              />
            )
          }

          {/* 类目选择弹框 */}
          {
            cateModalVisible && (
              <ModalCateSelect
                visible={cateModalVisible}
                options={store.cateList}
                onCancel={this.closeCateModal}
                onOk={this.handleCateConfirm}
              />
            )
          }
        </Spin>
      </div>
    )
  }

  // 选择行
  @action.bound onRowSelect(selectedRowKeys, selectedRows) {
    const {store} = this.props

    store.secondSelectedRows = selectedRows
  }

  // 移除某个标签（某行）
  @action.bound removeItem(index, record) {
    const {store} = this.props

    // 删除元素
    store.secondTableList.splice(index, 1)

    // 如果是被选中的，还需要更新选中数组
    store.secondSelectedRows = store.secondSelectedRows.filter(item => item.dataFieldName !== record.dataFieldName)
  }

  // 展开编辑弹框
  @action.bound showEditModal(index, record) {
    const {store} = this.props
    
    this.tagModalVisible = true
    this.editingTagIndex = index
  }

  // 关闭编辑弹框
  @action.bound closeEditModal() {
    this.tagModalVisible = false
  }

  // 编辑标签确定事件
  @action.bound handleTagEditConfirm(values, cb) {
    const {store} = this.props
    const index = this.editingTagIndex
    
    // 先不直接修改原列表数据，创建个副本拿去请求校验接口
    const tagListCopy = [...toJS(store.secondTableList)]

    // values的副本
    const valuesCopy = {}

    // 将undefined的值改成空字符串
    Object.keys(values).forEach(key => {
      valuesCopy[key] = values[key] === undefined ? '' : values[key]
    })

    // 替换掉编辑后的标签
    // （这里已知标签编辑弹框的表单fieldName和标签对象的字段一一对应，所以可以直接覆盖）
    tagListCopy[index] = {...tagListCopy[index], ...valuesCopy}

    console.log('secondTableList.length', store.secondTableList.length, 'tagListCopy', tagListCopy)

    store.checkTagList(tagListCopy, () => {
      cb && cb()
      this.closeEditModal()
    })
  }

  // 展开类目选择弹框
  @action.bound showCateModal = () => {
    this.cateModalVisible = true
  }

  // 关闭类目选择弹框
  @action.bound closeCateModal = () => {
    this.cateModalVisible = false
  }

  // 类目选择弹框确定事件
  @action.bound handleCateConfirm(values, cb) {
    const {store} = this.props

    store.secondSelectedRows.forEach(item => {
      item.pathIds = values.pathIds
    })

    // 更新类目后校验一遍
    store.checkTagList(() => {
      cb && cb()
      store.secondSelectedRows = []
      this.closeCateModal()
    })
  }
}
