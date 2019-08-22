import {Component, Fragment} from 'react'
import PropTypes from 'prop-types'
import {Button} from 'antd'

const {functionCodes} = window.__userConfig

class AuthBox extends Component {
  static propTypes = {
    code: PropTypes.string,
    isButton: PropTypes.bool,
  }

  static defaultProps = {
    code: '',
    isButton: true,
  }

  getAuth = () => {
    const {code} = this.props
    if (!code) {
      console.error('需配置权限code')
      return false
    }

    return functionCodes.includes(code)
  }

  renderContent = () => {
    const isAuth = this.getAuth()
    if (!isAuth) {
      return null
    }

    const {children, isButton, ...rest} = this.props

    if (isButton) {
      return <Button {...rest}>{children}</Button>
    }
    return children
  }

  render() {
    return (
      <Fragment>
        {this.renderContent()}
      </Fragment>
    )
  }
}

export default AuthBox
