/**
 * @description 对象配置数据表详情
 */
import {Component, Fragment} from 'react'
import PropTypes from 'prop-types'
import {observer, inject} from 'mobx-react'
import {action, observable, toJS} from 'mobx'
import {Form} from '@ant-design/compatible'
import '@ant-design/compatible/assets/index.css'
import {Drawer, Input, Select, Button} from 'antd'
import {OmitTooltip} from '../../../component'
// import {debounce, getNamePattern} from '../../../common/util'


const FormItem = Form.Item

const formItemLayout = {
  labelCol: {span: 5},
  wrapperCol: {span: 19},
  colon: false,
}

// @inject('bigStore')
@Form.create()
@observer
export default class DrawerDatasheet extends Component {
  constructor(props) {
    super(props)
    this.store = props.store
    this.store.storageId = props.store.storageId
    this.store.tableName = props.store.tableName
    this.typeCode = this.store.typeCode
    // console.log(toJS(this.store.dataSheetDetail), 'dds')
  }

  @action.bound initData() {
    this.store.getDataSheetDetail()
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
    } = this.props

    // const mainKey = this.store.dataSheetDetail.mappingKeys && this.store.dataSheetDetail.mappingKeys.length === 1 ? this.store.dataSheetDetail.mappingKeys[0].field_name : undefined
    // const field1Name = this.store.dataSheetDetail.mappingKeys && this.store.dataSheetDetail.mappingKeys.length === 2 ? this.store.dataSheetDetail.mappingKeys[0].field_name : undefined
    // const field2Name = this.store.dataSheetDetail.mappingKeys && this.store.dataSheetDetail.mappingKeys.length === 2 ? this.store.dataSheetDetail.mappingKeys[1].field_name : undefined
    // const obj1Name = this.store.dataSheetDetail.mappingKeys && this.store.dataSheetDetail.mappingKeys.length === 2 ? this.store.dataSheetDetail.mappingKeys[0].obj_name : undefined
    // const obj2Name = this.store.dataSheetDetail.mappingKeys && this.store.dataSheetDetail.mappingKeys.length === 2 ? this.store.dataSheetDetail.mappingKeys[1].obj_name : undefined

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
            {<OmitTooltip text={this.store.tableName} maxWidth={300} className="rel-entity-name" />}
          </FormItem>

          <FormItem {...formItemLayout} label="数据源">
            {<OmitTooltip text={this.store.storageName} maxWidth={300} className="rel-entity-name" />}
          </FormItem>
          
          <FormItem {...formItemLayout} label="where条件">
            {<OmitTooltip text={this.store.dataSheetDetail.whereCondition || '-'} maxWidth={300} className="rel-entity-name" />}
          </FormItem>

          {
            +this.typeCode === 4 ? (
              <FormItem {...formItemLayout} label={<OmitTooltip text="主标签绑定的字段" maxWidth={100} className="rel-entity-name" />}>
                {this.store.dataSheetDetail.mappingKeys && this.store.dataSheetDetail.mappingKeys.length === 1 ? [this.store.dataSheetDetail.mappingKeys[0].field_name] : undefined}
              </FormItem>
            ) : <h3 className="mb24 fs14">主标签配置</h3>
          }
          {
            +this.typeCode === 3 ? (
              <Fragment>
                <FormItem 
                  {...formItemLayout} 
                  label={this.store.dataSheetDetail.mappingKeys && this.store.dataSheetDetail.mappingKeys.length === 2 ? this.store.dataSheetDetail.mappingKeys[0].obj_name : undefined} 
                >
                  {this.store.dataSheetDetail.mappingKeys && this.store.dataSheetDetail.mappingKeys.length === 2 ? this.store.dataSheetDetail.mappingKeys[0].field_name : undefined}
                </FormItem>
                <FormItem 
                  {...formItemLayout} 
                  label={this.store.dataSheetDetail.mappingKeys && this.store.dataSheetDetail.mappingKeys.length === 2 ? this.store.dataSheetDetail.mappingKeys[1].obj_name : undefined}
                >
                  {this.store.dataSheetDetail.mappingKeys && this.store.dataSheetDetail.mappingKeys.length === 2 ? this.store.dataSheetDetail.mappingKeys[1].field_name : undefined}
                </FormItem>
              </Fragment>
            ) : null
          }
        </Form>
      </Drawer>
    )
  }
}
