
import {Component} from 'react'
import {observer} from 'mobx-react'
import {action} from 'mobx'
import {Dropdown, Menu, Icon} from 'antd'
import cls from 'classnames'
import Action from './tree-action'

@observer
export default class Tree extends Component {
  constructor(props) {
    super(props)
    this.store = props.store
  }

  // 设置节点的菜单
  setActionList = node => {
    return [
      {
        key: 'edit',
        value: '编辑',
        onClick: () => { },
      }, {
        key: 'del',
        value: '删除',
        onClick: () => { },
      }, {
        key: 'copy',
        value: '复制',
        onClick: () => { },
      },
    ]
  }

  @action.bound edit(d, i) {
    console.log(d, i)
  }

  @action.bound del(d, i) {
    this.store.tagTreeData.splice(i, 1)
  }

  @action.bound select(data) {
    if ((+data.tagId || data.id) !== +this.store.currentTag && data.canEdit) {
      this.props.selectTag(data)
    }
  }

  menu = (d, i) => (
    <Menu>
      {/* <Menu.Item key="1" onClick={() => this.edit(d, i)}>
        编辑
      </Menu.Item> */}
      <Menu.Item key="2" onClick={() => this.del(d, i)}>
        删除
      </Menu.Item>
    </Menu>
  )

  render() {
    const {tagTreeData, currentTag, canEditCondition} = this.store

    return (
      <div className="tree">
        <Action store={this.store} />
        {
          tagTreeData.map((d, i) => (
            <div
              className={
                cls({
                  'tree-item': true,
                  'tree-item-select': +currentTag === (d.tagId || d.id),
                  'tree-item-current': d.canEdit && canEditCondition,
                  'tree-item-disabled': +currentTag !== (d.tagId || d.id) && !d.canEdit,
                })} 
              onClick={() => this.select(d)}
            >
              <span> 
                {d.name}
              </span>
              {/* <Dropdown disabled={+currentTag !== (d.tagId || d.id)} overlay={() => this.menu(d, i)}>
                <Icon type="more" className="tree-action" />
              </Dropdown> */}
            </div>
          ))
        }
      </div>
    )
  }
}
