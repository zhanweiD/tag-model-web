/**
 * @description 标签集市 - 搜索
 */
import {Component, Fragment} from 'react'
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

  @action.bound onSearch(v) {
    this.store.hotWord = v.trim()
    this.store.updateList()
  }

  // @action.bound useProjectSelect(v, arr) {
  //   if (v === '') {
  //     this.store.projectPermission = undefined
  //   }

  //   if (typeof this.projectPermission === 'undefined') {
  //     this.store.projectPermission = 0
  //   }

  //   this.store.useProjectName = arr.props.children
  //   this.store.useProjectId = v
  //   this.store.updateList()
  //   this.store.selectedRows.clear()
  //   this.store.rowKeys.clear()
  // }

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
              {
                useProjectId ? (
                  <Fragment>
                    <span className="advanced-search-radio ml8">是否展示有使用权限</span>
                    <Radio.Group onChange={this.projectPermissionSelect} value={projectPermission}>
                      <Radio value={1} disabled={!this.store.useProjectId} className="fs12">是</Radio>
                      <Radio value={0} disabled={!this.store.useProjectId} className="fs12">否</Radio>
                    </Radio.Group>
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
