import React from 'react'
import PropTypes from 'prop-types'
import {DatePicker} from 'antd'

/**
 * @description 日期选择组件，包含三个月、七天、自己选（TODO: 三月、七天这种可选时间可以做成可配置）
 * @author 三千
 * @date 2019-08-07
 * @export
 * @class DateSelect
 * @extends {React.Component}
 */
export default class DateSelect extends React.Component {
  static propTypes = {
    onChange: PropTypes.func, // 选择时间发生变化时触发的回调
  }

  render() {
    return (
      <div style={{color: 'rgba(0,0,0,0.65)'}}>
        <span className="mr30 button-style-hover">近3个月</span>
        <span className="mr30 button-style-hover active">近7天</span>
        <DatePicker.RangePicker />
      </div>
    )
  }
}
