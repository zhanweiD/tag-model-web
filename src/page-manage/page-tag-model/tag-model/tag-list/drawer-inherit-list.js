import intl from 'react-intl-universal'
import { Component } from 'react'
import { observer, inject } from 'mobx-react'
import { observable, action, toJS, computed } from 'mobx'
import _ from 'lodash'
import { Table, Input, Tooltip, Popconfirm } from 'antd'
import { SearchOutlined } from '@ant-design/icons'
import { getDataTypeName } from '../../../../common/util'

@inject('bigStore')
@observer
class CateTree extends Component {
  columns = [
    {
      title: intl
        .get(
          'ide.src.page-manage.page-aim-source.source-detail.main.63kvhqd3cw8'
        )
        .d('标签名称'),
      dataIndex: 'name',
    },
    {
      title: intl
        .get(
          'ide.src.page-manage.page-tag-model.tag-model.tag-list.drawer-inherit-list.lwh8k7jyum'
        )
        .d('唯一标识'),
      dataIndex: 'enName',
    },
    {
      title: intl
        .get('ide.src.business-component.tag-relate.dag-box.zfaw0a4v7jh')
        .d('数据类型'),
      dataIndex: 'valueType',
      render: text => getDataTypeName(text),
    },
    {
      title: intl
        .get('ide.src.page-manage.page-common-tag.detail.main.ilm7zazygy')
        .d('是否枚举'),
      dataIndex: 'isEnum',
      render: text =>
        text === 1
          ? intl.get('ide.src.component.form-component.03xp8ux32s3a').d('是')
          : intl.get('ide.src.component.form-component.h7p1pcijouf').d('否'),
    },
    {
      title: intl
        .get(
          'ide.src.page-manage.page-object-model.object-list.object-detail.drawer-create.7g6e5biv0hp'
        )
        .d('枚举显示值'),
      dataIndex: 'enumValue',
    },
    {
      title: intl
        .get(
          'ide.src.page-manage.page-object-model.object-list.object-detail.drawer-create.7qxovvpt6pn'
        )
        .d('业务逻辑'),
      dataIndex: 'descr',
    },
    {
      title: intl
        .get('ide.src.page-common.approval.approved.main.1tcpwa6mu1')
        .d('操作'),
      dataIndex: 'action',
      render: (text, record) => {
        if (record.isUsed) {
          return (
            <Tooltip
              title={intl
                .get(
                  'ide.src.page-manage.page-tag-model.tag-model.tag-list.drawer-inherit-list.krqks0olqu'
                )
                .d('使用中的标签, 不可移除')}
            >
              <span className="disabled">
                {intl
                  .get('ide.src.page-config.workspace-config.main.i53j7u2d9hs')
                  .d('移除')}
              </span>
            </Tooltip>
          )
        }
        return (
          <Popconfirm
            placement="topRight"
            title={intl
              .get(
                'ide.src.page-manage.page-tag-model.tag-model.tag-list.drawer-inherit-list.3ngxij32725'
              )
              .d('确定移除？')}
            onConfirm={() => this.removeTag(record.id)}
          >
            <a href>
              {intl
                .get('ide.src.page-config.workspace-config.main.i53j7u2d9hs')
                .d('移除')}
            </a>
          </Popconfirm>
        )
      },
    },
  ]

  @observable inputValue

  @action removeTag(id) {
    const { bigStore } = this.props
    bigStore.checkedKeys = bigStore.checkedKeys.filter(e => e !== String(id))
    bigStore.tagDetaiList = bigStore.tagDetaiList.filter(e => e.id !== id)
    bigStore.selectTagList = bigStore.selectTagList.filter(e => e !== id)
  }

  @action.bound onChange(e) {
    this.inputValue = e.target.value
  }

  @computed get filterData() {
    const {
      bigStore: { tagDetaiList },
    } = this.props

    return this.inputValue
      ? tagDetaiList.filter(item => item.name.indexOf(this.inputValue) > -1)
      : tagDetaiList
  }

  render() {
    const {
      bigStore: { tagDetaiList, tagDetailTableLoading },
    } = this.props

    return (
      <div className="FB1 ml16">
        <Input
          allowClear
          value={this.inputValue}
          onChange={this.onChange}
          onSearch={this.onSearch}
          className="mb8"
          size="small"
          placeholder={intl
            .get(
              'ide.src.page-manage.page-tag-model.tag-model.tag-list.drawer-inherit-list.6rzqd8p64g7'
            )
            .d('请输入标签关键字')}
          style={{ width: 300 }}
          suffix={<SearchOutlined />}
        />

        <div className="select-object-table">
          <Table
            loading={tagDetailTableLoading}
            columns={this.columns}
            dataSource={this.filterData.slice()}
            pagination={false}
          />
        </div>
      </div>
    )
  }
}
export default CateTree
