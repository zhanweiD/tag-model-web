import intl from 'react-intl-universal'
/**
 * @description 标签模型 - 标签详情
 */
import { Component, useEffect } from 'react'
import { observer } from 'mobx-react'
import { Spin, Tabs } from 'antd'
import OnerFrame from '@dtwave/oner-frame'
import { DetailHeader, OverviewCardWrap, Tag } from '../../../../component'
import { Time } from '../../../../common/util'
import TagAnalyze from '../../../../business-component/tag-analyze'
import TagTrend from '../../../../business-component/tag-trend'
import TagrRelate from '../../../../business-component/tag-relate'
import ProjectList from './project-list'
import './main.styl'

import store from './store'

const { TabPane } = Tabs

@observer
class TagDetail extends Component {
  constructor(props) {
    super(props)
    const {
      match: { params },
    } = props
    store.tagId = params && params.tagId // 标签id
    store.projectId = params && params.projectId // 标签id
  }

  componentWillMount() {
    store.getTagBaseDetail()
    store.getCardInfo()
  }

  render() {
    const { tagId, cardInfo, tagBaseInfo, tagDetailLoading, projectId } = store

    const baseInfo = [
      //   {
      //   title: '对象',
      //   value: tagBaseInfo.objName,
      // },
      {
        title: intl
          .get('ide.src.business-component.tag-relate.dag-box.xs30zaqk60p')
          .d('标签标识'),
        value: tagBaseInfo.enName,
      },
      {
        title: intl
          .get('ide.src.business-component.tag-relate.dag-box.zfaw0a4v7jh')
          .d('数据类型'),
        value: tagBaseInfo.valueTypeName,
      },
      {
        title: intl
          .get('ide.src.page-manage.page-common-tag.detail.main.ilm7zazygy')
          .d('是否枚举'),
        value: tagBaseInfo.isEnum
          ? intl.get('ide.src.component.form-component.03xp8ux32s3a').d('是')
          : intl.get('ide.src.component.form-component.h7p1pcijouf').d('否'),
      },
      {
        title: intl
          .get('ide.src.page-manage.page-common-tag.detail.main.hv8quje3qk')
          .d('创建者'),
        value: tagBaseInfo.creator,
      },
      {
        title: intl
          .get(
            'ide.src.page-manage.page-aim-source.source-detail.main.2vp94m4091h'
          )
          .d('创建时间'),
        value: <Time timestamp={tagBaseInfo.createTime} />,
      },
      {
        title: intl
          .get('ide.src.page-manage.page-common-tag.detail.main.2ziwjluj78c')
          .d('绑定方式'),
        value:
          tagBaseInfo.configType === 1
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
          .get('ide.src.business-component.tag-relate.dag-box.9mzk7452ggp')
          .d('数据源'),
        value: tagBaseInfo.dataSource,
      },
      {
        title: intl
          .get(
            'ide.src.page-manage.page-aim-source.source-list.main.bh6e3tzii5'
          )
          .d('数据表'),
        value: tagBaseInfo.tableName,
      },
      {
        title: intl
          .get('ide.src.business-component.tag-relate.dag-box.bhzleo4vj5g')
          .d('字段'),
        value: tagBaseInfo.fieldName,
      },
    ]

    const cards = [
      {
        title: intl
          .get(
            'ide.src.page-manage.page-object-model.object-list.object-detail.main.ps8jdn62w8s'
          )
          .d('使用项目数'),
        tooltipText: intl
          .get(
            'ide.src.page-manage.page-tag-model.tag-model.tag-detail.main.4mbb3gsyvv6'
          )
          .d('被多少个项目申请使用，包括所属项目'),
        values: [cardInfo.projectCount || 0],
      },
      {
        title: intl
          .get('ide.src.page-manage.page-project-tag.detail.main.40y9kbpr4qg')
          .d('加工方案引用数'),
        tooltipText: intl
          .get(
            'ide.src.page-manage.page-tag-model.tag-model.tag-detail.main.lvnyequb3x'
          )
          .d('该标签租户下被加工方案的引用数'),
        values: [cardInfo.derivativeCount || 0],
      },
      {
        title: intl
          .get('ide.src.page-manage.page-project-tag.detail.main.nh79sa2cn9')
          .d('标签应用数'),
        tooltipText: intl
          .get(
            'ide.src.page-manage.page-tag-model.tag-model.tag-detail.main.q0oj5peunwg'
          )
          .d(
            '租户下，该标签被多少个数据查询引用+群体管理引用+API引用+业务场景引用'
          ),
        values: [cardInfo.appCount || 0],
      },
    ]

    const baseDeriveInfo = [
      {
        title: intl
          .get(
            'ide.src.page-manage.page-aim-source.source-detail.modal.hdb36gt6rzf'
          )
          .d('对象'),
        value: tagBaseInfo.objName,
      },
      {
        title: intl
          .get('ide.src.business-component.tag-relate.dag-box.xs30zaqk60p')
          .d('标签标识'),
        value: tagBaseInfo.enName,
      },
      {
        title: intl
          .get('ide.src.business-component.tag-relate.dag-box.zfaw0a4v7jh')
          .d('数据类型'),
        value: tagBaseInfo.valueTypeName,
      },
      {
        title: intl
          .get('ide.src.page-manage.page-common-tag.detail.main.ilm7zazygy')
          .d('是否枚举'),
        value: tagBaseInfo.isEnum
          ? intl.get('ide.src.component.form-component.03xp8ux32s3a').d('是')
          : intl.get('ide.src.component.form-component.h7p1pcijouf').d('否'),
      },
      {
        title: intl
          .get('ide.src.page-manage.page-common-tag.detail.main.hv8quje3qk')
          .d('创建者'),
        value: tagBaseInfo.creator,
      },
      {
        title: intl
          .get(
            'ide.src.page-manage.page-aim-source.source-detail.main.2vp94m4091h'
          )
          .d('创建时间'),
        value: <Time timestamp={tagBaseInfo.createTime} />,
      },
      {
        title: intl
          .get('ide.src.page-manage.page-common-tag.detail.main.2ziwjluj78c')
          .d('绑定方式'),
        value:
          tagBaseInfo.configType === 1
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
          .get('ide.src.business-component.tag-relate.dag-box.tm23no7bl7g')
          .d('衍生方案'),
        value: tagBaseInfo.schemeName,
      },
    ]

    const baseMainInfo = [
      {
        title: intl
          .get(
            'ide.src.page-manage.page-aim-source.source-detail.modal.hdb36gt6rzf'
          )
          .d('对象'),
        value: tagBaseInfo.objName,
      },
      {
        title: intl
          .get('ide.src.business-component.tag-relate.dag-box.xs30zaqk60p')
          .d('标签标识'),
        value: tagBaseInfo.enName,
      },
      {
        title: intl
          .get('ide.src.business-component.tag-relate.dag-box.zfaw0a4v7jh')
          .d('数据类型'),
        value: tagBaseInfo.valueTypeName,
      },
      {
        title: intl
          .get('ide.src.page-manage.page-common-tag.detail.main.ilm7zazygy')
          .d('是否枚举'),
        value: tagBaseInfo.isEnum
          ? intl.get('ide.src.component.form-component.03xp8ux32s3a').d('是')
          : intl.get('ide.src.component.form-component.h7p1pcijouf').d('否'),
      },
      {
        title: intl
          .get('ide.src.page-manage.page-common-tag.detail.main.hv8quje3qk')
          .d('创建者'),
        value: tagBaseInfo.creator,
      },
      {
        title: intl
          .get(
            'ide.src.page-manage.page-aim-source.source-detail.main.2vp94m4091h'
          )
          .d('创建时间'),
        value: <Time timestamp={tagBaseInfo.createTime} />,
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

    // 不同状态的相应map
    const tagMap = {
      0: (
        <Tag
          status="wait"
          text={intl.get('ide.src.component.tag.tag.ogvpoe5m3bg').d('未使用')}
        />
      ),
      1: (
        <Tag
          status="process"
          text={intl
            .get('ide.src.page-config.workspace-config.main.ztbqzsc34bb')
            .d('使用中')}
        />
      ),
    }

    return (
      <div>
        <Spin spinning={tagDetailLoading}>
          <DetailHeader
            name={tagBaseInfo.name}
            descr={tagBaseInfo.descr}
            baseInfo={
              tagBaseInfo.configType !== 1
                ? tagBaseInfo.configType !== 2
                  ? baseInfo
                  : baseMainInfo
                : baseDeriveInfo
            }
            tag={tagMap[tagBaseInfo.isUsed]}
          />

          <div className="ml16 mr16">
            <OverviewCardWrap cards={cards} />
          </div>
        </Spin>
        <div className="ml16 mr16 mb16">
          {tagBaseInfo.configType === 2 ? (
            <div
              style={{
                minHeight: 'calc(100vh - 372px)',
                backgroundColor: '#fff',
              }}
            />
          ) : (
            <Tabs defaultActiveKey="1" className="comp-tab mt0 box-border">
              <TabPane
                tab={intl
                  .get(
                    'ide.src.page-manage.page-project-tag.detail.main.dbjefjdor19'
                  )
                  .d('标签分析')}
                key="1"
              >
                <div style={{ minHeight: 'calc(100vh - 427px)' }}>
                  {tagBaseInfo.isEnum ? (
                    <TagAnalyze
                      tagId={tagId}
                      authorStatus={tagBaseInfo.authorStatus}
                    />
                  ) : null}
                  <TagTrend tagId={tagId} />
                </div>
              </TabPane>
              <TabPane
                tab={intl
                  .get(
                    'ide.src.page-manage.page-project-tag.detail.main.rjy3k6n968'
                  )
                  .d('血缘分析')}
                key="2"
              >
                <div style={{ height: 'calc(100vh - 427px)' }}>
                  <TagrRelate tagId={tagId} />
                </div>
              </TabPane>
              <TabPane
                tab={intl
                  .get('ide.src.common.navList.uu6h9e6gaqq')
                  .d('项目列表')}
                key="3"
              >
                <div
                  className="pt24"
                  style={{ minHeight: 'calc(100vh - 427px)' }}
                >
                  <ProjectList
                    tagId={tagId}
                    projectId={projectId}
                    configType={tagBaseInfo.configType}
                  />
                </div>
              </TabPane>
            </Tabs>
          )}
        </div>
      </div>
    )
  }
}

export default props => {
  const ctx = OnerFrame.useFrame()
  const projectId = ctx.useProjectId()

  useEffect(() => {
    ctx.useProject(true, null, { visible: false })
  }, [])

  return <TagDetail {...props} projectId={projectId} />
}
