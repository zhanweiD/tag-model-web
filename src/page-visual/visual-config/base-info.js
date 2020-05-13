// 基础信息
import {Component} from 'react'
import {
  Input, Form, Select, Button,
} from 'antd'

const FormItem = Form.Item
const Option = {Select}
const {TextArea} = Input

const formItemLayout = {
  labelCol: {span: 7},
  wrapperCol: {span: 12},
}

@Form.create()
export default class BaseInfo extends Component {
  render() {
    const {
      form: {
        getFieldDecorator,
        // getFieldValue,
      },
      show,
    } = this.props

    return (
      <div style={{display: show ? 'block' : 'none', height: '100%'}}>
        <Form>
          <FormItem {...formItemLayout} label="方案名称">
            {getFieldDecorator('name', {
              rules: [
                {transform: value => value && value.trim()},
                {required: true, message: '方案名称不能为空'},  
                {max: 32, message: '输入不能超过32个字符'},
                {
                  validator: this.checkName,
                }],
              validateFirst: true,
            })(
              <Input autoComplete="off" placeholder="请输入方案名称" />
            )}
          </FormItem>

          <FormItem {...formItemLayout} label="所属对象">
            {getFieldDecorator('objId', {
              rules: [{required: true, message: '请选择所属对象'}],
            })(
              <Select 
                labelInValue 
                placeholder="请选择所属对象" 
                style={{width: '100%'}} 
                // onSelect={v => this.selectObj(v)}
              >
                {
                  [].map(item => (
                    <Option key={item.value} value={item.value}>{item.name}</Option>
                  ))
                }
              </Select>
            )}
          </FormItem>

          <FormItem {...formItemLayout} label="源标签对象限制">
            {getFieldDecorator('objId', {
              rules: [{required: false, message: '请选择源标签对象限制'}],
            })(
              <Select 
                labelInValue 
                placeholder="请选择源标签对象限制" 
                style={{width: '100%'}} 
                // onSelect={v => this.selectObj(v)}
              >
                {
                  [].map(item => (
                    <Option key={item.value} value={item.value}>{item.name}</Option>
                  ))
                }
              </Select>
            )}
          </FormItem>

          <FormItem {...formItemLayout} label="方案描述">
            {getFieldDecorator('descr', {
              rules: [
                {transform: value => value && value.trim()},
                {max: 128, whitespace: true, message: '输入不能超过128个字符'},
              ],
            })(
              <TextArea placeholder="请输入方案描述" />
            )}
          </FormItem>
        </Form>
      </div>
    )
  }
}
