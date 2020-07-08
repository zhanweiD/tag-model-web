/**
 * @description 标签仓库 - 标签详情
 */
import {Component, useEffect} from 'react'
import {observer} from 'mobx-react'
import {Spin, Tabs} from 'antd'
import OnerFrame from '@dtwave/oner-frame'
import {DetailHeader} from '../../../component'
import {Time} from '../../../common/util'
import TagAnalyze from '../../../business-component/tag-analyze'
import TagrRelate from '../../../business-component/tag-relate'
import StorageList from './storage-list'
import AppList from './app-list'

import store from './store'

const {TabPane} = Tabs

@observer
class TagDetail extends Component {
  constructor(props) {
    super(props)
    const {match} = props
    store.tagId = match.params.id // 标签id
  }
  
  componentWillMount() {
    store.getTagBaseDetail()
  }

  render() {
    const {tagDetailLoading, tagBaseInfo, tagId} = store

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
      title: '数据源',
      value: tagBaseInfo.dataSource,
    }, {
      title: '数据表',
      value: tagBaseInfo.tableName,
    }, {
      title: '字段',
      value: tagBaseInfo.fieldName,
    }]

    return (
      <div>
        <Spin spinning={tagDetailLoading}>
          <DetailHeader
            name={tagBaseInfo.name}
            descr={tagBaseInfo.descr}
            baseInfo={baseInfo}
          />
        </Spin>
        <Tabs defaultActiveKey="1" className="comp-tab">
          <TabPane tab="标签分析" key="1">
            <div className="bgf m16 box-border" style={{minHeight: 'calc(100vh - 298px)'}}>
              <TagAnalyze tagId={tagId} />
            </div>
          </TabPane>
          <TabPane tab="血缘分析" key="2">
            <div className="bgf m16 box-border" style={{height: 'calc(100vh - 298px)'}}>
              <TagrRelate tagId={tagId} />
            </div>
          </TabPane>
          <TabPane tab="目的源列表" key="3">
            <div className="bgf m16 box-border pt24" style={{minHeight: 'calc(100vh - 298px)'}}>
              <StorageList tagId={tagId} />
            </div>
   
          </TabPane>
          <TabPane tab="标签应用列表" key="4">
            <div className="bgf m16 box-border pt24" style={{minHeight: 'calc(100vh - 298px)'}}>
              <AppList tagId={tagId} />
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
