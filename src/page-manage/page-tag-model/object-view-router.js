import {Component, Fragment} from 'react'
import {observer} from 'mobx-react'
import {toJS, observable, action} from 'mobx'
import ObjectView4 from './object-view-4' // 实体 的对象视图
import ObjectView3 from './object-view-3' // 关系 的对象视图


@observer
export default class BusinessModel extends Component {
  constructor(props) {
    super(props)
    this.store = props.bigStore
  }

  render() {
    return (
      <Fragment>
        {
          this.store.typeCode === '4' ? <ObjectView4 {...this.props} /> : <ObjectView3 {...this.props} />
        }
      </Fragment>
    )
  }
}
