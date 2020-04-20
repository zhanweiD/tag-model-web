import {Component} from 'react'
import {action, toJS} from 'mobx'
import {observer} from 'mobx-react'
import {Modal, Spin} from 'antd'
import {ModalForm} from '../../component'

@observer
export default class ModalStotage extends Component {
  constructor(props) {
    super(props)
    this.store = props.store
  }

  @action.bound selectStorageType(type) {
    this.form.resetFields(['dataStorageId'])
    this.store.getStorageSelectList({
      storageType: type,
    })
  }

  selectContent= () => {
    const {storageType, storageSelectList, storageTypeLoading, storageSelectLoading} = this.store
    return [{
      label: '数据源类型',
      key: 'storageType',
      component: 'select',
      rules: [
        '@requiredSelect',
      ],
      control: {
        options: toJS(storageType),
        onSelect: v => this.selectStorageType(v),
        notFoundContent: storageTypeLoading ? <Spin size="small" /> : null, 
      },
    }, {
      label: '数据源',
      key: 'dataStorageId',
      component: 'select',
      rules: [
        '@requiredSelect',
      ],
      control: {
        options: toJS(storageSelectList),
        notFoundContent: storageSelectLoading ? <Spin size="small" /> : null, 
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
      title: '添加数据源',
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
