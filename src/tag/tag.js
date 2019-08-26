import {Component} from 'react'
import {observable, action, toJS} from 'mobx'
import {observer, inject, Provider} from 'mobx-react'
import {Tabs} from 'antd'
import {navListMap} from '../common/constants'
import TagStore from './store-tag'
import TagCategory, {TagCategoryStore} from '../category-tag'
import TagDetail from '../tag-detail'
import ObjDetail from '../obj-detail'
import EmptyContent from './empty-content'

const {TabPane} = Tabs

@inject('frameChange')
@observer
export default class Tag extends Component {
  constructor(props) {
    super(props)
    const {match: {params}} = this.props

    this.store = new TagStore(props)
    this.store.categoryStore = new TagCategoryStore(props)
    // this.store.categoryStore.getCategoryList()

    this.store.getTypeCodes(() => {
      this.store.typeCode = +params.type || toJS(this.store.typeCodes)[0].objTypeCode
      this.store.id = +params.id
    })
  }

  componentWillMount() {
    const {frameChange} = this.props

    frameChange('nav', [
      navListMap.assetMgt,
      navListMap.tagMgt,
      {text: '标签池'},
    ])
  }

  @action onChangeTab(e) {
    // 防止点击过快，接口没返回时Tab已切换(tab高亮map到数据错乱)
    if (this.store.categoryStore.treeLoading) return false

    const {history} = this.props
    this.store.typeCode = +e
    this.store.id = undefined
    this.store.currentNode = undefined
    history.push(`/${e}`)
  }

  @action onClickBtn(activeType) {
    const {history} = this.props
    if (activeType === 'add') {
      // 获取关联的人/物
      if (this.store.typeCode === 3) {
        this.store.categoryStore.getRelObj()
      }
      this.store.categoryStore.currentTreeItemKey = 0
      this.store.categoryStore.eStatus.editObject = false
      this.store.categoryStore.modalVisible.editObject = true
    } else if (activeType === 'import') {
      history.push('/import')
    } else if (activeType === 'export') {
      history.push('/export')
    }
  }

  render() {
    const {typeCodes} = this.store
    const currentNode = toJS(this.store.currentNode)
    return (
      <div className="FBV" style={{minHeight: '100%'}}>
        <div className="fs16 mt16 ml16" style={{color: 'rgba(0, 0, 0, 0.85)'}}>
          标签池
        </div>
        <Tabs
          activeKey={`${this.store.typeCode}`}
          animated={false}
          onChange={e => this.onChangeTab(e)}
          className="pl4"
        >
          {typeCodes.map(item => <TabPane tab={item.objTypeName} key={item.objTypeCode} />)}
        </Tabs>

        <Provider bigStore={this.store}>
          <div className="FBH tag-container">
            <TagCategory typeCode={this.store.typeCode} />
            <div className="FB1 mt16 ml16 mr16" style={{backgroundColor: '#fff'}}>
              {(() => {
                if (currentNode && currentNode.aId) {
                  if (currentNode.type === 2) return <ObjDetail aId={currentNode.aId} updateKey={this.store.updateKey} />
                  if (currentNode.type === 0) return <TagDetail aId={currentNode.aId} updateKey={this.store.updateKey} />
                } else {
                  return <EmptyContent onClick={e => this.onClickBtn(e)} />
                }
              })()}
            </div>
          </div>
        </Provider>
      </div>
    )
  }
}
