import {
  action, runInAction, observable, toJS,
} from 'mobx'
import {
  successTip, failureTip, errorTip, changeToOptions,
} from '../../common/util'
import {ListContentStore} from '../../component/list-content'
import io from './io'

export default class Store extends ListContentStore(io.getFieldList) {
  @observable configDrawerVisible = false // 配置抽屉显示
  @observable release = false // 是否已发布
  @observable isConfig = false // 是否已配置
  @observable isNewTag = true // 是否新建标签
  @observable tableLoading = false // 列表加载

  @observable configNum = 0 // 已配置个数
  @observable currentStep = 0 // 抽屉步骤条
  @observable projectId = 0 
  @observable status = -1 // 字段配置状态
  @observable dataFieldName = ' ' // 搜索字段名称

  @observable recordObj = {} // 点击的字段
  @observable saveList = [] // 暂时保存字段列表
  @observable tagList = [] // 衍生标签列表
  @observable cateList = [] // 类目列表
  
  // 获取字段分页列表
  // @action async getFieldList() {
  //   this.configNum = 0
  //   try {
  //     const res = await io.getFieldList({
  //       projectId: this.projectId,
  //       id: this.sourceId,
  //       status: this.status,
  //       dataFieldName: this.dataFieldName,
  //       currentPage: this.pagination.currentPage,
  //       pageSize: this.pagination.pageSize,
  //     })
  //     runInAction(() => {
  //       this.list = res.data || []
  //       this.saveList = this.list
  //       this.list.forEach(item => {
  //         if (item.status) this.configNum++
  //       })
  //     })
  //   } catch (e) {
  //     errorTip(e.message)
  //   }
  // }

  // 获取配置结果预览分页列表
  @action async getConfigList() {
    this.configNum = 0
    try {
      // const res = await io.getConfigList({
      //   projectId: this.projectId,
      //   id: this.sourceId,
      //   currentPage: this.pagination.currentPage,
      //   pageSize: this.pagination.pageSize,
      // })
      runInAction(() => {
        // this.list = res.data || []
        this.list = []
      })
    } catch (e) {
      errorTip(e.message)
    }
  }

  // 获取未配置衍生标签列表
  @action async getTagList() {
    try {
      const res = await io.getTagList({
        projectId: this.projectId,
      })
      runInAction(() => {
        this.tagList = changeToOptions(toJS(res || []))('objName', 'objId')
      })
    } catch (e) {
      errorTip(e.message)
    }
  }

  // 获取类目列表
  @action async getcateList() {
    try {
      const res = await io.getcateList({
        projectId: this.projectId,
      })
      runInAction(() => {
        this.tagList = changeToOptions(toJS(res || []))('objName', 'objId')
      })
    } catch (e) {
      errorTip(e.message)
    }
  }

  // 配置
  @action async configField() {
    try {
      const res = await io.configField({
        projectId: this.projectId,
      })
      runInAction(() => {
        this.isConfig = 1
      })
    } catch (e) {
      errorTip(e.message)
    }
  }

  // 取消配置
  @action async cancelConfig() {
    try {
      const res = await io.cancelConfig({
        projectId: this.projectId,
      })
      runInAction(() => {
        this.isConfig = 0
      })
    } catch (e) {
      errorTip(e.message)
    }
  }

  // 重命名校验
  @action async recheckName(name, callback) {
    // if (!this.isAdd) {
    //   callback()
    //   return
    // }
    try {
      // const res = await io.recheckName({
      //   projectId: this.projectId,
      //   objId: this.objId,
      //   name,
      // })
      // runInAction(() => {
      //   if (res.isExist) {
      //     callback('标签名称重复')
      //   } else {
      //     callback()
      //   }
      // })
    } catch (error) {
      errorTip(error)
    }
  }

  // 重命名校验
  @action async checkEnName(name, callback) {
    // if (!this.isAdd) {
    //   callback()
    //   return
    // }
    try {
      // const res = await io.checkEnName({
      //   projectId: this.projectId,
      //   objId: this.objId,
      //   name,
      // })
      // runInAction(() => {
      //   if (res.isExist) {
      //     callback('标识名称重复')
      //   } else {
      //     callback()
      //   }
      // })
    } catch (error) {
      errorTip(error)
    }
  }
}
