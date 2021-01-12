import intl from 'react-intl-universal'
import { Component } from 'react'
import { action } from 'mobx'
import { observer } from 'mobx-react'
import { Modal, Button, Spin } from 'antd'
import { ModalDetail } from '../../../component'

@observer
class ModalStotage extends Component {
  constructor(props) {
    super(props)
    this.store = props.store
  }

  @action handleCancel = () => {
    this.store.storageVisible = false
  }

  render() {
    const {
      storageVisible: visible,
      storageDetail: detail,
      detailLoading,
    } = this.store

    const content = [
      {
        name: intl
          .get('ide.src.component.modal-stroage-detail.main.mwdqg42vi')
          .d('名称'),
        value: detail.storageName,
      },
      {
        name: intl
          .get('ide.src.component.modal-stroage-detail.main.s5yt1bpsch')
          .d('资源组'),
        value: detail.relGroupName,
      },
      {
        name: intl
          .get('ide.src.component.modal-stroage-detail.main.pstwvdyitir')
          .d('类型'),
        value: detail.storageType,
      },
      {
        name: intl
          .get('ide.src.component.modal-stroage-detail.main.lko6v2zuhmq')
          .d('地址'),
        value: detail.connectUrl,
      },
      {
        name: intl
          .get('ide.src.component.modal-stroage-detail.main.ik44jd7nhpb')
          .d('数据库'),
        value: detail.dbName,
      },
      {
        name: intl
          .get('ide.src.component.modal-stroage-detail.main.sxkhuy0rzpc')
          .d('用户名'),
        value: detail.userName,
      },
      {
        name: intl
          .get('ide.src.component.modal-stroage-detail.main.lyqo7nv5t9h')
          .d('描述'),
        value: detail.descr,
      },
    ]

    const modalConfig = {
      title: intl
        .get('ide.src.component.modal-stroage-detail.main.v6urtgjoxwd')
        .d('查看数据源'),
      visible,
      onCancel: this.handleCancel,
      onOk: this.submit,
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
        <Spin spinning={detailLoading}>
          <ModalDetail data={content} />
        </Spin>
      </Modal>
    )
  }
}
export default ModalStotage
