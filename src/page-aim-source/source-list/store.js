import {
  action, runInAction, observable,
} from 'mobx'
import {successTip, errorTip} from '../../common/util'
import {ListContentStore} from '../../component/list-content'
import io from './io'

class Store extends ListContentStore(io.getList) {
  @observable list = [
    {
      tenantId: null,
      userId: null,
      id: 0,
      name: 111,
      objId: 7025450323959360,
      objName: '实体',
      dataStorageId: null,
      dataStorageType: null, // 不要理会
      storageName: null, // 数据源名称
      dataTableName: null,
      storageType: 'Hive', // 数据源类型
      tagUsedCount: 0, // 绑定标签数
      fieldTotalCount: 0, // 字段总数
      status: 1,
      ctime: 1585319828000,
    },
  ]

  @observable visible = false
  @observable drawerVisible = false
  @observable confirmLoading = false
  @observable drawerTagConfigInfo = {}

  @action.bound closeDrawer() {
    this.visible = false
  }

  // 标签配置Drawer
  @action.bound closeTagConfig() {
    this.drawerTagConfigInfo = {}
    this.drawerVisible = false
  }

  // 更新标签配置
  @action.bound updateTagConfig() {
    this.closeTagConfig()
    this.getList()
  }


  @action async delList(id) {
    try {
      await io.delList({id})
      runInAction(() => {
        successTip('删除成功')
        this.getList({currentPage: 1})
      })
    } catch (e) {
      errorTip(e.message)
    }
  }
}

export default new Store()
