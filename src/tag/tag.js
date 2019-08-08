import {Component} from 'react'
import {observable, action} from 'mobx'
import {observer, inject, Provider} from 'mobx-react'
import {Tabs} from 'antd'
import {navListMap} from '../common/constants'
import TagStore from './store-tag'
import TagCategory, {TagCategoryStore} from '../tag-category'

const {TabPane} = Tabs

@inject('frameChange')
@observer
export default class Tag extends Component {
  constructor(props) {
    super(props)
    const {match: {params}} = this.props

    this.store = new TagStore(props)
    this.store.categoryStore = new TagCategoryStore(props)
    this.store.categoryStore.getCategoryList()

    this.store.typeCode = +params.type || 1
    this.store.id = +params.id || 999999999
  }

  componentWillMount() {
    const {frameChange} = this.props

    frameChange('nav', [
      navListMap.assetMgt,
      {text: '标签池'},
    ])
    // store.getContent()
  }

  @action onChangeTab(e) {
    const {history} = this.props
    this.store.typeCode = +e
    this.store.id = 999999999
    history.push(`/${e}`)
  }

  render() {
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
            <TagCategory updateKey={this.store.typeCode} />
            <div className="FB1 p16 mt16 ml16 mr16" style={{backgroundColor: '#fff'}}>
              ssss
            </div>
          </div>
        </Provider>
      </div>
    )
  }
}
