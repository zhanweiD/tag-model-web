/**
 * @description 
 */
import {Component} from 'react'
import {observer, inject} from 'mobx-react'
import {action, observable, toJS} from 'mobx'
import cls from 'classnames'
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { Button, Input } from 'antd';

import {QuestionTooltip} from '../../component'
import ParamItemInput from './param-item'

const FormItem = Form.Item

@Form.create()
@inject('rootStore')
@observer
export default class DrawerTwoParams extends Component {
  constructor(props) {
    super(props)

    const {drawerStore, codeStore} = props.rootStore

    this.drawerStore = drawerStore

    this.store = codeStore
  }

  @observable renderList = []

  @action componentDidMount() {
    const {schemeDetail} = this.drawerStore

    if (schemeDetail.parameterMappingKeys && typeof schemeDetail.parameterMappingKeys === 'object') {
      const keys = Object.keys(schemeDetail.parameterMappingKeys)

      this.renderList = keys.map((d, i) => ({
        id: `${i}paramItem`,
        init: {
          key: d,
          value: schemeDetail.parameterMappingKeys[d],
        },
      }))
    }
  }

  @action.bound addParam() {
    const len = this.renderList.length
    this.renderList.push({
      type: 'add',
      id: `${len ? Math.random() : 0}paramItem`,
    })
  }

  @action.bound paramsChange(v) {
    const {runStatusMessage} = this.store
    if (runStatusMessage.status === 'success') {
      this.store.runStatusMessage.status = 'error'
    }
  }

  @action.bound remove(id) {
    this.renderList = this.renderList.filter(d => d.id !== id)
  }

  // 运行参数相关
  paramItem = (id, initialValue) => {
    const {form} = this.props
    const {getFieldDecorator} = form

    const paramItemLayout = {
      labelCol: {
        xs: {span: 0},
        sm: {span: 0},
      },
      wrapperCol: {
        xs: {span: 24},
        sm: {span: 24},
      },
    }

    return (
      <div className="FBH param-item-box" key={`${id}_FormItem`}>
        <FormItem
          {...paramItemLayout}
        >
          {getFieldDecorator(id, {
            rules: [{
              validator: (rule, param, callback) => {
                if (!param) {
                  callback('请输入运行参数')
                } else if ((param.value && param.key) || (!param.value && !param.key)) {
                  callback()
                } else if (!param.key) {
                  callback('key值不能为空')
                } else {
                  callback('value值不能为空')
                }
              },
            }],
            initialValue,  
          })(
            <ParamItemInput 
              disabled={this.props.disabled} 
              form={form} 
              paramsChange={this.paramsChange}
            />
          )}
        </FormItem>
        <MinusCircleOutlined
          className={cls({
            'dynamic-delete-button': true,
            noAllow: this.props.disabled,
          })}
          onClick={this.props.disabled ? null : () => this.remove(id)} />
      </div>
    );
  }

  render() {
    const {wrappedComponentRef} = this.props

    return (
      <div className="params-box">
        <div className="params-box-title">
          运行参数 
          <QuestionTooltip tip="用于配置运行时代码中的变量和替换该变量的值" />
        </div>
        <div style={{height: 'calc(100% - 38px)', overflow: 'auto'}}>
          <Form wrappedComponentRef={wrappedComponentRef}>
            {
              this.renderList.map(d => this.paramItem(d.id, toJS(d.init)))
            }
            <div className="fac mt16" style={{width: '230px'}}> 
              <Button type="dashed" onClick={this.addParam} style={{width: '196px'}}>
                <PlusOutlined />
                添加参数
              </Button>
            </div>
          
          </Form>
        </div>
      </div>
    );
  }
}
