/**
 * @description 树组件 - 搜索框
 */
import {Component} from 'react'
import {action} from 'mobx'
import {observer} from 'mobx-react'
import {Dropdown, Menu} from 'antd'
import {NoBorderInput} from '../../component'
import {
  IconRefresh, IconTreeAdd, IconUnExtend, IconExtend,
} from '../../icon-comp'

const {functionCodes} = window.__userConfig

@observer
export default class Action extends Component {
  constructor(props) {
    super(props)
    this.store = props.store
  }

  /**
   * @description 查询树节点
   */
  @action.bound searchTree(data) {
    this.store.searchKey = data
    this.store.getObjTree()
  }

  /**
   * @description 刷新树节点
   */
  @action.bound refreshTree() {
    this.store.getObjTree()
  }

  /**
   * @description 展开缩放树节点
   */
  @action.bound expandTree() {
    this.store.treeLoading = true
    _.delay(() => {
      this.store.expandAll = !this.store.expandAll
      this.store.treeLoading = false
    }, 100)
  }

  /**
   * @description 添加
   */
  @action.bound addTree() {
    this.store.categoryModal = {
      visible: true,
      editType: 'add',
      type: 'add',
      detail: {},
    }
  }

  dropdownDom() {
    const menu = (
      <Menu>
        <Menu.Item>
          <div onClick={this.addTree} onKeyDown={() => {}} style={{margin: '-5px -12px', padding: '5px 12px'}}>
            添加对象类目
          </div>
        </Menu.Item>
      </Menu>
    )
    return functionCodes.includes('asset_tag_obj_cat_add_edit_del') 
      ? (
        <Dropdown overlay={menu}>
          <IconTreeAdd size="14" className="mr8 hand" />
        </Dropdown>
      )
      : null
  }

  render() {
    return (
      <div className="object-tree-action">
        <NoBorderInput 
          placeholder="请输入对象名称搜索" 
          onChange={this.searchTree}
          onPressEnter={this.searchTree}
        />

        <div className="FBH pr6 pl6" style={{maxWidth: 70}}>
          <IconRefresh size="14" className="mr8" onClick={this.refreshTree} />
          {
            this.dropdownDom()
          }
          { this.store.expandAll ? (
            <IconUnExtend size="14" className="hand" onClick={this.expandTree} /> 
          ) : (
            <IconExtend size="14" className="hand" onClick={this.expandTree} />
          )}
        </div>
      </div>
    )
  }
}
