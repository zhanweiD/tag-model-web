import {
  Select, Input, Form, Row, Col, Button, InputNumber,
} from 'antd'

const {Option} = Select
const FormItem = Form.Item

const formItemLayout = {
  labelCol: {
    xs: {span: 7},
    // md: {span: 7},
    xl: {span: 6},
    xxl: {span: 5},
  },
  wrapperCol: {
    xs: {span: 17}, // >=575
    // md: {span: 17}, // >=768
    xl: {span: 18}, // >=1200
    xxl: {span: 19}, // >=1600
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
      <Form className="dt-form-column bgf mb16 p16">
        <Row>
          <Col span={8}>
            <FormItem
              {...formItemLayout}
              label="标签名称"
            >
              {getFieldDecorator('name1')(
                <Input placeholder="请输入" />
              )}
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem
              {...formItemLayout}
              label="使用状态"
            >
              {getFieldDecorator('name2', {
                initialValue: '',
              })(
                <Select
                  showSearch
                  optionFilterProp="children"
                  placeholder="请下拉选择"
                >
                  <Option value="">全部</Option>
                  {
                    [].map(({value, key}) => (
                      <Option key={key} value={key}>{value}</Option>
                    ))
                  }
                </Select>
              )}
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem
              {...formItemLayout}
              label="价值分"
              style={{marginBottom: 0}}
            >
              <div>
                <FormItem style={{display: 'inline-block', width: 'calc(50% - 12px)', marginBottom: 0}}>
                  {getFieldDecorator('name3', {
                    initialValue: '',
                  })(
                    <InputNumber min={0} max={100} style={{width: '100%'}} />
                  )}
                </FormItem>
                <span style={{display: 'inline-block', width: '24px', textAlign: 'center'}}>
                  -
                </span>
                <FormItem style={{display: 'inline-block', width: 'calc(50% - 12px)'}}>
                  {getFieldDecorator('name4', {
                    initialValue: '',
                  })(
                    <InputNumber min={1} max={100} style={{width: '100%'}} />
                  )}
                </FormItem>
              </div>
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem
              {...formItemLayout}
              label="质量分"
              style={{marginBottom: 0}}
            >
              <div>
                <FormItem style={{display: 'inline-block', width: 'calc(50% - 12px)', marginBottom: 0}}>
                  {getFieldDecorator('name5', {
                    initialValue: '',
                  })(
                    <InputNumber min={0} max={100} style={{width: '100%'}} />
                  )}
                </FormItem>
                <span style={{display: 'inline-block', width: '24px', textAlign: 'center'}}>
                  -
                </span>
                <FormItem style={{display: 'inline-block', width: 'calc(50% - 12px)'}}>
                  {getFieldDecorator('name6', {
                    initialValue: '',
                  })(
                    <InputNumber min={1} max={100} style={{width: '100%'}} />
                  )}
                </FormItem>
              </div>
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem
              {...formItemLayout}
              label="热度"
              style={{marginBottom: 0}}
            >
              <div>
                <FormItem style={{display: 'inline-block', width: 'calc(50% - 12px)', marginBottom: 0}}>
                  {getFieldDecorator('name7', {
                    initialValue: '',
                  })(
                    <InputNumber min={0} max={100} style={{width: '100%'}} />
                  )}
                </FormItem>
                <span style={{display: 'inline-block', width: '24px', textAlign: 'center'}}>
                  -
                </span>
                <FormItem style={{display: 'inline-block', width: 'calc(50% - 12px)'}}>
                  {getFieldDecorator('name8', {
                    initialValue: '',
                  })(
                    <InputNumber min={1} max={100} style={{width: '100%'}} />
                  )}
                </FormItem>
              </div>
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
