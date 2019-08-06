import {Component} from 'react'
import {observable, action, toJS} from 'mobx'
import {observer} from 'mobx-react'

export default class DataSource extends Component {
  componentWillMount() {
  }

  render() {
    return (
      <div className="data-source FBH">
        目的数据源列表
      </div>
    )
  }
}
