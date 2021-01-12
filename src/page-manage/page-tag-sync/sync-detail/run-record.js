import intl from 'react-intl-universal'
import { Component } from 'react'
import { observer } from 'mobx-react'
import { action, toJS } from 'mobx'
import { Select, DatePicker, Table } from 'antd'
import { Authority } from '../../../component'
import { getLastStatus } from '../util'
import ModalLog from './modal-log'

import store from './store-run-record'

const { Option } = Select
const { RangePicker } = DatePicker
const runStatus = [
  {
    name: intl.get('ide.src.component.comp.search.e0mn12fihkg').d('全部'),
    value: '',
  },
  {
    name: intl
      .get(
        'ide.src.page-manage.page-tag-sync.sync-detail.run-record.yoe34ygwt6e'
      )
      .d('运行中'),
    value: 0,
  },
  {
    name: intl
      .get(
        'ide.src.page-manage.page-tag-sync.sync-detail.run-record.ifoapcxe4mr'
      )
      .d('运行失败'),
    value: 2,
  },
  {
    name: intl
      .get(
        'ide.src.page-manage.page-tag-sync.sync-detail.run-record.predyi8le4m'
      )
      .d('运行成功'),
    value: 1,
  },
]

@observer
class RunRecord extends Component {
  constructor(props) {
    super(props)
    store.projectId = props.projectId
    store.syncId = props.syncId
  }

  columns = [
    {
      title: intl
        .get(
          'ide.src.page-manage.page-tag-sync.sync-detail.run-record.mgayut83ss9'
        )
        .d('记录ID'),
      dataIndex: 'taskInstance',
    },
    {
      title: intl
        .get(
          'ide.src.page-manage.page-tag-sync.sync-detail.run-record.d0x84mwaaw'
        )
        .d('运行开始时间'),
      dataIndex: 'startTime',
      // render: text => <Time timestamp={text} />,
    },
    {
      title: intl
        .get(
          'ide.src.page-manage.page-tag-sync.sync-detail.run-record.zmmrwqefyue'
        )
        .d('运行结束时间'),
      dataIndex: 'stopTime',
      // render: text => <Time timestamp={text} />,
    },
    {
      title: intl
        .get(
          'ide.src.page-manage.page-tag-sync.sync-detail.run-record.md2u2058o6h'
        )
        .d('运行状态'),
      dataIndex: 'runStatus',
      render: text =>
        getLastStatus({
          status: text,
        }),
    },

    {
      title: intl
        .get(
          'ide.src.page-manage.page-tag-sync.sync-detail.run-record.zrctvxz3f2k'
        )
        .d('记录数'),
      dataIndex: 'recordCount',
      render: text => text || '-',
    },
    {
      title: intl
        .get('ide.src.page-common.approval.approved.main.1tcpwa6mu1')
        .d('操作'),
      dataIndex: 'action',
      render: (text, record) => (
        <div>
          <Authority authCode="tag_model:rerun_transfer[x]">
            {record.runStatus ? (
              <a href onClick={() => this.runTask(record)}>
                {intl
                  .get(
                    'ide.src.page-manage.page-tag-sync.sync-detail.run-record.5vouwbhc3g6'
                  )
                  .d('重跑')}
              </a>
            ) : (
              <a className="disabled">
                {intl
                  .get(
                    'ide.src.page-manage.page-tag-sync.sync-detail.run-record.5vouwbhc3g6'
                  )
                  .d('重跑')}
              </a>
            )}
          </Authority>
          <Authority authCode="tag_model:transfer_log[r]">
            <a href onClick={() => this.viewLog(record)} className="ml16">
              {intl
                .get(
                  'ide.src.page-manage.page-tag-sync.sync-detail.run-record.untqehrrk6c'
                )
                .d('查看日志')}
            </a>
          </Authority>
        </div>
      ),
    },
  ]

  componentWillMount() {
    store.getList({
      id: this.props.syncId,
    })
  }

  @action.bound viewLog(data) {
    store.visibleLog = true
    store.getLog(data.taskInstance)
  }

  @action.bound runTask(data) {
    store.runTask(data.taskInstance)
  }

  @action.bound selectStatus(status) {
    this.runStatus = status
    if (typeof status === 'undefined') {
      store.getList({
        runStatus: status,
        queryStartTime: this.queryStartTime,
        queryEndTime: this.queryEndTime,
        pageSize: undefined,
        currentPage: undefined,
      })
    } else {
      store.getList({
        runStatus: status,
        queryStartTime: this.queryStartTime,
        queryEndTime: this.queryEndTime,
        pageSize: undefined,
        currentPage: undefined,
      })
    }
  }

  @action.bound selectTime(date, dateString) {
    if (date) {
      this.queryStartTime = dateString[0]
      this.queryEndTime = dateString[1]
      store.getList({
        runStatus: this.runStatus,
        queryStartTime: dateString[0],
        queryEndTime: dateString[1],
        pageSize: undefined,
        currentPage: undefined,
      })
    } else {
      this.queryStartTime = undefined
      this.queryEndTime = undefined
      store.getList({
        runStatus: this.runStatus,
        pageSize: undefined,
        currentPage: undefined,
      })
    }
  }

  render() {
    const { tableLoading, list } = store

    // const listConfig = {
    //   buttons: [<div >
    //     <span className="mr8">运行状态：</span>
    //     <Select
    //       showSearch
    //       allowClear
    //       placeholder="请选择运行状态"
    //       style={{ width: 200 }}
    //       onChange={v => this.selectStatus(v)}
    //       optionFilterProp="children"
    //       className="mr16"
    //     >
    //       {
    //         runStatus.map(item => (
    //           <Option key={item.value} value={item.value}>{item.name}</Option>
    //         ))
    //       }
    //     </Select>
    //     <span className="mr8">运行日期：</span>
    //     <RangePicker onChange={this.selectTime} allowClear/>
    //   </div>],
    //   columns: this.columns,
    //   initParams: {id},
    //   initGetDataByParent: true,
    //   store, // 必填属性
    // }

    return (
      <div className="pr24 pl24 pt24">
        {/* <ListContent {...listConfig} /> */}
        <div className="mb16">
          <span className="mr8">
            {intl
              .get(
                'ide.src.page-manage.page-tag-sync.sync-detail.run-record.md2u2058o6h'
              )
              .d('运行状态')}
          </span>
          <Select
            showSearch
            allowClear
            placeholder={intl
              .get(
                'ide.src.page-manage.page-tag-sync.sync-detail.run-record.wlsmb4ud0m'
              )
              .d('请选择运行状态')}
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
                'ide.src.page-manage.page-tag-sync.sync-detail.run-record.3uzg1q7hy1s'
              )
              .d('运行日期')}
          </span>
          <RangePicker onChange={this.selectTime} allowClear />
        </div>
        <Table
          dataSource={toJS(list)}
          loading={tableLoading}
          columns={this.columns}
        />
        <ModalLog store={store} />
      </div>
    )
  }
}
export default RunRecord
