/**
 * @description 标签搜索 - 搜索
 */
import {Component} from 'react'
import {observer} from 'mobx-react'
import {
  Input, Icon, Select,
} from 'antd'
import {observable, action} from 'mobx'

const {Option} = Select

const permissionTypeMap = [{
  name: '有效',
  value: 1,
}, {
  name: '无效',
  value: 0,
}]
 
@observer
export default class Search extends Component {
  constructor(props) {
    super(props)
    this.store = props.store
  }

  @observable expand = false
  @observable permissionType = '' // 使用权限状态
  @observable ownProjectId = '' // 所属项目id
  @observable objectId = '' // 对象id
  @observable hotWord = undefined // 关键词

  componentDidMount() {
    this.store.getOwnProject()
    this.store.getObject()
  }

  @action.bound initData() {
    this.projectPermission = 0
    this.ownProjectId = ''
    this.objectId = ''
  }

  // 更新列表
  @action.bound updateList() {
    const params = {
      useProjectId: this.store.useProjectId,
      type: this.permissionType,
      projectId: this.ownProjectId,
      objId: this.objectId,
      hotWord: this.hotWord,
      currentPage: 1,
    }
    this.store.getList(params)
  }

  @action.bound expandToggle() {
    this.expand = !this.expand 
  }

  @action.bound onSearch(v) {
    this.hotWord = v.trim()
    this.updateList()
  }

  @action.bound permissionTypeSelect(v) {
    this.permissionType = v
    this.updateList()
  }

  @action.bound ownProjectSelect(v) {
    this.ownProjectId = v
    this.updateList()
  }

  @action.bound ownObjectSelect(v) {
    this.objectId = v
    this.updateList()
  }

  @action.bound projectPermissionSelect(e) {
    this.projectPermission = e.target.value
    this.updateList()
  } 

  render() {
    const {ownProjectList, objectList} = this.store
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
            <Icon type={this.expand ? 'up' : 'down'} style={{marginLeft: '4px'}} />
          </div>
        </div>
        <div className="advanced-search" style={{display: this.expand ? 'block' : 'none'}}>
          <div className="FBH">
            <div>
              <span className="mr8">所属项目</span>
              <Select value={this.ownProjectId} className="mr16" style={{width: 240}} onChange={this.ownProjectSelect}>
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
              <Select value={this.objectId} className="mr16" style={{width: 240}} onChange={this.ownObjectSelect}>
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
              <span className="mr8">使用权限状态</span>
              <Select value={this.permissionType} style={{width: 240}} onChange={this.permissionTypeSelect}>
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
              </Select>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
