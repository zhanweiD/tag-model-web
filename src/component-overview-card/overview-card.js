import React from 'react'
import PropTypes from 'prop-types'
import {Tooltip, Icon} from 'antd'
import cls from 'classnames'

/**
 * @description 标签概览的信息卡片组件，包含标题、问号icon的tooltip、数值、底部附加描述
 * @author 三千
 * @date 2019-08-07
 * @export
 * @class OverviewCard
 * @extends {React.Component}
 */
export default class OverviewCard extends React.Component {
  static defaultProps = {
    tooltipText: null,
    valueTexts: null,
    fontStyle: {
      color: 'rgba(0, 0, 0, 0.65)',
      // size: 12, // 整体的字体大小，先不给设置，直接继承父类好了
      active: {
        color: '#0078FF',
        size: 30, // 仅仅用于高亮的数值
      },
    },
    className: '',
  }

  static propTypes = {
    title: PropTypes.string.isRequired, // 标题
    tooltipText: PropTypes.string, // 提示文本
    values: PropTypes.arrayOf(
      PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.string,
      ])
    ).isRequired, // 值数组，至少1个，可以是数值或字符串；展示时会高亮第一个
    valueTexts: PropTypes.arrayOf(PropTypes.string), // 对值做解释的文本，如果有，那么应该和values一一对应
    fontStyle: PropTypes.object, // 字体相关样式，（没做细化校验了）
    className: PropTypes.string, // 卡片的类
  }


  render() {
    const {
      title, tooltipText, values, valueTexts, fontStyle: {color, active}, className,
    } = this.props

    return (
      <div className={cls('overview-card', className)} style={{color: color || 'inherit'}}>
        <div>
          {/* ml4 对齐微调 */}
          <span className="ml4">
            {title}
            {
              tooltipText ? (
                <Tooltip title={tooltipText}>
                  <Icon type="question-circle" className="ml4" />
                </Tooltip>
              ) : null
            }
          </span>
        </div>
        <div>
          {
            values.map((value, index) => (
              index === 0
                ? (<span style={{color: active.color || '#0078FF', fontSize: active.size || 30}}>{value}</span>)
                : (<span style={{fontSize: 16}}>{`/${value}`}</span>)
            ))
          }
        </div>
        {
          valueTexts && valueTexts.length > 0 && (
            <div>
              {
                valueTexts.map((text, index) => (
                  index === 0
                    ? (<span style={{color: active.color || '#0078FF'}}>{text}</span>)
                    : (<span>{` / ${text}`}</span>)
                ))
              }
            </div>
          )
        }
      </div>
    )
  }
}
