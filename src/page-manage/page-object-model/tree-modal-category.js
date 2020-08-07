import {Component} from 'react'
import {action} from 'mobx'
import {observer} from 'mobx-react'
import {Modal, Button} from 'antd'
import {Time} from '../../common/util'
import {ModalForm, ModalDetail} from '../../component'
import {targetTypeMap, nameTypeMap, modalDefaultConfig} from './util'

@observer
export default class ModalCategory extends Component {
  constructor(props) {
    super(props)
    this.store = props.store
  }

  renderContent() {
    const {categoryModal: {editType}} = this.store
    // 查看详情
    if (editType === 'view') {
      return this.renderDetail()
    }
    // 编辑/添加
    return this.renderEditModal()
  }

  /**
   * @description 渲染编辑弹窗
   */
  renderEditModal() {
    const {
      categoryModal: {
        detail,
        editType,
        visible,
      }, 
      confirmLoading,
    } = this.store

    const content = [{
      label: '类目名称',
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
      label: '描述',
      key: 'descr',
      initialValue: detail.descr,
      component: 'textArea',
      rules: [
        '@max128',
      ],
    }]

    const modalConfig = {
      title: editType === 'edit' ? '编辑对象类目' : '新建对象类目',
      visible,
      onCancel: this.handleCancel,
      onOk: this.submit,
      confirmLoading,
      ...modalDefaultConfig,
    }

    const formConfig = {
      selectContent: visible && content,
      wrappedComponentRef: form => { this.form = form ? form.props.form : form },
    }

    return (
      <Modal {...modalConfig}>
        <ModalForm {...formConfig} />
      </Modal>
    )
  }

  /**
   * @description 渲染详情弹窗
   */
  renderDetail() {
    const {categoryModal} = this.store
    const {detail} = categoryModal

    const modalConfig = {
      title: '对象类目详情',
      visible: categoryModal.visible,
      onCancel: this.handleCancel,
      onOk: this.submit,
      footer: [<Button onClick={this.handleCancel}>关闭</Button>],
      ...modalDefaultConfig,
    }

    const content = [{
      name: '类目名称',
      value: detail.name,
    }, {
      name: '创建者',
      value: detail.creator,
    }, {
      name: '创建时间',
      value: <Time timestamp={detail.createTime} />,
    }, {
      name: '描述',
      value: detail.descr,
    }]

    return (
      <Modal {...modalConfig}>
        <ModalDetail data={content} />
      </Modal>
    )
  }

  @action checkName = (rule, value, callback) => {
    const {categoryModal: {detail}} = this.store

    const params = {
      name: value,
      type: targetTypeMap.category, // 类型:0 类目 1 对象
      nameType: nameTypeMap[rule.field], // 名称类型: 1 中文名 2 英文名
    }

    // 编辑状态
    if (detail.aId) {
      params.id = detail.aId
    }
    
    this.store.checkName(params, callback)
  }

  @action.bound handleCancel() {
    this.store.categoryModal.visible = false
    this.store.confirmLoading = false
  }

  submit = () => {
    const t = this
    const {store} = t
    const {
      categoryModal: {
        editType, 
        detail,
        type,
      },
    } = store

    this.form.validateFields((err, values) => {
      if (!err) {
        // 编辑 
        if (editType === 'edit') {
          const params = {id: detail.id, ...values}
          store.editNode(params, type, () => {
            t.handleCancel()
          })
        } else {
          // 新增
          store.addNode(values, type, () => {
            t.handleCancel()
          })
        }
      }
    })
  }

  render() {
    return this.renderContent()
  }
}
