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
export default class Cloud extends Component {
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
    this.box.style('transform', 'scale(0.3, 0.3)').style('transition', 'all .3s linear')
    this.box.selectAll('*').remove()

    const scaleSize = d3.scaleLinear().domain([0, max]).range([14, 40])

    this.fill = d3.scaleOrdinal(d3.schemeCategory10)
    this.layout = cloud()
      .size([parseFloat(this.box.style('width')), 450])
      .words(data.map(d => ({text: d.objName, size: scaleSize(d.relCount)})))
      .padding(2)
      .spiral('archimedean')
      .rotate(0)
      .font('Impact')
      .fontSize(d => d.size)
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
      .attr('transform', `translate(${this.layout.size()[0] / 2},${this.layout.size()[1] / 2})`)
      .selectAll('text')
      .data(data)
      .enter()
      .append('text')
      .style('font-size', d => `${d.size}px`)
      .style('font-family', 'Impact')
      .style('fill', (d, i) => this.fill(i))
      .attr('text-anchor', 'middle')
      .attr('transform', d => `translate(${[d.x, d.y]})rotate(${d.rotate})`)
      .text(d => d.text)
  }

  render() {
    const {
      cloudData = [], entityCount, relCount, loading,
    } = this.store

    return (
      <div className="object-cloud">
        <div className="object-cloud-header">
          <span>对象云图</span>
          <div className="object-cloud-count">
            <span className="mr24">
              实体：
              {entityCount}
            </span>
            <span>
              关系：
              {relCount}
            </span>
          </div>
        </div>
        <Spin spinning={loading}>
          <div className="object-cloud-content">

            {
              !cloudData.length
                ? (
                  <div className="no-Data" style={{height: '442px'}}>
                    <NoData text="暂无数据" size="small" />
                  </div>
                )
                : null
            }
            <div id="box" />

          </div>
        </Spin>
      </div>
    )
  }
}
