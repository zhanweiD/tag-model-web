import intl from 'react-intl-universal'
import {Component} from 'react'
import {action, observable} from 'mobx'
import {observer} from 'mobx-react'
import {Modal, Table, Alert, Button} from 'antd'
import {OmitTooltip} from '../../../component'

const columns = [
  {
    title: intl
      .get('ide.src.page-manage.page-aim-source.source-detail.main.63kvhqd3cw8')
      .d('标签名称'),
    dataIndex: 'name',
    render: text => <OmitTooltip maxWidth={120} text={text} />,
  },
  {
    title: intl
      .get('ide.src.business-component.tag-relate.dag-box.xs30zaqk60p')
      .d('标签标识'),
    dataIndex: 'enName',
    render: text => <OmitTooltip maxWidth={120} text={text} />,
  },
  {
    title: intl
      .get('ide.src.business-component.tag-relate.dag-box.zfaw0a4v7jh')
      .d('数据类型'),
    dataIndex: 'valueTypeName',
  },
  {
    title: intl
      .get(
        'ide.src.page-manage.page-object-model.object-list.object-detail.tag-list.hyc6hqhiwj8'
      )
      .d('创建方'),
    dataIndex: 'creator',
    render: (text, record) => (
      <span>
        {record.createType === 1
          ? intl
            .get(
              'ide.src.page-manage.page-common-tag.common-tag.list.bty454nguz'
            )
            .d('租户')
          : record.projectName}
      </span>
    ),
  },
  {
    title: intl
      .get('ide.src.component.modal-stroage-detail.main.lyqo7nv5t9h')
      .d('描述'),
    dataIndex: 'descr',
    render: text => (text ? <OmitTooltip maxWidth={120} text={text} /> : '-'),
  },
]

@observer
class ModalSelectTag extends Component {
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
    this.store.getTagList(
      {
        cateId: this.store.defaultCate.id,
        currentPage: pagination.current,
        pageSize: pagination.pageSize,
      },
      'modal'
    )
  }

  @action.bound handleOk() {
    const t = this
    const {store} = this
    const {tagList, currentSelectKeys} = store

    store.moveTag(
      {
        ids: t.selectedRowKeys.slice(),
        targetId: currentSelectKeys,
      },
      () => {
        // 1. 选择标签成功；刷新标签类目树
        store.getTagCateTree()

        // 2. 选择标签成功；刷新标签列表
        store.getTagList(
          {
            currentPage: 1,
            pageSize: tagList.pageSize,
            cateId: currentSelectKeys,
          },
          'list'
        )

        store.modalSelectTagVisible = false
        t.destory()
      }
    )
  }

  @action.bound destory() {
    this.selectedRowKeys.clear()
    this.store.tagListModal.list.clear()
    this.store.tagListModal.currentPage = 1
    this.store.tagListModal.pageSize = 5
    this.store.confirmLoading = false
  }

  render() {
    const {
      modalSelectTagVisible: visible,
      tagListModal,
      confirmLoading,
    } = this.store
    const selectedRowKeysLength = this.selectedRowKeys.length
    const modalConfig = {
      visible,
      width: 800,
      title: intl
        .get(
          'ide.src.page-manage.page-object-model.object-list.object-list.modal-select-tag.njsm9f1qxjq'
        )
        .d('选择标签'),
      maskClosable: false,
      destroyOnClose: true,
      onOk: this.handleOk,
      onCancel: this.handleCancel,
      footer: [
        <Button onClick={this.handleCancel}>
          {intl
            .get('ide.src.page-config.workspace-config.modal.xp905zufzth')
            .d('取消')}
        </Button>,
        <Button
          type="primary"
          onClick={e => this.handleOk(e)}
          disabled={!selectedRowKeysLength}
          loading={confirmLoading}
        >
          {intl
            .get('ide.src.page-config.workspace-config.modal.wrk0nanr55b')
            .d('确定')}
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
        <Alert
          message={intl
            .get(
              'ide.src.page-manage.page-object-model.object-list.object-list.modal-select-tag.rvng2hxqg6f',
              {selectedRowKeysLength}
            )
            .d('已选择 {selectedRowKeysLength} 项')}
          type="info"
          className="mb16"
        />
        <Table {...listConfig} />
      </Modal>
    )
  }
}
export default ModalSelectTag
