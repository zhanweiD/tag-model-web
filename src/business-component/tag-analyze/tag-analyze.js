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
    return (
      <div className="p16 pt8 pr">
        <h3 className="chart-title">标签分布</h3>
        <Button type="primary pa" style={{display: 'block', top: '16px', right: '16px'}}>更新</Button>
        <p>
          <span className="mr16">{`${'80%'}的实体拥有${'手机号'}这个标签`}</span>
          <Badge status={!1 ? !2 ? 'error' : 'warning' : 'success'} />
          <span className="mr16">2020.07.20 12:12:12</span>
        </p>
        <Distribution store={store} />
        {/* <Trend store={store} /> */}
      </div>
    )
  }
}
