import {Component} from 'react'
import {Modal} from 'antd'
import ModalForm from '../modal-form'
// import {errorTip} from '../../common/util'

export default class ConfigModal extends Component {
  selectContent= () => {
    const {
      workspace = [], projectId,
    } = this.props
    return [{
      label: '环境',
      key: 'workspaceId',
      placeholder: '请选择',
      rules: [
        '@requiredSelect',
      ],
      control: {
        options: workspace,
      },
      component: 'select',
      extra:
  <span>
          若无可用的环境，请到
    <a target="_blank" rel="noopener noreferrer" href={`/project/index.html?projectId=${projectId}#/detail/env`}>项目管理-环境配置</a>
          中添加环境
  </span>,
    }]
  }

  submit = () => {
    this.form.validateFields((err, value) => {
      if (!err) {
        this.props.submit(value)
      }
    })
  }

  render() {
    const {
      visible, 
      handleCancel,
      // confirmLoading,
    } = this.props
    const modalConfig = {
      title: '初始化',
      visible,
      onCancel: () => handleCancel(),
      onOk: this.submit,
      maskClosable: false,
      width: 525,
      destroyOnClose: true,
      // confirmLoading,
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
