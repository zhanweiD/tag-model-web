import {Component} from 'react'
import {action, toJS} from 'mobx'
import {observer, inject} from 'mobx-react'
import {Modal, Button} from 'antd'

@observer
export default class ModalLog extends Component {
  constructor(props) {
    super(props)
    this.store = props.store
  }

  @action handleCancel = () => {
    this.store.visibleLog = false
    this.store.log = ''
  }

  render() {
    const {visibleLog, log} = this.store
    
    const modalConfig = {
      title: '日志',
      visible: visibleLog,
      onCancel: this.handleCancel,
      maskClosable: false,
      width: 525,
      destroyOnClose: true,
      footer: [<Button onClick={this.handleCancel}>关闭</Button>],
    } 
    return (
      <Modal {...modalConfig}>
        <div style={{
          minHeight: '200px', maxHeight: '500px', overflow: 'auto', whiteSpace: 'pre-wrap',
        }}
        >
          {
            toJS(log)
          }
        </div>
      </Modal>
    )
  }
}
