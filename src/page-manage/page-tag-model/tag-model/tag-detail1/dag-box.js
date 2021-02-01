import intl from 'react-intl-universal'
import { Component } from 'react'
import { observer } from 'mobx-react'
import { observable } from 'mobx'
import {
  RedoOutlined,
  ZoomInOutlined,
  ZoomOutOutlined,
} from '@ant-design/icons'

import './dag-box.styl'

const d3 = window.d3 || {}
const dagreD3 = window.dagreD3 || {}

const fieldHoverInfo = [
  {
    label: intl
      .get('ide.src.business-component.tag-relate.dag-box.bhzleo4vj5g')
      .d('字段'),
    key: 'entityName',
  },
  {
    label: intl
      .get('ide.src.business-component.tag-relate.dag-box.co39wa8uxw5')
      .d('字段名称'),
    key: 'entityCnName',
  },
  {
    label: intl
      .get('ide.src.business-component.tag-relate.dag-box.xr0hezmhuj')
      .d('字段类型'),
    key: 'fieldType',
  },
  {
    label: intl
      .get('ide.src.business-component.tag-relate.dag-box.az1mmko8h38')
      .d('数据表名'),
    key: 'tableName',
  },
  {
    label: intl
      .get('ide.src.business-component.tag-relate.dag-box.9mzk7452ggp')
      .d('数据源'),
    key: 'storageName',
  },
]

const deriveTagHoverInfo = [
  {
    label: intl
      .get('ide.src.business-component.tag-relate.dag-box.xs30zaqk60p')
      .d('标签标识'),
    key: 'uniqueIdentification',
  },
  {
    label: intl
      .get('ide.src.business-component.tag-relate.dag-box.zfaw0a4v7jh')
      .d('数据类型'),
    key: 'fieldType',
  },
  {
    label: intl
      .get('ide.src.business-component.tag-relate.dag-box.tm23no7bl7g')
      .d('衍生方案'),
    key: 'derivativeSchemeName',
  },
]

@observer
class DagBox extends Component {
  @observable clickBoxData = {}
  @observable rigthClickBoxStyle = {
    display: 'none',
  }

  @observable hoverBoxData = {}
  @observable hoverBoxStyle = {
    display: 'none',
  }

  @observable rightClickAction = {}

  renderItem(label, value) {
    return (
      <div className="filed-item">
        <label htmlFor className="box-item-label">
          {`${label}：`}
        </label>
        <span className="ide-text-overflow value-box">{value || '-'}</span>
      </div>
    )
  }

  render() {
    const me = this
    const { props } = me
    const { hoverBoxData } = me

    return (
      <div id="dag_box" className="dag-box">
        <div className="dag-zoom">
          <span className="zoom-area">
            {props.refreshNodes ? (
              <span>
                <RedoOutlined
                  onClick={() => {
                    props.refreshNodes()
                  }}
                />
                <span className="hen">|</span>
              </span>
            ) : null}

            <ZoomInOutlined
              onClick={() => {
                me.zoomClick(1)
              }}
            />
            <span className="hen">|</span>
            <ZoomOutOutlined
              onClick={() => {
                me.zoomClick(-1)
              }}
            />
          </span>
        </div>
        <svg id="dag_svg" className="dag-svg" />
        <div style={me.hoverBoxStyle} className="hover-box">
          {this.renderHoverTips(hoverBoxData, hoverBoxData.nodeType)}
        </div>
        {props.infoBox ? props.infoBox : null}
      </div>
    )
  }

  componentDidMount() {
    const me = this
    d3.select('body').on('click', () => {
      const { target } = d3.event
      if (
        target.nodeName &&
        target.nodeName.toLocaleLowerCase() === 'li' &&
        target.className &&
        target.className.indexOf('noHide') > -1
      ) {
        // 特殊控制，不隐藏
        return
      }
      me.rigthClickBoxStyle = {
        display: 'none',
      }
    })
    // if (me.props.initData) {
    //   me.initDag(me.props.initData)
    // }
  }

