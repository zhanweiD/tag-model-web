import {Component} from 'react'
import {action, toJS} from 'mobx'
import {observer, inject} from 'mobx-react'
import {Menu, Dropdown, Tooltip} from 'antd'
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
    const {treeData} = this.store 
    if (toJS(treeData).length) return 
    
    this.store.currentTreeItemKey = 0
    this.store.eStatus.editObject = false
    this.store.modalVisible.editObject = true
    
    // 获取选择对象
    this.store.getSelectObj()
  }

  @action.bound handleRefresh() {
    return this.store.getCategoryList()
  }

  @action.bound handleSearch(e) {
    this.store.searchKey = e
    this.store.getCategoryList()
  }

  @action.bound handleExpandAll() {
    this.store.treeLoading = true
    _.delay(() => {
      this.store.expandAll = !this.store.expandAll
      this.store.treeLoading = false
    }, 100)
  }

  render() {
    const {treeData} = this.store 

    const menu = (
      <Menu>
        <Menu.Item disabled={treeData.length}>
          <div
            style={{
              margin: '-5px -12px',
              padding: '5px 12px',
            }}
            onClick={this.handleEditCategory}
          >
            {/* 场景为选择对象，标签池为添加对象，注意区分 */}
            {
              treeData.length ? (
                <Tooltip title="场景已添加对象">
              选择对象
                </Tooltip>
              ) : '选择对象'
            }
            
          </div>
        </Menu.Item>
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
