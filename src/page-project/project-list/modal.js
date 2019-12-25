import {Component} from 'react'
import {action} from 'mobx'
import {observer} from 'mobx-react'
import {Modal} from 'antd'
import {ModalForm} from '../../component'

@observer
export default class ModalProject extends Component {
  constructor(props) {
    super(props)
    this.store = props.store
  }

  selectContent= () => {
    const {detail, selectLoading, dataSource = []} = this.store
    return [{
      label: '项目名称',
      key: 'name',
      initialValue: detail.name,
      component: 'input',
      rules: [
        '@transformTrim',
        '@required',
        '@max32',
        {validator: this.checkName},
      ],
    }, {
      label: '数据源类型',
      key: 'storageTypeName',
      initialValue: 'hive',
      rules: [
        '@requiredSelect',
      ],
      control: {
        options: [{
          name: 'hive',
          value: 'hive',
        }],
      },
      disabled: true, // 数据源类型禁选；默认hive
      component: 'select',
    }, {
      label: '数据源',
      key: 'dataStorageId',
      initialValue: detail.dataStorageId,
      rules: [
        '@requiredSelect',
      ],
      control: {
        options: dataSource,
      },
      selectLoading, // 下拉框loading效果
      component: 'select',
    }, {
      label: '描述',
      key: 'descr',
      initialValue: detail.descr,
      component: 'textArea',
      rules: [
        '@max128',
      ],
    }]
  }

  @action handleCancel = () => {
    this.store.visible = false
    // this.store.resetModal()
  }

  submit = () => {
    const t = this
    const {store} = t
    this.form.validateFields((err, values) => {
      if (!err) {
        // 编辑 
        if (store.type === 'edit') {
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
      visible, modalType, confirmLoading,
    } = this.store
    const modalConfig = {
      title: modalType === 'edit' ? '编辑项目' : '添加项目',
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
