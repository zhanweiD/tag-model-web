import {Component} from 'react'
import {observable, action} from 'mobx'
import {observer} from 'mobx-react'
import {Button, Modal} from 'antd'
import _ from 'lodash'
import cls from 'classnames'

@observer
export default class <%ComponentName%> extends Component {

  render() {
    const {store} = this.props
    return (
      <div className="<%component-name%>">
        {store.content}
      </div>
    )
  }
}

