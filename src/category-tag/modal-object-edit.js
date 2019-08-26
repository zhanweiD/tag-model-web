import {Component} from 'react'
import {
  Modal, Form, Input, Spin, Select,
} from 'antd'
import {observable, action, toJS} from 'mobx'
import {observer, inject} from 'mobx-react'
import {isExitMsg} from '../common/constants'
import {enNameReg, getNamePattern} from '../common/util'

const FormItem = Form.Item
const {Option} = Select

@inject('bigStore')
@observer
class ModalObjectEdit extends Component {
  constructor(props) {
    super(props)
    this.bigStore = this.props.bigStore
    this.store = this.bigStore.categoryStore
  }

  @action.bound handleOnCancel() {
    const {form} = this.props
    this.store.objectDetail = false
    this.store.modalVisible.editObject = false
    form.resetFields()
  }

  @action.bound handleOnOk() {
    const {form: {validateFields}} = this.props
    const {eStatus: {editObject}, objectDetail} = this.store
    const {typeCode} = this.bigStore

    validateFields((err, values) => {
      if (!err) {
        const param = {
          name: values.name,
          enName: values.enName,
          descr: values.descr,
          objTypeCode: typeCode,
        }

        if (typeCode === 3) {
          param.objIds = values.objIds
        } else {
          param.objIds = []
        }

        if (editObject) {
          param.id = objectDetail.id
        }

        this.store.updateObject(param, () => {
          this.bigStore.updateKey = Math.random()
        })
      }
    })
  }

  @action.bound handleNameValidator(rule, value, callback) {
    const {eStatus: {editObject}, currentTreeItemKey} = this.store
    if (value) {
      // 后端校验
      const param = {}
      param.isEdit = +editObject
      param.name = value
      param.objTypeCode = this.bigStore.typeCode
      // type(标签:0 类目:1 对象:2)
      param.type = 2
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

  @action.bound handleObjIdsValidator(rule, value, callback) {
    if (value) {
      if (value.length !== 2) {
        callback('请选择两个关联的人/物')
      }
      callback()
    } else {
      callback()
    }
  }

  render() {
    const {typeCode} = this.bigStore
    const {form: {getFieldDecorator}} = this.props
    const {
      objectDetail, eStatus: {editObject}, modalVisible, confirmLoading, relObjectList, relObjectListLoading,
    } = this.store

    const modalProps = {
      title: editObject ? '编辑对象' : '添加对象',
      visible: modalVisible.editObject,
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
                initialValue: editObject ? objectDetail.name : undefined,
                rules: [
                  {required: true, message: '名称不可为空'},
                  ...getNamePattern(),
                  {validator: this.handleNameValidator},
                ],
              })(<Input autoComplete="off" placeholder="不超过20个字，允许中文、英文、数字或下划线" />)}
            </FormItem>

            <FormItem {...formItemLayout} label="英文名">
              {getFieldDecorator('enName', {
                initialValue: editObject ? objectDetail.enName : undefined,
                rules: [
                  {transform: value => value.trim()},
                  {required: true, message: '英文名不可为空'},
                  {pattern: enNameReg, message: '不超过30个字，只能包含英文、数字或下划线，必须以英文开头'},
                  {validator: this.handleNameValidator},
                ],
              })(<Input autoComplete="off" placeholder="不超过30个字，允许英文、数字或下划线，必须以英文开头" />)}
            </FormItem>

            {
              typeCode === 3 && (
                <FormItem {...formItemLayout} label="关联的人/物">
                  {getFieldDecorator('objIds', {
                    initialValue: editObject ? toJS(objectDetail.objIds) : undefined,
                    rules: [
                      {required: true, message: '请选择关联的人/物'},
                      {validator: this.handleObjIdsValidator},
                    ],
                  })(
                    <Select
                      mode="multiple"
                      style={{width: '100%'}}
                      placeholder="请选择"
                      loading={relObjectListLoading}
                    >
                      {
                        relObjectList.map(item => (
                          <Option key={item.id} value={item.id}>{item.name}</Option>
                        ))
                      }
                    </Select>
                  )}
                </FormItem>
              )
            }
            

            <FormItem {...formItemLayout} label="描述">
              {getFieldDecorator('descr', {
                rules: [
                  {required: false, message: ''},
                  {transform: value => value.trim()},
                  {max: 100, message: '描述不能超过100个字符'},
                ],
                initialValue: editObject ? objectDetail.descr : undefined,
              })(<Input.TextArea autoComplete="off" rows="3" placeholder="不超过100个字" />)}
            </FormItem>
          </Spin>
        </Form>
      </Modal>
    )
  }
}

export default Form.create()(ModalObjectEdit)
