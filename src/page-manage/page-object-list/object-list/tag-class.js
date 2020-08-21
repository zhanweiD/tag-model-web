/**
 * @description 对象列表 - 标签类目
 */
import {Component} from 'react'
import {Drawer, Button} from 'antd'
import {action} from 'mobx'
import {observer} from 'mobx-react'
import {DetailHeader, Authority} from '../../../component'
import {Time} from '../../../common/util'

import Tree from './tag-class-tree'
import List from './tag-class-list'
import ModalSelectTag from './modal-select-tag'

@observer
export default class TagClass extends Component {
  constructor(props) {
    super(props)
    this.store = props.store
  }

  // 关闭抽屉
 closeDrawer = () => {
   const {onClose} = this.props
   this.destory()
   onClose()
 }

 @action destory = () => {
   this.store.currentSelectKeys = undefined
   this.store.searchKey = undefined
   this.store.keyword = undefined
   this.store.defaultCate = {}
   this.store.categoryData.clear()
   this.store.treeData.clear()
   this.store.searchExpandedKeys.clear()

   this.store.tagList = {
     list: [],
     loading: false,
     currentPage: 1,
     pageSize: 10,
   }

   this.store.tagListModal = {
     list: [],
     loading: false,
     currentPage: 1,
     pageSize: 5,
   }
 }

 // 打开选择标签弹窗
 @action.bound openSelectTag() {
   this.store.modalSelectTagVisible = true
   this.store.keyword = undefined
   this.store.getTagList({
     cateId: this.store.defaultCate.id,
     currentPage: 1,
     pageSize: 5,
   }, 'modal')
 }

 render() {
   const {visible} = this.props
   const {cateDetail} = this.store

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
         <Tree store={this.store} />
         <div className="FB1 ml24 object-cate">
           <DetailHeader 
             name={cateDetail.name}
             descr={cateDetail.descr}
             actions={[
               cateDetail.name !== '默认类目' ? (
                 <Authority 
                   authCode="tag_model:move_tag[u]"
                 >
                   <Button type="primary" className="mr4" onClick={this.openSelectTag}>选择标签</Button>
                 </Authority>
               ) : null,
             ]}
             baseInfo={baseInfo}
           />
           <List store={this.store} cateId={this.store.currentSelectKeys} openSelectTag={this.openSelectTag} />
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
         <ModalSelectTag store={this.store} />
       </div>
     </Drawer>
     
   )
 }
}
