/**
 * @description 标签仓库-标签体系
 */
import {Provider} from 'mobx-react'

import {Component} from 'react'
import Tree from './tree'
import Detail from './detail'

import store from './store'

class TagSystem extends Component {
  render() {
    return (
      // <Provider store={store}>
      <div className="tag-system">
        <Tree store={store} {...this.props} />
        <Detail store={store} {...this.props} />
      </div>
      // </Provider> 
    )
  }
}

export default TagSystem
