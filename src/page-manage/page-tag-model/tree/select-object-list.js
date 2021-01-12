import intl from 'react-intl-universal'
/**
 * @description 对象配置 - 选择对象 - 已配置标签列表
 */
import { Component } from 'react'
import { observer, inject } from 'mobx-react'
import { observable, action } from 'mobx'
import { Table, Input, Popconfirm, Tooltip } from 'antd'
import { SearchOutlined } from '@ant-design/icons'

import { OmitTooltip } from '../../../component'
import { Time } from '../../../common/util'
// import {usedStatusMap} from '../util'

const { Search } = Input

@inject('bigStore')
@observer
class ObjectList extends Component {
  constructor(props) {
    super(props)
    this.store = props.bigStore
  }

  @observable searchKey = undefined

  columns = [
    {
      title: intl
        .get(
          'ide.src.page-manage.page-object-model.object-list.object-list.main.9c8ou0oxjir'
        )
        .d('对象名称'),
      dataIndex: 'name',
      key: 'name',
      width: 80,
      render: text => <OmitTooltip maxWidth={80} text={text} />,
    },

    {
      title: intl
        .get(
          'ide.src.page-manage.page-object-model.tree-drawer-object.tk268r21mpn'
        )
        .d('对象描述'),
      dataIndex: 'descr',
      key: 'descr',
      width: 80,
      render: text => <OmitTooltip maxWidth={80} text={text} />,
    },

    {
      title: intl
        .get('ide.src.page-manage.page-object-model.detail.ml3nv2hkkdo')
        .d('对象类目'),
      dataIndex: 'objCatName',
      key: 'objCatName',
      render: text => <OmitTooltip maxWidth={80} text={text} />,
    },

    {
      title: intl
        .get(
          'ide.src.page-manage.page-tag-model.tree.select-object-list.lpc3wv8ycr'
        )
        .d('添加人'),
      dataIndex: 'creator',
      key: 'creator',
    },

    {
      title: intl
        .get('ide.src.page-config.workspace-config.main.dd9xgr2e3he')
        .d('添加时间'),
      dataIndex: 'createTime',
      key: 'createTime',
      render: text => <Time timestamp={text} />,
    },

    // {
    //   title: '使用状态',
    //   dataIndex: 'isUsed',
    //   key: 'isUsed',
    //   render: v => usedStatusMap(+v),
    // },
    {
      title: intl
        .get('ide.src.page-manage.page-object-model.detail.wih18jbc78')
        .d('数据表数'),
      dataIndex: 'tableCount',
      key: 'tableCount',
      width: 80,
    },

    {
      title: intl
        .get(
          'ide.src.page-manage.page-tag-model.tree.select-object-list.1spysrxo318'
        )
        .d('标签数'),
      dataIndex: 'tagCount',
      key: 'tagCount',
      width: 80,
    },

    {
      key: 'action',
      title: intl
        .get('ide.src.page-common.approval.approved.main.1tcpwa6mu1')
        .d('操作'),
      width: 80,
      dataIndex: 'action',
      render: (text, record) => {
        if (record.isUsed) {
          return (
            <Tooltip
              title={intl
                .get(
                  'ide.src.page-manage.page-tag-model.tree.select-object-list.gkdk87fcfnp'
                )
                .d('使用中的对象, 不可移除')}
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
            onConfirm={() => this.remove(record)}
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

  @action.bound onChange(e) {
    const { onSearch } = this.props
    const { value } = e.target

    this.searchKey = value
    onSearch(value)
  }

  @action.bound remove(data) {
    const { remove } = this.props
    remove(data)
  }

  getFilterData() {
    const { filteredData, searchData } = this.props

    if (this.searchKey) {
      return searchData.slice()
    }
    return filteredData.slice()
  }

  //  // 存储搜索数据
  //  beforeFetch = type => {
  //    this.setState({
  //      searchKey: undefined,
  //      type,
  //    }, () => this.getTreeFetch())
  //  }

  render() {
    const { selectedObjLoading: loading } = this.store
    const listConfig = {
      loading,
      dataSource: this.getFilterData(),
      rowKey: 'id',
      columns: this.columns,
      pagination: false,
      // scroll: {x: 960}
    }

    return (
      <div className="FB1 select-object-list">
        {/* <Search
           placeholder="请输入对象关键字"
           onSearch={this.onSearch}
           onChange={this.onChange}
           style={{width: 300}}
           className="mb8"
           // value={searchKey}
          /> */}
        <Input
          onChange={this.onChange}
          onSearch={this.onSearch}
          className="mb8"
          size="small"
          placeholder={intl
            .get(
              'ide.src.page-manage.page-tag-model.tree.select-object-list.fbkn1gnmxqb'
            )
            .d('请输入对象关键字')}
          style={{ width: 300 }}
          suffix={<SearchOutlined />}
        />

        <div
          style={{
            height: 'calc(100% - 32px)',
            border: '1px solid #d9d9d9',
            borderRadius: '4px',
            overflowY: 'auto',
          }}
        >
          <Table {...listConfig} />
        </div>
      </div>
    )
  }
}
export default ObjectList
