/**
 * @description 业务模型
 */
import * as d3 from 'd3'
import {Component} from 'react'
import {observer} from 'mobx-react'
import {toJS} from 'mobx'

import erClose from '../icon-svg/er-close.svg'
import erOpen from '../icon-svg/er-open.svg'
import erRelKey from '../icon-svg/er-rel-key.svg'
import erMajorKey from '../icon-svg/er-major-key.svg'

import './business-model.styl'

const option = {
  svgW: '100%',
  svgH: '100%',
  zoom_min: 0.5, // 缩小的比例
  zoom_max: 2, // 放大的比例

  colsHeight: 40, // 单元格高度
  colsWidth: 256, // 单元格
  offLine: 20, // 连线的节点偏移
  tableTitleHeight: 55, // 表头高度
  footerImgSrc: {
    open: erOpen,
    close: erClose,
  },
}


@observer
export default class BusinessModel extends Component {
  constructor(props) {
    super(props)
    this.store = props.bigStore
  }

  allTables
  allLinks
  addTablesData

  componentDidMount() {
    this.store.getBusinessModel(() => this.initSvg())
  }

  componentWillReceiveProps(next) {
    const {objId} = this.props
    if (!_.isEqual(objId, next.objId)) {
      this.store.getBusinessModel(() => this.initSvg())
    }
  }

  initSvg() {
    this.svg = d3.select('#box')
      .attr('width', option.svgW)
      .attr('height', option.svgH)
    this.svg.selectAll('#box g').remove()


    const {width: svgWidth, height: svgHeight} = this.svg.node().getBoundingClientRect()

    // 初始化 力导向图
    this.forceSimulation = d3.forceSimulation()
      .force('charge', d3.forceManyBody().strength(-100))// 电荷力
      .force('center', d3.forceCenter(svgWidth / 2, svgHeight / 2))
      .force('forceCollide', d3.forceCollide().radius(option.colsWidth / 2 + 50))// 检测碰撞
      .force('y', d3.forceY(() => 0))
      .force('link', d3.forceLink().id(d => d.id))// link


    // 用于放大，缩小的容器
    this.container = this.svg.append('g')

    const zoom = d3.zoom().on('zoom', () => {
      this.container.attr('transform', d3.event.transform)
    })


    this.svg.call(zoom)
    this.svg.call(zoom).on('wheel.zoom', null)

    this.container.append('g').attr('class', 'links')
    this.draw()
  }


  tick = () => { // force 迭代执行函数
    // eslint-disable-next-line no-unused-expressions
    this.allTables && this.allTables
      .attr('transform', d => `translate(${d.x},${d.y})`)
      .attr('cy', () => 0)
    // eslint-disable-next-line no-unused-expressions
    this.allLinks && this.allLinks.attr('points', this.linkFn)
  }

  draw() {
    const {obj, links} = this.store.businessModel
    this.obj = toJS(obj)
  
    console.log(this.obj)
    this.links = [
      // {
      //   source: 6435,
      //   target: 64356,
      //   relation: 'line1',
      //   sourceIndex: 0,
      //   targetIndex: 0,
      //   value: 1,
      // }, 
    // {
    //   source: `table${0}`,
    //   target: `table${2}`,
    //   relation: 'line1',
    //   sourceIndex: 1,
    //   targetIndex: 0,
    //   value: 1,
    // },
    ]

    this.forceInit(this.obj, this.links)
    this.addTables() 
    this.addLinks()
  }
  
  // 在nodes、links原对象上添加位置属性
  forceInit() { // 在nodes、links原对象上添加位置属性
    this.forceSimulation.nodes(this.obj)
      .on('tick', this.tick)
    this.forceSimulation.force('link')
      .links(this.links)
      .distance(d => d.value * option.colsWidth + 100)
  }

  // 添加表格
  addTables() {
    this.addTablesData = this.container.selectAll('.tbClass').data(this.obj)
      .enter()
      .append('g')
      .attr('class', 'tbClass')
      .attr('id', d => `${d.name}${d.id}`)
      .attr('transform', d => `translate(${d.x},${d.y})`)

    this.allTables = this.container.selectAll('.tbClass').data(this.obj)
    // 添加表头
    this.addTitle()
    this.addColsWrap()
    this.addFooter()
  }

  // 添加表头
  addTitle() {
    const tTitle = this.addTablesData.append('g')
      .attr('class', 'table-title')

    tTitle.append('rect')
      .attr('height', option.tableTitleHeight)
      .attr('width', option.colsWidth)
      .attr('fill', 'rgba(0, 0, 0, .06)')
      .style('cursor', 'pointer')

    tTitle.append('text')
      .text(d => d.name)
    // .attr('dx', () => colsWidth/2)
      .attr('dx', 48)
      .attr('dy', option.tableTitleHeight / 2)
      .attr('class', 'svg-text')
      .attr('text-anchor', 'middle')
      .attr('dominant-baseline', 'middle')
  }

  // 创建字段g
  addColsWrap() {
    this.addTablesData.append('g')
      .attr('class', 'table-cols')
      .attr('transform', `translate(${0}, ${option.tableTitleHeight})`)

    this.addColsGs()
  }

  addColsGs() {
    this.addColsGsData = this.addTablesData.select('.table-cols')
      .selectAll('g')
      .data(d => d.tag)
      .enter()
      .append('g')
      .attr('transform', (d, i) => `translate(${0},${i * option.colsHeight})`)
      .attr('id', d => `${d.name}${d.id}`)

    this.allColsGs = this.addTablesData.select('.table-cols')
      .selectAll('g')
      .data(d => d.tag)

    this.colsAdd()
  }

