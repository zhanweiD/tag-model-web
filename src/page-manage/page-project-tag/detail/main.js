/**
 * @description 标签仓库 - 标签详情
 */
import {Component, useEffect} from 'react'
import {observer} from 'mobx-react'
import {Spin, Tabs} from 'antd'
import OnerFrame from '@dtwave/oner-frame'
import {DetailHeader, OverviewCardWrap} from '../../../component'
import {Time} from '../../../common/util'
import TagAnalyze from '../../../business-component/tag-analyze'
import TagTrend from '../../../business-component/tag-trend'
import TagrRelate from '../../../business-component/tag-relate'
import StorageList from './storage-list'
import AppList from './app-list'
import './main.styl'

import store from './store'

const {TabPane} = Tabs

@observer
class TagDetail extends Component {
  constructor(props) {
    super(props)
    const {match} = props
    store.tagId = match.params.id // 标签id
    store.projectId = match.params.projectId // 标签id
  }
  
  componentWillMount() {
    store.getTagBaseDetail()
    store.getCardInfo()
  }

  render() {
    const {tagDetailLoading, tagBaseInfo, tagId, cardInfo, projectId, isTagapp} = store

    const baseInfo = [{
      title: '对象',
      value: tagBaseInfo.objName,
    }, {
      title: '标签标识',
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
      title: '所属项目',
      value: tagBaseInfo.projectName,
    },
    // , {
    //   title: '字段',
    //   value: tagBaseInfo.fieldName,
    // }
    ]
    const baseInfo1 = [{
      title: '对象',
      value: tagBaseInfo.objName,
    }, {
      title: '标签标识',
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
      value: '主标签',
    },
    ]

    const cards = [
      {
        title: '目的源数',
        tooltipText: '包括该标签被标签同步或者目的源管理的映射的总数。举个例子，员工.性别这个标签被标签同步到2个数据源，被目的源管理里映射了2个目的源。在目的源数是4',
        values: [cardInfo.targetCount || 0],
      }, {
        title: '加工方案引用数',
        tooltipText: '项目内该标签被加工方案的引用数',
        values: [cardInfo.derivativeCount || 0],
      }, {
        title: '标签应用数',
        tooltipText: '项目内，该标签被多少个数据查询引用+群体管理引用+API引用+业务场景引用',
        values: [cardInfo.appCount || 0],
      },
    ]

    return (
      <div style={{backgroundColor: '#f3f4f9', paddingBottom: '16px'}}>
        <Spin spinning={tagDetailLoading}>
          <DetailHeader
            name={tagBaseInfo.name}
            descr={tagBaseInfo.descr}
            baseInfo={tagBaseInfo.isMajor ? baseInfo1 : baseInfo}
          />
        </Spin>
        <div className="ml16 mr16">
          <OverviewCardWrap cards={cards} />
          <div className="box-border project-tag-detail"> 
            <Tabs defaultActiveKey={tagBaseInfo.isMajor ? '2' : '1'} className="comp-tab">
              {
                tagBaseInfo.isMajor ? null : (
                  <TabPane tab="标签分析" key="1">
                    <div style={{minHeight: 'calc(100vh - 398px)'}}>
                      {tagBaseInfo.isEnum ? <TagAnalyze tagId={tagId} authorStatus={tagBaseInfo.authorStatus} /> : null}
                      <TagTrend tagId={tagId} />
                    </div>
                  </TabPane>
                )
              }
              <TabPane tab="血缘分析" key="2">
                <div style={{height: 'calc(100vh - 398px)'}}>
                  <TagrRelate tagId={tagId} />
                </div>
              </TabPane>
              <TabPane tab="目的源列表" key="3">
                <div className="pt24" style={{minHeight: 'calc(100vh - 398px)'}}>
                  <StorageList tagId={tagId} projectId={projectId} />
                </div>
    
              </TabPane>
              {
                isTagapp ? (
                  <TabPane tab="标签应用列表" key="4">
                    <div className="pt24" style={{minHeight: 'calc(100vh - 398px)'}}>
                      <AppList tagId={tagId} projectId={projectId} />
                    </div>
                  </TabPane>
                ) : null
              }
            </Tabs>
          </div>
        </div>
      </div>
      
    )
  }
}


export default props => {
  const ctx = OnerFrame.useFrame()
  const projectId = ctx.useProjectId()
  useEffect(() => {
    ctx.useProject(true, null, {visible: false})
  }, [])

  return (
    <TagDetail {...props} projectId={projectId} />
  )
}
