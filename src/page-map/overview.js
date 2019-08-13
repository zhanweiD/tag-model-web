import React, {Component} from 'react'
import {observer} from 'mobx-react'

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
  render() {
    return (
      <div className="map-overview">
        <OverviewCards store={store} />
        <OverviewScore store={store} />
        <OverviewCall store={store} />
      </div>
    )
  }
}
