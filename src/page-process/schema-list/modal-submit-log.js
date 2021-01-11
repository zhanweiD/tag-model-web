import intl from 'react-intl-universal'
/**
 * @description 查询提交
 */
import { Component } from 'react'
import { observer } from 'mobx-react'
import { action, toJS } from 'mobx'
import { Modal, Button, Spin } from 'antd'

@observer
class ModalSubmitLog extends Component {
  constructor(props) {
    super(props)
    this.store = props.store
  }

  @action.bound handleCancel() {
    this.store.modalLogVisible = false
    this.store.submitLog = ''
  }

  render() {
    const { modalLogVisible, submitLog, submitLogLoading } = this.store

    return (
      <Modal
        visible={modalLogVisible}
        maskClosable={false}
        destroyOnClose
        title={intl
          .get(
            'ide.src.page-manage.page-tag-sync.sync-detail.modal-log.btekxc28nyd'
          )
          .d('日志')}
        onOk={this.handleSubmit}
        onCancel={this.handleCancel}
        footer={[
          <Button key="back" onClick={this.handleCancel} type="primary">
            {intl
              .get('ide.src.component.modal-stroage-detail.main.ph80bkiru5h')
              .d('关闭')}
          </Button>,
        ]}
      >
        <Spin spinning={submitLogLoading}>
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
        </Spin>
      </Modal>
    )
  }
}
export default ModalSubmitLog
