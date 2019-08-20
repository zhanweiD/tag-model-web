import React from 'react'
import PropTypes from 'prop-types'
import cls from 'classnames'
import {Form, InputNumber} from 'antd'
import {toNumberOrUndefined} from '../common/util'

const FormItem = Form.Item

const MIN = 'min'
const MAX = 'max'

/**
 * @description 带有两个输入框，通常用来输入数字范围值的表单组件
 * @author 三千
 * @date 2019-08-08
 * @class RangeInput
 * @extends {React.Component}
 */
class RangeInput extends React.Component {
  static propTypes = {
    className: PropTypes.string, // 组件的类名
    label: PropTypes.string, // label文本
    initialValues: PropTypes.arrayOf(PropTypes.number), // 初始值
    validateRules: PropTypes.arrayOf(PropTypes.object), // 校验规则，同时用于两个输入框
    min: PropTypes.number, // 最小值
    max: PropTypes.number, // 最大值
    onChange: PropTypes.func, // 输入变化时触发的回调, 参数是(transformedValues, rawValues, type), transformedValues指做了转换后的值，rawValues指未做处理的值， type是min/max，区分是哪个输入框的值
    onBlur: PropTypes.func, // 输入框失焦时的回调，参数同onChange
    orderInput: PropTypes.bool, // 决定失焦时，如果输入值min>max，是否要调换输入框结果顺序
    orderOutput: PropTypes.bool, // 决定在回调中返回结果时，要不要返回排序后的值
  }

  static defaultProps = {
    className: 'component-range-input',
    label: 'label',
    onChange: null,
    onBlur: null,
    initialValues: [],
    validateRules: [
      {
        required: false,
        pattern: /^\d*$/, // 允许是空
        message: '请输入0~100的整数',
      },
    ],
    min: 0,
    max: 100,
    orderInput: false,
    orderOutput: false,
  }

  // 输入框之前的值的状态，主要是用于onBlur时判断有没有变化
  prevState = []

  render() {
    const {
      form,
      label, className, 
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
            getFieldDecorator(MIN, {
              initialValue: initialValues[0],
              rules: validateRules,
            })(
              <InputNumber 
                min={min} 
                max={max} 
                placeholder="请输入" 
                onChange={value => this.handleChange(value, MIN)} 
                onBlur={e => {
                  this.handleBlur(e, MIN)
                }}
              />
            )
          }
        </FormItem>
        <span className="mt12" style={{padding: '0 10px'}}>-</span>
        <FormItem style={{marginBottom: 0}}>
          {
            getFieldDecorator(MAX, {
              initialValue: initialValues[1],
              rules: validateRules,
            })(
              <InputNumber 
                min={min} 
                max={max} 
                placeholder="请输入" 
                onChange={value => this.handleChange(value, MAX)}
                onBlur={e => {
                  this.handleBlur(e, MAX)
                }}
              />
            )
          }
        </FormItem>
      </div>
    )
  }

  // 按某些需求转换输出数据
  getTranformValues(value, type = MIN) {
    const {form} = this.props

    let min
    let max
    if (type === MIN) {
      min = value
      max = form.getFieldValue(MAX)
    } else {
      max = value
      min = form.getFieldValue(MIN)
    }

    return {
      before: [min, max], // 转换前
      after: [toNumberOrUndefined(min), toNumberOrUndefined(max)], // 转换后
    }
  }

  // 输入发生变化
  handleChange(value, type = MIN) {
    const {orderOutput, onChange} = this.props

    // console.log('onchange----')

    // 没传onChange，直接不触发事件好了
    if (typeof onChange !== 'function') {
      return
    }

    // console.log('onchange---- 3 --- ')

    // 处理一下数据
    let {before, after} = this.getTranformValues(value, type)

    // 如果要对输出的结果做排序，那么判断一下
    if (orderOutput) {
      // 如果都有值，那么返回前排序
      after = after.some(v => v === undefined) ? after : after.sort()
    }

    // 调用回调，返回处理后的值数组，原始的输入数据数组, 顺带返回type
    onChange(after, before, type)
  }

  // 失焦事件
  handleBlur(e, type) {
    const {
      orderInput, orderOutput, form, onBlur,
    } = this.props

    // 如果没有onBlur事件，且不用再输入后给输入框的值排序，那么不做后续操作
    if (typeof onBlur !== 'function' && !orderInput) {
      return
    }

    // console.log('onBlur --- 1 --- ')

    const {prevState} = this

    const {value} = e.target

    // 处理一下数据
    let {before, after} = this.getTranformValues(value, type)

    // 如果失焦时没有输入变化，那么不触发后续变化
    if (prevState[0] === after[0] && prevState[1] === after[1]) {
      return
    }

    // console.log('onBlur --- 2 --- ')

    // 要做排序，且第一个值比第二个值大，那就调换输入框的值（ps: undefined和数字比较大小总是false）
    if (orderInput && after[0] > after[1]) {
      form.setFieldsValue({
        min: after[1],
        max: after[0],
      })
      // 值数组也跟着排序
      after.sort()
    }

    // 更新之前的输入状态
    this.prevState = [...after]

    // 对输出结果做排序
    if (orderOutput) {
      // 如果都有值，那么返回前排序
      after = after.some(v => v === undefined) ? after : after.sort()
    }

    if (typeof onBlur === 'function') {
      onBlur(after, before, type)
    }
  }
}

export default Form.create()(RangeInput)
