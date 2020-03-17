/**
 * @description 加工方案详情
 */
import {Component} from 'react'
import {observer, inject} from 'mobx-react'
import {action} from 'mobx'
import {Spin} from 'antd'
import * as navListMap from '../../common/navList'
import {
  Tag,
  TabRoute,
  DetailHeader, 
} from '../../component'

import ConfigInfo from './config-info'
import {Time} from '../../common/util'

import store from './store'

// 面包屑设置
// eslint-disable-next-line no-underscore-dangle

const navList = [
  navListMap.tagCenter,
  navListMap.tagSchema,
  navListMap.schemaList,
  {text: navListMap.schemaList.text},
]

@inject('frameChange')
@observer
export default class SchemaDetail extends Component {
  constructor(props) {
    super(props)
    const {match} = props
    store.processeId = match.params.id // 方案id
  }

  componentWillMount() {
    // 面包屑设置
    const {frameChange} = this.props
    frameChange('nav', navList)
    store.getDetail()
  }

  @action.bound submit() {
    store.submitScheme({
      id: this.processeId,
    })
  }

  render() {
    const {loading, detail} = store

    // 详情信息
    const baseInfo = [{
      title: '方案类型',
      value: detail.type,
    }, {
      title: '所属对象',
      value: detail.objName,
    }, {
      title: '创建人',
      value: detail.cUserName,
    }, {
      title: '创建时间',
      value: <Time timestamp={detail.createTime} />,
    }]

    // 不同状态的相应map --方案状态 0 未完成、1 提交成功 2 提交失败
    const tagMap = {
      0: {
        tag: <Tag status="default" text="未完成" />,
      },
      1: {
        tag: <Tag status="success" text="提交成功" />,
      },
      2: {
        tag: <Tag status="error" text="提交失败" />,
      },
    }

    return (
      <div className="processe-detail">
        <Spin spinning={loading}>
          <div>
            <DetailHeader 
              name={detail.name}
              descr={detail.descr}
              btnMinWidth={160}
              baseInfo={baseInfo}
              tag={tagMap[detail.status]}
            />
          </div>
          <TabRoute tabs={[{name: '配置信息', value: 1}]} />
          <ConfigInfo store={store} />
        </Spin>
      </div>
    )
  }
}
