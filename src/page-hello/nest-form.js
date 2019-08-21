import React from 'react'
import {Form, InputNumber} from 'antd'

const FormItem = Form.Item


/**
 * @描述
 * 测试antd表单嵌套时校验的规则
 * @规则
 * 所有的FormItem都用form.getFieldDecorator包装
 * @表现
 * 1、未被Form.create()包装的内层Form，它的表单项会被暴露给外层Form；
 * 2、被Form.create()包装的内层Form，外层表单读取不到该内层Form的表单项
 * @结论
 * form.validateFields等方法只能读取/操作同一个form的getFieldDecorator包装的表单项。和组件使用的层级关系无关。
 */

const CustomForm = Form.create()(
  class InnerForm extends React.Component {
    render() {
      const {form, name, parentForm} = this.props
      const {getFieldDecorator} = form

      return (
        <Form layout="inline">
          <FormItem label={`表单-${name}-A`}>
            {
              getFieldDecorator('min', {
                initialValue: 0,
              })(
                <InputNumber />
              )
            }
          </FormItem>
          <FormItem label={`表单-${name}-B`}>
            {
              // parentForm.getFieldDecorator('max', {
              getFieldDecorator('max', {
                initialValue: 0,
              })(
                <InputNumber />
              )
            }
          </FormItem>

          <div style={{display: 'inline'}}>
            <button onClick={this.onCheck}>触发校验-{name}</button>
          </div>
        </Form>
      )
    }

    onCheck = () => {
      const {form} = this.props
  
      form.validateFields((errs, values) => {
        console.log('errs', errs, 'values', values)
      })
    }
  }
)

class NestForm extends React.Component {
  render() {
    const {form} = this.props
    const {getFieldDecorator} = form

    return (
      <Form>
        <FormItem label="外层表单-A">
          {
            getFieldDecorator('min', {
              initialValue: 0,
            })(
              <InputNumber />
            )
          }
        </FormItem>
        <CustomForm name={1} parentForm={form} />
        <CustomForm name={2} />
        <CustomForm name={3} />
        {/* <Form layout="inline">
          <FormItem label="表格1-A">
            {
              getFieldDecorator('min', {
                initialValue: 0,
              })(
                <InputNumber />
              )
            }
          </FormItem>
          <FormItem label="表格1-B">
            {
              getFieldDecorator('max', {
                initialValue: 0,
              })(
                <InputNumber />
              )
            }
          </FormItem>
        </Form>

        <Form layout="inline">
          <FormItem label="表单2-A">
            {
              getFieldDecorator('min', {
                initialValue: 0,
              })(
                <InputNumber />
              )
            }
          </FormItem>
          <FormItem label="表单2-B">
            {
              getFieldDecorator('max', {
                initialValue: 0,
              })(
                <InputNumber />
              )
            }
          </FormItem>
        </Form>

        <Form layout="inline">
          <FormItem label="表单3-A">
            {
              getFieldDecorator('min3', {
                initialValue: 0,
              })(
                <InputNumber />
              )
            }
          </FormItem>
          <FormItem label="表单3-B">
            {
              getFieldDecorator('max3', {
                initialValue: 0,
              })(
                <InputNumber />
              )
            }
          </FormItem>
        </Form> */}

        <div>
          <button onClick={this.onCheck}>触发校验</button>
        </div>
      </Form>
    )
  }

  onCheck = () => {
    const {form} = this.props

    form.validateFields((errs, values) => {
      console.log('errs', errs, 'values', values)
    })
  }
}

export default Form.create()(NestForm)
