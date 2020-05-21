import {Component} from 'react'
import {Select, Input, Form} from 'antd'

const {Option} = Select
const FormItem = Form.Item

const formItemLayout = null

@Form.create()
export default class FixedValue extends Component {
  componentWillReceiveProps(next) {
    const {clearActionKey} = this.props
    const {form: {resetFields}} = this.props

    if (next.clearActionKey && !_.isEqual(clearActionKey, next.clearActionKey)) {
      resetFields()
    }
  }
  
  render() {
    const {
      form: {
        getFieldDecorator,
      },
      detail = {},
    } = this.props

    return (
      <div className="FBH">
        <FormItem
          {...formItemLayout}
          label={null}
        >
          {getFieldDecorator('thenFunction', {
            initialValue: '固定值',
          })(
            <Select className="mr8" style={{width: 100}}>
              <Option value="固定值">固定值</Option>
            </Select>
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label={null}
        >
          {getFieldDecorator('thenParams', {
            initialValue: detail.params && detail.params[0],
            rules: [
              {required: true, message: '请输入'},
            ],
          })(
            <Input placeholder="请输入" style={{width: 120}} />
          )}
        </FormItem>
      </div>
    )
  }
}
