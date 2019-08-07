import React, {Component} from 'react'
import PropTypes from 'prop-types'

import OverviewCards from './overview-cards'
import OverviewScore from './overview-score'
import OverviewCall from './overview-call'

/**
 * @description 标签地图 - 标签概览
 * @author 三千
 * @date 2019-08-06
 * @export
 * @class Overview
 * @extends {Component}
 */
export default class Overview extends Component {

  componentDidMount() {
    console.log('componentDidMount')
  }

  componentDidUpdate(prevProps, prevState) {
    console.log('componentDidUpdate')
  }
  

  render() {
    return (
      <div className="map-overview">
        <OverviewCards />
        <OverviewScore />
        <OverviewCall />
      </div>
    )
  }
}
