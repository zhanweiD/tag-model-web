import React from 'react'
import PropTypes from 'prop-types'
import {Empty, Button} from 'antd'
import {Link} from 'react-router-dom'

import emptyIcon from '../icon/noData.svg'
import manIcon from '../icon/hexagon-circle.svg'
import objectIcon from '../icon/hexagon-hexagon.svg'
import relationIcon from '../icon/hexagon-triangle.svg'

import './no-obj.styl'

export default class NoObj extends React.Component {
  static propTypes = {
    visible: PropTypes.bool,
    onClick: PropTypes.func, // 点击某个按钮的回调
  }

  render() {
    const {visible, onClick} = this.props

    const cardsData = [
      {
        title: '人',
        icon: manIcon,
        info: [
          '能发出主动行为的主体',
          '包括自然人或法人群体',
          '例如客户、加盟商、员工等与人相关的标签',
          '都可以归类到人这个对象',
        ],
        desc: [
          '在创建标签前，首先您需要在人中',
          '添加具体的对象',
        ],
        url: '/1', // 要跳转去的地址
      },
      {
        title: '物',
        icon: objectIcon,
        info: [
          '行为中被动作用的客体',
          '例如账户、卡片等与物相关的标签',
          '都可以归类到“物”这个对象',
        ],
        desc: [
          '在创建标签前，首先您需要在物中',
          '添加具体的对象',
        ],
        url: '/2',
      },
      {
        title: '关系',
        icon: relationIcon,
        info: [
          '某时某刻人物发生的某种行为关系',
          '例如浏览、推荐、购买、分析等与关系相关的标签',
          '都可以归类到“关系”这个对象',
        ],
        desc: [
          '在创建标签前，首先您需要在关系中',
          '添加具体的对象',
        ],
        url: '/3',
      },
    ]

    return (
      <div
        className="pool-no-obj"
        style={{
          visibility: visible ? 'visible' : 'hidden',
          background: '#F4F6F9',
        }}
      >
        <Empty
          image={emptyIcon}
          imageStyle={{
            height: 100,
          }}
          description={(
            <div className="fs12 mt12 black85 opacity65">
              还未新建任何对象，请参考以下3种对象的创建方式
            </div>
          )}
        />

        <div className="FBH FBJC">
          {
            cardsData.map(({
              title, icon, info, desc, url,
            }) => (
              <div className="pr no-obj-card">
                <div className="pr no-obj-card__title">
                  <img className="no-obj-card__title-icon" src={icon} alt={`对象-${title}`} />
                  <span className="no-obj-card__title-text">{title}</span>
                </div>

                <div className="fs12 black85 opacity65 no-obj-card__info">
                  {/* <p>能发出主动行为的主体</p>
                  <p>包括自然人或法人群体</p>
                  <p>例如客户、加盟商、员工等与人相关的标签</p>
                  <p>都可以归类到人这个对象</p> */}
                  {info.map(text => <p>{text}</p>)}
                </div>

                <div className="fs12 black85 opacity45 no-obj-card__desc">
                  {/* <p>在创建标签前，首先您需要在人中</p>
                  <p>添加具体的对象</p> */}
                  {desc.map(text => <p>{text}</p>)}
                </div>

                <Button 
                  className="no-obj-card__btn" 
                  type="primary"
                  onClick={() => onClick()}
                >
                  <Link to={url}>{`新建对象到${title}`}</Link>
                </Button>
              </div>
            ))
          }
        </div>
      </div>
    )
  }
}
