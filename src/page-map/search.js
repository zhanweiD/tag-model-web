import React, {Component} from 'react'
import {observer} from 'mobx-react'
import SearchFilter from './search-filter'
import SearchTable from './search-table'
import SearchModal from './search-modal'
import store from './store-search'

/**
 * @description 标签搜索
 * @author 三千
 * @date 2019-08-06
 * @export
 * @class MapSearch
 * @extends {Component}
 */
@observer
export default class MapSearch extends Component {
  // state={
  //   modalVisible: true, // 批量添加弹框是否显示
  // }

  // // 控制弹框显隐
  // toggleModal(visible = false) {
  //   this.setState({
  //     modalVisible: visible,
  //   })
  // }

  render() {
    return (
      <div className="map-search">
        <SearchFilter store={store} />
        <SearchTable store={store} />
        <SearchModal store={store} />
      </div>
    )
  }
}
