import intl from 'react-intl-universal'
import { Component } from 'react'
import { observer } from 'mobx-react'
import { Row, Col, Empty } from 'antd'
import { pieOpt } from './util'
import { NoData } from '../component'

@observer
class Distribute extends Component {
  constructor(props) {
    super(props)
    this.store = props.store
  }

  componentDidMount() {
    this.objTypeChart = echarts.init(this.objRef)
    this.tagChart = echarts.init(this.tagRef)
    this.tagTypeChart = echarts.init(this.tagTypeRef)

    this.store.getObjTypeChart(res => this.drawObjTypeChart(res))
    this.store.getTagChart(res => this.drawTagChart(res))
    this.store.getTagTypeChart(res => this.drawTagTypeChart(res))
  }

  drawObjTypeChart = info => {
    const data = info.total
      ? [
          {
            name: intl.get('ide.src.common.dict.yy6bfwytt9').d('实体'),
            value: info.entityRelation,
          },
          {
            name: intl
              .get(
                'ide.src.page-manage.page-object-model.object-list.util.b78dpbz8x4u'
              )
              .d('简单关系'),
            value: info.simpleRelation,
          },
          {
            name: intl
              .get(
                'ide.src.page-manage.page-object-model.object-list.util.gc2qgcsh5xa'
              )
              .d('复杂关系'),
            value: info.complexRelation,
          },
        ]
      : []

    this.objTypeChart.setOption(pieOpt(data))
  }

  drawTagChart = info => {
    const data = info.total
      ? [
          {
            name: intl
              .get('ide.src.page-overview.distribute.8tqgeh77op')
              .d('实体标签'),
            value: info.entityTagCount,
          },
          {
            name: intl
              .get('ide.src.page-overview.distribute.rvs314iz1x')
              .d('关系标签'),
            value: info.relationTagCount,
          },
        ]
      : []

    this.tagChart.setOption(pieOpt(data))
  }

  drawTagTypeChart = info => {
    const data = info.total
      ? [
          {
            name: intl
              .get(
                'ide.src.page-manage.page-common-tag.detail.main.vwwmvcib39m'
              )
              .d('基础标签'),
            value: info.basicTagCount,
          },
          {
            name: intl
              .get(
                'ide.src.page-manage.page-common-tag.detail.main.mfs279f7xcc'
              )
              .d('衍生标签'),
            value: info.derivativeTagCount,
          },
        ]
      : []

    this.tagTypeChart.setOption(pieOpt(data))
  }

  render() {
    const { objTypeChart, tagChart, tagTypeChart } = this.store

    return (
      <div>
        <Row gutter={16}>
          <Col span={8}>
            <div className="overview-rank mb16">
              <div className="overview-rank-header">
                {intl
                  .get('ide.src.page-overview.distribute.42pjjvwmv2r')
                  .d('对象类型分布')}
              </div>
              <div className="overview-rank-content">
                <div
                  style={{ height: '300px', width: '100%' }}
                  ref={ref => (this.objRef = ref)}
                />
                {!objTypeChart.total ? (
                  <div className="no-Data" style={{ height: '300px' }}>
                    <NoData
                      text={intl
                        .get(
                          'ide.src.business-component.tag-trend.tag-trend.o18ga4b3ils'
                        )
                        .d('暂无数据')}
                      size="small"
                    />
                  </div>
                ) : null}
              </div>
            </div>
          </Col>
          <Col span={8}>
            <div className="overview-rank mb16">
              <div className="overview-rank-header">
                {intl
                  .get('ide.src.page-overview.distribute.lwj2stvaomo')
                  .d('标签资产分布')}
              </div>
              <div className="overview-rank-content">
                <div
                  style={{ height: '300px', width: '100%' }}
                  ref={ref => (this.tagRef = ref)}
                />
                {!tagChart.total ? (
                  <div className="no-Data" style={{ height: '300px' }}>
                    <NoData
                      text={intl
                        .get(
                          'ide.src.business-component.tag-trend.tag-trend.o18ga4b3ils'
                        )
                        .d('暂无数据')}
                      size="small"
                    />
                  </div>
                ) : null}
              </div>
            </div>
          </Col>
          <Col span={8}>
            <div className="overview-rank mb16">
              <div className="overview-rank-header">
                {intl
                  .get('ide.src.page-overview.distribute.4j9ggxmudb4')
                  .d('标签类型分布')}
              </div>
              <div className="overview-rank-content">
                <div
                  style={{ height: '300px', width: '100%' }}
                  ref={ref => (this.tagTypeRef = ref)}
                />
                {!tagTypeChart.total ? (
                  <div className="no-Data" style={{ height: '300px' }}>
                    <NoData
                      text={intl
                        .get(
                          'ide.src.business-component.tag-trend.tag-trend.o18ga4b3ils'
                        )
                        .d('暂无数据')}
                      size="small"
                    />
                  </div>
                ) : null}
              </div>
            </div>
          </Col>
        </Row>
      </div>
    )
  }
}
export default Distribute
