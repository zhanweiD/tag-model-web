import {Component} from 'react'
import {observable, action, toJS} from 'mobx'
import {observer, inject, Provider} from 'mobx-react'
import {Tabs} from 'antd'
import {navListMap} from '../common/constants'
import TagStore from './store-tag'
import TagCategory, {TagCategoryStore} from '../category-tag'
import TagDetail from '../tag-detail'
import ObjDetail from '../obj-detail'

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

    this.store.typeCode = +params.type || 1
    this.store.id = +params.id
  }

  componentWillMount() {
    const {frameChange} = this.props

    frameChange('nav', [
      navListMap.assetMgt,
      {text: '标签池'},
    ])
  }

  @action onChangeTab(e) {
    const {history} = this.props
    this.store.typeCode = +e
    history.push(`/${e}`)
  }

  render() {
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
          <TabPane tab="人" key="1" />
          <TabPane tab="物" key="2" />
          <TabPane tab="关系" key="3" />
        </Tabs>

        <Provider bigStore={this.store}>
          <div className="FBH tag-container">
            <TagCategory typeCode={this.store.typeCode} />
            <div className="FB1 mt16 ml16 mr16" style={{backgroundColor: '#fff'}}>
              {(() => {
                if (currentNode && currentNode.aId) {
                  if (currentNode.type === 2) return <ObjDetail aId={currentNode.aId} updateKey={this.store.updateKey} />
                  if (currentNode.type === 0) return <TagDetail aId={currentNode.aId} updateKey={this.store.updateKey} />
                }
              })()}
            </div>
          </div>
        </Provider>
      </div>
    )
  }
}
