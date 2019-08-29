import React from 'react'
import {observer} from 'mobx-react'
import {action} from 'mobx'
import TimeRange from '../time-range'
import OverviewCallPie from './overview-call-pie'

/**
 * @description 标签概览 - 标签调用，两个饼图
 * @author 三千
 * @date 2019-08-07
 * @export
 * @class OverviewCall
 * @extends {React.Component}
 */
@observer
export default class OverviewCall extends React.Component {
  state = {
    leftLoading: false,
    rightLoading: false,
  }

  componentDidMount() {
    this.loadData()
  }

  render() {
    const {store} = this.props
    const {leftLoading, rightLoading} = this.state
    const {apiCountData, tagCallTimesData} = store

    return (
      <div className="bgf mt16">
        {/* 标签调用标题部分 */}
        <div
          className="FBH FBJB"
          style={{padding: '16px 24px 8px', borderBottom: '1px solid #e8e8e8'}}
        >
          <span className="fs14 mt4">标签调用</span>
          <TimeRange 
            custom
            exportTimeRange={(lte, gte) => {
              this.onTimeChange(lte, gte)
            }}
          />
        </div>

        {/* 饼图部分 */}
        <div className="p24 pt16">
          <div className="FBH FBJB" style={{minHeight: 280}}>
            {/* 左侧部分 */}
            <div style={{width: '50%'}}>
              <div className="pb16 fs14">标签调用的API数占比</div>
              <OverviewCallPie list={apiCountData.list} total={apiCountData.total} loading={leftLoading} />
            </div>

            {/* 右侧部分 */}
            <div style={{width: '50%'}}>
              <div className="pb16 fs14">标签被API调用的次数占比</div>
              <OverviewCallPie list={tagCallTimesData.list} total={tagCallTimesData.total} loading={rightLoading} />
            </div>
          </div>
        </div>
      </div>
    )
  }

  // 切换时间
  @action.bound onTimeChange(lte, gte) {
    const {store} = this.props
    store.callTimeRange = [lte, gte]

    this.loadData()
  }

  // 加载数据
  @action loadData() {
    const {store} = this.props
    this.setState({
      leftLoading: true,
      rightLoading: true,
    })
 
    // 1.标签调用api；2.标签被api调用
    store.getCallData(1, () => {
      this.setState({
        leftLoading: false,
      })
    })
    store.getCallData(2, () => {
      this.setState({
        rightLoading: false,
      })
    })
  }
}
