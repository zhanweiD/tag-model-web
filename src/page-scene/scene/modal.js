import {Component} from 'react'
import {action, toJS} from 'mobx'
import {observer} from 'mobx-react'
import {Modal} from 'antd'
import {ModalForm} from '../../component'

@observer
export default class ModalAdd extends Component {
  constructor(props) {
    super(props)
    this.store = props.store
  }

  selectContent= () => {
    const {info} = this.store
    return [{
      label: '名称',
      key: 'name',
      initialValue: info.name,
      component: 'input',
      rules: [
        '@transformTrim',
        '@required',
        '@max32',
        {validator: this.handleNameValidator},
      ],
    }, {
      label: '应用类型',
      key: 'dataStorageId',
      initialValue: info.dataStorageId,
      rules: [
        '@requiredSelect',
      ],
      control: {
        options: [],
      },
      component: 'select',
    }, {
      label: '数据应用',
      key: 'groupIdList',
      initialValue: info.groupIdList,
      rules: [
        '@requiredSelect',
      ],
      control: {
        options: [],
      },
      component: 'select',
      extra: <span>
        若无可用的数据应用，请先
        <a className="ml4" target="_blank" rel="noopener noreferrer" href="/ent/index.html#/resource/">去项目配置中添加数据应用</a>
      </span>,
    }, {
      label: '描述',
      key: 'descr',
      initialValue: info.descr,
      component: 'textArea',
      rules: [
        '@max128',
      ],
    }]
  }

  @action handleCancel = () => {
    const {store} = this.props
    store.modalVisible = false
    this.handleReset()
  }

  @action handleReset = () => {
    const {form: {resetFields}} = this.props
    resetFields()
  }

  @action handleSubmit = e => {
    const {form: {validateFieldsAndScroll}, store} = this.props

    validateFieldsAndScroll((err, values) => {
      if (err) {
        return
      }
      if (store.isEdit) {
        store.editScene({
          occasionId: store.info.id,
          ...values,
        }, () => {
          this.handleReset()
        })
      } else {
        store.addScene(values, () => {
          this.handleReset()
        })
      }
    })
  }

  checkName = (rule, value, callback) => {
    const params = {
      name: value,
    }

    if (this.store.detail.id) {
      params.id = this.store.detail.id
    }

    this.store.checkName(params, callback)
  }

  render() {
    const {
      store: {
        modalVisible: visible,
        isEdit,
        confirmLoading,
      }, 
    } = this.props

    const modalConfig = {
      title: isEdit ? '编辑场景' : '添加场景',
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
