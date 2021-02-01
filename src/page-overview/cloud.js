import intl from 'react-intl-universal'
/**
 * @description 对象云图
 */
import * as d3 from 'd3'
import cloud from 'd3-cloud'
import {Component} from 'react'
import {observer} from 'mobx-react'
import {Spin} from 'antd'
import {NoData} from '../component'

@observer
class Cloud extends Component {
  constructor(props) {
    super(props)
    this.store = props.store
  }

  componentDidMount() {
    this.store.getObjCloud((res, max) => {
      this.couldLayout(res, max)
    })
  }

  couldLayout(data = [], max) {
    this.box = d3.select('#box')
    this.box
      .style('transform', 'scale(0.3, 0.3)')
      .style('transition', 'all .3s linear')
    this.box.selectAll('*').remove()

    const scaleSize = data.length > 20 // 按比例设置字体大小
      ? d3
        .scaleLinear()
        .domain([0, max])
        .range([14, 20])
      : d3
        .scaleLinear()
        .domain([0, max])
        .range([14, 35])

    this.fill = d3.scaleOrdinal(d3.schemeCategory10) // 颜色比例尺
    this.layout = cloud() // 云图画布
      .size([parseFloat(this.box.style('width')), 450]) // 大小
      .words(data.map(d => ({text: d.objName, size: scaleSize(d.relCount)}))) // {单词，字号} words数组
      .padding(2) // 间距
      .spiral('archimedean') // 单词按螺线放置，防止重叠(生成xy偏移量，后需设置translate)
      .rotate(0) // 旋转0
      .font('Impact') 
      .fontSize(d => d.size) // 读取设置字号
      .on('end', d => this.draw(d))

    this.layout.start()
    this.box.style('transform', 'scale(1, 1)')
  }

  draw(data) {
    d3.select('#box')
      .append('svg')
      .attr('width', this.layout.size()[0])
      .attr('height', this.layout.size()[1])
      .append('g')
      .attr(
        'transform',
        `translate(${this.layout.size()[0] / 2},${this.layout.size()[1] / 2})`
      )
      .selectAll('text') // 根据数据自动添加对应text
      .data(data)
      .enter()
      .append('text')
      .style('font-size', d => `${d.size}px`)
      .style('font-family', 'Impact')
      .style('fill', (d, i) => this.fill(i))
      .attr('text-anchor', 'middle') // 文本字符串的中间位置即当前文本的初始位置
      .attr('transform', d => `translate(${[d.x, d.y]})rotate(${d.rotate})`)
      .text(d => d.text)
  }

  render() {
    const {cloudData = [], entityCount, relCount, loading} = this.store

    return (
      <div className="object-cloud">
        <div className="object-cloud-header">
          <span>
            {intl.get('ide.src.page-overview.cloud.8e89dfeyryv').d('对象云图')}
          </span>
          <div className="object-cloud-count">
            <span className="mr24">
              {intl.get('ide.src.page-overview.cloud.pygifm5t3ra').d('实体：')}

              {entityCount}
            </span>
            <span>
              {intl.get('ide.src.page-overview.cloud.p9lyn2gdup').d('关系：')}

              {relCount}
            </span>
          </div>
        </div>
        <Spin spinning={loading}>
          <div className="object-cloud-content">
            {!cloudData.length ? (
              <div className="no-Data" style={{height: '442px'}}>
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

            <div id="box" />
          </div>
        </Spin>
      </div>
    )
  }
}
export default Cloud
