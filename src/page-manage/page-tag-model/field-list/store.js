import intl from 'react-intl-universal'
import {observable, action, runInAction, toJS} from 'mobx'
import {
  successTip,
  failureTip,
  errorTip,
  changeToOptions,
  listToTree,
} from '../../../common/util'
import {ListContentStore} from '../../../component/list-content'
import io from './io'

class Store extends ListContentStore(io.getList) {
  projectId
  objId
  typeCode
  objType
  tagId

  @observable dataSourceList = [] // 数据源下拉数据
  @observable dataSheetList = [] // 数据表下拉数据
  @observable tableName
  @observable isNewTag = true 
  @observable tagList = []
  @observable tagDetail = {}

  @observable modalInfo = {
    visible: false,
    detail: {},
  }

  @observable isEnum = false
  @observable confirmLoading = false

  @observable tagTreeData = []

  // 获取衍生标签详情
  @action async getTagBaseDetail(cb) {
    try {
      const res = await io.getTagBaseDetail({
        id: this.tagId,
        projectId: this.projectId,
      })

      runInAction(() => {
        this.tagDetail = res
        this.isEnum = res.isEnum
        if (cb) cb()
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
        objId: +this.objId,
      })

      runInAction(() => {
        this.tagList = changeToOptions(toJS(res || []))('name', 'id')
      })
    } catch (e) {
      errorTip(e.message)
    }
  }

  /**
   * @description 移除字段列表
   */
  @action async removeList(params, cb) {
    try {
      await io.removeList({
        objId: this.objId,
        projectId: this.projectId,
        ...params,
      })

      runInAction(() => {
        successTip(
          intl
            .get(
              'ide.src.page-common.approval.pending-approval.store.voydztk7y5m'
            )
            .d('操作成功')
        )
        if (cb) cb()
      })
    } catch (e) {
      errorTip(e.message)
    }
  }

  /*
   * @description 取消配置
   */
  @action async revokeConfig(id) {
    try {
      const res = await io.revokeConfig({
        projectId: this.projectId,
        id,
      })

      runInAction(() => {
        this.getList()
      })
    } catch (e) {
      errorTip(e.message)
    }
  }

  /**
   * @description 数据源列表
   */
  @action async getDataSource() {
    try {
      const res = await io.getDataSource({
        objId: this.objId,
        projectId: this.projectId,
      })

      runInAction(() => {
        this.dataSourceList = changeToOptions(res)('storageName', 'storageId')
      })
    } catch (e) {
      errorTip(e.message)
    }
  }

  /**
   * @description 数据表列表
   */
  @action async getDataSheet(params) {
    try {
      const res = await io.getDataSheet({
        objId: this.objId,
        projectId: this.projectId,
        ...params,
      })

      runInAction(() => {
        this.dataSheetList = changeToOptions(res)('tableName', 'tableName')
      })
    } catch (e) {
      errorTip(e.message)
    }
  }

  /**
   * @description 获取标签类目树
   */
  @action async getTagTree() {
    try {
      const res = await io.getTagTree({
        id: this.objId,
        projectId: this.projectId,
      })

      runInAction(() => {
        this.tagTreeData = listToTree(res)
      })
    } catch (e) {
      errorTip(e.message)
    }
  }

  /**
   * @description 批量创建标签及标签字段关系
   */
  @action async createBatchTag(checkList, cb) {
    try {
      this.confirmLoading = true
      const res = await io.createBatchTag({
        checkList,
        projectId: this.projectId,
      })

      runInAction(() => {
        if (res) {
          successTip(
            intl
              .get(
                'ide.src.page-common.approval.pending-approval.store.voydztk7y5m'
              )
              .d('操作成功')
          )
          this.modalInfo.visible = false
          // 刷新字段列表
          this.getList({
            objId: this.objId,
            currentPage: 1,
          })
        } else {
          failureTip(
            intl
              .get(
                'ide.src.page-manage.page-aim-source.tag-config.store.82gceg0du65'
              )
              .d('操作失败')
          )
        }
        this.confirmLoading = false
        if (res && cb) cb()
      })
    } catch (e) {
      errorTip(e.message)
    }
  }

  @action async tagConfig(reqList, cb) {
    try {
      this.confirmLoading = true
      const res = await io.tagConfig({
        reqList,
        projectId: this.projectId,
      })

      runInAction(() => {
        if (res) {
          successTip(
            intl
              .get(
                'ide.src.page-common.approval.pending-approval.store.voydztk7y5m'
              )
              .d('操作成功')
          )
          this.modalInfo.visible = false
          // 刷新字段列表
          this.getList({
            objId: this.objId,
            currentPage: 1,
          })
        } else {
          failureTip(
            intl
              .get(
                'ide.src.page-manage.page-aim-source.tag-config.store.82gceg0du65'
              )
              .d('操作失败')
          )
        }
        this.confirmLoading = false
        if (res && cb) cb()
      })
    } catch (e) {
      errorTip(e.message)
    }
  }

  /**
   * @description 重名校验
   */
  @action async checkName(params, cb) {
    try {
      const res = await io.checkName({
        projectId: this.projectId,
        objId: this.objId,
        ...params,
      })

      runInAction(() => {
        if (res.success) {
          cb(
            intl
              .get(
                'ide.src.page-manage.page-aim-source.source-list.store.o07pkyecrw'
              )
              .d('名称已存在')
          )
        } else {
          cb()
        }
      })
    } catch (e) {
      errorTip(e.message)
    }
  }

  @observable nameKeyWord = []
  @action async checkKeyWord() {
    try {
      const res = await io.checkKeyWord({
        projectId: this.projectId,
      })

      runInAction(() => {
        this.nameKeyWord = res
      })
    } catch (e) {
      errorTip(e.message)
    }
  }

  @observable tagTypeList = []
  @action async getTagTypeList(data) {
    try {
      const res = await io.getTagTypeList({
        fieldType: data.dataFieldType,
        projectId: this.projectId,
      })

      runInAction(() => {
        this.tagTypeList = res
      })
    } catch (e) {
      errorTip(e.message)
    }
  }
}

export default new Store()
