import React, {Component} from 'react'
import {observer} from 'mobx-react'
import PropTypes from 'prop-types'

import OverviewCards from './overview-cards'
import OverviewScore from './overview-score'
import OverviewCall from './overview-call'
import store from './store-overview'

/**
 * @description 标签地图 - 标签概览
 * @author 三千
 * @date 2019-08-06
 * @export
 * @class Overview
 * @extends {Component}
 */
@observer
export default class Overview extends Component {
  static propTypes = {
    basicData: PropTypes.object, // 卡片的原始数据，因为页面初始化时要加载来判断是否无标签，所以就从外面传进来吧
  }

  render() {
    const {basicData} = this.props

    return (
      <div className="map-overview">
        <OverviewCards basicData={basicData} />
        <OverviewScore store={store} />
        <OverviewCall store={store} />
      </div>
    )
  }
}
