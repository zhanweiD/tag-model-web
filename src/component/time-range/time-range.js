import {Component} from 'react'
import PropTypes from 'prop-types'
import {observable, action} from 'mobx'
import {observer} from 'mobx-react'
import {DatePicker, Select} from 'antd'

const {Option} = Select

@observer
class TimeRange extends Component {
  @observable disabledDatePicker = true
  @observable theDateRange = this.props.rangeMap[this.props.defaultRangeInx].value
  @observable theDateRange2 = this.props.includeToday ? this.props.rangeMap[this.props.defaultRangeInx].value - 1 : this.props.rangeMap[this.props.defaultRangeInx].value
  @observable gte = moment().subtract(this.theDateRange2, 'day').format(this.props.dataFormat)
  @observable lte = this.props.includeToday ? moment().subtract(0, 'day').format(this.props.dataFormat) : moment().subtract(1, 'day').format(this.props.dataFormat)

  render() {
    const {rangeMap, custom, dataFormat} = this.props
    const theDateGlt = moment(this.gte, dataFormat)
    const theDateLte = moment(this.lte, dataFormat)
    return (
      <div className="time-range">
        <label className="pr8">时间设置</label>
        <Select className="pr8" style={{width: 110}} defaultValue={this.theDateRange} onChange={v => this.changeTimeRange(v)}>
          {
            rangeMap.map(item => <Option key={item.value} value={item.value}>{item.label}</Option>)
          }
          {custom && <Option value="custom">自定义</Option>}
        </Select>
        <DatePicker
          className="mr8"
          style={{width: 115}}
          allowClear={false}
          value={theDateGlt}
          // getCalendarContainer={() => document.getElementById('bar-container')}
          disabledDate={e => this.disabledStartDate(e, theDateLte)}
          disabled={this.disabledDatePicker}
          onChange={field => this.onDateChange('gte', field.format(dataFormat))}
        />
        至
        <DatePicker
          className="ml8"
          style={{width: 115}}
          allowClear={false}
          value={theDateLte}
          // getCalendarContainer={() => document.getElementById('bar-container')}
          disabledDate={e => this.disabledEndDate(e, theDateGlt)}
          disabled={this.disabledDatePicker}
          onChange={field => this.onDateChange('lte', field.format(dataFormat))}
        />
      </div>
    )
  }

  @action onDateChange(type, value) {
    if (type) {
      type === 'gte' ? this.gte = value : this.lte = value
      this.theDateRange = null
    }

    // 控制时间跨度在90天
    if (type === 'gte') {
      const diff = moment(this.lte).diff(moment(value), 'days')

      if (diff > 90) {
        this.lte = moment(value).add(90, 'd').format('YYYY-MM-DD')
      }
    } else if (type === 'lte') {
      const diff = moment(value).diff(moment(this.gte), 'days')

      if (diff > 90) {
        this.gte = moment(value).subtract(90, 'd').format('YYYY-MM-DD')
      }
    }

    this.props.exportTimeRange(this.gte, this.lte)
  }

  @action disabledStartDate(startValue, endValue) {
    if (!startValue || !endValue) {
      return false
    }
    return startValue.valueOf() > endValue.valueOf() || startValue.isAfter(moment(Date.now()).add(0, 'days'))
  }

  @action disabledEndDate(endValue, startValue) {
    if (!endValue || !startValue) {
      return false
    }

    return endValue.valueOf() < startValue.valueOf() || endValue.isAfter(moment(Date.now()).add(0, 'days'))
  }

  @action changeTimeRange(number) {
    const {dataFormat} = this.props
    const isCustom = number === 'custom'
    if (!isCustom) {
      this.theDateRange = number

      // 控件日期算今天
      if (this.props.includeToday) {
        this.gte = moment().subtract(this.theDateRange - 1, 'day').format(dataFormat)
        this.lte = moment().subtract(0, 'day').format(dataFormat)
      } else {
        this.gte = moment().subtract(this.theDateRange, 'day').format(dataFormat)
        this.lte = moment().subtract(1, 'day').format(dataFormat)
      }
      // this.gte = moment().subtract(this.theDateRange, 'day').format(dataFormat)
      // this.lte = moment().subtract(1, 'day').format(dataFormat)

      this.onDateChange()
    }
    this.disabledDatePicker = !isCustom
  }
}

Component.propTypes = {
  custom: PropTypes.bool,
  rangeMap: PropTypes.arrayOf(PropTypes.object),
  defaultRangeInx: PropTypes.number,
  dataFormat: PropTypes.string,
  exportTimeRange: PropTypes.func,
  includeToday: PropTypes.bool,
}

TimeRange.defaultProps = {
  custom: false,
  rangeMap: [{
    value: 7,
    label: '最近7天',
  }, {
    value: 30,
    label: '最近30天',
  }],
  defaultRangeInx: 0,
  dataFormat: 'YYYY-MM-DD',
  exportTimeRange: () => {},
  includeToday: false,
}

export default TimeRange
