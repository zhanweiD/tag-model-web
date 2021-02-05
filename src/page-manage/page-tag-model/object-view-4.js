/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import {Component, Fragment} from 'react'
import {observer} from 'mobx-react'
import {toJS, observable, action} from 'mobx'
import * as _ from 'lodash'
import * as d3Drag from 'd3-drag'
import * as d3Selection from 'd3-selection'
import erMajorKey from '../../icon/er-major-key.svg'
import erOpenRight from '../../icon/er-open-right.svg'
import ObjectViewDrawer from './object-view-drawer'
import './object-view-4.styl'

const {jsPlumb} = window

const MAIN_WIDTH = 10000
const MAIN_HEIGHT = 10000

@observer
export default class ObjectView extends Component {
  @observable mainNode = []
  @observable otherNode = []
  @observable WIDTH
  @observable HEIGHT
  @observable CONTAINER_WIDTH
  @observable CONTAINER_HEIGHT

  // 图表的缩放平移属性
  containerX = 0
  containerY = 0
  containerScale = 1

  myIns

  @observable drawerVis = false
  @observable drawerDatas = {
    name: '',
    tag: [],
    objTypeCode: 0,
  }

  constructor(props) {
    super(props)
    this.store = props.bigStore
  }

  componentDidMount() {
    this.WIDTH = this.model.offsetWidth 
    this.HEIGHT = this.model.offsetHeight
    this.CONTAINER_WIDTH = this.container.offsetWidth
    this.CONTAINER_HEIGHT = this.container.offsetHeight
    this.getData()
    
    this.d3Container = d3Selection.select(this.model)
    this.d3Container.call(d3Drag.drag().on('drag', this.dragged))

    this.containerX = -MAIN_WIDTH / 2
    this.containerY = -MAIN_HEIGHT / 2

    this.model.style.transform = `translate(${this.containerX}px, ${this.containerY}px)`
    this.model.style.transformOrigin = '1000px 1000px'
  }

  componentWillReceiveProps(next) {
    const {objId} = this.props
    if (+objId !== +next.objId) {
      if (this.myIns) {
        this.myIns.deleteEveryConnection()

        this.containerX = -MAIN_WIDTH / 2
        this.containerY = -MAIN_HEIGHT / 2

        this.model.style.transform = `translate(${this.containerX}px, ${this.containerY}px)`
      }

      this.mainNode = []
      this.otherNode = []
      this.getData()
    }
  }

  @action.bound dragged() {
    if (this.d3Container) {
      const {
        dx,
        dy,
      } = d3Selection.event

      this.containerX += dx
      this.containerY += dy
      this.d3Container.style(
        'transform',
        `translate(${this.containerX}px, ${this.containerY}px) scale(${this.containerScale})`
      )
    }
  }

  getData() {
    const t = this
    t.store.getBMRelation(
      res => {
        // TODO: 只会有一个吗？
        t.relObjId = res[0] && res[0].id

        // 获取节点和关系
        t.store.getBusinessModel(() => t.init(), {
          relationId: res[0] && res[0].id,
        })
      }
    )
  }

  init() {
    // 进行初始化
    // 重新处理一下数据
    const {objId} = this.props
    const {businessModel} = this.store
    const {links, obj} = businessModel

    // 图上只展示主键
    obj.forEach(item => {
      const isMajor = _.filter(item.tag, e => e.isMajor === 1)
      const isNotMajor = _.filter(item.tag, e => e.isMajor !== 1)

      item.mainKey = toJS(isMajor)
    })

    const mainNode = _.find(obj, item => String(item.id) === String(objId))

    // TODO: 关系是否有多个呢？
    const otherNode = _.filter(obj, item => String(item.id) !== String(objId))

    this.mainNode = [mainNode]
    this.otherNode = otherNode

    this.otherNode.forEach((item, index) => {
      if (index === 0) {
        item.left = this.WIDTH / 2 + this.CONTAINER_WIDTH / 2 - 200
        item.top = this.HEIGHT / 2 + 200 - 120
      }

      if (index === 1) {
        item.left = this.WIDTH / 2 + this.CONTAINER_WIDTH / 2 + 200
        item.top = this.HEIGHT / 2 + 200 - 120
      }

      if (index === 2) {
        item.left = this.WIDTH / 2 + this.CONTAINER_WIDTH / 2 - 200
        item.top = this.HEIGHT / 2 + 200 + 120
      }

      if (index === 3) {
        item.left = this.WIDTH / 2 + this.CONTAINER_WIDTH / 2 + 200
        item.top = this.HEIGHT / 2 + 200 + 120
      }
    })

    setTimeout(() => {
      this.drawLink()
    }, 100)
  }

