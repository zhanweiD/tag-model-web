/* eslint-disable jsx-a11y/click-events-have-key-events */
import React from 'react'
import PropTypes from 'prop-types'
import {
  Form, Input, InputNumber, Icon,
} from 'antd'

const FormItem = Form.Item
const {Search} = Input

/**
 * @description 标签搜索 - 顶部筛选项部分
 * @author 三千
 * @date 2019-08-06
 * @class SearchFilterForm
 * @extends {React.Component}
 */
class SearchFilter extends React.Component {
  // props类型校验；（除了做校验，还能方便快速知道有哪些props）
  static propTypes = {
    onChange: PropTypes.func.isRequired,
  }

  // 状态
  state={
    expand: false, // 是否展开
  }

  // 筛选项改变
  onChange = () => {
    // this.props.onChange()
  }

  // 展开/收起数字输入部分
  handleToggle = () => {
    const {expand} = this.state
    this.setState({
      expand: !expand,
    })
  }

  render() {
    const {form} = this.props
    const {getFieldDecorator} = form
    const {expand} = this.state

    return (
      <div className="search-filter white-block p24">
        <Form>
          {/* 搜索输入框 */}
          <div className="fac" style={{height: '40px', marginTop: '40px'}}>
            <FormItem>
              {
                getFieldDecorator('keyword', {
                  initialValue: '',
                  rules: [
                    // whiteSpace: 
                  ],
                })(
                  <Search
                    placeholder="请输入标签关键词"
                    enterButton="搜索"
                    size="large"
                    style={{width: 552}}
                    onSearch={value => console.log(value)}
                  />
                )
              }
            </FormItem>
          </div>

          {/* 所属类目 + 展开/收起按钮 */}
          <div className="FBH FBJB" style={{marginTop: '40px'}}>
            {/* 类目选择 */}
            <div className="fal">
              <span>所属类目：</span>
              <span className="search-category search-category--active">全部</span>
              <span className="search-category">客户</span>
              <span className="search-category">加盟商</span>
              <span className="search-category">消费者</span>
            </div>

            {/* 展开/收起按钮 */}
            <div>
              <span className="button-style" onClick={this.handleToggle}>
                {expand ? '收起' : '展开'}
                <Icon type={expand ? 'up' : 'down'} style={{marginLeft: '4px'}} />
              </span>
            </div>
          </div>

          {/* 被折叠的价值分、质量分、热度的筛选输入框 */}
          <div 
            className="filter-collapse mt16 pt16 FBH" 
            style={{
              borderTop: '1px dashed #E9E9E9', 
              display: expand ? 'flex' : 'none',
            }}
          >
            <FormItem
              // antd bug: colon为true时不显示冒号，且会截掉label后面刻意加的冒号，false时才不会截；另外label宽度不好微调，干脆不用
              // label="价值分："
              // colon={false}
              // labelCol={{span: 1}}
            >
              <span className="mr4">价值分：</span>
              {
                getFieldDecorator('score-value-min', {
                  initialValue: undefined,
                })(
                  <InputNumber />
                )
              }
              <span style={{padding: '0 10px'}}>-</span>
              {
                getFieldDecorator('score-value-max', {
                  initialValue: undefined,
                })(
                  <InputNumber />
                )
              }
            </FormItem>
            <FormItem>
              <span className="mr4">质量分：</span>
              {
                getFieldDecorator('score-quality-min', {
                  initialValue: undefined,
                })(
                  <InputNumber />
                )
              }
              <span style={{padding: '0 10px'}}>-</span>
              {
                getFieldDecorator('score-quality-max', {
                  initialValue: undefined,
                })(
                  <InputNumber />
                )
              }
            </FormItem>
            <FormItem>
              <span className="mr4">热度：</span>
              {
                getFieldDecorator('score-hot-min', {
                  initialValue: undefined,
                })(
                  <InputNumber />
                )
              }
              <span style={{padding: '0 10px'}}>-</span>
              {
                getFieldDecorator('score-hot-max', {
                  initialValue: undefined,
                })(
                  <InputNumber />
                )
              }
            </FormItem>
          </div>
        </Form>
      </div>
    )
  }
}

export default Form.create()(SearchFilter)
