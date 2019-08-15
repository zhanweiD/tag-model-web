import {Component} from 'react'
import {
  observable, action, toJS, computed,
} from 'mobx'
import {observer} from 'mobx-react'
import {Table, Button, Alert} from 'antd'
import {withRouter} from 'react-router-dom'

import store from './store-tag-import'

@observer
class StepThree extends Component {
  @computed get alertInfo() {
    const {total, failTotal, failPreView, correctPreView} = store

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
    const {match, history} = this.props
    return (
      <div>
        <Alert className="mb30" message={toJS(this.alertInfo)} type="info" showIcon />
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
            disabled={!store.canImportData.length}
            onClick={() => store.postImportData(() => history.push(`/${match.params.type}`))}
          >
            导入
          </Button>
        </div>
      </div>
    )
  }
}
export default withRouter(StepThree)
