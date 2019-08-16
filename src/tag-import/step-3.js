import {Component} from 'react'
import {
  observable, action, toJS, computed,
} from 'mobx'
import {observer} from 'mobx-react'
import {Table, Button, Alert, Tooltip} from 'antd'
import {withRouter} from 'react-router-dom'
import SvgDownload from '../svg-component/Download'

import store from './store-tag-import'

@observer
class StepThree extends Component {
  @computed get alertInfo() {
    const {
      total, failTotal, failPreView, correctPreView,
    } = store

    return (
      <p className="mb0">
        当前成功解析
        {' '}
        {total}
        {' '}
        条记录，失败
        {' '}
        {failTotal}
        {' '}
        条记录，预览数据只展示
        {' '}
        {failPreView}
        {' '}
        条失败记，
        {' '}
        {correctPreView}
        {' '}
        条成功记录
      </p>
    )
  }

  @action goBack = () => {
    store.currStep = 1
    store.previewDataHead.clear()
    store.previewDataList.clear()
  }

  componentWillUnmount() {
    this.goBack()
  }

  render() {
    const {history} = this.props
    const {pathPrefix} = window.__onerConfig

    return (
      <div>
        <div className="FBH FBJB mb24">
          <Alert message={toJS(this.alertInfo)} type="info" showIcon className="fl" />
          {
            store.failKey && (
              <Tooltip title="解析失败记录文件只保留10分钟" placement="top">
                <div
                  className="FBH FBJE FBAC hand"
                  style={{width: '150px', color: '#0078ff'}}
                  onClick={() => {
                    window.open(`${pathPrefix}/file/download/api/v1/be_tag/import/preview_fail?keyRedis=${store.failKey}`)
                  }}
                >
                  <SvgDownload size="14" />
                  <span className="pl8">导出解析失败的记录</span>
                </div>
              </Tooltip>
            )
          }
        </div>
        <Table
          pagination={false}
          loading={store.previewDataLoading}
          columns={toJS(store.previewDataHead)}
          dataSource={store.previewDataList.slice()}
          rowClassName={record => (record.isError ? 'error-row' : '')}
        />
        <div className="fac mt12">
          <Button
            size="large"
            className="mr12"
            onClick={this.goBack}
          >
            上一步
          </Button>
          <Button
            type="primary"
            size="large"
            loading={store.importDataLoading}
            disabled={!store.canImportData.length}
            onClick={() => store.postImportData(() => history.push(`/${store.typeCode}`))}
          >
            导入
          </Button>
        </div>
      </div>
    )
  }
}
export default withRouter(StepThree)
