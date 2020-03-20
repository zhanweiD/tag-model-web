/**
 * @description 业务视图
 */
import * as d3 from 'd3'
import {Component} from 'react'
import {observer} from 'mobx-react'
import {toJS, observable} from 'mobx'
import {Select} from 'antd'

import erClose from '../../icon-svg/er-close.svg'
import erOpen from '../../icon-svg/er-open.svg'
import erRelKey from '../../icon-svg/er-rel-key.svg'
import erMajorKey from '../../icon-svg/er-major-key.svg'

import './business-model.styl'

const {Option} = Select

const option = {
  svgW: '100%',
  svgH: '100%',
  zoom_min: 0.5, // 缩小的比例
  zoom_max: 2, // 放大的比例

  colsHeight: 40, // 单元格高度
  colsWidth: 256, // 单元格
  offLine: 50, // 连线的节点偏移
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
    this.store = props.store
  }

  @observable relObjId = undefined

  allTables
  allLinks
  addTablesData
  entitySelect

  componentDidMount() {
    this.getData()
  }

  getData() {
    const t = this
    if (t.store.typeCode === '4') {
      t.store.getBMRelation(
        res => {
          t.relObjId = res[0] && res[0].id

          t.store.getBusinessModel(() => t.initSvg(), {
            relationId: res[0] && res[0].id,
          })
        }
      )
    } else {
      t.store.getBusinessModel(() => t.initSvg())
    }
  }

  initSvg() {
    d3.select('#wrap').style('height', '570px')
    this.svg = d3.select('#box')
      .attr('width', option.svgW)
      .attr('height', option.svgH)
    this.svg.selectAll('#box g').remove()
    d3.select('#entity_select #entity_select_box').style('display', 'none')

    if (this.svg.node()) {
      const {width: svgWidth, height: svgHeight} = this.svg.node().getBoundingClientRect()

      // 初始化 力导向图
      this.forceSimulation = d3.forceSimulation()
        .force('charge', d3.forceManyBody().strength())// 电荷力
        .force('center', d3.forceCenter((svgWidth / 2) - option.colsWidth / 2, svgHeight / 2 - 100))
        .force('forceCollide', d3.forceCollide().radius(option.colsWidth / 2 + 50))// 检测碰撞
        .force('y', d3.forceY(() => 0))
        .force('link', d3.forceLink().id(d => d.id))// link
  
  
      // 用于放大，缩小的容器
      this.container = this.svg.append('g')
  
      const zoom = d3.zoom().on('zoom', () => {
        // this.container.attr('transform', d3.event.transform)
      })
  
      this.svg.call(zoom).on('dblclick.zoom', null).on('wheel.zoom', null)
  
      this.container.append('g').attr('class', 'links')
  
      this.draw()
    }
  }

  tick = () => { // force 迭代执行函数
    // eslint-disable-next-line no-unused-expressions
    if (this.allTables) {
      this.allTables
        .attr('transform', (d, i) => {
          if (this.entitySelect && i === 1) {
            this.entitySelect.style('top', `${d.y + 11}px`)
            this.entitySelect.style('left', `${d.x + 24}px`)
          }
          return `translate(${d.x},${d.y})`
        })
    }

    // eslint-disable-next-line no-unused-expressions
    this.allLinks && this.allLinks.attr('points', this.linkFn)
  }

  draw() {
    const {obj, links} = this.store.businessModel
    this.obj = toJS(obj)
    this.links = toJS(links)
    if (this.addTablesData) {
      this.allTables.exit().remove()
      this.allLinks.exit().remove()
      this.addTablesData.exit().remove()
    }
   
    this.forceInit(this.obj, this.links)
    this.addLinks()

    this.addTables() 
  }
  
  // 在nodes、links原对象上添加位置属性
  forceInit() { // 在nodes、links原对象上添加位置属性
    this.forceSimulation.nodes(this.obj)
      .force('y', d3.forceY(() => 0))
      .on('tick', this.tick)

    this.forceSimulation.force('link')
      .links(this.links)
      .id(d => d.id)
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

    // 添加表头 实体对象特殊处理 关联的关系表头为下拉框
    if (this.store.typeCode === '4') {
      this.addEntityTitle()
    } else {
      this.addTitle()
    }
  
    this.addColsWrap()
    this.gsAddBorder({
      type: 'init',
    })
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

    tTitle.append('foreignObject')
      .attr('dx', 48)
      .attr('dy', option.tableTitleHeight / 2)
      .attr('width', option.colsWidth)
      .attr('height', option.colsHeight)
      .append('xhtml:div')
      .html(d => `<p title="${d.name}"style="line-height: 50px;padding:0px 16px;">${d.name}</p>`)
  }

  // 当前选择对象是实体对象，关联多个关系对象，关系对象可下拉框选择
  addEntityTitle() {
    const {typeCode} = this.store

    const tTitle = this.addTablesData.append('g')
      .attr('class', 'table-title')

    const {obj} = this.store.businessModel

    if (obj.length > 1) {
      this.entitySelect = d3.select('#entity_select')
      d3.select('#entity_select #entity_select_box').style('display', 'block')
    }

   
    tTitle.append('rect')
      .attr('height', option.tableTitleHeight)
      .attr('width', option.colsWidth)
      .attr('fill', 'rgba(0, 0, 0, .06)')
      .style('cursor', 'pointer')
      .attr('class', 'entity-title')

    tTitle.append('foreignObject')
      .attr('dx', 48)
      .attr('dy', option.tableTitleHeight / 2)
      .attr('width', option.colsWidth)
      .attr('height', option.colsHeight)
      .append('xhtml:div')
      .html(d => `<p title="${d.name}"style="line-height: 50px;padding:0px 16px;">${+typeCode === 4 && d.objTypeCode === 3 ? '' : d.name}</p>`)
  }

  // 创建单元格g
  addColsWrap() {
    this.addTablesData.append('g')
      .attr('class', 'table-cols')
      .attr('transform', `translate(${0}, ${option.tableTitleHeight})`)

    this.addColsGs()
  }

  addColsGs() {
    this.addColsGsData = this.addTablesData.select('.table-cols')
      .selectAll('g')
      .data(d => {
        const marjorTag = d.tag.filter(i => i.configType === 2)
        return marjorTag
      })
      .enter()
      .append('g')
      .attr('transform', (d, i) => `translate(${0},${i * option.colsHeight})`)
      .attr('id', d => `${d.name}${d.id}`)

    this.allColsGs = this.addTablesData.select('.table-cols')
      .selectAll('g')
      .data(d => d.tag)

    this.colsAdd()
  }

  // 添加单元格信息
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
        if (d.isMajor === 1) return `<img src=${erMajorKey} class="major-key"/>` 
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
      .attr('height', 30)
      .append('xhtml:div')
      .html(`<div class="pull-down"><img src=${option.footerImgSrc.open} class="pull-down-click"/></div>`)
      .on('click', this.addCols)

    this.allFooter = this.allTables.selectAll('.table-foot')

    this.updateFoot({
      type: 'init',
    })
  }

  // 添加底部按钮
  updateFoot({data, type}) {
    this.allFooter = this.allTables.selectAll('.table-foot')

    if (type === 'init') {
      this.allFooter.attr('transform', 
        d => {
          const marjorTag = d.tag.filter(item => item.configType === 2)
          return `translate(${0},${option.tableTitleHeight + option.colsHeight * marjorTag.length - 15})`
        }) 
    }
    
    if (data) {
      if (data.isAddCols) {
        this.allFooter
          .selectAll(`#${data.name}${data.id} .pull-down`)
          .html(`<img src=${option.footerImgSrc.close} class="pull-down-click" />`)

        this.allTables.selectAll(`#${data.name}${data.id} .table-foot`).attr('transform',
          d => `translate(${0},${option.tableTitleHeight + option.colsHeight * d.tag.length - 15})`)
      } else {
        this.allFooter
          .selectAll(`#${data.name}${data.id} .pull-down`)
          .html(`<img src=${option.footerImgSrc.open} class="pull-down-click" />`)

        this.allTables.selectAll(`#${data.name}${data.id} .table-foot`).attr('transform',
          d => `translate(${0},${option.tableTitleHeight + option.colsHeight * d.tag.filter(item => item.configType === 2).length - 15})`)
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
    res[0][1] += d.sourceIndex * option.colsHeight + option.tableTitleHeight / 2 
    res[1][1] += d.sourceIndex * option.colsHeight + option.tableTitleHeight / 2
    res[2][1] += d.targetIndex * option.colsHeight + option.tableTitleHeight / 2 + option.colsHeight / 4
    res[3][1] += d.targetIndex * option.colsHeight + option.tableTitleHeight / 2 + option.colsHeight / 4
    
    return res.map(v => v.join(',')).join(' ')
  }

  // 单元格展开
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

  // 单元格收起
  delColsGs = obj => {
    this.allColsGs = this.allTables.select('.table-cols')
      .selectAll('g')
      .data(d => {
        if (d.id === obj.id) {
          return d.tag.filter(item => item.configType === 2)
        }
        return d.tag
      })
    this.allColsGs.exit().remove()
  }

  addCols = data => {
    // 收起
    if (data.isAddCols) {
      data.isAddCols = false
      data.footerSrc = option.footerImgSrc.open

      data.allCols = data.tag
      data.tag = data.linkCols
      this.delColsGs(data)
    } else {
      // 展开
      data.isAddCols = true
      data.footerSrc = option.footerImgSrc.close

      data.linkCols = data.tag.concat()
      // data.tag = data.tag.concat([]) 
      this.addExtColsGs(data)
    }
    this.updateFoot({
      data,
    })

    this.gsAddBorder({
      data,
    })
  }

  // 添加边框
  gsAddBorder({type, data}) {
    if (type === 'init') {
      this.addTablesData.append('rect').attr('class', 'table-border')
        .attr('height', d => option.colsHeight * d.tag.filter(item => item.configType === 2).length + option.tableTitleHeight)
        .attr('width', () => option.colsWidth)
        .attr('rx', 2)
        .attr('stroke', '#d9d9d9')
        .attr('stroke-width', '1px')
        .attr('fill-opacity', '0')
    }

    if (data) {
      if (data.isAddCols) {
        const height = option.colsHeight * data.tag.length + option.tableTitleHeight

        this.addTablesData.selectAll(`#${data.name}${data.id} .table-border`)
          .attr('height', height)
        
        if (height + 300 > 570) {
          d3.select('#wrap').style('height', `${height + 300}px`)
        }
      } else {
        this.addTablesData.selectAll(`#${data.name}${data.id} .table-border`)
          .attr('height', option.colsHeight * data.tag.filter(item => item.configType === 2).length + option.tableTitleHeight)
        
        d3.select('#wrap').style('height', '570px')
      }
    }
  }

  reDraw = () => {
    this.initSvg()
  }

  handleChange = value => {
    this.relObjId = value

    d3.select('#entity_select #entity_select_box').style('display', 'none')

    this.store.getBusinessModel(() => this.initSvg(), {
      relationId: value,
    })
  }

  render() {
    const {relList} = this.store

    return (
      <div className="business-model" id="wrap">
        <svg id="box" />
        <div id="entity_select" style={{position: 'absolute'}}>
          <div id="entity_select_box" style={{display: 'none'}}> 
            <Select value={this.relObjId} style={{width: 208}} onChange={this.handleChange}>
              {
                relList.map(d => <Option value={d.id}>{d.name}</Option>)
              }
            </Select>
          </div>
        </div>
      </div>
    )
  }
}