  // 添加字段信息
  colsAdd() {
    this.addColsGsData.append('rect')
      .attr('height', () => option.colsHeight)
      .attr('width', () => option.colsWidth)
      .attr('fill', '#fff')

    this.addColsGsData
      .append('foreignObject')
      .attr('dx', 10)
      .attr('width', 30)
      .attr('height', 30)
      .append('xhtml:div')
      .html(d => {
        if (d.configType === 2) return `<img src=${erMajorKey} class="major-key"/>` 
        return `<img src=${erRelKey} class="major-key"/>` 
      })


    this.addColsGsData.append('text')
      .attr('class', 'svg-text')
      .text(d => d.name)
      .attr('dx', 30)
      .attr('dy', option.colsHeight / 2)
      .attr('dominant-baseline', 'middle')
      .attr('rx', 5)
  }

  // 添加底部按钮
  addFooter() {
    this.addFooterData = this.addTablesData.append('g')
      .attr('class', 'table-foot')
      .append('foreignObject')
      .attr('width', option.colsWidth)
      .attr('height', 20)
      .append('xhtml:div')
      .html(`<div class="pull-down"><img src=${option.footerImgSrc.open} class="pull-down-click"/></div>`)
      .on('click', this.addCols)

    this.allFooter = this.allTables.selectAll('.table-foot')

    this.updateFoot()
  }

  // 添加底部按钮
  updateFoot(data) {
    this.allFooter = this.allTables.selectAll('.table-foot')
    this.allFooter.attr('transform', 
      d => `translate(${0},${option.tableTitleHeight + option.colsHeight * d.tag.length - 10})`)  

    if (data) {
      if (data.isAddCols) {
        this.allFooter
          .selectAll(`#${data.name}${data.id} .pull-down`)
          .html(`<img src=${option.footerImgSrc.close} class="pull-down-click" />`)
      } else {
        this.allFooter
          .selectAll(`#${data.name}${data.id} .pull-down`)
          .html(`<img src=${option.footerImgSrc.open} class="pull-down-click" />`)
      }
    }
  }

  // 添加连线
  addLinks() {
    this.addLinksData = d3.select('.links')
      .selectAll('polyline')
      .data(this.links)
      .enter()
      .append('polyline')
      .attr('fill', 'none')
      .attr('stroke', '#d9d9d9')
      .attr('stroke-width', 1)
      .attr('class', 'link-polyline')

    this.allLinks = d3.select('.links')
      .selectAll('polyline')
      .data(this.links)
  }

  // 左右连线计算
  linkFn(d) {
    const res = []
    if (d.source.x < d.target.x) {
      res[2] = [d.target.x - option.offLine, d.target.y]
      res[3] = [d.target.x, d.target.y]
      if ((d.source.x + option.colsWidth + option.offLine * 0) < d.target.x) {
        res[0] = [d.source.x + option.colsWidth, d.source.y]
        res[1] = [d.source.x + option.colsWidth + option.offLine, d.source.y]
      } else {
        res[0] = [d.source.x, d.source.y]
        res[1] = [d.source.x - option.offLine, d.source.y]
      }
    } else {
      res[1] = [d.source.x - option.offLine, d.source.y]

      res[0] = [d.source.x, d.source.y]
      if ((d.target.x + option.colsWidth + option.offLine * 0) < d.source.x) {
        res[3] = [d.target.x + option.colsWidth, d.target.y]
        res[2] = [d.target.x + option.colsWidth + option.offLine, d.target.y]
      } else {
        res[3] = [d.target.x, d.target.y]
        res[2] = [d.target.x - option.offLine, d.target.y]
      }
    }
    res[0][1] += d.sourceIndex * option.colsHeight + option.tableTitleHeight / 2 + option.colsHeight / 4
    res[1][1] += d.sourceIndex * option.colsHeight + option.tableTitleHeight / 2 + option.colsHeight / 4
    res[2][1] += d.targetIndex * option.colsHeight + option.tableTitleHeight / 2
    res[3][1] += d.targetIndex * option.colsHeight + option.tableTitleHeight / 2

    return res.map(v => v.join(',')).join(' ')
  }

   
  // 字段展开
  addExtColsGs = obj => {
    this.addColsGsData = d3.select(`#${obj.name}${obj.id}`).select('.table-cols')
      .selectAll('g')
      .data(d => d.tag)
      .enter()
      .append('g')
      .attr('transform', (d, i) => `translate(${0},${i * option.colsHeight})`)
      .attr('id', d => `${d.name}${d.id}`)
    this.colsAdd()
  }

  // 字段收起
  delColsGs() {
    this.allColsGs = this.allTables.select('.table-cols')
      .selectAll('g')
      .data(d => d.tag)
    this.allColsGs.exit().remove()
  }

  addCols = data => {
    const len = data.tag.length
    console.log(len)
    // const col = new Array(2).fill(1).map((v, i2) => ({
    //   id: `${data.id}cols${i2 + len}`,
    //   name: `${data.id}colsName${i2 + len}`,
    // }))

    // 展开
    if (data.isAddCols) {
      data.isAddCols = false
      data.footerSrc = option.footerImgSrc.open

      data.allCols = data.tag
      data.tag = data.linkCols
      this.delColsGs()
    } else {
      // 收起
      data.isAddCols = true
      data.footerSrc = option.footerImgSrc.close

      data.linkCols = data.tag.concat()
      data.tag = data.tag.concat([])
      this.addExtColsGs(data)
    }
    this.updateFoot(data)
  }

  render() {
    return (
      <div className="business-model">
        <svg id="box" />
      </div>
    )
  }
}
