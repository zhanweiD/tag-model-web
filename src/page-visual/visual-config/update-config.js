// 更新配置
import {Component} from 'react'
import {observer} from 'mobx-react'
import {action} from 'mobx'
import {
  Form, Button, Select, Modal,
} from 'antd'
import {CycleSelect} from '@dtwave/uikit'

const FormItem = Form.Item
const Option = {Select}
const formItemLayout = {
  labelCol: {span: 7},
  wrapperCol: {span: 10},
}
const {confirm} = Modal

@Form.create()
@observer
export default class UpdateConfig extends Component {
  constructor(props) {
    super(props)
    this.store = props.store
  }

  @action.bound submit() {
    const {form: {validateFields}} = this.props
    const t = this

    confirm({
      title: '确认提交方案并返回方案列表',
      onOk() {
        validateFields((err, params) => {
          if (err) {
            return
          }
    
          t.store.submitVisual(params, () => {
            window.location.href = `${window.__keeper.pathHrefPrefix || '/'}/visual`
          })
        })
      },
      onCancel() {
        console.log('Cancel')
      },
    })
  }

  render() {
    const {
      form: {
        getFieldValue,
        getFieldDecorator,
      },
      show,
    } = this.props

    const {
      detailBaseInfo,
    } = this.store

    return (
      <div style={{display: show ? 'block' : 'none'}}>
        <FormItem {...formItemLayout} label="调度类型">
          {getFieldDecorator('scheduleType', {
            initialValue: detailBaseInfo.scheduleType || 1,
            rules: [{required: true, message: '请选择调度类型'}],
          })(
            <Select placeholder="请选择调度类型" style={{width: '100%'}}>
              {
                [{
                  name: '周期调度',
                  value: 1,
                }, {
                  name: '手动执行',
                  value: 2,
                }].map(item => (
                  <Option key={item.value} value={item.value}>{item.name}</Option>
                ))
              }
            </Select>
          )}
        </FormItem>

        {
          getFieldValue('scheduleType') === 1 ? (
            <FormItem
              className="period-item"
              label=""
              style={{marginBottom: 0}}
            >
              {getFieldDecorator('scheduleExpression', {
                initialValue: detailBaseInfo.scheduleExpression || CycleSelect.formatCron({
                  cycle: 'day',
                }),
                rules: [
                  {required: true, message: '更新周期不能为空'},
                ],
              })(
                <CycleSelect
                  cycleList={['day']}
                  cycleText="更新"
                  disabled={false}
                  required
                  layout="horizontal"
                  formItemLayout={formItemLayout} 
                />
              )}
            </FormItem>
          ) : null
        }
        <div className="bottom-button">
          <Button
            type="primary"
            onClick={this.submit}
          >
            提交
          </Button>
        </div>
      </div>
    )
  }
}
