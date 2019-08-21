import {Component, Fragment} from 'react'
import {observable, action, toJS} from 'mobx'
import {observer} from 'mobx-react'
import {Table, Button} from 'antd'
import {withRouter, Link} from 'react-router-dom'

import store from './store-tag-export'

@observer
class Step2 extends Component {
  constructor(props) {
    super(props)
  }

  @action exportTag() {
    store.exportTag(() => {
      this.props.history.push(`/${store.typeCode}`)
    })
  }

  render() {
    return (
      <Fragment>
        <Table
          columns={toJS(store.previewDataHead)}
          loading={store.previewDataLoading}
          dataSource={store.previewDataList.slice()}
          pagination={false}
        />

        <div className="fac mt12">
          <Button size="large" className="mr12" onClick={() => store.currStep = 0}>上一步</Button>
          <Button type="primary" size="large" onClick={() => this.exportTag()}>导出</Button>
        </div>
      </Fragment>
    )
  }
}

export default withRouter(Step2)
