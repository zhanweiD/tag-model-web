import {Component} from 'react'
import {action} from 'mobx'
import {observer} from 'mobx-react'
import {Modal} from 'antd'
import {ModalForm} from '../../../../component'

@observer
export default class ModalTagAppl extends Component {
  constructor(props) {
    super(props)
    this.store = props.store
  }

  selectContent= () => [{
    label: '申请理由',
    key: 'applyDescr',
    component: 'textArea',
    rules: [
      '@transformTrim',
      '@required',
      '@max128',
    ],
  }]

  @action handleCancel = () => {
    this.store.tagApplyVisible = false
  }

  submit = () => {
    const t = this
    const {store} = t

    this.form.validateFields((err, values) => {
      if (!err) {
        const {applyInfo} = store

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
    const {
      tagApplyVisible: visible, 
      applyInfo, 
      confirmLoading,
    } = this.store
    const modalConfig = {
      title: `${+applyInfo.type === 1 ? '上架' : '下架'}申请`,
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
