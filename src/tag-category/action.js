import {Component} from 'react'
import {observable, action} from 'mobx'
import {observer, inject} from 'mobx-react'
import {Menu, Dropdown} from 'antd'
import _ from 'lodash'
import {Link} from 'react-router-dom'
import NoBorderInput from '../component-noborder-input'
import SvgExtend from '../svg-component/Extend'
import SvgUnExtend from '../svg-component/UnExtend'
import SvgRefresh from '../svg-component/Refresh'
import SvgTreeAdd from '../svg-component/TreeAdd'

@inject('bigStore')
@observer
class Action extends Component {
  constructor(props) {
    super(props)
    this.bigStore = this.props.bigStore
    this.store = this.bigStore.categoryStore
  }

  @action.bound handleEditCategory() {
    this.store.currentTreeItemKey = 0
    this.store.eStatus.editObject = false
    this.store.modalVisible.editObject = true
  }

  @action.bound handleRefresh() {
    return this.store.getCategoryList()
  }

  @action.bound handleSearch(e) {
    this.store.searchKey = e
    this.store.getCategoryList()
  }

  @action.bound handleExpandAll() {
    this.store.isLoading = true
    _.delay(() => {
      this.store.expandAll = !this.store.expandAll
      this.store.isLoading = false
    }, 100)
  }

  render() {
    const menu = (
      <Menu>
        <Menu.Item>
          <div style={{
            margin: '-5px -12px',
            padding: '5px 12px',
          }} onClick={this.handleEditCategory}>添加对象</div>
        </Menu.Item>
        {/* <Menu.Item>
          <Link to="">导入类目及标签</Link>
        </Menu.Item>
        <Menu.Item>
          <Link to="">导出类目及标签</Link>
        </Menu.Item> */}
      </Menu>
    )
    
    const dropdownDom = (
      <Dropdown overlay={menu}>
        <SvgTreeAdd size="14" className="mr8 hand" />
      </Dropdown>
    )

    return (
      <div className="category-manager-action pl8 FBH FBAC">
        <div className="FB1">
          <NoBorderInput onChange={this.handleSearch} />
        </div>

        <div className="FBH pr6 pl6" style={{maxWidth: 70}}>
          <SvgRefresh size="14" onClick={this.handleRefresh} className="mr8 hand" />
          {dropdownDom}
          { this.store.expandAll ? (
            <SvgUnExtend size="14" className="hand" onClick={this.handleExpandAll} /> 
          ) : (
            <SvgExtend size="14" className="hand" onClick={this.handleExpandAll} />
          )}
        </div>
      </div>
    )
  }
}

export default Action
