/**
 * @description 公共标签 - 标签详情
 */
import {Component, useEffect} from 'react'
import {observer} from 'mobx-react'
import {Spin} from 'antd'
import OnerFrame from '@dtwave/oner-frame'
import {DetailHeader} from '../../../component'
import {Time} from '../../../common/util'
import TagAnalyze from '../../../business-component/tag-analyze'
import TagTrend from '../../../business-component/tag-trend'

import store from './store'


@observer
class TagDetail extends Component {
  constructor(props) {
    super(props)
    const {match} = props
    store.tagId = match.params.id // 标签id
    store.projectId = match.params.projectId // 项目id
  }
  
  componentWillMount() {
    store.getTagBaseDetail()
  }

  render() {
    const {detailLoading, info, tagId} = store

    const baseInfo = [{
      title: '对象',
      value: info.objName,
    }, {
      title: '标签标识',
      value: info.enName,
    }, {
      title: '数据类型',
      value: info.valueTypeName,
    }, {
      title: '是否枚举',
      value: info.isEnum ? '是' : '否',
    }, {
      title: '创建者',
      value: info.creator,
    }, {
      title: '创建时间',
      value: <Time timestamp={info.createTime} />,
    }, {
      title: '绑定方式',
      value: info.configType === 1 ? '衍生标签' : '基础标签',
    }, {
      title: '所属项目',
      value: info.projectName,
    }]

    return (
      <div>
        <Spin spinning={detailLoading}>
          <DetailHeader
            name={info.name}
            descr={info.descr}
            baseInfo={baseInfo}
          />
        </Spin>
        <div className="bgf m16 box-border" style={{minHeight: 'calc(100vh - 266px)'}}> 
          {info.isEnum ? <TagAnalyze tagId={tagId} authorStatus={info.authorStatus} /> : null}
          <TagTrend tagId={tagId} projectId={store.projectId} />
        </div>
      </div>
      
    )
  }
}

export default props => {
  const ctx = OnerFrame.useFrame()
  const projectId = ctx.useProjectId()

  useEffect(() => {
    // 使用该方法导致空值占比setOption 报错
    // store.getProjects(isProject => {
    //   isProject ? ctx.useProject(true, null, {visible: false}) : ctx.useProject(isProject)
    // })
    ctx.useProject(true, null, {visible: false})
  }, [])

  return (
    <TagDetail {...props} projectId={projectId} />
  )
}