  // 初始化d3图表
  initDag(data) {
    const me = this
    const dagObject = {}
    me.dagObject = dagObject
    const svg = d3.select('#dag_svg')
    dagObject.inner = svg.append('g')

    dagObject.g = new dagreD3.graphlib.Graph({ compound: true })
      .setGraph({
        rankdir: 'LR', // LR从左到右，TB从上到下
        ranksep: 50,
        nodesep: 50,
        transition: selection => selection.transition().duration(500),
      })
      .setDefaultEdgeLabel(() => ({}))

    dagObject.dagreD3render = new dagreD3.render()
    me.renderNode(data)

    dagObject.zoom = d3.behavior
      .zoom()
      .scaleExtent([0.5, 3])
      .on('zoom', me.zoomed.bind(me))
    svg.call(dagObject.zoom).on('dblclick.zoom', null)
    svg.call(dagObject.zoom).on('wheel.zoom', null)

    const { width } = svg[0][0].getBoundingClientRect()
    const { height } = svg[0][0].getBoundingClientRect()
    const initialScale = 1
    dagObject.zoom
      .translate([
        (width - dagObject.g.graph().width * initialScale) / 2,
        (height - dagObject.g.graph().height * initialScale) / 2,
      ])
      .scale(initialScale)
      .event(svg)

    // 取消默认右键样式
    // svg.on('contextmenu', () => {
    //   const ev = d3.event
    //   ev.preventDefault() && ev.stopPropagation()
    // })

    // me.bindClick()
    me.bindHoverEvent()
  }

  // 渲染d3-node节点
  renderNode(data) {
    const me = this
    const { dagObject } = this

    data.nodes.forEach(node => {
      const bgClass = ''
      const nodeId = node.entityId
      const label = `<div class="dag-divBox ${bgClass}" title="${node.entityName ||
        ''}">
        ${node.entityName || ''}
      <div>`

      dagObject.g.setNode(nodeId, {
        labelType: 'html',
        label,
        shape: 'rect',
        style: 'stroke: transparent;',
        width: 226,
        height: 40,
        labelObj: node,
      })
    })
    data.links.forEach(link => {
      // lineInterpolate: 'cardinal', 默认就比较好
      dagObject.g.setEdge(link.u, link.v, {
        lineTension: 0.1,
        // lineInterpolate: "monotone"
      })
    })

    dagObject.dagreD3render(dagObject.inner, dagObject.g)

    d3.selectAll('svg g.node').attr('class', id => {
      if (`${id}` === `${me.props.current}`) {
        return 'active node'
      }
      return 'node'
    })
  }

  // 渲染tips 提示框
  renderHoverTips(data, type) {
    const me = this
    let html = null
    switch (type) {
      case 0:
        html = fieldHoverInfo.map(({ label, key }) =>
          me.renderItem(label, data[key])
        )
        break
      case 1:
        html = me.renderItem(
          intl
            .get(
              'ide.src.page-manage.page-aim-source.source-detail.main.63kvhqd3cw8'
            )
            .d('标签名称'),
          data.entityName
        )
        break
      case 2:
        html = me.renderItem(
          intl
            .get('ide.src.business-component.tag-relate.dag-box.hbmtefgjkcm')
            .d('API名称'),
          data.entityName
        )
        break
      case 3:
        html = me.renderItem(
          intl
            .get('ide.src.business-component.tag-relate.dag-box.tz31zzfzmu')
            .d('应用名称'),
          data.entityName
        )
        break
      case 4:
        html = deriveTagHoverInfo.map(({ label, key }) =>
          me.renderItem(label, data[key])
        )
        break
      default:
        break
    }

    return <div className="hover-box-inner">{html}</div>
  }

