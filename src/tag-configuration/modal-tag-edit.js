import {Component} from 'react'
import PropTypes from 'prop-types'
import {
  Modal, Form, Input, Spin, Select, Switch, Cascader,
} from 'antd'
import {isJsonFormat, enNameReg, DATA_TYPES} from '../common/util'

const FormItem = Form.Item
const {Option} = Select

class ModalTagEdit extends Component {
  static propTypes = {
    visible: PropTypes.bool.isRequired, // 是否可见
    tagDetail: PropTypes.object, // 标签对象
    onCancel: PropTypes.func.isRequired, // 关闭弹框回调
    onOk: PropTypes.func.isRequired, // 点击确定的回调
    cateList: PropTypes.array, // 所属类目的options数组
  }

  static defaultProps = {
    tagDetail: {},
  }

  state = {
    isEnum: false, // 是否枚举
    confirmLoading: false, // 确认按钮加载状态
  }

  render() {
    const {
      form: {getFieldDecorator}, 
      tagDetail,
      visible,
      onCancel,
      cateList = [],
    } = this.props

    const {isEnum, confirmLoading} = this.state

    const modalProps = {
      title: '编辑标签',
      visible,
      onCancel,
      onOk: this.handleOk,
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
          <Spin spinning={false}>
            <FormItem {...formItemLayout} label="中文名">
              {getFieldDecorator('name', {
                initialValue: tagDetail.name || undefined,
                rules: [
                  {required: true, message: '中文名不可为空'},
                  {max: 20, message: '中文名不能超过20个字符'},
                  {pattern: /^[\u4e00-\u9fa5]{1,30}$/, message: '输入限制为中文字符'},
                  // {validator: this.handleNameValidator},
                ],
              })(<Input autoComplete="off" placeholder="不超过20个字，输入为中文字符" />)}
            </FormItem>

            <FormItem {...formItemLayout} label="英文名">
              {getFieldDecorator('enName', {
                initialValue: tagDetail.enName || undefined,
                rules: [
                  {required: true, message: '英文名不可为空'},
                  // {max: 30, message: '请输入少于30个字'},
                  {pattern: enNameReg, message: '不超过30个字，只能包含英文、数字或下划线，必须以英文开头'},
                  // {pattern: /^(?!\d+$)[a-zA-Z0-9_]{1,30}$/, message: '仅支持小写字母、数字和下划线的组合'},
                  // {validator: this.handleNameValidator},
                ],
              })(<Input autoComplete="off" placeholder="不超过30个字，允许英文、数字或下划线，必须以英文开头" />)}
            </FormItem>

            <FormItem {...formItemLayout} label="数据类型">
              {getFieldDecorator('valueType', {
                initialValue: +tagDetail.valueType || undefined,
                rules: [{required: true, message: '请选择数据类型'}],
              })(
                <Select placeholder="请下拉选择">
                  {
                    DATA_TYPES.map(item => (
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
              })(<Switch checkedChildren="是" unCheckedChildren="否" onChange={v => this.changeIsEnum(v)} />)}
            </FormItem>

            {(tagDetail.isEnum || isEnum) && (
              <FormItem {...formItemLayout} label="枚举显示值">
                {getFieldDecorator('enumValue', {
                  rules: [
                    // {required: true, message: '枚举显示值不可为空'},
                    {max: 100, message: '业务逻辑不能超过100个字符'},
                    {validator: this.handleEnumValueValidator},
                  ],
                  initialValue: tagDetail.enumValue || undefined,
                })(
                  <Input.TextArea
                    autoComplete="off"
                    rows="3"
                    placeholder={'若标签值为枚举型，可将枚举代码值显示为易理解的值，例如：{"0":"女","1":"男"}'}
                  />
                )}
              </FormItem>
            )}

            <FormItem {...formItemLayout} label="所属类目">
              {getFieldDecorator('pathIds', {
                initialValue: tagDetail.pathIds || undefined,
              })(
                <Cascader
                  options={cateList}
                  placeholder="请选择标签类目"
                />
              )}
            </FormItem>

            <FormItem {...formItemLayout} label="业务逻辑">
              {getFieldDecorator('descr', {
                rules: [{max: 100, message: '业务逻辑不能超过100个字符'}],
                initialValue: tagDetail.descr || undefined,
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

  // 确定
  handleOk = () => {
    const {form, onOk} = this.props

    form.validateFields((errs, values) => {
      if (!errs) {
        console.log(values)

        this.setState({
          confirmLoading: true,
        })

        const valuesCopy = {...values}

        // 如果不是枚举值，清空这个字段
        if (!valuesCopy.isEnum) {
          valuesCopy.enumValue = ''
        }

        // 将枚举值字段改成数字
        valuesCopy.isEnum = +valuesCopy.isEnum

        // 调用传入的“确定”回调
        onOk(valuesCopy, () => {
          this.setState({
            confirmLoading: false,
          })
        })
      } else {
        console.log('handleOk Errors: ', errs)
      }
    })
  }

  // 校验枚举值输入
  handleEnumValueValidator(rule, value, callback) {
    if (value) {
      if (!isJsonFormat(value)) {
        callback('请输入正确的JSON格式')
      }
      callback()
    } else {
      callback()
    }
  }

  // 改变是否枚举值
  changeIsEnum(v) {
    this.setState({
      isEnum: v,
    })
  }
}

export default Form.create()(ModalTagEdit)
