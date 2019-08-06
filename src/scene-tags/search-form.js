import {
  Select, Input, Form, Row, Col, Button,
} from 'antd'

const {Option} = Select
const FormItem = Form.Item
const formItemLayout = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 18,
  },
}

exports.SearchForm = Form.create({
  onFieldsChange: props => {
    props.onChange()
  },
})(
  props => {
    const {form: {getFieldDecorator}} = props

    return (
      <Form>
        <Row>
          <Col span={8}>
            <FormItem
              {...formItemLayout}
              label="标签名称"
            >
              {getFieldDecorator('searchKey')(
                <Input placeholder="请输入" />
              )}
            </FormItem>
          </Col>
        </Row>

        <Row>
          <Col span={24} style={{textAlign: 'right'}}>
            <Button type="primary" onClick={() => {}}>查询</Button>
            <Button style={{marginLeft: 8}} onClick={() => {}}>重置</Button>
          </Col>
        </Row>
      </Form>
    )
  }
)
