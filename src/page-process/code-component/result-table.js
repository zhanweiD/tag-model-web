import {Component} from 'react'
import {observer} from 'mobx-react'
import {observable, action, runInAction} from 'mobx'
import {
  Modal, Spin, Button, Pagination,
} from 'antd'

import io from '../schema-list/io-code'
import './flexgrid'

const pageSize = 20
@observer
export default class Page extends Component {
  @observable tableData = []
  @observable tableTitle = []
  @observable totalSize = 0
  @observable currentPage = 1
  @observable loading = false
  @action getTableResult = async currentPage => {
    const {taskInstanceId, resultId, fieldInfo, projectId} = this.props

    this.loading = true
    try {
      const data = await io.queryInstanceResult({
        fieldInfo: JSON.stringify(fieldInfo),
        taskInstanceId,
        resultId,
        pageSize,
        projectId,
        currentPage: currentPage || 1,
      })
      runInAction(() => {
        this.tableData = data.result.data
        this.tableTitle = data.result.title
        this.totalSize = data.totalSize
        this.loading = false
        this.currentPage = currentPage || 1
      })
      this.flexTable()
    } catch (e) {
      Modal.error({
        title: `获取${taskInstanceId}的结果失败!`,
        content: e.message,
      })
      runInAction(() => this.loading = false)
    }
  }

  @action flexTable = () => {
    $(this.resultDom).flexigrid({
      width: '100%',
      minwidth: 50,
      height: $(this.resultDomBox).height() - 88,
    })
  }

  @action onChange = currentPage => {
    this.getTableResult(currentPage)
  }

  @action setHeight = height => {
    $(this.resultDom).parent('.bDiv').height(height - 88)
  }

  render() {
    return (
      <div className="result-box" ref={p => this.resultDomBox = p}>
        <Spin
          spinning={this.loading} 
          tip="Loading..."
        >
          {!this.loading
            && (
              <div style={{width: '1280px'}}>
                <table style={{height: '100%'}} ref={p => this.resultDom = p}>
                  <thead>
                    <tr>
                      {
                        this.tableTitle.length > 0
                          ? (
                            <th>
                          序号
                            </th>
                          )
                          : null
                      }
                      {
                        this.tableTitle.map(item => (
                          <th>
                            {`${item.dataKey}`}
                          </th>
                        ))
                      }
                    </tr>
                  </thead>
                  <tbody className="table-content">
                    {
                      this.tableData.map((item, index) => (
                        <tr>
                          <td>
                            {index + ((this.currentPage - 1) * pageSize) + 1 }
                          </td>
                          {
                            this.tableTitle.map(o => (
                              <td>
                                {
                                  `${item[o.dataKey]}`
                                }
                              </td>
                            ))
                          }
                        </tr>
                      ))
                    }
                  </tbody>
                </table>
              </div>
            )
          }
          {
            this.loading && <div style={{height: '100%'}} />
          }
          {!this.loading
            ? (
              <div className="download-area">
                {/* <div className="left">
                  <Button 
                    // disabled={!_store.isDownload}
                    onClick={this.downloadResult} 
                    className="download-result"
                  >
                  下载结果
                  </Button>
                  <span className="ml16">
                  下载的文件编码格式为UTF-8
                  </span>
                </div> */}
                <div style={{float: 'right', paddingRight: '5px'}}>
                  <Pagination 
                    current={this.currentPage} 
                    pageSize={pageSize} 
                    onChange={this.onChange} 
                    total={this.totalSize}
                  />
                </div>
              </div>
            )
            : null
          }
        </Spin>
      </div>
    )
  }

  // @action downloadResult = () => {
  //   if (_store.isDownload) {
  //     const urlPre = `${window.__keeper.pathPrefix || ''}/api/download`
  //     const param = `resultId=${this.props.resultId}&taskId=${this.props.taskInstanceId}&wsId=${this.props.wsId}`
  //     const url = `${urlPre}?${param}`
  //     window.open(url)
  //   }
  // }

  componentDidMount() {
    this.getTableResult()
  }
}
