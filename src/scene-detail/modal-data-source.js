import {Component} from 'react'
import {observer} from 'mobx-react'
import {action, toJS} from 'mobx'
import {
  Modal, Input, Table, Alert,
} from 'antd'

@observer
class ModalDataSource extends Component {
  handleSubmit(e) {
    
  }

  @action handleCancel() {
    const {store} = this.props
    store.dSourceVisible = false
  }

  render() {
    const {store: {dSourceVisible}} = this.props

    return (
      <Modal
        width={800}
        visible={dSourceVisible}
        maskClosable={false}
        destroyOnClose
        title="添加目的数据源"
        onOk={e => this.handleSubmit(e)}
        onCancel={() => this.handleCancel()}
      >
        <div>
          <Alert message="为了让标签通过API的方式输出，需要将标签映射至API所对应的目的数据源、目的数据表、目的字段" type="info" showIcon />
        </div>
      </Modal>
    )
  }
}

export default ModalDataSource
