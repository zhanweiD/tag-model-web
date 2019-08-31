import React from 'react'
import ReactDOM from 'react-dom'
import {Tabs} from 'antd'
import Overview from './overview'
import Search from './search'

const {TabPane} = Tabs

/** 
 * @description 标签地图页面
 * @author 三千
*/
export default class Map extends React.Component {
  constructor(props) {
    super(props)

    const {match: {params}} = this.props
    this.state = {
      activeKey: params.type || 'overview',
    }
  }

  onChangeTab(e) {
    const {history} = this.props
    this.setState({
      activeKey: e,
    })
    history.push(`/${e}`)
  }

  render() {
    const {activeKey} = this.state
    const {basicData} = this.props

    return (
      <div className="page-map FBV">
        <h2 className="fs16 fc0 mb16 ml16" style={{fontWeight: 'normal'}}>标签地图</h2>
        <Tabs
          animated={false}
          tabBarStyle={{paddingLeft: '16px'}}
          activeKey={activeKey}
          onChange={e => this.onChangeTab(e)}
        >
          <TabPane tab="标签概览" key="overview">
            <Overview basicData={basicData} />
          </TabPane>
          <TabPane tab="标签搜索" key="search">
            <Search />
          </TabPane>
        </Tabs>
      </div>
    )
  }
}
