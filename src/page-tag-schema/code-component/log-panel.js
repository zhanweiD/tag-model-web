import {Component, Fragment} from 'react'
import {observer} from 'mobx-react'
import {toJS} from 'mobx'
import {
  Button, Tabs, Spin, Icon, Tooltip,
} from 'antd'
import cls from 'classnames'
import ResultTable from './result-table'

const {TabPane} = Tabs
// const pathPrefix = window.__keeper.pathPrefix || ''

@observer
export default class LogPanel extends Component {
  render() {
    const {
      store,
      taskId,
    } = this.props
    return (
      <Fragment>
        <div
          className={cls({
            running_log: true,
            // FB1: true,
            'show-log': store.isRuned,
            'all-window': store.logBoxToAllFlag,
          })}
          id={`log_${taskId}`}
          style={{width: '640px'}}
        >
          <Button
            key="allwindow"
            className="allwindow-button"
            onClick={store.logBoxToAll}
          >
            <span>
              <i
                className={cls({
                  iconfont: true,
                  dtwave: true,
                  'icon-pingmusuoxiao': store.logBoxToAllFlag,
                  'icon-quanping': !store.logBoxToAllFlag,
                })}
              />
            </span>
          </Button>
          <Button
            key="min-log"
            className="zoomIn-log allwindow-button"
            onClick={store.zoomInLogFun}
            disabled={store.logBoxToAllFlag}
          >
            <Icon type={store.isMinLog ? 'up-square-o' : 'down-square-o'} />
          </Button>
          {store.resultActiveKey === 'running_log'
            ? (
              <Tooltip placement="topRight" title="点击可以清空已有的日志">
                <Button className="clear-log " title="清空日志" onClick={store.clearLog}>
                  <Icon type="delete" />
                </Button>
              </Tooltip>
            )
            : null
          }
          {
            store.isMinLog ? null : (
              <div className="drag-bottom" onMouseDown={store.onDraggableLogMouseDown} />
            )
          }
          <Tabs
            hideAdd
            onChange={store.resultTabChange}
            activeKey={store.resultActiveKey}
            type="editable-card"
            onEdit={store.onTabEdit}
            className="result-log"
          >

            {
              store.tableData.map((item, index) => {
                if (item.resultId === 'running_log') {
                  return (
                    <TabPane
                      tab={item.title}
                      key={`${item.resultId}`}
                      className="log-tab"
                    >
                      <pre className="pre_resize" id={`content${taskId}`}>
                        <span>
                          {
                            store.runLog
                          }
                        </span>
                        {
                          store.runStatusMessage.message ? (
                            <p
                              className={cls({
                                error: store.runStatusMessage.status === 'error',
                                success: store.runStatusMessage.status === 'success',
                              })}
                            >
                              {
                                store.runStatusMessage.message
                              }
                            </p>
                          ) : null
                        }
                       
                        {/* {
                          store.runStatusMessage.download ? (
                            <p className="success">
                              当前日志量比较大，请
                              <a
                                // href={`./api/downloadLog?wsId=${_store.wsId}&taskId=${taskId}&taskInstanceId=${this.store.taskInstanceId}`}
                                href={`${pathPrefix}/api/all_log/download?wsId=${_store.wsId}&taskInstanceId=${store.taskInstanceId}`}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                &nbsp;下载&nbsp;
                              </a>
                              查看完整日志！
                            </p>
                          ) : null
                        } */}
                      </pre>
                    </TabPane>
                  )
                }
                
                return (
                  <TabPane
                    tab={`运行结果${index}`}
                    key={`${item.taskInstance}${item.resultId}`}
                  >
                    <ResultTable
                      // wsId={_store.wsId}
                      fieldInfo={toJS(store.fieldInfo)}
                      taskId={taskId}
                      resultId={item.resultId}
                      taskInstanceId={item.taskInstance}
                      ref={p => store[`resultTableHeight${item.taskInstance}${item.resultId}`] = p}
                    />
                  </TabPane>
                )
              })
            } 
          </Tabs>
        </div>
  
      </Fragment>
    )
  }
}
