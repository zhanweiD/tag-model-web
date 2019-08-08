import {Component} from 'react'
import {observer} from 'mobx-react'
import {action, toJS} from 'mobx'
import {
  Modal, Input, Table, Alert,
} from 'antd'

@observer
class ModalSelectTag extends Component {
  handleSubmit(e) {
    
  }

  @action handleCancel() {
    const {store} = this.props
    store.selectTagVisible = false
  }

  render() {
    const {store: {selectTagVisible = false}} = this.props

    return (
      <Modal
        width={800}
        visible={selectTagVisible}
        maskClosable={false}
        destroyOnClose
        title="选择标签"
        onOk={e => this.handleSubmit(e)}
        onCancel={() => this.handleCancel()}
      >
        <div>
          选择标签
        </div>
      </Modal>
    )
  }
}

export default ModalSelectTag
