/**
 * @description 标签集市 - 搜索
 */
import {Component} from 'react'
import {observer} from 'mobx-react'
import {
  Input, Icon, Select, Radio,
} from 'antd'
import {action} from 'mobx'

const {Option} = Select
 
@observer
export default class Search extends Component {
  constructor(props) {
    super(props)
    this.store = props.store
  }

  componentWillMount() {
    this.store.getUseProject()
    this.store.getOwnProject()
    this.store.getObject()
  }


  @action.bound expandToggle() {
    this.store.expand = !this.store.expand 
  }

  @action.bound onSearch(v) {
    this.store.hotWord = v.trim()
    this.store.updateList()
  }

  @action.bound useProjectSelect(v, arr) {
    if (v === '') {
      this.store.projectPermission = undefined
    }

    if (typeof this.projectPermission === 'undefined') {
      this.store.projectPermission = 0
    }
    this.useProjectName = arr.props.children
    this.store.useProjectId = v
    this.store.updateList()
  }

  @action.bound ownProjectSelect(v) {
    this.store.ownProjectId = v
    this.store.updateList()
  }

  @action.bound ownObjectSelect(v) {
    this.store.objectId = v
    this.store.updateList()
  }

  @action.bound projectPermissionSelect(e) {
    this.store.projectPermission = e.target.value
    this.store.updateList()
  } 

  render() {
    const {
      useProjectList, 
      ownProjectList, 
      objectList, 
      useProjectId,
      projectPermission,
      ownProjectId,
      objectId,
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
            <Icon type={this.store.expand ? 'up' : 'down'} style={{marginLeft: '4px'}} />
          </div>
        </div>
        <div className="advanced-search" style={{display: this.store.expand ? 'block' : 'none'}}>
          <div className="FBH mb24">
            <span className="advanced-search-title">检索角度：</span>
            <div>
              <span className="advanced-search-label">使用项目</span>
              <Select value={useProjectId} style={{width: 240}} className="mr24" onChange={this.useProjectSelect}>
                <Option value="">全部</Option>
                {
                  useProjectList.map(
                    ({useProjectId: id, useProjectName}) => (
                      <Option 
                        key={id} 
                        value={id}
                      >
                        {useProjectName}
                      </Option>
                    )
                  )
                }
              </Select>
              <Radio.Group onChange={this.projectPermissionSelect} value={projectPermission}>
                <Radio value={1} disabled={!this.store.useProjectId}>有使用权限</Radio>
                <Radio value={0} disabled={!this.store.useProjectId}>无使用权限</Radio>
              </Radio.Group>
            </div>
          </div>
          <div className="FBH">
            <span className="advanced-search-title">过滤条件：</span>
            <div>
              <span className="advanced-search-label">对象</span>
              <Select value={objectId} className="mr8" style={{width: 240}} onChange={this.ownObjectSelect}>
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
              <span className="advanced-search-label">所属项目</span>
              <Select value={ownProjectId} style={{width: 240}} onChange={this.ownProjectSelect}>
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
            </div>
          </div>
        </div>
      </div>
    )
  }
}
