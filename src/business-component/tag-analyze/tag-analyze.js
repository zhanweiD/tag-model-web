/**
 * @description 空值占比趋势
 */
import {Component} from 'react'
import {observer} from 'mobx-react'
import Trend from './trend'
import Distribution from './distribution'

import store from './store'
import './distribution.styl'

@observer
export default class TagAnalyze extends Component {
  constructor(props) {
    super(props)
    store.tagId = props.tagId
  }

  componentWillMount() {

  }

  render() {
    const {tagId} = this.props
    return (
      <div className="p16 pt8">
        <h3 className="chart-title">标签分布</h3>
        <Distribution store={store} />
        <Trend store={store} />
      </div>
    )
  }
}
