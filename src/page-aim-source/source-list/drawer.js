/**
 * @description 添加目的源
 */
import {Component} from 'react'
import {observer} from 'mobx-react'
import {action} from 'mobx'
import {Drawer, Input, Form, Select, Button} from 'antd'


const FormItem = Form.Item
const Option = {Select}
const {TextArea} = Input

const formItemLayout = {
  labelCol: {span: 4},
  wrapperCol: {span: 20},
}

@Form.create()
@observer
export default class AddSource extends Component {
  constructor(props) {
    super(props)
    this.store = props.store
  }
  
  @action.bound closeDrawer() {
    this.store.visible = false
  }


  render() {
    const {
      form: {
        getFieldDecorator,
      }} = this.props
    const {
      visible,
      confirmLoading,
    } = this.store

    const drawerConfig = {
      title: '添加目的源',
      visible,
      width: 560,
      maskClosable: false,
      destroyOnClose: true,
      onClose: this.closeDrawer,
      className: 'add-source',
    }

    return (
      <Drawer
        {...drawerConfig}
      >
        <Form>
          <FormItem {...formItemLayout} label="目的源名称">
            {getFieldDecorator('name', {
              rules: [
                {transform: value => value && value.trim()},
                {required: true, message: '目的源名称不能为空'},  
                {max: 32, message: '输入不能超过32个字符'},
                {
                  validator: this.checkName,
                }],
              validateFirst: true,
            })(
              <Input autoComplete="off" placeholder="请输入目的源名称" />
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
          <h3 className="mb24">目的源信息</h3>
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
            labelCol={{span: 4}}
            wrapperCol={{span: 16}}
            label="数据源"
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
          <FormItem {...formItemLayout} label="目的表">
            {getFieldDecorator('objId', {
              rules: [{required: true, message: '请选择目的表'}],
            })(
              <Select 
                labelInValue 
                placeholder="请选择目的表" 
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
        </Form>
        <div className="bottom-button">
          <Button style={{marginRight: 8}} onClick={() => this.store.closeDrawer()}>取消</Button>
          <Button type="primary" loading={confirmLoading} onClick={this.submit}>确定</Button>
        </div>
      </Drawer>
    )
  }
}
