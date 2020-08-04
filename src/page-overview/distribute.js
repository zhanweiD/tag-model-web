import {Component} from 'react'
import {observer} from 'mobx-react'
import {Row, Col, Empty} from 'antd'
import {pieOpt} from './util'

@observer
export default class Distribute extends Component {
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
    const data = [{
      name: '实体',
      value: info.entityRelation,
    }, {
      name: '简单关系',
      value: info.simpleRelation,
    }, {
      name: '复杂关系',
      value: info.entityRelation,
    }]
  
    this.objTypeChart.setOption(pieOpt(
      data
    ))
  }

  drawTagChart = info => {
    const data = [{
      name: '实体标签',
      value: info.entityTagCount,
    }, {
      name: '关系标签',
      value: info.relationTagCount,
    }]
  
    this.tagChart.setOption(pieOpt(
      data
    ))
  }

  drawTagTypeChart = info => {
    const data = [{
      name: '基础标签',
      value: info.basicTagCount,
    }, {
      name: '衍生关系',
      value: info.derivativeTagCount,
    }]

    this.tagTypeChart.setOption(pieOpt(
      data
    ))
  }


  render() {
    const {objTypeChart, tagChart, tagTypeChart} = this.store

    return (
      <div>
        <Row gutter={16}>
          <Col span={8}>
            <div className="overview-rank mb16">
              <div className="overview-rank-header">对象类型分布</div>
              <div className="overview-rank-content">
              <div style={{height: '300px', width: '100%'}} ref={ref => this.objRef = ref} />
                {
                  !objTypeChart.total
                    ? (
                      <div className="noData">
                        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
                      </div>
                    )
                    : null
                }
              </div>
            </div>
          </Col>
          <Col span={8}>
            <div className="overview-rank mb16">
              <div className="overview-rank-header">标签资产分布</div>
              <div className="overview-rank-content">
              <div style={{height: '300px', width: '100%'}} ref={ref => this.tagRef = ref} />
                {
                  !tagChart.total
                    ? (
                      <div className="noData">
                        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
                      </div>
                    )
                    : null
                }
              </div>
            </div>
          </Col>
          <Col span={8}>
            <div className="overview-rank mb16">
              <div className="overview-rank-header">标签类型分布</div>
              <div className="overview-rank-content">
              <div style={{height: '300px', width: '100%'}} ref={ref => this.tagTypeRef = ref} />
                {
                  !tagTypeChart.total
                    ? (
                      <div className="noData">
                        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
                      </div>
                    )
                    : null
                }
              </div>
            </div>
          </Col>
        </Row>
      </div>
    )
  }
}