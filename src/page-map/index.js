import React from 'react'
import ReactDOM from 'react-dom'
import {Tabs} from 'antd'
// import {
//   HashRouter, Route, Switch,
// } from 'react-router-dom'

import Frame from '../frame'
import Overview from './overview'
import Search from './search'

import './main.styl'

const {TabPane} = Tabs

/** 
 * @description 标签地图页面
 * @author 三千
*/
export default class PageMap extends React.Component {
  render() {
    return (
      <Frame
        navList={[{
          text: '标签管理',
        }, {
          text: '标签地图',
        }, {
          text: '标签预览',
        }]}
      >
        <div className="page-map">
          <h2 className="fs16 fc0 mb16 ml16" style={{fontWeight: 'normal'}}>标签地图</h2>
          <Tabs animated={false} tabBarStyle={{paddingLeft: '16px'}}>
            <TabPane tab="标签概览" key="overview">
              <Overview />
            </TabPane>
            <TabPane tab="标签搜索" key="search">
              <Search />
            </TabPane>
          </Tabs>
        </div>
      </Frame>
    )
  }
}

ReactDOM.render(<PageMap />, document.getElementById('root'))