  zoomed() {
    const me = this
    const { dagObject } = me
    const arr = []
    arr.push(dagObject.zoom.translate()[0])
    arr.push(dagObject.zoom.translate()[1])
    dagObject.inner.attr(
      'transform',
      `translate(${arr})scale(${dagObject.zoom.scale()})`
    )
  }

  // 点击放大缩小
  zoomClick(direction) {
    const me = this
    const { dagObject } = me
    const svg = d3.select('#dag_svg')
    const { width } = svg[0][0].getBoundingClientRect()
    const { height } = svg[0][0].getBoundingClientRect()
    const factor = 0.2
    let targetZoom = 0
    const center = [width / 2, height / 2]
    const extent = dagObject.zoom.scaleExtent()
    const translate = dagObject.zoom.translate()
    let translate0 = []
    let l = []
    const view = {
      x: translate[0],
      y: translate[1],
      k: dagObject.zoom.scale(),
    }

    targetZoom = dagObject.zoom.scale() * (1 + factor * direction)
    if (targetZoom < extent[0] || targetZoom > extent[1]) {
      return false
    }
    translate0 = [(center[0] - view.x) / view.k, (center[1] - view.y) / view.k]

    view.k = targetZoom
    l = [translate0[0] * view.k + view.x, translate0[1] * view.k + view.y]

    view.x += center[0] - l[0]
    view.y += center[1] - l[1]
    const interpolateZoom = (transl, scale) =>
      d3
        .transition()
        .duration(350)
        .tween('zoom', () => {
          const iTranslate = d3.interpolate(dagObject.zoom.translate(), transl)
          const iScale = d3.interpolate(dagObject.zoom.scale(), scale)
          return t => {
            dagObject.zoom.scale(iScale(t)).translate(iTranslate(t))
            me.zoomed()
          }
        })

    return interpolateZoom([view.x, view.y], view.k)
  }

  // 鼠标指向节点
  bindHoverEvent() {
    const me = this
    me.dagObject.inner.selectAll('g.node').on('mouseenter', function fun(d) {
      // const svg = d3.select('#dag_svg')[0][0].getBoundingClientRect()
      const scale = me.dagObject.zoom.scale()
      const height = 30 * scale
      const width = 226 * scale
      const container = document.getElementById('dag_box')
      const svgPosition = d3.mouse(container) // 这个是相对于dag_box的位置，xy的中心在左上角
      const rectPosition = d3.mouse(this) // 这个是相对于rect的位置，但是xy的中心在rect的中心，
      // 计算让hoverbox一直在rect的下方偏上显示，以便鼠标移动搭配hoverbox上
      const left = svgPosition[0] - (rectPosition[0] * scale + width / 2)
      const top =
        svgPosition[1] +
        (height - (rectPosition[1] * scale + height / 2)) +
        10 * scale

      me.hoverBoxData = me.dagObject.g.node(d).labelObj
      const renderTop = top
      me.hoverBoxStyle = {
        display: 'block',
        left: `${left}px`,
        top: `${renderTop}px`,
      }
    })
    me.dagObject.inner.selectAll('g.node').on('mouseleave', () => {
      if (
        d3.event.toElement &&
        d3.event.toElement.className === 'hover-box-inner'
      ) {
        return
      }
      me.hoverBoxStyle = {
        display: 'none',
      }
    })
    d3.selectAll('.hover-box-inner').on('mouseleave', () => {
      me.hoverBoxStyle = {
        display: 'none',
      }
    })
  }

  // 更新图
  drawDag = data => {
    const me = this
    if (!data.nodes) {
      return
    }

    if (!me.dagObject) {
      me.initDag(data)
      return
    }
    const { dagObject } = me
    dagObject.g.nodes().forEach(v => {
      dagObject.g.removeNode(v)
    })

    me.renderNode(data)

    me.bindHoverEvent()
  }

  removeDag() {
    const me = this
    const { dagObject } = me

    if (!dagObject) {
      return
    }

    const svg = d3.select('#dag_svg')
    svg.select('g').remove()
    me.dagObject = null
  }
}
export default DagBox
