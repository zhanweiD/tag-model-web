import {Component} from 'react'
import {action, toJS} from 'mobx'
import {observer} from 'mobx-react'

import store from './store-relate'

@observer
export default class Relate extends Component {
  render() {
    return <div className="relate">标签血缘</div>
  }
}
