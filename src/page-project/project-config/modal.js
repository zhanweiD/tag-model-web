import {Component} from 'react'
import {action} from 'mobx'
import {observer} from 'mobx-react'
import {Modal} from 'antd'
import {ModalForm} from '../../component'

@observer
export default class ModalProjectConfig extends Component {
  constructor(props) {
    super(props)
    this.store = props.store
  }

  selectContent= () => {
    const {detail, users, roles} = this.store
    const userList = detail.userName ? [{name: detail.userName, value: detail.userId}] : users
    
    return [{
      label: '用户名',
      key: 'memberId',
      initialValue: detail.userId,
      component: 'select',
      disabled: Boolean(detail.userId),
      rules: [
        '@requiredSelect',
      ],
      control: {
        options: userList,
      },
    }, {
      label: '角色',
      key: 'roleId',
      initialValue: detail.roleId,
      component: 'select',
      rules: [
        '@requiredSelect',
      ],
      control: {
        options: roles,
      },
    }]
  }

  @action handleCancel = () => {
    this.store.visible = false
  }

  submit = () => {
    const t = this
    const {store} = t

    this.form.validateFields((err, values) => {
      if (!err) {
        // 编辑 
        if (store.modalType === 'edit') {
          const params = {id: store.detail.id, ...values}
          store.editList(params, () => {
            t.handleCancel()
          })
        } else {
          // 新增
          store.addList(values, () => {
            t.handleCancel()
          })
        }
      }
    })
  }

  render() {
    const {
      visible, modalType, confirmLoading,
    } = this.store
    const modalConfig = {
      title: modalType === 'edit' ? '编辑成员' : '添加成员',
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
      wrappedComponentRef: form => { this.form = form ? form.props.form : form },
    }

    return (
      <Modal {...modalConfig}>
        <ModalForm {...formConfig} />
      </Modal>
    )
  }
}
