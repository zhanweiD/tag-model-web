import intl from 'react-intl-universal'
import { Component } from 'react'
import { observer, inject } from 'mobx-react'
import { observable, action, toJS, computed } from 'mobx'
import _ from 'lodash'
import { Tree, Switch } from 'antd'

import { NoBorderInput, Loading, OmitTooltip } from '../../../../component'
import { IconChakan } from '../../../../icon-comp'
import tagIcon from '../../../../icon/new-tag.svg'

const { TreeNode } = Tree

@inject('bigStore')
@observer
class CateTree extends Component {
  constructor(props) {
    super(props)
    this.bigStore = props.bigStore
  }
  // 生成dom节点
  renderTreeNodes = data =>
    data.map(item => {
      const isCheck =
        this.bigStore.selectTagList.includes(item.aId) || !item.available
      if (item.children) {
        return (
          <TreeNode
            title={<OmitTooltip maxWidth={120} text={item.name} />}
            key={item.aId}
            dataRef={toJS(item)}
            selectable={false}
          >
            {this.renderTreeNodes(item.children)}
          </TreeNode>
        )
      }

      return (
        <TreeNode
          key={item.aId}
          title={<OmitTooltip maxWidth={120} text={item.name} />}
          selectable={false}
          objectData={toJS(item)}
          icon={
            item.type ? null : (
              <img src={tagIcon} alt="icon" style={{ width: '14px' }} />
            )
          }
          // disableCheckbox
          // disableCheckbox={!item.available || item.isUsed}
          disableCheckbox={isCheck}
        />
      )
    })

  // 选中子节点or父节点
  @action onCheck = (checkedKeys, e) => {
    const { bigStore } = this.props
    const { tagParentIds } = bigStore

    bigStore.checkedKeys = _.filter(
      checkedKeys,
      item => tagParentIds.indexOf(item) === -1
    )
  }

  @action.bound onSwitchChange = e => {
    const { bigStore } = this.props
    if (e) {
      // 展示所有的标签
      bigStore.tagTreeLoading = true
      setTimeout(() => {
        bigStore.tagTreeList = bigStore.tagTreeListAll
        bigStore.tagTreeLoading = false
      }, 200)
    } else {
      // 展示可选择的标签
      bigStore.tagTreeLoading = true
      setTimeout(() => {
        bigStore.tagTreeList = bigStore.tagTreeListAvailable
        bigStore.tagTreeLoading = false
      }, 200)
    }
  }

  @action.bound searchTree = e => {
    const { bigStore } = this.props

    bigStore.treeSearchKey = e
    bigStore.getTagTree()
  }

  render() {
    const { bigStore } = this.props
    const { tagTreeList, tagTreeLoading, checkedKeys, treeSearchKey } = bigStore

    return (
      <div>
        <div className="mb12 mt2 FBH FBAC">
          <div className="mr4">
            {intl
              .get(
                'ide.src.page-manage.page-tag-model.tag-model.tag-list.drawer-inherit-tree.jkrcru8u6'
              )
              .d('展示不可继承的标签')}
          </div>
          <Switch
            size="small"
            checkedChildren={intl
              .get('ide.src.component.form-component.03xp8ux32s3a')
              .d('是')}
            unCheckedChildren={intl
              .get('ide.src.component.form-component.h7p1pcijouf')
              .d('否')}
            onChange={this.onSwitchChange}
          />
        </div>
        <div
          className="inherit-tree"
          style={{
            border: '1px solid #d9d9d9',
            marginRight: '16px',
            height: 'calc(100% - 32px)',
            borderRadius: '4px',
            width: '200px',
          }}
        >
          <div className="object-tree-header">
            <NoBorderInput
              placeholder={intl
                .get(
                  'ide.src.page-manage.page-tag-model.tag-model.tag-list.drawer-inherit-tree.hhf5qe4tfy'
                )
                .d('请输入标签名称搜索')}
              value={treeSearchKey}
              onChange={this.searchTree}
            />

            <IconChakan size="14" className="mr8" onClick={this.onSearch} />
          </div>
          {tagTreeLoading && this.bigStore.selectTagList.length ? (
            <Loading mode="block" height={100} />
          ) : (
            <Tree
              checkable
              defaultExpandAll
              showIcon
              onCheck={this.onCheck}
              checkedKeys={checkedKeys}
            >
              {this.renderTreeNodes(tagTreeList)}
            </Tree>
          )}
        </div>
      </div>
    )
  }
}
export default CateTree
