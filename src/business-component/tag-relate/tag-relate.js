/**
 * @description 标签血缘
 */
import {Component} from 'react'
import {observer} from 'mobx-react'
import DagBox from './dag-box'

import store from './store'

@observer
export default class Related extends Component {
  componentDidMount() {
    const me = this
    const {tagId} = this.props
    
    store.tagLineage(tagId, data => {
      if (me.dagBox) {
        me.dagBox.drawDag(data)
      } 
    })
  }

  render() {
    const me = this
    const {tagId} = this.props
    return (
      <DagBox
        ref={dag => me.dagBox = dag}
        current={tagId}
      />
    )
  }
}
