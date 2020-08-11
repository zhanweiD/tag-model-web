import {Component} from 'react'
import {observer} from 'mobx-react'
import {action, toJS} from 'mobx'
import {Select, DatePicker, Table} from 'antd'
import {Authority} from '../../component'
import {getSchemeRunStatus} from '../util'
import ModalLog from './modal-log'

import store from './store-run-record'

const {Option} = Select
const {RangePicker} = DatePicker
const runStatus = [{
  name: '全部',
  value: '',
}, {
  name: '运行中',
  value: 0,
}, {
  name: '运行失败',
  value: 2,
}, {
  name: '运行成功',
  value: 1,
}]

@observer
export default class RunRecord extends Component {
  constructor(props) {
    super(props)
    store.projectId = props.projectId
    store.processeId = props.processeId
  }
  
  columns = [{
    title: '记录ID',
    dataIndex: 'taskInstance',
  }, {
    title: '运行开始时间',
    dataIndex: 'startTime',
    // render: text => <Time timestamp={text} />,
  }, {
    title: '运行结束时间',
    dataIndex: 'stopTime',
    // render: text => <Time timestamp={text} />,
  }, {
    title: '运行状态',
    dataIndex: 'runStatus',
    render: text => getSchemeRunStatus({
      status: text,
    }),
  }, {
    title: '记录数',
    dataIndex: 'recordCount',
  }, {
    title: '操作',
    dataIndex: 'action',
    render: (text, record) => (
      <div>
        <Authority authCode="tag_derivative:rerun_tql[x]">
          {record.runStatus ? <a href onClick={() => this.runTask(record)}>重跑</a> : <a className="disabled">重跑</a>}
        </Authority>
        {/* <a href onClick={() => this.runTask(record)}>重跑</a> */}
        <span className="table-action-line" />
        <Authority authCode="tag_derivative:tql_log[r]">
          <a href onClick={() => this.viewLog(record)}>查看日志</a>
        </Authority>
      </div>
    ),
  }]


  componentWillMount() {
    store.getList({
      id: this.props.processeId,
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
    const {tableLoading, list} = store
    
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
      <div className="pr24 pl24"> 
        {/* <ListContent {...listConfig} /> */}
        <div className="mb8">
          <span className="mr8">运行状态：</span>
          <Select
            showSearch
            allowClear
            placeholder="请选择运行状态"
            style={{width: 200}}
            onChange={v => this.selectStatus(v)}
            optionFilterProp="children"
            className="mr16"
          >
            {
              runStatus.map(item => (
                <Option key={item.value} value={item.value}>{item.name}</Option>
              ))
            }
          </Select>
          <span className="mr8">运行日期：</span>
          <RangePicker onChange={this.selectTime} allowClear />
        </div>
        <Table dataSource={toJS(list)} loading={tableLoading} columns={this.columns} />
        <ModalLog store={store} />
      </div>
    )
  }
}
