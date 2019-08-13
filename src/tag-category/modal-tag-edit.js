import {Component} from 'react'
import {
  Modal, Form, Input, Spin, Select, Switch, Tooltip, Icon,
} from 'antd'
import {observable, action, toJS} from 'mobx'
import {observer, inject} from 'mobx-react'
import {isExitMsg} from '../common/constants'
import {isJsonFormat} from '../common/util'

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
          parentId: currentTreeItemKey,
          level: cateDetail.level,
        })

        if (!values.isEnum) {
          param.enumValue = ''
        }

        if (editTag) {
          param.id = tagDetail.id
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
            <FormItem {...formItemLayout} label="中文名">
              {getFieldDecorator('name', {
                initialValue: editTag ? tagDetail.name : undefined,
                rules: [
                  {required: true, message: '名称不可为空'},
                  {max: 20, message: '名称不能超过20个字符'},
                  {pattern: /^[\u4e00-\u9fa5]{1,30}$/, message: '输入限制为中文字符'},
                  {validator: this.handleNameValidator},
                ],
              })(<Input autoComplete="off" placeholder="不超过20个字，输入为中文字符" />)}
            </FormItem>

            <FormItem {...formItemLayout} label="英文名">
              {getFieldDecorator('enName', {
                initialValue: editTag ? tagDetail.enName : undefined,
                rules: [
                  {required: true, message: '英文名不可为空'},
                  {max: 30, message: '请输入少于30个字'},
                  {pattern: /^(?!\d+$)[a-zA-Z0-9_]{1,30}$/, message: '仅支持小写字母、数字和下划线的组合'},
                  // {pattern: /^(?!\d+$)[a-zA-Z0-9_]{1,30}$/, message: '仅支持小写字母、数字和下划线的组合'},
                  {validator: this.handleNameValidator},
                ],
              })(<Input autoComplete="off" placeholder="不超过30个字，输入为英文字符或数字" />)}
            </FormItem>

            <FormItem {...formItemLayout} label="数据类型">
              {getFieldDecorator('valueType', {
                initialValue: tagDetail.valueType || undefined,
                rules: [{required: true, message: '请选择数据类型'}],
              })(
                <Select placeholder="请下拉选择">
                  {
                    window.njkData.dict.dataType.map(item => (
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
                    {required: true, message: '枚举显示值不可为空'},
                    {max: 100, message: '业务逻辑不能超过100个字符'},
                    {validator: this.handleEnumValueValidator},
                  ],
                  initialValue: editTag ? tagDetail.enumValue : undefined,
                })(
                  <Input.TextArea
                    autoComplete="off"
                    rows="3"
                    placeholder={`若标签值为枚举型，可将枚举代码值显示为易理解的值，例如：{"0":"女","1":"男"}`}
                  />
                )}
              </FormItem>
            )}

            <FormItem {...formItemLayout} label="业务逻辑">
              {getFieldDecorator('descr', {
                rules: [{max: 100, message: '业务逻辑不能超过100个字符'}],
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
