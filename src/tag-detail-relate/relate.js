import {Component} from 'react'
import {observer} from 'mobx-react'
import {observable} from 'mobx'
import DagBox from '../component-dag-box'
import store from './store-relate'


@observer
export default class Related extends Component {
  @observable tableId = ''

  constructor(props) {
    super(props)
    if (props.aId) store.id = props.aId
  }


  componentDidMount() {
    const me = this
    store.tagLineage(data => { me.dagBox.drawDag(data) })
  }

  componentWillReceiveProps(nextProps) {
    if (store.id !== nextProps.aId && nextProps.isActive) {
      const me = this
      store.id = nextProps.aId
      store.tagLineage(data => { me.dagBox.drawDag(data) })
    }
  }

  render() {
    const me = this
    return (
      <div className="tag-relate">
        <DagBox
          ref={dag => me.dagBox = dag}
          current={store.id}
          // nodeClick={me.nodeClick}
        />
      </div>
    )
  }
}
