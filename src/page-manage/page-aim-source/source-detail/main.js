import intl from 'react-intl-universal'
/**
 * 目的源管理列表 - 详情
 */
import { Component, useEffect } from 'react'
import { Spin, Popconfirm, Badge, Select, Input } from 'antd'
import { action, observable, toJS } from 'mobx'
import { observer } from 'mobx-react'
import OnerFrame from '@dtwave/oner-frame'
import {
  DetailHeader,
  ListContent,
  TabRoute,
  Authority,
} from '../../../component'
import { Time } from '../../../common/util'
import ModalTagConfig from './modal'

import store from './store'

const tabs = [
  {
    name: intl
      .get('ide.src.page-manage.page-aim-source.source-detail.main.yjl6a0fdf2l')
      .d('字段列表'),
    value: 1,
  },
]
// -1 / null 全部、0  未映射  、1 已映射
const runStatus = [
  {
    name: intl.get('ide.src.component.comp.search.e0mn12fihkg').d('全部'),
    value: -1,
  },
  {
    name: intl
      .get('ide.src.page-manage.page-aim-source.source-detail.main.tnm2e3sy0xa')
      .d('未映射'),
    value: 0,
  },
  {
    name: intl
      .get('ide.src.page-manage.page-aim-source.source-detail.main.spk572wrny')
      .d('已映射'),
    value: 1,
  },
]

const { Option } = Select

@observer
class SourceDetail extends Component {
  constructor(props) {
    super(props)
    const { match } = props
    store.sourceId = match.params.id
    store.projectId = match.params.projectId

    console.log(toJS(store.projectId), toJS(props.projectId))
  }

  @observable tabId = 1 // 当前详情tabID

  columns = [
    {
      title: intl
        .get('ide.src.business-component.tag-relate.dag-box.co39wa8uxw5')
        .d('字段名称'),
      dataIndex: 'dataFieldName',
    },
    {
      title: intl
        .get('ide.src.business-component.tag-relate.dag-box.xr0hezmhuj')
        .d('字段类型'),
      dataIndex: 'dataFieldType',
    },
    {
      title: intl
        .get(
          'ide.src.page-manage.page-aim-source.source-detail.main.0w580oiww7pj'
        )
        .d('字段描述'),
      dataIndex: 'descr',
      render: text => text || '-',
    },
    {
      title: intl
        .get(
          'ide.src.page-manage.page-aim-source.source-detail.main.9apxlnm9ue'
        )
        .d('映射状态'),
      dataIndex: 'status',
      render: text =>
        text ? (
          <Badge
            color="#87d068"
            text={intl
              .get(
                'ide.src.page-manage.page-aim-source.source-detail.main.spk572wrny'
              )
              .d('已映射')}
          />
        ) : (
          <Badge
            color="#d9d9d9"
            text={intl
              .get(
                'ide.src.page-manage.page-aim-source.source-detail.main.tnm2e3sy0xa'
              )
              .d('未映射')}
          />
        ),
    },

    {
      title: intl
        .get(
          'ide.src.page-manage.page-aim-source.source-detail.main.16o5qwy427p'
        )
        .d('标签状态'),
      dataIndex: 'tagStatus',
      render: (text, record) => {
        if (record.tagName) {
          return text ? (
            <Badge
              color="#87d068"
              text={intl
                .get(
                  'ide.src.page-manage.page-aim-source.source-detail.main.6iq9u8qb0ta'
                )
                .d('已使用')}
            />
          ) : (
            <Badge
              color="#d9d9d9"
              text={intl
                .get('ide.src.component.tag.tag.ogvpoe5m3bg')
                .d('未使用')}
            />
          )
        }
        return '-'
      },
    },
    {
      title: intl
        .get(
          'ide.src.page-manage.page-aim-source.source-detail.main.63kvhqd3cw8'
        )
        .d('标签名称'),
      dataIndex: 'tagName',
      render: text => text || '-',
    },
    {
      title: intl
        .get('ide.src.page-common.approval.approved.main.1tcpwa6mu1')
        .d('操作'),
      dataIndex: 'action',
      width: 100,
      render: (text, record) => (
        <Authority authCode="tag_model:update_tag_target[ud]">
          <div>
            {(() => {
              if (record.tagStatus) {
                return (
                  <span className="disabled">
                    {intl
                      .get(
                        'ide.src.page-manage.page-aim-source.source-detail.main.b5l07cksuhm'
                      )
                      .d('取消映射')}
                  </span>
                )
              }

              if (record.status) {
                return (
                  <Popconfirm
                    placement="topRight"
                    title={intl
                      .get(
                        'ide.src.page-manage.page-aim-source.source-detail.main.5h7cg2et1e2'
                      )
                      .d('你确定要取消该字段的标签映射吗？')}
                    onConfirm={() => this.cancelConfig(record)}
                  >
                    <a href>
                      {intl
                        .get(
                          'ide.src.page-manage.page-aim-source.source-detail.main.b5l07cksuhm'
                        )
                        .d('取消映射')}
                    </a>
                  </Popconfirm>
                )
              }
              return (
                <a href onClick={() => this.config(record)}>
                  {intl
                    .get(
                      'ide.src.page-manage.page-aim-source.source-detail.main.6pm0gqavven'
                    )
                    .d('标签映射')}
                </a>
              )
            })()}
          </div>
        </Authority>
      ),
    },
  ]

