import React from 'react'
import PropTypes from 'prop-types'
import cls from 'classnames'
import {Form, InputNumber} from 'antd'
import {toNumberOrUndefined} from '../common/util'

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
        required: false,
        // type: 'integer', // 不允许是空（输入后清空会报错）
        pattern: /^\d*$/, // 允许是空
        // validator:
        message: '请输入0~100的整数',
      },
    ],
    min: 0,
    max: 100,
  }

  static propTypes = {
    className: PropTypes.string, // 组件的类名
    label: PropTypes.string, // label文本
    fieldNamePrefix: PropTypes.string, // getDecoratorField修饰的fieldName的前缀，后缀为min和max
    onChange: PropTypes.func, // 输入变化时触发的回调, 格式是 onChange: (value, type) => {}, value是输入框的值，type是min/max，区分是哪个输入框的值
    initialValues: PropTypes.arrayOf(PropTypes.number), // 初始值
    validateRules: PropTypes.arrayOf(PropTypes.object), // 校验规则，同时用于两个输入框
    min: PropTypes.number, // 最小值
    max: PropTypes.number, // 最大值
  }

  render() {
    const {
      form, 
      label, fieldNamePrefix, className, 
      onChange,
      initialValues,
      validateRules,
      min, max,
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
              <InputNumber 
                min={min} 
                max={max} 
                placeholder="请输入" 
                onChange={value => this.handleChange(value, 'min')} 
              />
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
              <InputNumber 
                min={min} 
                max={max} 
                placeholder="请输入" 
                // onChange={value => onChange(value, 'max')} 
                onChange={value => this.handleChange(value, 'max')}
              />
            )
          }
        </FormItem>
      </div>
    )
  }

  // 输入发生变化
  handleChange(value, type) {
    const {form, fieldNamePrefix, onChange} = this.props

    // [?] form.getFieldsValue() 取到的是onChange之前的值，不能用，暂不清楚原因
    // const values = form.getFieldsValue()

    let min
    let max
    if (type === 'min') {
      min = value
      max = form.getFieldValue(`${fieldNamePrefix}-max`)
    } else {
      max = value
      min = form.getFieldValue(`${fieldNamePrefix}-min`)
    }

    let result = [toNumberOrUndefined(min), toNumberOrUndefined(max)]
    // 如果都有值，那么返回前排序
    result = result.some(v => v === undefined) ? result : result.sort()

    if (typeof onChange === 'function') {
      // 调用回调，返回处理后的值数组，原始的输入数据数组, 顺带返回type
      onChange(result, [min, max])
    }
  }
}

export default Form.create()(RangeInput)
