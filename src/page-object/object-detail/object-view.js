/**
 * @description 对象视图
 */
import {Component} from 'react'
import {observer} from 'mobx-react'

@observer
export default class ObjectView extends Component {
  render() {
    return (
      <div className="object-view">对象视图</div>
    )
  }
}
