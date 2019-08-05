import {Component} from 'react'
import {observer} from 'mobx-react'
import {action, toJS} from 'mobx'
import initChart from './draw-chart'
// import store from './store-warn-rule'

@observer
export default class WarnRule extends Component {

  componentDidMount() {
    setTimeout(() => {
      initChart(this.chart, this.props.chartData, this.props.isTable)
    }, 1000)
  }

  render() {
    return (
      <div>
        <svg ref={p => this.chart = p} height="500" width="100%"/>
      </div>
    )
  }
}
