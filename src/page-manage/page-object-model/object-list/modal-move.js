import intl from 'react-intl-universal'
import {Component} from 'react'
import {action} from 'mobx'
import {observer} from 'mobx-react'
import {Modal} from 'antd'
import {ModalForm} from '../../../component'
import {changeToOptions} from '../../../common/util'
import {modalDefaultConfig} from '../util'

@observer
class ModalMove extends Component {
  constructor(props) {
    super(props)
    this.store = props.store
  }

  @action.bound handleCancel() {
    this.store.modalMove.visible = false
    this.store.confirmLoading = false
  }

  submit = () => {
    const t = this
    const {store} = t
    const {
      modalMove: {selectKeys},
    } = store

    t.form.validateFields((err, values) => {
      if (!err) {
        const params = {
          ids: selectKeys.slice(),
          ...values,
        }

        store.moveTag(params, () => {
          t.props.moveSuccess()
          t.handleCancel()
        })
      }
    })
  }

  render() {
    const {
      modalMove,
      confirmLoading,
      categoryData = [],
      currentSelectKeys,
    } = this.store

    const categData = categoryData.length
      ? categoryData.filter(d => +d.id !== +currentSelectKeys)
      : []

    const content = [
      {
        label: intl
          .get(
            'ide.src.page-manage.page-object-model.object-list.object-list.modal-category.aps4bfdj6ls'
          )
          .d('类目名称'),
        key: 'targetId',
        component: 'select',
        rules: ['@requiredSelect'],

        control: {
          options: changeToOptions(categData)('name', 'id'),
        },
      },
    ]

    const modalConfig = {
      title: intl
        .get(
          'ide.src.page-manage.page-object-model.object-list.object-list.modal-move.0e0hc9fvvfzc'
        )
        .d('移动至'),
      visible: modalMove.visible,
      onCancel: this.handleCancel,
      onOk: this.submit,
      confirmLoading,
      ...modalDefaultConfig,
    }

    const formConfig = {
      selectContent: modalMove.visible && content,
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
