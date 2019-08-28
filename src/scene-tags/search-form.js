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

const status = [{
  key: 1,
  label: '使用中',
}, {
  key: 2,
  label: '未使用',
}]

exports.SearchForm = Form.create({
  onFieldsChange: props => {
    props.onChange()
  },
})(
  props => {
    const {form: {getFieldDecorator}, onSearch, onReset} = props

    return (
      <Form className="dt-form-column bgf mb16 p16">
        <Row>
          <Col span={8}>
            <FormItem
              {...formItemLayout}
              label="标签名称"
            >
              {getFieldDecorator('tagName')(
                <Input placeholder="请输入" />
              )}
            </FormItem>
          </Col>
          {/* <Col span={8}>
            <FormItem
              {...formItemLayout}
              label="使用状态"
            >
              {getFieldDecorator('stat', {
                initialValue: 0,
              })(
                <Select
                  showSearch
                  optionFilterProp="children"
                  placeholder="请下拉选择"
                >
                  <Option value={0}>全部</Option>
                  {
                    status.map(({label, key}) => (
                      <Option key={key} value={key}>{label}</Option>
                    ))
                  }
                </Select>
              )}
            </FormItem>
          </Col> */}
          <Col span={8}>
            <FormItem
              {...formItemLayout}
              label="价值分"
              style={{marginBottom: 0}}
            >
              <div>
                <FormItem style={{display: 'inline-block', width: 'calc(50% - 12px)', marginBottom: 0}}>
                  {getFieldDecorator('minWorth', {
                    initialValue: '',
                  })(
                    <InputNumber min={0} max={100} precision={0} style={{width: '100%'}} placeholder="请输入" />
                  )}
                </FormItem>
                <span style={{display: 'inline-block', width: '24px', textAlign: 'center'}}>
                  -
                </span>
                <FormItem style={{display: 'inline-block', width: 'calc(50% - 12px)'}}>
                  {getFieldDecorator('maxWorth', {
                    initialValue: '',
                  })(
                    <InputNumber min={1} max={100} precision={0} style={{width: '100%'}} placeholder="请输入" />
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
                  {getFieldDecorator('minQuality', {
                    initialValue: '',
                  })(
                    <InputNumber min={0} max={100} precision={0} style={{width: '100%'}} placeholder="请输入" />
                  )}
                </FormItem>
                <span style={{display: 'inline-block', width: '24px', textAlign: 'center'}}>
                  -
                </span>
                <FormItem style={{display: 'inline-block', width: 'calc(50% - 12px)'}}>
                  {getFieldDecorator('maxQuality', {
                    initialValue: '',
                  })(
                    <InputNumber min={1} max={100} precision={0} style={{width: '100%'}} placeholder="请输入" />
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
                  {getFieldDecorator('minHot', {
                    initialValue: '',
                  })(
                    <InputNumber min={0} max={100} precision={0} style={{width: '100%'}} placeholder="请输入" />
                  )}
                </FormItem>
                <span style={{display: 'inline-block', width: '24px', textAlign: 'center'}}>
                  -
                </span>
                <FormItem style={{display: 'inline-block', width: 'calc(50% - 12px)'}}>
                  {getFieldDecorator('maxHot', {
                    initialValue: '',
                  })(
                    <InputNumber min={1} max={100} precision={0} style={{width: '100%'}} placeholder="请输入" />
                  )}
                </FormItem>
              </div>
            </FormItem>
          </Col>
        </Row>

        <Row>
          <Col span={24} style={{textAlign: 'right'}}>
            <Button type="primary" onClick={() => onSearch()}>查询</Button>
            <Button style={{marginLeft: 8}} onClick={() => onReset()}>重置</Button>
          </Col>
        </Row>
      </Form>
    )
  }
)
