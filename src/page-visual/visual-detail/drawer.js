
import {Component} from 'react'
import {Drawer, Button, Spin} from 'antd'
import {RuleIfBox, FixedValue} from '../component'

export default class DrawerConfig extends Component {
  render() {
    const {ruleInfo, drawerVisible, closeDrawer, loading, posInfoList} = this.props

    const drawerConfig = {
      width: 1120,
      title: '数据过滤规则查看',
      maskClosable: false,
      destroyOnClose: true,
      visible: drawerVisible,
      onClose: () => closeDrawer(),
    }


    return (
      <Drawer {...drawerConfig}>
        <Spin spinning={loading}>
          <div>
            <div className="condition-item-box">
              <h3>如果</h3>
              <RuleIfBox detail={posInfoList} type="detail" />
              <div>
                <h3>那么</h3>
                <FixedValue detail={ruleInfo.then} />
              </div>
            </div>
            <div className="condition-item-box">
              <h3>否则</h3>
              <FixedValue />
            </div>
          </div>
         
        </Spin>
        <div 
          style={{
            width: '100%',
            position: 'absolute',
            left: 0,
            bottom: 0,
            borderTop: '1px solid #e9e9e9',
            padding: '10px 16px',
            background: '#fff',
            textAlign: 'right',
          }}
        >
          <Button
            type="primary"
            onClick={() => closeDrawer()}
          >
            关闭
          </Button>
        </div>
      </Drawer>
    )
  }
}
