/**
 * @description 初始化page组件操作
 */

import {Component} from 'react'
import PropTypes from 'prop-types'

export default PageComponent => {
  class WrappedComponent extends Component {
    // 设置context将route属性往下传
    getChildContext() {
      const {history, location, match} = this.props
      return {
        router: {
          history,
          location,
          match,
        },
      }
    }

    render() {
      return <PageComponent {...this.props} />
    }
  }

  WrappedComponent.childContextTypes = {
    router: PropTypes.instanceOf(Object),
  }

  return WrappedComponent
}
