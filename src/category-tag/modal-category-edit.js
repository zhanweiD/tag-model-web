import {Component} from 'react'
import {
  Modal, Form, Input, Spin,
} from 'antd'
import {observable, action} from 'mobx'
import {observer, inject} from 'mobx-react'
import {isExitMsg} from '../common/constants'
import {getNamePattern} from '../common/util'

const FormItem = Form.Item

@inject('bigStore')
@observer
class ModalEditCategory extends Component {
  constructor(props) {
    super(props)
    this.bigStore = this.props.bigStore
    this.store = this.bigStore.categoryStore
  }

  @action.bound handleOnCancel() {
    const {form} = this.props
    this.store.cateDetail = false
    this.store.modalVisible.editCategory = false
    form.resetFields()
  }

  @action.bound handleOnOk() {
    const {form: {validateFields}} = this.props
    const {eStatus: {editCategory}, cateDetail, currentTreeItemKey} = this.store
    const {typeCode} = this.bigStore

    validateFields((err, values) => {
      if (!err) {
        const param = {
          name: values.name,
          descr: values.descr,
          objTypeCode: typeCode,
          level: cateDetail.level,
        }

        if (editCategory) {
          param.id = cateDetail.id
          param.parentId = cateDetail && cateDetail.parentId
        } else {
          param.parentId = currentTreeItemKey
        }
        
        this.store.updateCategory(param)
      }
    })
  }

  @action.bound handleNameValidator(rule, value, callback) {
    const {eStatus: {editCategory}, currentTreeItemKey} = this.store
    if (value) {
      // 后端校验
      const param = {}
      param.isEdit = +editCategory
      param.name = value
      param.objTypeCode = this.bigStore.typeCode
      // type(标签:0 类目:1 对象:2)
      param.type = 1
      // nameType(中文名:1 英文名:2)
      param.nameType = rule.field === 'name' ? 1 : 2
      param.treeId = currentTreeItemKey

      const backPromise = this.store.checkIsExist(param)
      backPromise.then(content => {
        if (content.isExist) return callback(isExitMsg)
        callback()
      })
    } else {
      callback()
    }
  }

  render() {
    const {form: {getFieldDecorator}} = this.props
    const {
      cateDetail, eStatus: {editCategory}, modalVisible, confirmLoading, currentTreeItemKey,
    } = this.store

    const modalProps = {
      title: editCategory ? '编辑类目' : '添加类目',
      visible: modalVisible.editCategory,
      onCancel: this.handleOnCancel,
      onOk: this.handleOnOk,
      maskClosable: false,
      width: 520,
      destroyOnClose: true,
      confirmLoading,
    }

    const formItemLayout = {
      labelCol: {span: 4},
      wrapperCol: {span: 20},
      colon: false,
    }

    return (
      <Modal {...modalProps}>
        <Form>
          <Spin spinning={this.store.detailLoading}>

            <FormItem {...formItemLayout} label="名称">
              {getFieldDecorator('name', {
                initialValue: editCategory ? cateDetail.name : undefined,
                rules: [
                  {required: true, message: '名称不可为空'},
                  ...getNamePattern(),
                  {validator: this.handleNameValidator},
                ],
                validateFirst: true,
              })(<Input autoComplete="off" placeholder="不超过20个字，允许中文、英文、数字或下划线" />)}
            </FormItem>

            <FormItem {...formItemLayout} label="所属类目">
              {(() => {
                if (cateDetail.parentId === 0) {
                  return '--'
                }

                if (editCategory) {
                  if (cateDetail.catePath) {
                    return cateDetail.catePath
                  }
                  return '--'
                }

                if (cateDetail.catePath) { // 添加子级
                  return `${cateDetail.catePath}/${cateDetail.name}`
                }
                return cateDetail.name
              })()}
            </FormItem>

            <FormItem {...formItemLayout} label="描述">
              {getFieldDecorator('descr', {
                rules: [
                  {transform: value => value.trim()},
                  {max: 100, message: '描述不能超过100个字符'},
                ],
                initialValue: editCategory ? cateDetail.descr : undefined,
              })(<Input.TextArea autoComplete="off" rows="3" placeholder="不超过100个字" />)}
            </FormItem>
          </Spin>
        </Form>
      </Modal>
    )
  }
}

export default Form.create()(ModalEditCategory)
