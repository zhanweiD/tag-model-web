import React, {Component} from 'react'
import SearchFilter from './search-filter'
import SearchTable from './search-table'
import SearchModal from './search-modal'

/**
 * @description 标签搜索
 * @author 三千
 * @date 2019-08-06
 * @export
 * @class MapSearch
 * @extends {Component}
 */
export default class MapSearch extends Component {

  state={
    modalVisible: true, // 批量添加弹框是否显示
  }

  // 控制弹框显隐
  toggleModal(visible = false) {
    this.setState({
      modalVisible: visible,
    })
  }

  render() {
    const {modalVisible} = this.state

    return (
      <div className="map-search">
        <SearchFilter />
        <SearchTable />
        <SearchModal
          visible={modalVisible}
          onCancel={() => this.toggleModal(false)}
          onOk={() => this.toggleModal(false)}
        />
      </div>
    )
  }
}
