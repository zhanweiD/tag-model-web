import {Component} from 'react'
import {Select, Input, Form} from 'antd'
import {toJS} from 'mobx'
import {IconDel} from '../../icon-comp'

const {Option} = Select
const FormItem = Form.Item

const formItemLayout = null

const condition = [{
  value: 'equals',
  name: '等于',
}, {
  value: 'gt',
  name: '大于',
}, {
  value: 'ge',
  name: '大于等于',
}, {
  value: 'lt',
  name: '小于',
}, {
  value: 'le',
  name: '小于等于',
}, {
  value: 'not_equals',
  name: '不等于',
}, {
  value: 'in',
  name: '在集合',
}, {
  value: 'not_in',
  name: '不在集合',
}, {
  value: 'is_null',
  name: '为空',
}]

@Form.create()
export default class RuleItem extends Component {
  state = {
    tagList: [],
  }

  render() {
    const {
      pos = [], 
      delCon, 
      funcList = [], 
      tagList = [],
      form: {
        getFieldDecorator,
      },
      info,
    } = this.props

    const posStyle = {
      left: pos[0],
      top: pos[1],
    }

    const {level} = info

    return (  
      <div className="rule-item" style={posStyle}>
        <FormItem
          {...formItemLayout}
          label={null}
        >
          {getFieldDecorator('leftFunction', {
            rules: [
              {required: true, message: '请选择函数'},
            ],
            initialValue: info.leftFunction || '标签值',
          })(
            <Select 
              showSearch
              className="mr8" 
              style={{width: 100}}
              optionFilterProp="children"
              placeholder="选择函数"
            >
              {funcList.map(d => <Option value={d.code}>{d.name}</Option>)}
            </Select>
          )}
        </FormItem>

        <FormItem
          {...formItemLayout}
          label={null}
        >
          {getFieldDecorator('leftTagId', {
            rules: [
              {required: true, message: '请选择标签'},
            ],
            initialValue: info.leftTagId,
          })(
            <Select 
              showSearch
              className="mr8" 
              style={{width: 150}}
              optionFilterProp="children"
              placeholder="选择标签"
            >
              {tagList.map(d => <Option value={d.objIdTagId}>{d.objNameTagName}</Option>)}
         
            </Select>
          )}
        </FormItem>

        <FormItem
          {...formItemLayout}
          label={null}
        >
          {getFieldDecorator('comparision', {
            initialValue: info.comparision || 'equals',
          })(
            <Select 
              showSearch
              className="mr8" 
              style={{width: 100}}
              optionFilterProp="children"
            >
              {
                condition.map(d => <Option value={d.value}>{d.name}</Option>)
              }
         
            </Select>
          )}
        </FormItem>

        <FormItem
          {...formItemLayout}
          label={null}
        >
          {getFieldDecorator('rightFunction', {
            initialValue: info.rightFunction || '固定值',
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
          {getFieldDecorator('rightParams', {
            initialValue: info.rightParams,
            rules: [
              {required: true, message: '请输入'},
            ],
          })(
            <Input placeholder="请输入" style={{width: 120}} />
          )}
        </FormItem>
       
        {
          level[level.length - 1] > 0 ? <IconDel size="16" className="delete-icon" onClick={() => delCon()} style={{right: '0px'}} /> : null
        }
       
      </div>
    )
  }
}
