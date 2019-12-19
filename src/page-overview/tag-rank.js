/**
 * @description 总览-标签排名  标签昨日调用次数TOP5 / 冷门标签TOP5 / 标签累计调用次数TOP5
 */
import * as d3 from 'd3'
import {Component} from 'react'
import {observer} from 'mobx-react'
import {Row, Col, Empty} from 'antd'

const chartOption = {
  svgW: '100%',
  svgH: 240,
  rectH: 8,
  rectDistance: 42, // 每个进度条的高度距离
  translateX: 4,
  // 动画延迟时间
  duration: 1400,
}

const countUnitMap = {
  Yday: '次',
  Unpopular: '天',
  All: '次',
}

@observer
export default class TagRank extends Component {
  constructor(props) {
    super(props)
    this.store = props.store
  }

  componentDidMount() {  
    this.initSvg()
    // type: Yday-标签昨日调用次数TOP5/ Unpopular-冷门标签TOP5 / All-标签累计调用次数TOP5
    this.store.getTagInvokeYday((res, max) => this.drawBulletChart(res, max, 'Yday'))
    this.store.getTagUnpopular((res, max) => this.drawBulletChart(res, max, 'Unpopular'))
    this.store.getTagInvokeAll((res, max) => this.drawBulletChart(res, max, 'All'))
  }

  initSvg() {
    this.svgBulletYday = d3.select('#bulletYday') 
      .attr('width', chartOption.svgW)
      .attr('height', chartOption.svgH)
    this.svgBulletYday.selectAll('*').remove()
    
    this.svgBulletUnpopular = d3.select('#bulletUnpopular')
      .attr('width', chartOption.svgW)
      .attr('height', chartOption.svgH)
    this.svgBulletUnpopular.selectAll('*').remove()
    
    this.svgBulletAll = d3.select('#bulletAll')
      .attr('width', chartOption.svgW)
      .attr('height', chartOption.svgH)
    this.svgBulletAll.selectAll('*').remove()
  }

  // 绘制子弹图
  drawBulletChart(d, max, type) {
    const {
      rectH, rectDistance, duration,
    } = chartOption

    const scaleX = d3.scaleLinear().domain([0, max]).range([0, 100])

    // 绘制底部背景
    const boxBg = this[`svgBullet${type}`].append('g')

    boxBg
      .selectAll('rect')
      .data(d)
      .enter()
      .append('rect')
      .attr('y', (d, i) => rectDistance * (i + 1) + rectH)
      .attr('width', '100%')
      .attr('height', rectH)
      .attr('fill', 'rgba(0, 0, 0, 0.03)')


    const box = this[`svgBullet${type}`].append('g')

    // 绘制实际值进度条
    box
      .selectAll('rect')
      .data(d)
      .enter()
      .append('rect')
      .attr('width', 0)
      .attr('height', rectH)
      .attr('y', (d, i) => rectDistance * (i + 1) + rectH)
      .attr('fill', '#7EBDFF')
      .transition()
      .duration(duration)
      .attr('width', w => `${scaleX(w.count)}%`)

    // 绘制 对象名称 + 标签名称
    const boxName = this[`svgBullet${type}`].append('g')

    boxName
      .selectAll('text')
      .data(d)
      .enter()
      .append('text')
      .attr('y', (d, i) => rectDistance * i + rectH + 36)
      .text(d => `${d.objName}—${d.tagName}`)
      .attr('fill', 'rgba(0,0,0, 0.45)')

    
    // 绘制 数量
    const boxCount = this[`svgBullet${type}`].append('g').attr('id', `boxCount${type}`)

    boxCount
      .selectAll('text')
      .data(d)
      .enter()
      .append('text')
      .attr('text-anchor', 'start')
      .attr('x', '100%')
      .attr('y', (d, i) => rectDistance * i + rectH + 36)
      .text(d => `${d.count}${countUnitMap[type]}`)
      .attr('fill', 'rgba(0,0,0, 0.45)')

    const boxCountW = document.getElementById(`boxCount${type}`).getBBox()

    boxCount.attr('transform', `translate(${-boxCountW.width}, 0)`)
  }

  render() {
    const {tagInvokeYday, tagUnpopular, tagInvokeAll} = this.store
    return (
      <div>
        <Row gutter={16}>
          <Col span={8}>
            <div className="overview-rank">
              <div className="overview-rank-header">昨日标签调用次数 TOP5</div>
              <div className="overview-rank-content">
                <svg id="bulletYday" />
                {
                  !tagInvokeYday.length  
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
            <div className="overview-rank">
              <div className="overview-rank-header">冷门标签 TOP5</div>
              <div className="overview-rank-content">
                <svg id="bulletUnpopular" />  
                {
                  !tagUnpopular.length  
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
            <div className="overview-rank">
              <div className="overview-rank-header">标签累计调用次数 TOP5</div>
              <div className="overview-rank-content">
                <svg id="bulletAll" />
                {
                  !tagInvokeAll.length  
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
