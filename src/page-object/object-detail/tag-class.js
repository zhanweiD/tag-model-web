/**
 * @description 对象管理 - 标签类目
 */
import {Component} from 'react'
import {Drawer, Button} from 'antd'
import {action} from 'mobx'
import {observer} from 'mobx-react'
import {DetailHeader, AuthBox} from '../../component'
import {Time} from '../../common/util'

import Tree from './tag-class-tree'
import List from './tag-class-list'
import ModalSelectTag from './modal-select-tag'

import store from './store-tag-class'

@observer
export default class TagClass extends Component {
  constructor(props) {
    super(props)
    store.objId = props.objId
  }

  componentWillReceiveProps(next) {
    const {objId} = this.props
    if (!_.isEqual(objId, next.objId)) {
      store.objId = next.objId
    }
  }

  // 关闭抽屉
 closeDrawer = () => {
   const {onClose} = this.props
   this.destory()
   onClose()
 }

 @action destory = () => {
   store.currentSelectKeys = undefined
   store.defaultCate = {}
   store.categoryData.clear()
 }

 // 打开选择标签弹窗
 @action.bound openSelectTag() {
   store.modalSelectTagVisible = true
   store.keyword = undefined
   store.getTagList({
     cateId: store.defaultCate.id,
     currentPage: 1,
     pageSize: 5,
   }, 'modal')
 }

 render() {
   const {visible} = this.props
   const {cateDetail} = store

   const baseInfo = [{
     title: '创建者',
     value: cateDetail.creator,
   }, {
     title: '创建时间',
     value: <Time timestamp={cateDetail.createTime} />,
   }, {
     title: '上级类目',
     value: cateDetail.parentName,
   }]

   // 抽屉配置
   const drawerConfig = {
     title: '标签类目',
     visible,
     width: 1120,
     maskClosable: false,
     destroyOnClose: true,
     onClose: this.closeDrawer,
   }

   return (
     <Drawer
       {...drawerConfig}
     >
       <div className="FBH" style={{height: 'calc(100vh - 56px - 96px)'}}>
         <Tree store={store} />
         <div className="FB1 ml48">
           <DetailHeader 
             name={cateDetail.name}
             descr={cateDetail.descr}
             actions={[
               cateDetail.name !== '默认类目' ? (
                 <AuthBox 
                   code="asset_tag_tag_tag_select_move"
                   type="primary" 
                   className="mr4"
                   onClick={this.openSelectTag}
                 >
                选择标签
                 </AuthBox>
               ) : null,
             ]}
             baseInfo={baseInfo}
           />
           <List store={store} cateId={store.currentSelectKeys} openSelectTag={this.openSelectTag} />
         </div>
         <div
           style={{
             position: 'absolute',
             left: 0,
             bottom: 0,
             width: '100%',
             borderTop: '1px solid #e9e9e9',
             padding: '10px 16px',
             background: '#fff',
             textAlign: 'right',
           }}
         >
           <Button onClick={this.closeDrawer} type="primary">
              关闭
           </Button>
         </div>
         <ModalSelectTag store={store} />
       </div>
     </Drawer>
     
   )
 }
}
