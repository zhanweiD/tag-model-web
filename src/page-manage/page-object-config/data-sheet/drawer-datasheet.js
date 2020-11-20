/**
 * @description 对象配置数据表详情
 */
import {Component} from 'react'
import PropTypes from 'prop-types'
import {observer, inject} from 'mobx-react'
import {action, observable} from 'mobx'
import {Form} from '@ant-design/compatible'
import '@ant-design/compatible/assets/index.css'
import {Drawer, Input, Select, Button} from 'antd'
// import {ModalStotageDetail, OmitTooltip} from '../../../component'
// import {debounce, getNamePattern} from '../../../common/util'


const FormItem = Form.Item

const formItemLayout = {
  labelCol: {span: 5},
  wrapperCol: {span: 19},
}

@inject('bigStore')
@Form.create()
@observer
export default class DrawerDatasheet extends Component {
  static propTypes = {
    visible: PropTypes.bool.isRequired, // 是否显示
    // objId: PropTypes.number.isRequired, // 对象id
    // storageId: PropTypes.string.isRequired, // 数据源id
    // tableName: PropTypes.string.isRequired, // 数据表名
    onClose: PropTypes.func.isRequired, // 取消，关闭抽屉
  }
  constructor(props) {
    super(props)
    this.store = props.store
    this.bigStore = props.bigStore
    this.projectId = this.store.projectId
    this.objId = this.store.objId
    this.tableName = this.store.tableName
    this.storageId = this.store.storageId
    this.storageName = this.store.dataSourceList.storageName
    this.whereValue = this.whereValue
    this.entity1Key = this.entity1Key
    this.entity2Key = this.entity2Key
    console.log(props, 'dds')
  }

  @action.bound initData() {
    this.store.getList()
 
    // 关系
    // if (this.store.typeCode === '3') {
    //   resetFields(['entity1Key', 'entity2Key'])
    //   this.store.entity1Key = undefined
    //   this.store.entity2Key = undefined
    // }
  }

  componentWillMount() {
    this.initData()
  }

  closeDrawer = () => {
    const {onClose} = this.props
    onClose()
  }


  render() {
    const {
      visible,
      dataSourceList,
    } = this.props

    const {objDetail} = this.bigStore

    const entity1Name = objDetail.objRspList && objDetail.objRspList[0].name
    const entity2Name = objDetail.objRspList && objDetail.objRspList[1].name

    const drawerConfig = {
      title: '数据表信息',
      visible: {visible},
      closable: true,
      width: 560,
      maskClosable: false,
      destroyOnClose: true,
      onClose: this.closeDrawer,
      className: 'drawer-datasheet',
    }

    return (
      <Drawer
        {...drawerConfig}
      >
        <Form style={{paddingBottom: '50px'}} colon={false}>
          <FormItem {...formItemLayout} label="数据表">
            {this.tableName}
          </FormItem>

          <FormItem {...formItemLayout} label="数据源">
            {this.storageName}
          </FormItem>
          
          <FormItem {...formItemLayout} label="where条件">
            {this.whereValue}
          </FormItem>

          <h3 className="mb24 fs14">主标签配置</h3>

          <FormItem {...formItemLayout} label={`关联${entity1Name}绑定的字段`}>
            {this.entity1Key}
          </FormItem>

          <FormItem {...formItemLayout} label={`关联${entity2Name}绑定的字段`}>
            {this.entity2Key}
          </FormItem>
        </Form>
      </Drawer>
    )
  }
}
