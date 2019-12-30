/**
 * @description 标签搜索 - 搜索
 */
import {Component} from 'react'
import {observer} from 'mobx-react'
import {
  Input, Icon, Select,
} from 'antd'
import {action} from 'mobx'

const {Option} = Select

const permissionTypeMap = [{
  name: '有效',
  value: 1,
}, {
  name: '失效',
  value: 0,
}]
 
@observer
export default class Search extends Component {
  constructor(props) {
    super(props)
    this.store = props.store
  }

  componentDidMount() {
    this.store.getOwnProject()
    this.store.getObject()
  }

  @action.bound initData() {
    this.store.projectPermission = 0
    this.store.ownProjectId = ''
    this.store.objectId = ''
  }

  // 更新列表
  @action.bound updateList() {
    this.store.searchParams = {
      useProjectId: this.store.useProjectId,
      type: this.store.permissionType,
      projectId: this.store.ownProjectId,
      objId: this.store.objectId,
      hotWord: this.store.hotWord,
    }

    this.store.selectedRows.clear()
    this.store.rowKeys.clear()
    this.store.tagIds.clear()
    
    const params = {
      currentPage: 1,
    }
    this.store.getList(params)
  }

  @action.bound expandToggle() {
    this.store.expand = !this.store.expand 
  }

  @action.bound onSearch(v) {
    this.store.hotWord = v.trim()
    this.updateList()
  }

  @action.bound permissionTypeSelect(v) {
    this.store.permissionType = v
    this.updateList()
  }

  @action.bound ownProjectSelect(v) {
    this.store.ownProjectId = v
    this.updateList()
  }

  @action.bound ownObjectSelect(v) {
    this.store.objectId = v
    this.store.selectedRows.clear()
    this.store.rowKeys.clear()
    this.store.tagIds.clear()
    this.updateList()
  }

  @action.bound projectPermissionSelect(e) {
    this.store.projectPermission = e.target.value
    this.updateList()
  } 

  render() {
    const {
      ownProjectList, 
      objectList,
      expand,
      ownProjectId,
      objectId,
      permissionType,
    } = this.store
    return (
      <div className="market-search">
        <div className="search-box">
          <Input.Search
            placeholder="请输入搜索关键词"
            enterButton="搜索"
            size="large"
            onSearch={this.onSearch}
          />
          {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events */}
          <div className="advanced-search-btn" onClick={this.expandToggle}>
            <span>高级检索</span>
            <Icon type={expand ? 'up' : 'down'} style={{marginLeft: '4px'}} />
          </div>
        </div>
        <div className="advanced-search" style={{display: expand ? 'block' : 'none'}}>
          <div className="FBH">
            <div>
              <span className="mr8">所属项目</span>
              <Select value={ownProjectId} className="mr16" style={{width: 240}} onChange={this.ownProjectSelect}>
                <Option value="">全部</Option>
                {
                  ownProjectList.map(
                    ({projectId, projectName}) => (
                      <Option 
                        key={projectId} 
                        value={projectId}
                      >
                        {projectName}
                      </Option>
                    )
                  )
                }
              </Select>
              <span className="mr8">对象</span>
              <Select value={objectId} className="mr16" style={{width: 240}} onChange={this.ownObjectSelect}>
                <Option value="">全部</Option>
                {
                  objectList.map(
                    ({objId, objName}) => (
                      <Option 
                        key={objId} 
                        value={objId}
                      >
                        {objName}
                      </Option>
                    )
                  )
                }
              </Select>
              {/* <span className="mr8">使用权限状态</span>
              <Select value={permissionType} style={{width: 240}} onChange={this.permissionTypeSelect}>
                <Option value="">全部</Option>
                {
                  permissionTypeMap.map(
                    ({name, value}) => (
                      <Option 
                        key={value} 
                        value={value}
                      >
                        {name}
                      </Option>
                    )
                  )
                }
              </Select> */}
            </div>
          </div>
        </div>
      </div>
    )
  }
}
