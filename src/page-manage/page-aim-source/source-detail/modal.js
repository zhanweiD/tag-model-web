import intl from 'react-intl-universal'
import { Component } from 'react'
import { action, toJS } from 'mobx'
import { observer } from 'mobx-react'
import { Modal } from 'antd'
import { ModalForm } from '../../../component'

@observer
class ModalTagConfig extends Component {
  constructor(props) {
    super(props)
    this.store = props.store
  }

  selectContent = () => {
    const { objList, tagList } = this.store
    return [
      {
        label: intl
          .get(
            'ide.src.page-manage.page-aim-source.source-detail.modal.hdb36gt6rzf'
          )
          .d('对象'),
        key: 'objId',
        component: 'select',
        rules: ['@requiredSelect'],

        control: {
          options: toJS(objList),
          onSelect: v => this.selectObj(v),
        },
      },

      {
        label: intl
          .get(
            'ide.src.page-manage.page-aim-source.source-detail.main.63kvhqd3cw8'
          )
          .d('标签名称'),
        key: 'tagId',
        component: 'select',
        rules: ['@requiredSelect'],

        control: {
          options: toJS(tagList),
        },
      },
    ]
  }

  @action.bound selectObj(v) {
    this.form.resetFields(['tagId'])
    this.store.getTagList({
      objId: v,
    })
  }

  @action handleCancel = () => {
    this.store.visible = false
  }

  submit = () => {
    const t = this

    this.form.validateFields((err, values) => {
      if (!err) {
        const params = {
          tagId: values.tagId,
          id: t.store.fieldDetail.id,
        }

        t.store.configTag(params, () => {
          t.handleCancel()
        })
      }
    })
  }

  render() {
    const { visible, confirmLoading } = this.store
    const modalConfig = {
      title: intl
        .get(
          'ide.src.page-manage.page-aim-source.source-detail.main.6pm0gqavven'
        )
        .d('标签映射'),
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
export default ModalTagConfig
