import intl from 'react-intl-universal'
/**
 * @description 标签集市 - 搜索
 */
import { Component, Fragment } from 'react'
import { observer } from 'mobx-react'
import { Input, Select } from 'antd'
import { SearchOutlined } from '@ant-design/icons'

import { action } from 'mobx'

const { Option } = Select

// -1 未申请 0 申请中 1 有权限
const typeMap = [
  {
    name: intl
      .get('ide.src.page-manage.page-common-tag.common-tag.search.1t6olgootk4j')
      .d('未申请'),
    value: -1,
  },
  {
    name: intl
      .get(
        'ide.src.page-common.approval.common.comp-approval-modal.nb8qntq7vug'
      )
      .d('审批中'),
    value: 0,
  },
  {
    name: intl
      .get('ide.src.page-manage.page-common-tag.common-tag.list.imf5yhtwj8c')
      .d('有权限'),
    value: 1,
  },
]

@observer
class Search extends Component {
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
      isProject,
    } = this.store
    return (
      <div className="market-search">
        <div
          className="search-box"
          style={{ marginBottom: isProject ? '24px' : '16px' }}
        >
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

          {/* <Input
             onSearch={this.onSearch}
             size="small"
             placeholder="请输入搜索关键词"
             suffix={<SearchOutlined />}
            /> */}
        </div>
        <div
          className="advanced-search"
          style={{ display: isProject ? 'block' : 'none' }}
        >
          <div className="FBH mb16">
            <div>
              <span className="advanced-search-label">
                {intl
                  .get('ide.src.component.comp.search.h5l3m6s8dn7')
                  .d('所属项目')}
              </span>
              <Select
                value={ownProjectId}
                style={{ width: 240 }}
                onChange={this.ownProjectSelect}
                showSearch
                optionFilterProp="children"
              >
                <Option value="">
                  {intl
                    .get('ide.src.component.comp.search.e0mn12fihkg')
                    .d('全部')}
                </Option>
                {ownProjectList.map(({ projectId, projectName }) => (
                  <Option key={projectId} value={projectId}>
                    {projectName}
                  </Option>
                ))}
              </Select>
              <span className="advanced-search-label">
                {intl
                  .get(
                    'ide.src.page-manage.page-aim-source.source-detail.modal.hdb36gt6rzf'
                  )
                  .d('对象')}
              </span>
              <Select
                value={objectId}
                className="mr24"
                style={{ width: 240 }}
                onChange={this.ownObjectSelect}
                showSearch
                optionFilterProp="children"
              >
                <Option value="">
                  {intl
                    .get('ide.src.component.comp.search.e0mn12fihkg')
                    .d('全部')}
                </Option>
                {objectList.map(({ objId, objName }) => (
                  <Option key={objId} value={objId}>
                    {objName}
                  </Option>
                ))}
              </Select>

              {useProjectId ? (
                <Fragment>
                  <span className="advanced-search-label">
                    {intl
                      .get(
                        'ide.src.page-manage.page-common-tag.common-tag.search.84qb5v0ewny'
                      )
                      .d('权限状态')}
                  </span>
                  <Select
                    value={projectPermission}
                    className="mr8"
                    style={{ width: 240 }}
                    onChange={this.permissionSelect}
                    showSearch
                    optionFilterProp="children"
                  >
                    <Option value={2}>
                      {intl
                        .get('ide.src.component.comp.search.e0mn12fihkg')
                        .d('全部')}
                    </Option>
                    {typeMap.map(({ name, value }) => (
                      <Option key={value} value={value}>
                        {name}
                      </Option>
                    ))}
                  </Select>
                </Fragment>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    )
  }
}
export default Search
