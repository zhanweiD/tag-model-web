import React from 'react'
import ReactDOM from 'react-dom'
import {Tabs, Spin} from 'antd'
import Frame from '../frame'
import {navListMap} from '../common/constants'

import Overview from './overview'
import Search from './search'
import NoTag from './no-tag'

import io from './io'

import './main.styl'

const {TabPane} = Tabs

// 仅测试用
async function sleep(delay = 2000) {
  await new Promise(resolve => {
    setTimeout(() => {
      resolve()
    }, delay)
  })
}

/** 
 * @description 标签地图页面
 * @author 三千
*/
export default class PageMap extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      loading: true, // 数据加载成功之前都是loading
      basicData: {}, // 卡片数据
    }

    this.checkTagExist()
  }

  render() {
    const {loading, basicData} = this.state
    const isNoTag = !basicData.tagCount

    return (
      <Frame
        navList={[
          navListMap.tagMgt, 
          {
            text: '标签地图',
          },
        ]}
      >
        <div 
          className="FBH FBJC FBAC" 
          style={{
            minHeight: '100%',
            background: (!loading && isNoTag) ? '#F4F6F9' : '',
          }}
        >
          <Spin 
            spinning={loading} 
            tip="Loading"
            wrapperClassName="FB1"
          >
            {
              isNoTag ? <NoTag visible={!loading} />
                : (
                  <div className="page-map">
                    <h2 className="fs16 fc0 mb16 ml16" style={{fontWeight: 'normal'}}>标签地图</h2>
                    <Tabs animated={false} tabBarStyle={{paddingLeft: '16px'}}>
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
          </Spin>
        </div>
      </Frame>
    )
  }

  // 判断是否有标签
  async checkTagExist() {
    try {
      this.setState({
        loading: true,
      })
      const res = await io.getBasicData()

      this.setState({
        loading: false,
        basicData: res || {},
      })
    } catch (e) {
      this.setState({
        loading: false,
      })
    }
  }
}

ReactDOM.render(<PageMap />, document.getElementById('root'))
