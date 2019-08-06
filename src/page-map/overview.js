import React, {Component} from 'react'

/**
 * @description 标签概览
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
        overview hi
      </div>
    )
  }
}
