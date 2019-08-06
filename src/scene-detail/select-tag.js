import {Component} from 'react'
import {observable, action, toJS} from 'mobx'
import {observer} from 'mobx-react'

export default class SelectTag extends Component {
  componentWillMount() {
  }

  render() {
    return (
      <div className="select-tag FBH">
        <div style={{width: '150px'}}>tree</div>
      </div>
    )
  }
}
