import intl from 'react-intl-universal'
import { Component } from 'react'
import { action, toJS } from 'mobx'
import { observer, inject } from 'mobx-react'
import { Modal, Button } from 'antd'

@observer
class ModalLog extends Component {
  constructor(props) {
    super(props)
    this.store = props.store
  }

  @action handleCancel = () => {
    this.store.visibleLog = false
    this.store.log = ''
  }

  render() {
    const { visibleLog, log } = this.store

    const modalConfig = {
      title: intl
        .get(
          'ide.src.page-manage.page-tag-sync.sync-detail.modal-log.btekxc28nyd'
        )
        .d('日志'),
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
          {toJS(log)}
        </div>
      </Modal>
    )
  }
}
export default ModalLog
