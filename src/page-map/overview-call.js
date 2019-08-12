import React from 'react'
import {observer} from 'mobx-react'
import {action, toJS} from 'mobx'
import TimeRange from '../time-range'
import EchartsChart from '../component-echarts-chart'
import {getPieChartOption} from './util'

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
  componentDidMount() {
    const {store} = this.props
    store.getCallData()
  }

  render() {
    const {store} = this.props
    const pieOption = getPieChartOption(store.apiCountData)

    console.log(pieOption)

    return (
      <div className="white-block mt16">
        {/* 标签调用标题部分 */}
        <div
          className="FBH FBJB"
          style={{padding: '16px 24px 8px', borderBottom: '1px solid #e8e8e8'}}
        >
          <span className="fs14 mt4">标签调用</span>
          <TimeRange 
            custom
            exportTimeRange={(lte, gte) => {
              console.log('exportTimeRange', lte, gte)
            }}
          />
        </div>

        {/* 饼图部分 */}
        <div className="p24 pt16">
          {/* <Row>
            <Col span={12}>
              ddd
            </Col>
            <Col span={12}>
              ccc
            </Col>
          </Row> */}
          <div className="FBH FBJB">
            {/* 左侧部分 */}
            <div style={{width: '50%'}}>
              <div className="pb16 fs14">标签调用的API数占比</div>
              <div className="FBH FBJB mr24">
                <div style={{width: '60%'}}>
                  <EchartsChart
                    option={pieOption}
                    height={280}
                  />
                </div>
                <div>
                  legends
                </div>
              </div>
            </div>

            {/* 右侧部分 */}
            <div style={{width: '50%'}}>
              <div className="pb16 fs14">标签被API调用的次数占比</div>
              <div className="FBH FBJB mr24">
                <div style={{width: '60%'}}>
                  <EchartsChart
                    option={pieOption}
                    height={280}
                  />
                </div>
                <div>
                  legends
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
