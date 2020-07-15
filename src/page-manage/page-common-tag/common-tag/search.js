/**
 * @description 标签集市 - 搜索
 */
import {Component, Fragment} from 'react'
import {observer} from 'mobx-react'
import {Input, Select} from 'antd'
import {action} from 'mobx'

const {Option} = Select

// -1 未申请 0 申请中 1 有权限
const typeMap = [{
  name: '未申请',
  value: -1,
}, {
  name: '审批中',
  value: 0,
}, {
  name: '有权限',
  value: 1,
}]
 
@observer
export default class Search extends Component {
  constructor(props) {
    super(props)
    this.store = props.store
  }

  componentWillMount() {
    if (this.store.useProjectId) {
      this.store.getUseProject()
      this.store.getOwnProject()
      this.store.getObject()
    }
  }

  @action.bound onSearch(v) {
    this.store.hotWord = v.trim()
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

  @action.bound permissionSelect(v) {
    this.store.projectPermission = v
    this.store.updateList()
  } 

  render() {
    const {
      // useProjectList, 
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
        </div>
        <div className="advanced-search">
          <div className="FBH mb16">
            <div>
              <span className="advanced-search-label">所属项目</span>
              <Select value={ownProjectId} style={{width: 240}} onChange={this.ownProjectSelect} showSearch optionFilterProp="children">
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
              <span className="advanced-search-label">对象</span>
              <Select value={objectId} className="mr8" style={{width: 240}} onChange={this.ownObjectSelect} showSearch optionFilterProp="children">
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

              {
                useProjectId ? (
                  <Fragment>
                    <span className="advanced-search-label">权限状态</span>
                    <Select value={projectPermission} className="mr8" style={{width: 240}} onChange={this.permissionSelect} showSearch optionFilterProp="children">
                      <Option value={2}>全部</Option>
                      {
                        typeMap.map(
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
                  </Fragment>
                ) : null
              }
            </div>
          </div>
         
        </div>
      </div>
    )
  }
}
