import React from 'react'
import PropTypes from 'prop-types'
import cls from 'classnames'
import {Form, InputNumber} from 'antd'

const FormItem = Form.Item

/**
 * @description 带有两个输入框，通常用来输入数字范围值的表单组件
 * @author 三千
 * @date 2019-08-08
 * @class RangeInput
 * @extends {React.Component}
 */
class RangeInput extends React.Component {
  static defaultProps = {
    className: 'comp-range-input',
    label: 'label',
    fieldNamePrefix: 'input',
    onChange: () => {},
    initialValues: [],
    validateRules: [
      {
        type: 'integer',
        min: 0,
        max: 100,
        message: '请输入0~100的整数',
      },
    ],
  }

  static propTypes = {
    className: PropTypes.string, // 组件的类名
    label: PropTypes.string, // label文本
    fieldNamePrefix: PropTypes.string, // getDecoratorField修饰的fieldName的前缀，后缀为min和max
    onChange: PropTypes.func, // 输入变化时触发的回调, 格式是 onChange: (value, type) => {}, value是输入框的值，type是min/max，区分是哪个输入框的值
    initialValues: PropTypes.arrayOf(PropTypes.number), // 初始值
    validateRules: PropTypes.arrayOf(PropTypes.object), // 校验规则，同时用于两个输入框
  }

  render() {
    const {
      form, 
      label, fieldNamePrefix, className, 
      onChange,
      initialValues,
      validateRules,
    } = this.props
    const {getFieldDecorator} = form

    return (
      <div className={cls('FBH', className)}>
        <span className="mr4 mt12">{`${label}：`}</span>
        <FormItem style={{marginBottom: 0}}>
          {
            getFieldDecorator(`${fieldNamePrefix}-min`, {
              initialValue: initialValues[0],
              rules: validateRules,
            })(
              <InputNumber onChange={value => onChange(value, 'min')} />
            )
          }
        </FormItem>
        <span className="mt12" style={{padding: '0 10px'}}>-</span>
        <FormItem style={{marginBottom: 0}}>
          {
            getFieldDecorator(`${fieldNamePrefix}-max`, {
              initialValue: initialValues[1],
              rules: validateRules,
            })(
              <InputNumber onChange={value => onChange(value, 'max')} />
            )
          }
        </FormItem>
      </div>
    )
  }
}

export default Form.create()(RangeInput)
