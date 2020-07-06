/**
 * @description 对象视图
 */
import * as d3 from 'd3'
import * as dagreD3 from 'dagre-d3'
import {Component} from 'react'
import {observer} from 'mobx-react'
import {Spin} from 'antd'

const chartOption = {
  svgW: '100%',
  svgH: '100%',
  zoom_min: 0.5, // 缩小的比例
  zoom_max: 2, // 放大的比例
}

@observer
export default class ObjectView extends Component {
  constructor(props) {
    super(props)
    this.store = props.store
  }

  componentDidMount() {
    this.store.getObjView(() => this.initSvg())
  }

  initSvg() {
    this.svg = d3.select('#box')
      .attr('width', chartOption.svgW)
      .attr('height', chartOption.svgH)
    this.svg.selectAll('#box g').remove()

    // 用于放大，缩小的容器
    this.container = this.svg.append('g')
    this.draw()
  }

  draw() {
    const t = this
    const {objView, typeCode, objId} = t.store

    const zoom = d3.zoom().on('zoom', () => {
      t.container.attr('transform', d3.event.transform)
    })

    this.svg.call(zoom).on('dblclick.zoom', null).on('wheel.zoom', null)

    const render = new dagreD3.render()

    // direction
    const dir = typeCode === '3' ? {rankdir: 'LR'} : {rankdir: 'TB'}

    // Create the input graph
    const g = new dagreD3.graphlib.Graph()
      .setGraph(dir)
      .setDefaultEdgeLabel(() => ({}))

    objView.nodes.forEach(node => {
      // 关系 - 菱形diamond
      if (node.nodeType === 3) {
        g.setNode(node.entityId, {
          label: node.entityName, 
          class: 'diamond', 
          shape: 'diamond',
        })
      }
      // 实体 - 矩形
      if (node.nodeType === 4) {
        if (+node.entityId === +objId) {
          g.setNode(node.entityId, {
            label: node.entityName, 
            class: 'subject', 
            shape: 'rect',
          })
        } else {
          g.setNode(node.entityId, {
            label: node.entityName, 
            class: 'normal', 
            shape: 'rect',
          })
        }
      }
    })

    // 画线
    if (typeCode === '4') {
      objView.links.forEach(link => {
        if (+link.v === +objId) {
          g.setEdge(link.u, link.v, {
            arrowhead: 'undirected',
          })
        } else {
          g.setEdge(link.v, link.u, {
            arrowhead: 'undirected',
          })
        } 
      })
    } else {
      objView.links.forEach((link, i) => {
        if (i === 0) {
          g.setEdge(link.v, link.u, {
            arrowhead: 'undirected',
          })
        } else {
          g.setEdge(link.u, link.v, {
            arrowhead: 'undirected',
          })
        }
      })
    }
   
    // 设置圆角
    g.nodes().forEach(v => {
      const node = g.node(v)
      // Round the corners of the nodes
      node.rx = 3
      node.ry = 3
    })

    // Set margins, if not present
    if (!Object.prototype.hasOwnProperty.call(g.graph(), 'marginx')
      && !Object.prototype.hasOwnProperty.call(g.graph(), 'marginy')) {
      g.graph().marginx = 20
      g.graph().marginy = 20
    }

    g.graph().transition = selection => selection.transition().duration(500)

    render(this.container, g)

    const {width: svgWidth, height: svgHeight} = this.svg.node().getBoundingClientRect()

    const initialScale = 1.2
    this.svg.call(
      zoom.transform, 
      d3.zoomIdentity.translate((svgWidth - g.graph().width * initialScale) / 2,
        (svgHeight - g.graph().height * initialScale) / 2).scale(initialScale)
    )
  }

  render() {
    const {objViewLoading} = this.store 
    return (
      <Spin spinning={objViewLoading}>
        <div className="object-view">
          <svg id="box" />
        </div>
      </Spin>
    )
  }
}
