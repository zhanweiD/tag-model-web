/**
 * @description 添加同步计划 - 基础信息配置
 */
import {Component, Fragment} from 'react'
import {observer} from 'mobx-react'
import {action, toJS} from 'mobx'
import {
  Input, Form, Select, Button, Switch,
} from 'antd'

const FormItem = Form.Item
const Option = {Select}
const {TextArea} = Input

const formItemLayout = {
  labelCol: {span: 7},
  wrapperCol: {span: 12},
}

@Form.create()
@observer
export default class StepOne extends Component {
  constructor(props) {
    super(props)
    this.store = props.store
  }

  @action.bound nextStep() {
    this.store.nextStep()
  }

  render() {
    const {
      form: {
        getFieldDecorator,
        getFieldValue,
      },
      show,
      closeDrawer,
    } = this.props

    return (
      <div style={{display: show ? 'block' : 'none'}}>
        <Form>
          <FormItem {...formItemLayout} label="计划名称">
            {getFieldDecorator('name', {
              rules: [
                {transform: value => value && value.trim()},
                {required: true, message: '计划名称不能为空'},  
                {max: 32, message: '输入不能超过32个字符'},
                {
                  validator: this.checkName,
                }],
              validateFirst: true,
            })(
              <Input autoComplete="off" placeholder="请输入计划名称" />
            )}
          </FormItem>
       
          <FormItem {...formItemLayout} label="同步对象">
            {getFieldDecorator('objId', {
              rules: [{required: true, message: '请选择同步对象'}],
            })(
              <Select 
                labelInValue 
                placeholder="请选择所属对象" 
                style={{width: '100%'}} 
                onSelect={v => this.selectObj(v)}
              >
                {
                  [].map(item => (
                    <Option key={item.objId} value={item.objId}>{item.name}</Option>
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
          <h3 className="mb24" style={{marginLeft: '200px'}}>目的源信息</h3>
          <FormItem {...formItemLayout} label="数据源类型">
            {getFieldDecorator('objId', {
              rules: [{required: true, message: '请选择数据源类型'}],
            })(
              <Select 
                labelInValue 
                placeholder="请选择数据源类型" 
                style={{width: '100%'}} 
                onSelect={v => this.selectObj(v)}
              >
                {
                  [].map(item => (
                    <Option key={item.objId} value={item.objId}>{item.name}</Option>
                  ))
                }
              </Select>
            )}
          </FormItem>
          <FormItem 
            {...formItemLayout} 
            label="目的源"
            extra={(
              <span>
              若无可用的数据源，请先
                <a href>去项目配置中添加目的数据源</a>
              </span>
            )}
          >
            {getFieldDecorator('objId', {
              rules: [{required: true, message: '请选择数据源'}],
            })(
              <div className="select-storage">
                <Select 
                  labelInValue 
                  placeholder="请选择数据源" 
                  style={{width: '100%'}} 
                  onSelect={v => this.selectObj(v)}
                >
                  {
                    [].map(item => (
                      <Option key={item.objId} value={item.objId}>{item.name}</Option>
                    ))
                  }
                </Select>
                <div className="view-storage">查看数据源</div>
              </div>
              
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="自定义目的表">
            {getFieldDecorator('isEnum', {
              valuePropName: 'checked',
            })(<Switch checkedChildren="是" unCheckedChildren="否" onChange={v => this.changeIsEnum(v)} />)}
          </FormItem>
          <FormItem {...formItemLayout} label="表名">
            {getFieldDecorator('objId', {
              rules: [
                {transform: value => value && value.trim()},
                {required: true, message: '表名不能为空'},  
              ]})(
              <div className="FBH"> 
                  <span className="ml16 mr16">tbjh_</span>
                  <Input autoComplete="off" placeholder="请输入表名称" />
                </div>
            )}
          </FormItem>
        </Form>
        <div className="bottom-button">
          <Button style={{marginRight: 8}} onClick={() => closeDrawer()}>关闭</Button>
          <Button
            type="primary"
            style={{marginRight: 8}}
            onClick={this.nextStep}
          >
            下一步
          </Button>
        </div>
      </div>
    )
  }
}
