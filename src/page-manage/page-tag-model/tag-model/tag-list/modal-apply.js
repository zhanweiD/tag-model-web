/**
 * @description 标签申请
 */
import {Component} from 'react'
import {observer} from 'mobx-react'
import {action, toJS} from 'mobx'
import {Form} from '@ant-design/compatible'
import '@ant-design/compatible/assets/index.css'
import {Modal, Input, Radio, DatePicker, Spin, Select} from 'antd'

const FormItem = Form.Item
const {TextArea} = Input
const {RangePicker} = DatePicker
const {Option} = Select

const formItemLayout = {
  labelCol: {span: 4},
  wrapperCol: {span: 19},
  colon: false,
}

@Form.create()
@observer
export default class TagApply extends Component {
  constructor(props) {
    super(props) 
    this.store = props.store
  }

  // 表单提交
  @action handleOk() {
    const t = this
    const {store} = t
    const {form: {validateFieldsAndScroll}} = t.props
    
    validateFieldsAndScroll((err, values) => {
      if (err) {
        return
      }
      const params = {}
      // 申请时长为永远
      if (values.forever) {
        params.startTime = moment().format('YYYY-MM-DD')
        params.endTime = null
      } else {
        params.startTime = moment().format('YYYY-MM-DD')
        params.endTime = values.timeRange[1].format('YYYY-MM-DD')
      }

      store.applyTag(params, () => {
        t.handleCancel()
      })
    })
  }

  @action handleCancel() {
    this.store.modalApplyVisible = false
    this.store.useProjectId.clear()
    this.handleReset()
  }

  // 表单重置
  @action handleReset() {
    const {form: {resetFields}} = this.props
    resetFields()
  }

  @action.bound applyProjectSelect(v) {
    this.store.useProjectId.push(v)
    const useProjectIds = this.store.useProjectId
    for (let i = 0; i < useProjectIds.length; i += 1) {
      if (toJS(this.store.applyProjectList.filter(d => d.id === i)[0].endTime)) {
        this.store.startDate = moment(moment(toJS(this.store.applyProjectList.filter(d => d.id === this.store.useProjectId)[0].endTime)).format())
      } else {
        this.store.startDate = moment()
      }
    }
  }

  @action disabledDate = (current) => {
    return current && current < moment(this.store.startDate).endOf('day')
  }

  render() {
    const {form: {getFieldDecorator, getFieldValue}} = this.props
    const {
      confirmLoading, modalApplyVisible, selectItem, applyProjectList, useProjectId, startDate, endDate, applyProjectLoading,
    } = this.store
    
    const selectName = selectItem && selectItem.name
    const selectEnName = selectItem && selectItem.enName

    const modalConfig = {
      width: 525,
      maskClosable: false,
      title: '标签授权',
      confirmLoading,
      visible: modalApplyVisible,
      onOk: e => this.handleOk(e),
      onCancel: () => this.handleCancel(),
    }

    return (
      <Modal
        {...modalConfig}
      >
        <Form className="FBV">
          <FormItem {...formItemLayout} label="标签名称">
            {selectName}
          </FormItem>
          <FormItem {...formItemLayout} label="标签标识">
            {selectEnName}
          </FormItem>
          <FormItem {...formItemLayout} label="授权项目">
            {getFieldDecorator('useprojectId', {
              rules: [{required: true, message: '请选择授权项目'}],
            })(
              <Select 
                placeholder="请选择授权项目" 
                showSearch
                optionFilterProp="children"
                onSelect={v => this.applyProjectSelect(v)}
                notFoundContent={applyProjectLoading ? <div style={{textAlign: 'center'}}><Spin /></div> : null}
                mode="multiple"
              >
                {
                  applyProjectList.map(item => (
                    <Option key={item.id} value={item.id} disabled={item.config && !item.endTime}>{item.name}</Option>
                  ))
                }
              </Select>
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="有效时长"
          >
            {getFieldDecorator('forever', {
              rules: [
                {required: true, message: '请选择有效时长'},
              ],
              initialValue: 1,
            })(
              <Radio.Group>
                <Radio value={1}>永久</Radio>
                <Radio value={0}>
                  自定义
                </Radio>
              </Radio.Group>
            )}
          </FormItem>
          {!getFieldValue('forever') ? (
            <FormItem
              {...formItemLayout}
              label="自定义时长"
            >
              {getFieldDecorator('timeRange', {
                initialValue: [startDate, endDate],
                rules: [
                  {type: 'array', required: true, message: '请选择自定义时长'},
                  {
                    // 自定义校验规则
                    validator: (rule, value, callback) => {
                      if (value.length === 2) {
                        if (!value[0] || !value[1]) {
                          callback('请选择申请时间')
                        } else {
                          // callback不传参数表示校验通过
                          callback()
                        }
                      } else {
                        callback('请选择申请时间')
                      }
                    }
                  },
                ],
              })(
                <RangePicker disabled={[true, false]} disabledDate={this.disabledDate} />
              )}
            </FormItem>
          )
            : null }
        </Form>
      </Modal>
    )
  }
}
