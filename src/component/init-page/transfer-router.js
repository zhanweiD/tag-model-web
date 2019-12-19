/**
 * @description 让传入放入组件获得路由参数和方法
 */
import {Component} from 'react'
import PropTypes from 'prop-types'

export default PageComponent => {
  class WrappedComponent extends Component {
    render() {
      const {router} = this.context
      return <PageComponent router={router} {...this.props} />
    }
  }

  WrappedComponent.contextTypes = {
    router: PropTypes.instanceOf(Object),
  }

  return WrappedComponent
}
