import intl from 'react-intl-universal'
/**
 * @description 树组件 - 搜索框
 */
import {Component} from 'react'
import {action} from 'mobx'
import {observer} from 'mobx-react'
import {Dropdown, Menu} from 'antd'
import {NoBorderInput, Authority} from '../../component'
import {codeInProduct} from '../../common/util'
import {
  IconRefresh,
  IconTreeAdd,
  IconUnExtend,
  IconExtend,
} from '../../icon-comp'

@observer
class Action extends Component {
  constructor(props) {
    super(props)
    this.store = props.store
  }

  /**
   * @description 查询树节点
   */
  @action.bound searchTree(data) {
    this.store.searchKey = data
    this.props.getTreeData()
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
   * @description 新建
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
          <div
            onClick={this.addTree}
            onKeyDown={() => {}}
            style={{margin: '-5px -12px', padding: '5px 12px'}}
          >
            {intl
              .get(
                'ide.src.page-manage.page-object-model.tree-action.znat69vvyk8'
              )
              .d('新建对象类目')}
          </div>
        </Menu.Item>
      </Menu>
    )

    return codeInProduct('tag_model:update_obj_cate[cud]', true) ? (
      <Dropdown overlay={menu}>
        <IconTreeAdd size="14" className="mr8 hand" />
      </Dropdown>
    ) : null
  }

  render() {
    return (
      <div className="object-tree-action">
        <NoBorderInput
          placeholder={intl
            .get(
              'ide.src.page-manage.page-object-model.tree-action.w44lfomptlh'
            )
            .d('请输入对象名称搜索')}
          onChange={this.searchTree}
          onPressEnter={this.searchTree}
        />

        <div className="FBH pr6 pl6" style={{maxWidth: 70}}>
          <IconRefresh size="14" className="mr8" onClick={this.refreshTree} />
          <Authority authCode="tag_model:update_obj_cate[cud]" isCommon>
            {this.dropdownDom()}
          </Authority>

          {this.store.expandAll ? (
            <IconUnExtend
              size="14"
              className="hand"
              onClick={this.expandTree}
            />
          ) : (
            <IconExtend size="14" className="hand" onClick={this.expandTree} />
          )}
        </div>
      </div>
    )
  }
}
export default Action
