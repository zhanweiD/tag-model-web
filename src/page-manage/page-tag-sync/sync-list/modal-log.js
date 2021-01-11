import intl from 'react-intl-universal'
import { Component } from 'react'
import { action, toJS } from 'mobx'
import { observer, inject } from 'mobx-react'
import { Modal, Button } from 'antd'

@inject('bigStore')
@observer
class ModalLog extends Component {
  constructor(props) {
    super(props)
    this.store = props.bigStore
  }

  @action handleCancel = () => {
    this.store.visibleLog = false
  }

  render() {
    const { visibleLog, submitLog } = this.store

    const modalConfig = {
      title: intl
        .get('ide.src.page-manage.page-tag-sync.sync-list.main.r93qum4tmg')
        .d('提交日志'),
      visible: visibleLog,
      onCancel: this.handleCancel,
      maskClosable: false,
      width: 525,
      destroyOnClose: true,
      footer: [
        <Button onClick={this.handleCancel}>
          {intl
            .get('ide.src.component.modal-stroage-detail.main.ph80bkiru5h')
            .d('关闭')}
        </Button>,
      ],
    }

    return (
      <Modal {...modalConfig}>
        <div
          style={{
            minHeight: '200px',
            maxHeight: '500px',
            overflow: 'auto',
            whiteSpace: 'pre-wrap',
          }}
        >
          {toJS(submitLog)}
        </div>
      </Modal>
    )
  }
}
export default ModalLog
