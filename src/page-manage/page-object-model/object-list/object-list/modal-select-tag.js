import {Component} from 'react'
import {action, observable} from 'mobx'
import {observer} from 'mobx-react'
import {
  Modal, Table, Alert, Button,
} from 'antd'
import {OmitTooltip} from '../../../../component'

const columns = [
  {
    title: '标签名称',
    dataIndex: 'name',
    render: text => <OmitTooltip maxWidth={120} text={text} />,
  }, {
    title: '标签标识',
    dataIndex: 'enName',
    render: text => <OmitTooltip maxWidth={120} text={text} />,
  }, {
    title: '数据类型',
    dataIndex: 'valueTypeName',
  }, {
    title: '创建方',
    dataIndex: 'creator',
    render: (text, record) => <span>{record.createType === 1 ? '租户' : record.projectName}</span>,
  }, {
    title: '描述',
    dataIndex: 'descr',
    render: text => (text ? <OmitTooltip maxWidth={120} text={text} /> : '-'),
  },
]

@observer
export default class ModalSelectTag extends Component {
  @observable selectedRowKeys = []

  constructor(props) {
    super(props)
    this.store = props.store
  }

  // 关闭选择标签弹窗
  @action.bound handleCancel = () => {
    this.store.modalSelectTagVisible = false
    this.destory()
  }

  @action.bound changeRow(keys) {
    this.selectedRowKeys = keys
  }

  @action.bound changeTable(pagination) {
    this.store.getTagList({
      cateId: this.store.defaultCate.id,
      currentPage: pagination.current,
      pageSize: pagination.pageSize,
    }, 'modal')
  }

  @action.bound handleOk() {
    const t = this
    const {store} = this
    const {tagList, currentSelectKeys} = store

    store.moveTag({
      ids: t.selectedRowKeys.slice(),
      targetId: currentSelectKeys,
    }, () => {
      // 1. 选择标签成功；刷新标签类目树
      store.getTagCateTree()

      // 2. 选择标签成功；刷新标签列表
      store.getTagList({
        currentPage: 1,
        pageSize: tagList.pageSize,
        cateId: currentSelectKeys,
      }, 'list')

      store.modalSelectTagVisible = false
      t.destory()
    })
  }

  @action.bound destory() {
    this.selectedRowKeys.clear()
    this.store.tagListModal.list.clear()
    this.store.tagListModal.currentPage = 1
    this.store.tagListModal.pageSize = 5
    this.store.confirmLoading = false
  }

  render() {
    const {modalSelectTagVisible: visible, tagListModal, confirmLoading} = this.store
    const selectedRowKeysLength = this.selectedRowKeys.length
    const modalConfig = {
      visible,
      width: 800,
      title: '选择标签',
      maskClosable: false,
      destroyOnClose: true,
      onOk: this.handleOk,
      onCancel: this.handleCancel,
      footer: [
        <Button onClick={this.handleCancel}>取消</Button>,
        <Button 
          type="primary" 
          onClick={e => this.handleOk(e)} 
          disabled={!selectedRowKeysLength}
          loading={confirmLoading}
        >
          确定
        </Button>,
      ],
    }

    const rowSelection = {
      selectedRowKeys: this.selectedRowKeys,
      onChange: this.changeRow,
    }

    const listConfig = {
      columns,
      rowKey: 'id',
      rowSelection,
      loading: tagListModal.loading,
      dataSource: tagListModal.list,
      pagination: {
        current: tagListModal.currentPage,
        pageSize: tagListModal.pageSize,
        total: tagListModal.total,
      },
      style: {maxHeight: '400px', overflowY: 'auto'},
      onChange: this.changeTable,
    }
    return (
      <Modal {...modalConfig}>
        {/* wait */}
        <Alert message={`已选择 ${selectedRowKeysLength} 项`} type="info" className="mb16" />
        <Table {...listConfig} />
      </Modal>
    )
  }
}
