import {Component} from 'react'
import {observable, action, toJS} from 'mobx'
import {observer} from 'mobx-react'
import {Tabs} from 'antd'
import NemoBaseInfo from '@dtwave/nemo-base-info'
import {Time} from '../common/util'
import SelectTag from './select-tag'
import DataSource from './data-source'

import store from './store-scene-detail'

const {TabPane} = Tabs

@observer
export default class SceneDetail extends Component {
  componentWillMount() {
    store.getDetail()
  }

  render() {
    const info = toJS(store.info)
    const {
      tagCount,
      cCuser,
      cDate,
      invokeList = [],
      descr,
    } = info

    // 详情信息
    const baseInfo = [{
      title: '创建者',
      value: cCuser,
    }, {
      title: '创建时间',
      value: <Time timestamp={cDate} />,
    }, {
      title: '调用的API名称',
      value: invokeList.join('、'),
    }, {
      title: '标签数',
      value: tagCount,
    }, {
      title: '描述',
      value: descr,
    }]

    return (
      <div className="scene-detail">
        <div className="info">
          <p className="name">
            {info.name}
          </p>
          <NemoBaseInfo dataSource={baseInfo} key={Math.random()} />
        </div>

        <Tabs defaultActiveKey="1">
          <TabPane tab="标签选择" key="1">    
            <SelectTag />
          </TabPane>
          <TabPane tab="目的数据源列表" key="2">
            <DataSource />
          </TabPane>
        </Tabs>
      </div>
    )
  }
}
