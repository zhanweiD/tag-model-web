/**
 * @description 加工方案详情
 */
import {Component, useEffect} from 'react'
import {observer} from 'mobx-react'
import {action} from 'mobx'
import {Spin, NoData} from 'antd'
import OnerFrame from '@dtwave/oner-frame'
import {
  Tag,
  TabRoute,
  DetailHeader, 
} from '../../component'

import ConfigInfo from './config-info'
import {Time} from '../../common/util'

import store from './store'

@observer
class SchemaDetail extends Component {
  constructor(props) {
    super(props)
    const {match} = props
    store.processeId = match.params.id // 方案id
  }

  componentWillMount() {
    if (store.processeId) {
      store.getDetail()
    }
  }

  @action.bound submit() {
    store.submitScheme({
      id: this.processeId,
    })
  }

  render() {
    const {loading, detail, processeId} = store

    // 详情信息
    const baseInfo = [{
      title: '方案类型',
      value: 'TQL',
    }, {
      title: '所属对象',
      value: detail.objName,
    }, {
      title: '创建人',
      value: detail.cuserName,
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
        { processeId ? (
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
        )
          : (
            <NoData />
          )
        }
       
      </div>
    )
  }
}

export default props => {
  const ctx = OnerFrame.useFrame()
  const projectId = ctx.useProjectId()

  useEffect(() => {
    ctx.useProject(false)
  }, [])

  return (
    <SchemaDetail {...props} projectId={projectId} />
  )
}
