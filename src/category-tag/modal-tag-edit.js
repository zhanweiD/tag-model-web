import {Component} from 'react'
import {
  Modal, Form, Input, Spin, Select, Switch, Tooltip, Icon,
} from 'antd'
import {observable, action, toJS} from 'mobx'
import {observer, inject} from 'mobx-react'
import {isExitMsg} from '../common/constants'
import {isJsonFormat, enNameReg, getNamePattern} from '../common/util'

const FormItem = Form.Item
const {Option} = Select

@inject('bigStore')
@observer
class ModalTagEdit extends Component {
  @observable isEnum = false

  constructor(props) {
    super(props)
    this.bigStore = this.props.bigStore
    this.store = this.bigStore.categoryStore
  }

  @action.bound handleOnCancel() {
    const {form} = this.props
    this.store.tagDetail = false
    this.store.modalVisible.editTag = false
    form.resetFields()
  }

  @action.bound handleOnOk() {
    const {
      form: {validateFields},
    } = this.props
    const {
      eStatus: {editTag}, cateDetail, tagDetail, currentTreeItemKey,
    } = this.store
    const {typeCode} = this.bigStore

    validateFields((err, values) => {
      if (!err) {
        const param = Object.assign(values, {
          isEnum: +values.isEnum,
          objTypeCode: typeCode,
          // parentId: currentTreeItemKey,
          level: cateDetail.level,
        })

        if (!values.isEnum) {
          param.enumValue = ''
        }

        if (editTag) {
          param.id = tagDetail.id
          param.parentId = tagDetail.parentId
        } else {
          param.parentId = currentTreeItemKey
        }

        this.store.updateTag(param, () => {
          this.bigStore.updateKey = Math.random()
        })
      }
    })
  }

  @action.bound handleNameValidator(rule, value, callback) {
    const {eStatus: {editTag}, currentTreeItemKey} = this.store
    if (value) {
      // 后端校验
      const param = {}
      param.isEdit = +editTag
      param.name = value
      param.objTypeCode = this.bigStore.typeCode
      // type(标签:0 类目:1 对象:2)
      param.type = 0
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

  @action.bound handleEnumValueValidator(rule, value, callback) {
    if (value) {
      if (!isJsonFormat(value)) {
        callback('请输入正确的JSON格式')
      }
      callback()
    } else {
      callback()
    }
  }

  @action changeIsEnum(e) {
    const {
      form: {setFieldsValue},
    } = this.props
    setFieldsValue({
      isEnum: +e,
    })

    this.isEnum = e
  }

  render() {
    const {form: {getFieldDecorator}} = this.props
    const {
      tagDetail, eStatus: {editTag}, modalVisible, confirmLoading,
    } = this.store

    const modalProps = {
      title: editTag ? '编辑标签' : '添加标签',
      visible: modalVisible.editTag,
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
                initialValue: editTag ? tagDetail.name : undefined,
                rules: [
                  {required: true, message: '名称不可为空'},
                  ...getNamePattern(),
                  {validator: this.handleNameValidator},
                ],
              })(<Input autoComplete="off" placeholder="不超过20个字，允许中文、英文、数字或下划线" />)}
            </FormItem>

            <FormItem {...formItemLayout} label="英文名">
              {getFieldDecorator('enName', {
                initialValue: editTag ? tagDetail.enName : undefined,
                rules: [
                  {transform: value => value.trim()},
                  {required: true, message: '英文名不可为空'},
                  {pattern: enNameReg, message: '不超过30个字，只能包含英文、数字或下划线，必须以英文开头'},
                  {validator: this.handleNameValidator},
                ],
              })(<Input autoComplete="off" placeholder="不超过30个字，允许英文、数字或下划线，必须以英文开头" />)}
            </FormItem>

            <FormItem {...formItemLayout} label="数据类型">
              {getFieldDecorator('valueType', {
                initialValue: tagDetail.valueType || undefined,
                rules: [{required: true, message: '请选择数据类型'}],
              })(
                <Select placeholder="请下拉选择">
                  {
                    ((window.njkData.dict || {}).dataType || []).map(item => (
                      <Option key={item.key} value={item.key}>{item.value}</Option>
                    ))
                  }
                </Select>
              )}
            </FormItem>

            <FormItem {...formItemLayout} label="是否枚举">
              {getFieldDecorator('isEnum', {
                initialValue: tagDetail.isEnum || 0,
                valuePropName: 'checked',
              })(<Switch checkedChildren="是" unCheckedChildren="否" onChange={e => this.changeIsEnum(e)} />)}
            </FormItem>

            {(tagDetail.isEnum || this.isEnum) && (
              <FormItem {...formItemLayout} label="枚举显示值">
                {getFieldDecorator('enumValue', {
                  rules: [
                    {transform: value => value.trim()},
                    // {required: true, message: '枚举显示值不可为空'},
                    {validator: this.handleEnumValueValidator},
                  ],
                  initialValue: editTag ? tagDetail.enumValue : undefined,
                })(
                  <Input.TextArea
                    autoComplete="off"
                    rows="3"
                    placeholder={'若标签值为枚举型，可将枚举代码值显示为易理解的值，例如：{"0":"女","1":"男"}'}
                  />
                )}
              </FormItem>
            )}

            <FormItem {...formItemLayout} label="业务逻辑">
              {getFieldDecorator('descr', {
                rules: [
                  {transform: value => value.trim()},
                  {max: 100, message: '业务逻辑不能超过100个字符'},
                ],
                initialValue: editTag ? tagDetail.descr : undefined,
              })(
                <Input.TextArea
                  autoComplete="off"
                  rows="3"
                  placeholder="标签表示的业务逻辑，例如“该用户的售手机号”，不超过100个字"
                />
              )}
            </FormItem>
          </Spin>
        </Form>
      </Modal>
    )
  }
}

export default Form.create()(ModalTagEdit)
