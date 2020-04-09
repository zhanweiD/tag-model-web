import {Component} from 'react'
import {action} from 'mobx'
import {observer} from 'mobx-react'
import {Modal} from 'antd'
import {ModalForm} from '../../component'

@observer
export default class ModalResource extends Component {
  constructor(props) {
    super(props)
    this.store = props.store
  }

  selectContent= () => {
    return [{
      label: '资源组名称',
      key: 'memberId',
      component: 'select',
      rules: [
        '@requiredSelect',
      ],
      control: {
        options: [],
      },
    }]
  }

  @action handleCancel = () => {
    this.store.visible = false
  }

  submit = () => {
    const t = this
    const {store} = this

    this.form.validateFields((err, values) => {
      if (!err) {
        // 新增
        store.addList(values, () => {
          t.handleCancel()
        })
      }
    })
  }

  render() {
    const {
      visible, confirmLoading,
    } = this.store
    const modalConfig = {
      title: '添加资源组',
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
