import intl from 'react-intl-universal'
import {Component} from 'react'
import {action} from 'mobx'
import {observer} from 'mobx-react'
import {Modal} from 'antd'
import {ModalForm} from '../../../component'
import {modalDefaultConfig, judgeEditType} from '../util'
import {debounce} from '../../../common/util'

@observer
class ModalCategory extends Component {
  constructor(props) {
    super(props)
    this.store = props.store
  }

  /**
   * @description 渲染编辑弹窗
   */
  renderEditModal() {
    const {
      categoryModal: {detail, title, editType, visible},

      confirmLoading,
    } = this.store

    const content = [
      {
        label: intl
          .get(
            'ide.src.page-manage.page-object-model.object-list.object-list.modal-category.aps4bfdj6ls'
          )
          .d('类目名称'),
        key: 'name',
        initialValue: judgeEditType(detail.name, editType),
        component: 'input',
        rules: [
          '@namePattern',
          '@nameUnderline',
          '@nameShuQi',
          '@transformTrim',
          '@required',
          '@max32',
          {validator: this.checkName}, // here warning
        ],
      },
      {
        label: intl
          .get('ide.src.component.modal-stroage-detail.main.lyqo7nv5t9h')
          .d('描述'),
        key: 'descr',
        initialValue: judgeEditType(detail.descr, editType),
        component: 'textArea',
        rules: ['@max128'],
      },
    ]

    const modalConfig = {
      title:
        editType === 'edit'
          ? intl
            .get(
              'ide.src.page-manage.page-object-model.object-list.object-list.modal-category.n5fnnbqmunm',
              {title}
            )
            .d('编辑{title}')
          : intl
            .get(
              'ide.src.page-manage.page-object-model.object-list.object-list.modal-category.n8jyftw6qej',
              {title}
            )
            .d('添加{title}'),
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

  @action checkName = (rule, value, callback) => {
    const {
      categoryModal: {detail, editType},
    } = this.store

    const params = {
      name: value,
    }

    // 编辑状态
    if (editType === 'edit') {
      params.id = detail.aId
    }
    debounce(() => this.store.checkName(params, callback), 500)
    // this.store.checkName(params, callback)
  }

  @action.bound handleCancel() {
    this.store.categoryModal.visible = false
    this.store.confirmLoading = false
  }

  submit = () => {
    const t = this
    const {store} = t

    const {
      categoryModal: {editType, detail},
    } = store

    this.form.validateFields((err, values) => {
      if (!err) {
        const params = {
          level: detail.level,
          parentId: detail.aId,
          ...values,
        }

        // 编辑
        if (editType === 'edit') {
          store.editNode(
            {
              id: detail.id,
              ...values,
            },
            () => {
              t.handleCancel()
              t.props.editNodeSuccess()
            }
          )
        } else {
          // 新增
          store.addNode(params, () => {
            t.handleCancel()
          })
        }
      }
    })
  }

  render() {
    return this.renderEditModal()
  }
}
export default ModalCategory
