/**
 * @description 标签仓库-标签体系
 */
import {Component} from 'react'
import Tree from './tree'
import Detail from './detail'

import store from './store'

class TagSystem extends Component {
  render() {
    return (
      <div className="tag-system">
        <Tree store={store} />
        <Detail store={store} />
      </div>
    )
  }
}

export default TagSystem
