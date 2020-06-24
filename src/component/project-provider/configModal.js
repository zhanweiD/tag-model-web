import {Component} from 'react'
import {action, toJS} from 'mobx'
import {observer} from 'mobx-react'
import {Modal, Spin} from 'antd'
import ModalForm from '../modal-form'
import {errorTip} from '../../common/util'

@observer
export default class ConfigModal extends Component {
  constructor(props) {
    super(props)
    this.store = props.store
  }

  selectContent= () => {
    const {
      dataSource = [],
    } = this.store
    return [{
      label: '环境',
      key: 'workspaceId',
      placeholder: '请选择',
      rules: [
        '@requiredSelect',
      ],
      control: {
        options: dataSource,
        // onSelect: v => this.selectDataTypeSource(v),
      },
      component: 'select',
    }]
  }

  @action handleCancel = () => {
    this.store.visible = false
  }

  @action submit = () => {
    this.form.validateFields((err, value) => {
      if (!err) {
        this.store.visible = false
        console.log(value)
        // this.store.confirmLoading = true
        // this.store.initProject(value)
      } else {
        this.store.confirmLoading = false
        errorTip(err)
      }
    })
  }

  render() {
    const {
      visible, 
      confirmLoading,
    } = this.store
    const modalConfig = {
      title: '初始化',
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