  componentWillMount() {
    store.getDetail()
  }

  @action.bound config(data) {
    store.fieldDetail = data

    store.getObjList()
    store.visible = true
  }

  @action.bound cancelConfig(data) {
    store.cancelConfig({
      id: data.id,
    })
  }

  @action.bound selectStatus(status) {
    this.status = status
    if (typeof status === 'undefined') {
      store.getList({
        status,
        dataFieldName: this.fieldName,
      })
    } else {
      store.getList({
        status,
        dataFieldName: this.fieldName,
      })
    }
  }

  @action.bound searchField(e) {
    const { value } = e.target
    this.fieldName = value
    store.getList({
      status: this.status,
      dataFieldName: value,
    })
  }

  render() {
    const { infoLoading, detail } = store

    const baseInfo = [
      {
        title: intl
          .get(
            'ide.src.page-manage.page-aim-source.source-detail.main.64wlzv1scpk'
          )
          .d('同步对象'),
        value: detail.objName,
      },
      {
        title: intl
          .get(
            'ide.src.page-manage.page-aim-source.source-detail.main.ixa3qz2l6ie'
          )
          .d('创建人'),
        value: detail.cuserName,
      },
      {
        title: intl
          .get(
            'ide.src.page-manage.page-aim-source.source-detail.main.2vp94m4091h'
          )
          .d('创建时间'),
        value: <Time timestamp={detail.ctime} />,
      },
      {
        title: intl
          .get('ide.src.page-config.workspace-config.main.1b0l5lpgghm')
          .d('数据源类型'),
        value: detail.storageType,
      },
      {
        title: intl
          .get('ide.src.business-component.tag-relate.dag-box.9mzk7452ggp')
          .d('数据源'),
        value: detail.storageName,
      },
      {
        title: intl
          .get(
            'ide.src.page-manage.page-aim-source.source-detail.main.vzwvcfbgza'
          )
          .d('目的表'),
        value: detail.dataTableName,
      },
    ]

    const tabConfig = {
      tabs,
      currentTab: this.tabId,
      changeUrl: false,
    }

    const listConfig = {
      columns: this.columns,
      initParams: { id: store.sourceId, projectId: store.projectId },
      store, // 必填属性
    }

    return (
      <div className="page-source-detail">
        <Spin spinning={infoLoading}>
          <DetailHeader
            name={detail.name}
            descr={detail.descr}
            baseInfo={baseInfo}
          />
        </Spin>
        <div className="list-content box-border">
          {/* <TabRoute {...tabConfig} /> */}
          <div className="mb16 pl24 pt24">
            <span className="mr8">
              {intl
                .get(
                  'ide.src.page-manage.page-aim-source.source-detail.main.9apxlnm9ue'
                )
                .d('映射状态')}
            </span>
            <Select
              showSearch
              allowClear
              placeholder={intl
                .get(
                  'ide.src.page-manage.page-aim-source.source-detail.main.tnko2ugpk7b'
                )
                .d('请选择映射状态')}
              style={{ width: 200 }}
              onChange={v => this.selectStatus(v)}
              optionFilterProp="children"
              className="mr16"
            >
              {runStatus.map(item => (
                <Option key={item.value} value={item.value}>
                  {item.name}
                </Option>
              ))}
            </Select>
            <span className="mr8">
              {intl
                .get(
                  'ide.src.business-component.tag-relate.dag-box.co39wa8uxw5'
                )
                .d('字段名称')}
            </span>
            <Input
              size="small"
              onChange={this.searchField}
              style={{ width: 200 }}
              placeholder={intl
                .get(
                  'ide.src.page-manage.page-aim-source.source-detail.main.gjtfxx6mbd'
                )
                .d('请输入字段名称')}
            />
          </div>
          <ListContent {...listConfig} />
        </div>
        <ModalTagConfig store={store} />
      </div>
    )
  }
}

export default props => {
  const ctx = OnerFrame.useFrame()
  const projectId = ctx.useProjectId()

  useEffect(() => {
    ctx.useProject(true, null, { visible: false })
  }, [])

  return <SourceDetail {...props} projectId={projectId} />
}
