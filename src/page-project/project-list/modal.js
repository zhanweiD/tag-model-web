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

  /**
   * @description 选择数据源；请求计算引擎
   * @param {*} storageId 数据源id
   */
  @action.bound selectDataSource(storageId) {
    this.form.resetFields(['engineId'])
    this.store.getEnginesSource(storageId)
  }


  selectContent= () => {
    const {
      detail, selectLoading, dataSource = [], dataEnginesSource = [], dataGroupData = [],
    } = this.store
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
        onSelect: v => this.selectDataSource(v),
      },
      selectLoading, // 下拉框loading效果
      component: 'select',
      extra: <span>
若无可用的数据源，请先
        <a className="ml4" target="_blank" rel="noopener noreferrer" href="/ent/datasource#/">添加数据源或授权</a>
             </span>,
    }, {
      label: '计算引擎',
      key: 'engineId',
      initialValue: detail.engineId,
      rules: [
        '@requiredSelect',
      ],
      control: {
        options: dataEnginesSource,
      },
      component: 'select',
    }, {
      label: '资源组',
      key: 'groupIdList',
      initialValue: detail.groupIdList || undefined,
      rules: [
        '@requiredSelect',
      ],
      control: {
        mode: 'multiple',
        options: dataGroupData,
      },
      component: 'select',
      extra: <span>
若无可用的数据源，请先
        <a className="ml4" target="_blank" rel="noopener noreferrer" href="/ent/resource#/">添加资源组或授权</a>
             </span>,
    }, {
      label: '调度队列',
      key: 'queueName',
      initialValue: detail.queueName,
      component: 'input',
      rules: [
        '@transformTrim',
        '@required',
        '@max32',
      ],
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
