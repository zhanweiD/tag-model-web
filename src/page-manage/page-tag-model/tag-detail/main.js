/**
 * @description 标签模型 - 标签详情
 */
import {Component, useEffect} from 'react'
import {observer} from 'mobx-react'
import {Spin, Tabs} from 'antd'
import OnerFrame from '@dtwave/oner-frame'
import {DetailHeader, OverviewCardWrap, Tag} from '../../../component'
import {Time} from '../../../common/util'
import TagAnalyze from '../../../business-component/tag-analyze'
import TagTrend from '../../../business-component/tag-trend'
import TagrRelate from '../../../business-component/tag-relate'
import ProjectList from './project-list'

import store from './store'

const {TabPane} = Tabs

@observer
class TagDetail extends Component {
  constructor(props) {
    super(props)
    const {match: {params}} = props
    store.tagId = params && params.tagId // 标签id
  }
  
  componentWillMount() {
    store.getTagBaseDetail()
    store.getCardInfo()
  }
  
  render() {
    const {
      tagId,
      cardInfo,
      tagBaseInfo, 
      tagDetailLoading, 
    } = store

    const baseInfo = [{
      title: '对象',
      value: tagBaseInfo.objName,
    }, {
      title: '唯一标识',
      value: tagBaseInfo.enName,
    }, {
      title: '数据类型',
      value: tagBaseInfo.valueTypeName,
    }, {
      title: '是否枚举',
      value: tagBaseInfo.isEnum ? '是' : '否',
    }, {
      title: '创建者',
      value: tagBaseInfo.creator,
    }, {
      title: '创建时间',
      value: <Time timestamp={tagBaseInfo.createTime} />,
    }, {
      title: '绑定方式',
      value: tagBaseInfo.configType === 1 ? '衍生标签' : '基础标签',
    }, {
      title: '数据源',
      value: tagBaseInfo.dataSource,
    }, {
      title: '数据表',
      value: tagBaseInfo.tableName,
    }, {
      title: '字段',
      value: tagBaseInfo.fieldName,
    }]

    const cards = [
      {
        title: '使用项目数',
        tooltipText: '被多少个项目申请使用，包括所属项目',
        values: [cardInfo.projectCount || 0],
      }, {
        title: '加工方案引用数',
        tooltipText: '该标签租户下被加工方案的引用数',
        values: [cardInfo.derivativeCount || 0],
      }, {
        title: '标签应用数',
        tooltipText: '租户下，该标签被多少个数据查询引用+群体管理引用+API引用+业务场景引用',
        values: [cardInfo.appCount || 0],
      },
    ]
    const baseDeriveInfo = [{
      title: '对象',
      value: tagBaseInfo.objName,
    }, {
      title: '唯一标识',
      value: tagBaseInfo.enName,
    }, {
      title: '数据类型',
      value: tagBaseInfo.valueTypeName,
    }, {
      title: '是否枚举',
      value: tagBaseInfo.isEnum ? '是' : '否',
    }, {
      title: '创建者',
      value: tagBaseInfo.creator,
    }, {
      title: '创建时间',
      value: <Time timestamp={tagBaseInfo.createTime} />,
    }, {
      title: '绑定方式',
      value: tagBaseInfo.configType === 1 ? '衍生标签' : '基础标签',
    }, {
      title: '衍生方案',
      value: <Time timestamp={tagBaseInfo.createTime} />,
    }]

    // 不同状态的相应map
    const tagMap = {
      0: <Tag status="wait" text="未使用" />,
      1: <Tag status="process" text="使用中" />,
    }

    return (
      <div>
        <Spin spinning={tagDetailLoading}>
          <DetailHeader
            name={tagBaseInfo.name}
            descr={tagBaseInfo.descr}
            baseInfo={tagBaseInfo.configType === 1 ? baseDeriveInfo : baseInfo}
            tag={tagMap[tagBaseInfo.isUsed]}
          />
          <OverviewCardWrap cards={cards} />
        </Spin>
        <Tabs defaultActiveKey="1" className="comp-tab">
          <TabPane tab="标签分析" key="1">
            <div className="bgf m16 box-border" style={{minHeight: 'calc(100vh - 430px)'}}>
              <TagAnalyze tagId={tagId} />
              <TagTrend tagId={tagId} />
            </div>
          </TabPane>
          <TabPane tab="血缘分析" key="2">
            <div className="bgf m16  box-border" style={{height: 'calc(100vh - 300px)'}}>
              <TagrRelate tagId={tagId} />
            </div>
          </TabPane>
          <TabPane tab="项目列表" key="3">
            <div className="bgf m16 box-border pt24" style={{minHeight: 'calc(100vh - 430px)'}}>
              <ProjectList tagId={tagId} configType={tagBaseInfo.configType} />
            </div>
          </TabPane>
        </Tabs>
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
    <TagDetail {...props} projectId={projectId} />
  )
}
