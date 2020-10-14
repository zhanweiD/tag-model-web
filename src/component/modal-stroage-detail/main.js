import {Component} from 'react'
import {Modal, Button, Spin} from 'antd'
import ModalDetail from '../modal-detail'

export default class ModalStotageDetail extends Component {
  render() {
    const {
      visible, detail, loading = false, handleCancel,
    } = this.props

    const content = [{
      name: '名称',
      value: detail.storageName,
    }, {
      name: '资源组',
      value: detail.relGroupName,
    }, {
      name: '类型',
      value: detail.storageType,
    }, {
      name: '地址',
      value: detail.connectUrl,
    }, {
      name: '数据库',
      value: detail.dbName,
    }, {
      name: '用户名',
      value: detail.userName,
    }, {
      name: '描述',
      value: detail.descr,
    }]


    const modalConfig = {
      title: '查看数据源',
      visible,
      onCancel: () => handleCancel(),
      maskClosable: false,
      width: 525,
      destroyOnClose: true,
      footer: [<Button onClick={() => handleCancel()}>关闭</Button>],
    }

    return (
      <Modal {...modalConfig}>
        <Spin spinning={loading}>
          <ModalDetail data={content} labelWidth={40} />
        </Spin>
      </Modal>
    )
  }
}
