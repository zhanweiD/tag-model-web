/* eslint-disable jsx-a11y/click-events-have-key-events */
import React from 'react'
import cls from 'classnames'
import {action} from 'mobx'
import {observer} from 'mobx-react'
import {
  Form, Input, Icon,
} from 'antd'
import RangeInput from '../component-range-input'

const FormItem = Form.Item
const {Search} = Input

/**
 * @description 标签搜索 - 顶部筛选项部分
 * @author 三千
 * @date 2019-08-06
 * @class SearchFilterForm
 * @extends {React.Component}
 */
@observer
class SearchFilter extends React.Component {
  // 状态
  state={
    expand: false, // 是否展开
  }

  render() {
    const {form, store} = this.props
    const {getFieldDecorator} = form
    const {expand} = this.state

    const {objList = [], filterObjId} = store

    // 所选类目的对象列表
    const objAll = {id: null, name: '全部'} // 指代全部
    const objSpans = [objAll, ...objList].map(obj => {
      // 就用 == ，原因：当初始化没有选择时，null == undefined可以选择全部，另外免得有字符串和数字的区别
      const isActive = obj.id == filterObjId //  || (!selectedObjId && obj.id === null)
      const className = cls('search-category', 'hand', isActive ? 'search-category--active' : '')

      return (
        <span 
          key={obj.id} 
          className={className}
          onClick={() => this.handleObjSelect(obj.id)}
        >
          {/* 刻意加的空格：
            * 由于obj可能数量很多，默认的自动换行可能截断某个 obj.name 文本，
            * 此时要给每个span加word-break: keep-all保持不被截断，
            * 但是这会导致所有span被当做一个词（即使有margin隔开），无法自动换行，
            * 因此需要刻意添加空格作为换行识别
            */}
          {obj.name + ' '}
        </span>
      )
    })
    
    return (
      <div className="search-filter white-block p24">
        <Form>
          {/* 搜索输入框 */}
          <div className="fac" style={{height: '40px', marginTop: '40px'}}>
            <FormItem>
              {
                getFieldDecorator('keyword', {
                  initialValue: store.filterKeyword,
                  // rules: [
                  // ],
                })(
                  <Search
                    placeholder="请输入标签关键词"
                    enterButton="搜索"
                    size="large"
                    style={{width: 552}}
                    // onChange={e => this.handleKeywordChange(e.target.value)}
                    onSearch={value => this.handleKeywordChange(value)}
                    onPressEnter={e => this.handleKeywordChange(e.target.value)}
                    onBlur={e => this.handleKeywordChange(e.target.value)}
                  />
                )
              }
            </FormItem>
          </div>

          {/* 所属类目 + 展开/收起按钮 */}
          <div className="FBH FBJB" style={{marginTop: '40px'}}>
            {/* 类目选择 */}
            <div className="FBH FBJS FB1">
              <span className="mr32 pt4" style={{width: 60}}>对象名称：</span>
              <div className="search-category-container">
                {objSpans}
              </div>
            </div>

            {/* 展开/收起按钮 */}
            <div>
              <span className="button-style far ml16" style={{width: 50}} onClick={this.handleToggle}>
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
            <RangeInput
              className="search-range-input"
              label="价值分"
              fieldNamePrefix="score-worth"
              onChange={(values, rawValues) => {
                this.handleScoreChange('filterWorth', values, rawValues)
              }}
            />
            <RangeInput
              className="search-range-input"
              label="质量分"
              fieldNamePrefix="score-quality"
              onChange={(values, rawValues) => {
                this.handleScoreChange('filterQuality', values, rawValues)
              }}
            />
            <RangeInput
              className="search-range-input"
              label="热度"
              fieldNamePrefix="score-hot"
              onChange={(values, rawValues) => {
                this.handleScoreChange('filterHot', values, rawValues)
              }}
            />
          </div>
        </Form>
      </div>
    )
  }

  // 展开/收起范围输入部分
  handleToggle = () => {
    const {expand} = this.state
    this.setState({
      expand: !expand,
    })
  }

  // 切换对象名称
  @action.bound handleObjSelect(id) {
    const {store} = this.props

    // 点击已选中的，不请求接口
    if (store.filterObjId === id) {
      return
    }

    store.filterObjId = id
    // 选择新的对象时，要回到第一页
    store.currentPage = 1

    // 更新列表
    this.doSearch()
  }

  // 关键词输入改变
  @action.bound handleKeywordChange(value) {
    const {store} = this.props
    store.filterKeyword = value.trim()
    this.doSearch()
  }

  // 价值分、质量分、热度输入发生变化, key是store里对应属性的键, values是处理过的值数组，rawValues是未处理的输入数据
  @action.bound handleScoreChange(key, values, rawValues) {
    const {store} = this.props

    console.log(values, rawValues)

    // 原始值既不是没填，也不是整数
    const isInvalid = rawValues.some(v => (v !== undefined && !(/^\d*$/).test(v)))

    // 如果不是整数，那么不修改store，而且UI上会报错
    if (isInvalid) {
      return
    }

    // 如果是合格的输入，那就存入store，之后请求接口
    store[key].min = values[0]
    store[key].max = values[1]

    this.doSearch()
  }

  // 触发筛选
  doSearch = () => {
    const {store} = this.props

    // 筛选时要重置选中的标签，不然遍历多麻烦
    store.resetSelectedTags()

    store.getTagList()
  }
}

export default Form.create()(SearchFilter)
