import {Component} from 'react'
import {action} from 'mobx'
import {observer} from 'mobx-react'
import {Modal, Button} from 'antd'
import {ModalDetail} from '../../component'

@observer
export default class ModalStotage extends Component {
  constructor(props) {
    super(props)
    this.store = props.store
  }

  @action handleCancel = () => {
    this.store.visibleDetail = false
  }

  render() {
    const {
      visibleDetail, detail,
    } = this.store

    const content = [{
      name: '名称',
      value: detail.name,
    }, {
      name: '资源组',
      value: detail.name1,
    }, {
      name: '类型',
      value: detail.type,
    }, {
      name: '地址',
      value: detail.descr,
    }, {
      name: '数据库',
      value: detail.descr,
    }, {
      name: '用户名',
      value: detail.descr,
    }, {
      name: '描述',
      value: detail.descr,
    }]


    const modalConfig = {
      title: '查看数据源',
      visible: visibleDetail,
      onCancel: this.handleCancel,
      onOk: this.submit,
      maskClosable: false,
      width: 525,
      destroyOnClose: true,
      footer: [<Button onClick={this.handleCancel}>关闭</Button>],
    }

    return (
      <Modal {...modalConfig}>
        <ModalDetail data={content} />
      </Modal>
    )
  }
}
