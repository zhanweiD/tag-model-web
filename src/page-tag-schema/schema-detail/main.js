/**
 * @description 加工方案详情
 */
import {Component} from 'react'
import {observer} from 'mobx-react'
import {action} from 'mobx'
import {Spin, Button} from 'antd'
import {
  Tag,
  TabRoute,
  DetailHeader, 
} from '../../component'

import ConfigInfo from './config-info'
import {Time} from '../../common/util'

import store from './store'

@observer
export default class SchemaDetail extends Component {
  constructor(props) {
    super(props)
    const {match} = props
    store.processeId = match.params.id // 方案id
  }

  componentWillMount() {
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
      title: '加工类型',
      value: detail.type,
    }, {
      title: '对象',
      value: detail.objName,
    }, {
      title: '标签数/字段数',
      value: `${detail.tagCount}/${detail.fieldCount}`,
    }, {
      title: '调度类型',
      value: detail.scheduleType,
    }, {
      title: '调度周期',
      value: detail.period,
    }, {
      title: '调度时间',
      value: detail.periodTime,
    }, {
      title: '创建人',
      value: detail.cUserName,
    }, {
      title: '创建时间',
      value: <Time timestamp={detail.createTime} />,
    }]

    // 不同状态的相应map --方案状态 0 未完成、1 待提交、2 提交成功 3 提交失败
    const tagMap = {
      0: {
        tag: <Tag status="default" text="未完成" />,
      },
      1: {
        tag: <Tag status="wait" text="待提交" />,
      },
      2: {
        tag: <Tag status="success" text="提交成功" />,
      },
      3: {
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
              actions={[
                <Button 
                  type="primary" 
                  onClick={this.submit}
                >
                  移除
                </Button>,
              ]}
            />
          </div>
          <TabRoute tabs={[{name: '配置信息', value: 1}]} />
          <ConfigInfo store={store} />
        </Spin>
      </div>
    )
  }
}
