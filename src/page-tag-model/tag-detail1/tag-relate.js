/**
 * @description 标签血缘
 */
import {Component} from 'react'
import {observer} from 'mobx-react'
import DagBox from './dag-box'

@observer
export default class Related extends Component {
  constructor(props) {
    super(props)
    this.store = props.store
  }

  componentDidMount() {
    const me = this
    this.store.tagLineage(data => {
      if (me.dagBox) {
        me.dagBox.drawDag(data)
      } 
    })
  }

  render() {
    const me = this
    const {tagId} = this.store
    return (
      <DagBox
        ref={dag => me.dagBox = dag}
        current={tagId}
      // nodeClick={me.nodeClick}
      />
    )
  }
}
