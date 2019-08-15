/**
 * 场景详情标签树-类目(编辑/添加)弹窗
 */
import {Component} from 'react'
import {
  Modal, Form, Input, Spin,
} from 'antd'
import {observable, action} from 'mobx'
import {observer, inject} from 'mobx-react'
import {isExitMsg} from '../common/constants'

const FormItem = Form.Item

@inject('bigStore')
@observer
class ModalEditCategory extends Component {
  constructor(props) {
    super(props)
    this.bigStore = props.bigStore
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
    // const {typeCode} = this.bigStore
    console.log(cateDetail)

    validateFields((err, values) => {
      if (!err) {
        const params = {
          name: values.name,
          descr: values.descr,
        }

        // 判断节点父级是否为对象
        let parentIsObj = false

        // cateDetail.type = 2; 对象下添加类目; 父id字段为objId
        if (cateDetail.type) {
          params.objId = currentTreeItemKey
          parentIsObj = true
        } else {
          params.catId = currentTreeItemKey
        }

        console.log(params)
        // if (editCategory) {
        //   param.id = cateDetail.id
        //   param.parentId = cateDetail && cateDetail.parentId
        // } else {
        //   param.parentId = currentTreeItemKey
        // }
        
        this.store.updateCategory(params, parentIsObj)
      }
    })
  }

  @action.bound handleNameValidator(rule, value, callback) {
    const {currentTreeItemKey} = this.store
    console.log(rule, value, callback)
    if (value) {
      // // 后端校验
      // const param = {}
      // param.name = value
      // param.objTypeCode = this.bigStore.typeCode
      // // type(标签:0 类目:1 对象:2)
      // param.type = 2
      // // nameType(中文名:1 英文名:2)
      // param.nameType = rule.field === 'name' ? 1 : 2
      // param.treeId = currentTreeItemKey
      const params = {
        catId: currentTreeItemKey,
        name: value,
      }
      const backPromise = this.store.checkIsExist(params)
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
      cateDetail, eStatus: {editCategory}, modalVisible, confirmLoading,
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

            <FormItem {...formItemLayout} label="中文名">
              {getFieldDecorator('name', {
                initialValue: editCategory ? cateDetail.name : undefined,
                rules: [
                  {required: true, message: '名称不可为空'},
                  {max: 20, message: '名称不能超过20个字符'},
                  {pattern: /^[\u4e00-\u9fa5]{1,30}$/, message: '输入限制为中文字符'},
                  {validator: this.handleNameValidator},
                ],
                validateFirst: true,
              })(<Input autoComplete="off" placeholder="不超过20个字，输入为中文字符" />)}
            </FormItem>

            <FormItem {...formItemLayout} label="所属类目">
              {cateDetail.fullName || '--'}
            </FormItem>

            <FormItem {...formItemLayout} label="描述">
              {getFieldDecorator('descr', {
                rules: [
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