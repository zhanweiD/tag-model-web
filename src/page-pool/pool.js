import {Component} from 'react'
import {observer} from 'mobx-react'
import {
  HashRouter as Router, Route, Switch, Redirect,
} from 'react-router-dom'
import {Spin} from 'antd'
import cls from 'classnames'

import Frame from '../frame'
import io from './io'
import {navListMap} from '../common/constants'
import TaglPool from '../tag'
import TagImport from '../tag-import'
import TagExport from '../tag-export'
import NoObj from './no-obj'

// 仅测试用
async function sleep(delay = 2000) {
  await new Promise(resolve => {
    setTimeout(() => {
      resolve()
    }, delay)
  })
}

@observer
export default class TagRouter extends Component {
  constructor(props) {
    super(props)

    this.state = {
      loading: true, // 数据加载成功之前都是loading
      showNoObj: false, // 是否有对象
    }

    this.checkObjExist()
  }

  render() {
    const {loading, showNoObj} = this.state

    return (
      <Router>
        <Frame
          navList={[
            navListMap.assetMgt,
            navListMap.tagMgt, 
            {
              text: '标签池',
            },
          ]}
        >
          <div 
            className={cls({
              FBH: showNoObj,
              FBJC: showNoObj,
              FBAC: showNoObj,
            })}
            style={{
              minHeight: '100%',
              background: (!loading && showNoObj) ? '#F4F6F9' : '',
            }}
          >
            <Spin 
              spinning={loading} 
              tip="Loading"
              wrapperClassName="FB1"
            >
              {
                showNoObj ? <NoObj visible={!loading} onClick={() => this.hideNoObj()} />
                  : (
                    <Switch>
                      <Route exact strict path="/import" component={TagImport} />
                      <Route exact strict path="/export" component={TagExport} />
                      <Route exact strict path="/:type/:id" component={TaglPool} />
                      <Route exact strict path="/:type" component={TaglPool} />
                      <Redirect exact from="/" to="/1" />

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

  // 判断是否有对象
  async checkObjExist() {
    try {
      this.setState({
        loading: true,
      })
      const content = await io.checkObjExist()

      // await sleep()

      this.setState({
        loading: false,
        showNoObj: !content,
      })
    } catch (e) {
      this.setState({
        loading: false,
      })
    }
  }

  // 无对象引导状态点击某个按钮，跳到对应内容
  hideNoObj() {
    this.setState({
      showNoObj: false,
    })
  }
}
