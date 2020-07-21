/**
 * @description 空值占比趋势
 */
import {Component} from 'react'
import {observer} from 'mobx-react'
import {Badge, Button} from 'antd'
// import Trend from './trend'
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
    const {status, nullRatio, recordTime, name} = store.valueTrend
    return (
      <div className="p16 pt8 pr">
        <h3 className="chart-title">标签分布</h3>
        <Button 
          type="primary pa" 
          style={{display: 'block', top: '16px', right: '16px'}}
          onClick={store.getValueUpdate}
        >
          更新
        </Button>
        <p>
          <span className="mr16">{`${nullRatio}%的实体拥有${name}这个标签`}</span>
          <Badge status={status !== 3 ? status !== 2 ? 'warning' : 'success' : 'error'} />
          <span className="mr16">{recordTime}</span>
        </p>
        <Distribution store={store} />
      </div>
    )
  }
}
