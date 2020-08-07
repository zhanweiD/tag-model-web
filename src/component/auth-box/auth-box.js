import {Children, cloneElement} from 'react'

/**
 * @Authority 权限校验的统一判断组件，支持现实隐藏，如果是显示但没权限的时候，props会注入disabled，class里也会添加disabled，click也会忽略掉
 * @param {Boolean} isHidden 是隐藏还是现实
 * @param {String} authCode 功能code
 * @param {Array} customCodes 是自定义的codes还是根据统一的codes去做判断
 * @example <Authority> <Button>xxx</Button></Authority>
 */

const Authority = ({children, isHidden = false, authCode, customCodes}) => {
  const {userProductFunctionCode = []} = window.frameinfo || {}
  const functionCodes = customCodes || userProductFunctionCode
  const isHaveAuth = functionCodes.includes(authCode)
  if (isHidden) {
    return isHaveAuth ? children : null
  }
  return Children.map(children, child => {
    const {className, onClick} = child.props
    return cloneElement(child, {
      ...child.props,
      onClick: isHaveAuth ? onClick : null,
      className: isHaveAuth ? className : `${className || ''} disabled`,
      disabled: !isHaveAuth,
    })
  })
}

export default Authority
