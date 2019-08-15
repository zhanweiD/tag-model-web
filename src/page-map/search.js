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
  componentDidMount() {
    // 请求所属类目的对象列表
    store.getObjList()

    // 请求标签列表（表格数据）
    store.getTagList()
  }

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
