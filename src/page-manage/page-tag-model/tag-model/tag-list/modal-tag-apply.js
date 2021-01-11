import intl from 'react-intl-universal'
import { Component } from 'react'
import { action } from 'mobx'
import { observer } from 'mobx-react'
import { Modal } from 'antd'
import { ModalForm } from '../../../../component'

@observer
class ModalTagAppl extends Component {
  constructor(props) {
    super(props)
    this.store = props.store
  }

  selectContent = () => [
    {
      label: intl
        .get(
          'ide.src.page-common.approval.common.comp-approval-modal.qskkf95ea1k'
        )
        .d('申请理由'),
      key: 'applyDescr',
      component: 'textArea',
      rules: ['@transformTrim', '@required', '@max128'],
    },
  ]

  @action handleCancel = () => {
    this.store.tagApplyVisible = false
  }

  submit = () => {
    const t = this
    const { store } = t

    this.form.validateFields((err, values) => {
      if (!err) {
        const { applyInfo } = store

        const params = {
          type: applyInfo.type,
          id: applyInfo.id,
          ...values,
        }

        store.tagApply(params)
      }
    })
  }

  render() {
    const { tagApplyVisible: visible, applyInfo, confirmLoading } = this.store
    const modalConfig = {
      title: intl
        .get('ide.src.page-manage.page-common-tag.common-tag.list.0ho0lb3mlo86')
        .d('申请'),
      visible,
      onCancel: this.handleCancel,
      onOk: this.submit,
      maskClosable: false,
      width: 525,
      destroyOnClose: true,
      confirmLoading,
    }

    const formConfig = {
      selectContent: visible && this.selectContent(),
      wrappedComponentRef: form => {
        this.form = form ? form.props.form : form
      },
    }

    return (
      <Modal {...modalConfig}>
        <ModalForm {...formConfig} />
      </Modal>
    )
  }
}
export default ModalTagAppl