  drawLink() {
    const {businessModel, objId} = this.store
    const {links, obj} = businessModel

    this.myIns = jsPlumb.getInstance()
    this.myIns.setContainer('parent')
    // 清除连线
    window.d3.selectAll('.jtk-connector').remove()

    links.forEach(item => {
      this.myIns.connect({
        source: `node-${item.source}`,
        target: `node-${item.target}`,
        endpoint: 'Blank',
        connector: ['Flowchart'],
        paintStyle: {stroke: '#c9cbd2', strokeWidth: 1},
        endpointStyle: {fill: '#c9cbd2'},
        anchor: ['Left', 'Right'],
        overlays: [
          ['Arrow', {width: 10, length: 10, location: 1}],
        ],
      })
    })
  }

  diamondDom() {
    return (
      <svg viewBox="0 0 100 100" preserveAspectRatio="none">
        <filter id="dropshadow" height="125%">
          <feGaussianBlur in="SourceAlpha" stdDeviation="1" />
          <feOffset dx="0" dy="0" result="offsetblur" />
          <feMerge>
            <feMergeNode />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <path d="M2,50 50,2 98,50 50,98z" className="outer" fill="#88b53d" />
      </svg>
    )
  }

  openClick(data) {
    // objTypeCode 是用来区分实体和关系的嘛
    this.drawerDatas = data
    this.drawerVis = true
  }

  render() {
    const {businessModel, objId} = this.store

    return (
      <div style={{height: '400px', overflow: 'hidden'}} ref={e => this.container = e}>
        <div 
          className="object-view-4" 
          id="parent" 
          ref={e => this.model = e}
        >
          <div>
            {
              this.mainNode.map(item => (
                <div className="main-node" style={{left: `${this.WIDTH / 2 + this.CONTAINER_WIDTH / 2}px`, top: `${this.HEIGHT / 2 + 200}px`}}>
                  <img 
                    src={erOpenRight} 
                    alt="main-node-open" 
                    className="main-node-open" 
                    onClick={() => this.openClick(item)}
                  />
                  <div className="main-title omit" title={item.name}>
                    {item.name}
                  </div>
                  {
                    item.mainKey.map(e => (
                      <div className="main-key">
                        <div className="omit" id={`node-${e.objId}`}>
                          <img 
                            className="ml8" 
                            src={erMajorKey} 
                            alt="major-key" 
                          />
                          <span className="omit" title={e.name}>{e.name}</span>
                        </div>
                      </div>
                    ))
                  }
                </div>
              ))
            }
            {
              this.otherNode.map(item => (
                <div className="other-node" style={{left: `${item.left}px`, top: `${item.top}px`}}>
                  <img 
                    src={erOpenRight} 
                    alt="other-node-open" 
                    className="other-node-open" 
                    onClick={() => this.openClick(item)}
                  />
                  <div className="diamond">
                    {this.diamondDom()}
                    <span className="omit" title={item.name}>{item.name}</span>
                  </div>
                  {
                    item.mainKey.map(e => (
                      <div className="other-key">
                        <div className="omit" id={`node-${e.id}`}>
                          <img 
                            className="ml8" 
                            src={erMajorKey} 
                            alt="major-key" 
                          />
                          <span className="omit" title={e.name}>{e.name}</span>
                        </div>
                      </div>
                    ))
                  }
                </div>
              ))
            }
          </div>
          <ObjectViewDrawer 
            datas={this.drawerDatas} 
            visible={this.drawerVis} 
            closeDrawer={() => this.drawerVis = false}
          />
        </div>
      </div>
    )
  }
}
