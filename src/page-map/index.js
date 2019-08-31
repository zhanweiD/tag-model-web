import React from 'react'
import ReactDOM from 'react-dom'
import {
  HashRouter as Router, Route, Switch, Redirect,
} from 'react-router-dom'
import {Spin} from 'antd'
import cls from 'classnames'
import Frame from '../frame'
import {navListMap} from '../common/constants'

import Map from './map'
import NoTag from './no-tag'
import io from './io'
import './main.styl'

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
      <Router>
      <Frame
        navList={[
          navListMap.assetMgt,
          navListMap.tagMgt, 
          {
            text: '标签地图',
          },
        ]}
      >
        <div
          className={cls({
            FBH: isNoTag || loading,
            FBJC: isNoTag || loading,
            FBAC: isNoTag || loading,
          })}
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
                  <Switch>
                    <Route exact strict path="/:type" render={props => <Map {...props} basicData={basicData} />} />
                    <Redirect exact from="/" to="/overview" />
                    <Route
                      render={() => {
                        window.location.href = '/404'
                      }}
                    />
                  </Switch>
                )
            }
          </Spin>
        </div>
      </Frame>
      </Router>
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
