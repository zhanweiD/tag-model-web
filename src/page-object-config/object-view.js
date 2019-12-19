/**
 * @description 对象视图
 */
import {Component} from 'react'
import {observer} from 'mobx-react'

@observer
export default class ObjectView extends Component {
  render() {
    console.log('view')
    return (
      <div className="object-view">对象视图</div>
    )
  }
}
