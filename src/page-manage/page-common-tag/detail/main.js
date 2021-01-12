import intl from 'react-intl-universal'
/**
 * @description 公共标签 - 标签详情
 */
import { Component, useEffect } from 'react'
import { observer } from 'mobx-react'
import { Spin } from 'antd'
import OnerFrame from '@dtwave/oner-frame'
import { DetailHeader } from '../../../component'
import { Time } from '../../../common/util'
import TagAnalyze from '../../../business-component/tag-analyze'
import TagTrend from '../../../business-component/tag-trend'

import store from './store'

@observer
class TagDetail extends Component {
  constructor(props) {
    super(props)
    const { match } = props
    store.tagId = match.params.id // 标签id
    store.projectId = match.params.projectId // 项目id
  }

  componentWillMount() {
    store.getTagBaseDetail()
  }

  render() {
    const { detailLoading, info, tagId } = store

    const baseInfo = [
      {
        title: intl
          .get(
            'ide.src.page-manage.page-aim-source.source-detail.modal.hdb36gt6rzf'
          )
          .d('对象'),
        value: info.objName,
      },
      {
        title: intl
          .get('ide.src.business-component.tag-relate.dag-box.xs30zaqk60p')
          .d('标签标识'),
        value: info.enName,
      },
      {
        title: intl
          .get('ide.src.business-component.tag-relate.dag-box.zfaw0a4v7jh')
          .d('数据类型'),
        value: info.valueTypeName,
      },
      {
        title: intl
          .get('ide.src.page-manage.page-common-tag.detail.main.ilm7zazygy')
          .d('是否枚举'),
        value: info.isEnum
          ? intl.get('ide.src.component.form-component.03xp8ux32s3a').d('是')
          : intl.get('ide.src.component.form-component.h7p1pcijouf').d('否'),
      },
      {
        title: intl
          .get('ide.src.page-manage.page-common-tag.detail.main.hv8quje3qk')
          .d('创建者'),
        value: info.creator,
      },
      {
        title: intl
          .get(
            'ide.src.page-manage.page-aim-source.source-detail.main.2vp94m4091h'
          )
          .d('创建时间'),
        value: <Time timestamp={info.createTime} />,
      },
      {
        title: intl
          .get('ide.src.page-manage.page-common-tag.detail.main.2ziwjluj78c')
          .d('绑定方式'),
        value:
          info.configType === 1
            ? intl
                .get(
                  'ide.src.page-manage.page-common-tag.detail.main.mfs279f7xcc'
                )
                .d('衍生标签')
            : intl
                .get(
                  'ide.src.page-manage.page-common-tag.detail.main.vwwmvcib39m'
                )
                .d('基础标签'),
      },
      {
        title: intl
          .get('ide.src.component.comp.search.h5l3m6s8dn7')
          .d('所属项目'),
        value: info.projectName,
      },
    ]

    const baseInfo1 = [
      {
        title: intl
          .get(
            'ide.src.page-manage.page-aim-source.source-detail.modal.hdb36gt6rzf'
          )
          .d('对象'),
        value: info.objName,
      },
      {
        title: intl
          .get('ide.src.business-component.tag-relate.dag-box.xs30zaqk60p')
          .d('标签标识'),
        value: info.enName,
      },
      {
        title: intl
          .get('ide.src.business-component.tag-relate.dag-box.zfaw0a4v7jh')
          .d('数据类型'),
        value: info.valueTypeName,
      },
      {
        title: intl
          .get('ide.src.page-manage.page-common-tag.detail.main.ilm7zazygy')
          .d('是否枚举'),
        value: info.isEnum
          ? intl.get('ide.src.component.form-component.03xp8ux32s3a').d('是')
          : intl.get('ide.src.component.form-component.h7p1pcijouf').d('否'),
      },
      {
        title: intl
          .get('ide.src.page-manage.page-common-tag.detail.main.hv8quje3qk')
          .d('创建者'),
        value: info.creator,
      },
      {
        title: intl
          .get(
            'ide.src.page-manage.page-aim-source.source-detail.main.2vp94m4091h'
          )
          .d('创建时间'),
        value: <Time timestamp={info.createTime} />,
      },
      {
        title: intl
          .get('ide.src.page-manage.page-common-tag.detail.main.2ziwjluj78c')
          .d('绑定方式'),
        value: intl
          .get('ide.src.page-manage.page-common-tag.detail.main.dz497pguc9')
          .d('主标签'),
      },
    ]

    return (
      <div>
        <Spin spinning={detailLoading}>
          <DetailHeader
            name={info.name}
            descr={info.descr}
            baseInfo={info.isMajor ? baseInfo1 : baseInfo}
          />
        </Spin>
        <div
          className="bgf m16 box-border"
          style={{ minHeight: 'calc(100vh - 266px)' }}
        >
          {info.isEnum ? (
            <TagAnalyze tagId={tagId} authorStatus={info.authorStatus} />
          ) : null}
          {info.isMajor ? null : (
            <TagTrend tagId={tagId} projectId={store.projectId} />
          )}
          {/* <TagTrend tagId={tagId} projectId={store.projectId} /> */}
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
    ctx.useProject(true, null, { visible: false })
  }, [])

  return <TagDetail {...props} projectId={projectId} />
}
