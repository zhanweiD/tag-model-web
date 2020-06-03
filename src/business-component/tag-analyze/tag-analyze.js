/**
 * @description 空值占比趋势
 */
import {Component} from 'react'
import {observer} from 'mobx-react'
import {action} from 'mobx'
import Trend from './trend'

import store from './store'

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
        <Trend store={store} />
      </div>
    )
  }
}
