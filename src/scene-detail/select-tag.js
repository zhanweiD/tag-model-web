import {Component} from 'react'
import {observable, action, toJS} from 'mobx'
import {observer} from 'mobx-react'
import NemoBaseInfo from '@dtwave/nemo-base-info'
import {Tag, Button} from 'antd'

import {Time} from '../common/util'
import ModalSelectTag from './modal-select-tag'
import TrendTag from './trend-tag'
import TrendApi from './trend-api'

import store from './store-select-tag'

@observer
export default class SelectTag extends Component {
  componentWillMount() {
    store.getTagDetail()
  }

  // 临时
  @action handleModalVisible() {
    store.selectTagVisible = true
  }

  render() {
    const {tagInfo} = store
    const {
      enName,
      valueTypeName,
      cUser,
      cDate,
      descr,
    } = toJS(tagInfo)
    // 详情信息
    const baseInfo = [{
      title: '英文名',
      value: enName,
    }, {
      title: '数据类型',
      value: valueTypeName,
    }, {
      title: '创建者',
      value: cUser,
    }, {
      title: '创建时间',
      value: <Time timestamp={cDate} />,
    }, {
      title: '业务逻辑',
      value: descr,
    }]
    return (
      <div className="select-tag FBH">
        <div style={{width: '200px'}}>
          <Button>选择标签</Button>
        </div>
        <div className="select-tag-box">
          <div className="detail-info">
            <div className="d-head FBH FBJ">
              <div>
                <span className="mr10">交易金额</span>
                <Tag color="green">使用中</Tag>
              </div>
              {/* 点击“标签详情”按钮，进入标签池中的标签详情 */}
              <Button type="primary">标签详情</Button>
            </div>
            <NemoBaseInfo dataSource={baseInfo} key={Math.random()} className="d-info" />
          </div>
          <TrendTag store={store} />
          <TrendApi store={store} />
        </div>
        <ModalSelectTag store={store} />
      </div>
    )
  }
}
