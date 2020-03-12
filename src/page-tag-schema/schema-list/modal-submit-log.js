/**
 * @description 查询提交
 */
import {Component} from 'react'
import {observer} from 'mobx-react'
import {action} from 'mobx'
import {
  Modal, Button,
} from 'antd'

@observer
export default class ModalSubmitLog extends Component {
  constructor(props) {
    super(props)
    this.store = props.store
  }

  @action.bound handleCancel() {
    this.store.modalLogVisible = false
    this.store.submitLog = ''
  }

  render() {
    const {modalLogVisible, submitLog} = this.store
    return (
      <Modal
        visible={modalLogVisible}
        maskClosable={false}
        destroyOnClose
        title="日志"
        onOk={this.handleSubmit}
        onCancel={this.handleCancel}
        footer={[
          <Button key="back" onClick={this.handleCancel}>
            关闭
          </Button>,
        ]}
      >
        <div style={{minHeight: '200px', maxHeight: '500px', overflow: 'auto'}}>
          {submitLog}
        </div>
      </Modal>
    )
  }
}
