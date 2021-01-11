import intl from 'react-intl-universal'
import { Component } from 'react'
import { action } from 'mobx'
import { observer, inject } from 'mobx-react'
import { Modal } from 'antd'
import { ModalForm } from '../../component'
import { changeToOptions } from '../../common/util'
import { modalDefaultConfig } from './util'

@inject('bigStore')
@observer
class ModalMove extends Component {
  constructor(props) {
    super(props)
    this.store = props.store
    this.bigStore = props.bigStore
  }

  @action.bound handleCancel() {
    this.store.moveModal.visible = false
    this.store.confirmLoading = false
  }

  submit = () => {
    const t = this
    const { store } = t
    const {
      moveModal: { detail },
    } = store

    this.form.validateFields((err, values) => {
      if (!err) {
        const params = {
          ids: [detail.aId],
          ...values,
        }

        store.moveObject(params, () => {
          // 编辑节点为当前选中节点
          if (+detail.aId === +t.bigStore.objId) {
            // 刷新对象详情
            t.bigStore.updateDetailKey = Math.random()
          }

          t.handleCancel()
        })
      }
    })
  }

  render() {
    const {
      moveModal: { visible, detail },

      confirmLoading,
    } = this.store

    const content = [
      {
        label: intl
          .get(
            'ide.src.page-manage.page-object-model.object-list.object-list.modal-category.aps4bfdj6ls'
          )
          .d('类目名称'),
        key: 'targetId',
        initialValue: detail.parentId,
        component: 'select',
        rules: ['@requiredSelect'],

        control: {
          options: changeToOptions(this.store.categoryData)('name', 'aId'),
        },
      },
    ]

    const modalConfig = {
      title: intl
        .get(
          'ide.src.page-manage.page-object-model.object-list.object-list.modal-move.0e0hc9fvvfzc'
        )
        .d('移动至'),
      visible,
      onCancel: this.handleCancel,
      onOk: this.submit,
      confirmLoading,
      ...modalDefaultConfig,
    }

    const formConfig = {
      selectContent: visible && content,
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
export default ModalMove
