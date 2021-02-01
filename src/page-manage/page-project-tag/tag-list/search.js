import intl from 'react-intl-universal'
/**
 * @description 标签仓库 - 搜索
 */
import {Component} from 'react'
import {observer} from 'mobx-react'
import {Input, Select} from 'antd'
import {SearchOutlined} from '@ant-design/icons'
import {action} from 'mobx'

const {Option} = Select

// const permissionTypeMap = [{
//   name: '有效',
//   value: 1,
// }, {
//   name: '失效',
//   value: 0,
// }]

@observer
class Search extends Component {
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

    this.store.tagIds.clear()

    const params = {
      currentPage: 1,
    }

    this.store.getList(params)
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
      // expand,
      ownProjectId,
      objectId,
      // permissionType, // 用于权限申请
    } = this.store
    return (
      <div className="market-search">
        <div className="search-box">
          <Input.Search
            placeholder={intl
              .get(
                'ide.src.page-manage.page-common-tag.common-tag.search.6ohvobkx2kg'
              )
              .d('请输入搜索关键词')}
            enterButton={intl
              .get(
                'ide.src.page-manage.page-common-tag.common-tag.search.mm14ehjy90e'
              )
              .d('搜索')}
            size="small"
            onSearch={this.onSearch}
          />
        </div>
        <div className="advanced-search">
          <div className="FBH mb16">
            <div>
              <span className="mr8">
                {intl
                  .get('ide.src.component.comp.search.h5l3m6s8dn7')
                  .d('所属项目')}
              </span>
              <Select
                value={ownProjectId}
                className="mr16"
                style={{width: 240}}
                onChange={this.ownProjectSelect}
                showSearch
                optionFilterProp="children"
              >
                <Option value="">
                  {intl
                    .get('ide.src.component.comp.search.e0mn12fihkg')
                    .d('全部')}
                </Option>
                {ownProjectList.map(({projectId, projectName}) => (
                  <Option key={projectId} value={projectId}>
                    {projectName}
                  </Option>
                ))}
              </Select>
              <span className="mr8">
                {intl
                  .get(
                    'ide.src.page-manage.page-aim-source.source-detail.modal.hdb36gt6rzf'
                  )
                  .d('对象')}
              </span>
              <Select
                value={objectId}
                className="mr16"
                style={{width: 240}}
                onChange={this.ownObjectSelect}
                showSearch
                optionFilterProp="children"
              >
                <Option value="">
                  {intl
                    .get('ide.src.component.comp.search.e0mn12fihkg')
                    .d('全部')}
                </Option>
                {objectList.map(({objId, objName}) => (
                  <Option key={objId} value={objId}>
                    {objName}
                  </Option>
                ))}
              </Select>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
export default Search
