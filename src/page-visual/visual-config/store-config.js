import {
  action, runInAction, observable, toJS,
} from 'mobx'
import {errorTip, successTip, failureTip, changeToOptions} from '../../common/util'
import io from './io'

class Store {
  projectId
  objId
  visualId

  @observable treeSearchKey

  //* ****************** 标签树 start ********************* //
  @observable currentTag
  @observable currentTagData = {}
  @observable tagTreeData = []
  @observable visibleTag = false // 创建衍生标签弹窗
  @observable confirmTagLoading = false // 创建衍生标签弹窗 确认按钮loading
  @observable canEditCondition = true

  // 添加标签
  @action async addTag(value, cb) {
    const data = {
      ...value,
    }
    if (!this.tagTreeData.length) {
      this.currentTag = value.tagId || value.id
    }

    if (this.tagTreeData.filter(d => d.canSubmit).length === this.tagTreeData.length) {
      data.canEdit = 1
    }

    this.tagTreeData.push(data)

    if (cb) {
      cb()
    }
  }

  // 创建标签
  @action async createTag(params, cb) {
    this.confirmTagLoading = true

    try {
      const res = await io.createTag({
        projectId: this.projectId,
        objId: this.objId,
        ...params,
      })
      runInAction(() => {
        if (res) {
          successTip('操作成功')
          if (cb) {
            cb()
          }

          const data = {
            tagId: res,
            ...params,
          }
          this.addTag(data)
        } else {
          failureTip('操作失败')
        }
      })
    } catch (e) {
      errorTip(e.message)
    } finally {
      this.confirmTagLoading = false
    }
  }

  @observable derivativeTagList = []
  @action async getDerivativeTagList(params) {
    try {
      const res = await io.getDerivativeTagList({
        projectId: this.projectId,
        ...params,
      })
      runInAction(() => {
        this.derivativeTagList = changeToOptions(res)('name', 'id')
      })
    } catch (e) {
      errorTip(e.message)
    }
  }

  @observable tagDetail = {}
  // 标签详情
  @action async getTagDetail(params) {
    try {
      const res = await io.getTagDetail(params)
      runInAction(() => {
        this.tagDetail = res
      })
    } catch (e) {
      errorTip(e.message)
    }
  }

  // 重名校验
  @action async checkTagName(params, cb) {
    try {
      const res = await io.checkTagName({
        projectId: this.projectId,
        objId: this.objId,
        ...params,
      })
      if (res.success) {
        cb('名称已存在')
      } else {
        cb()
      }
    } catch (e) {
      errorTip(e.message)
    }
  }
  //* ****************** 标签树 end ********************* //

  //* ****************** 设置数据过滤规则 start ********************* //
  @observable drawerRuleVisible = false
  relVisualExtRspList = {}
  configIdInfo = {}

  // 保存可视化条件表达式（条件页面）设置数据规则
  @action async saveVisualExt(data, cb) {
    try {
      let res

      if (this.configIdInfo[data.tagId || data.id]) {
        res = await io.updateVisualExt({
          projectId: this.projectId,
          derivativeSchemeId: this.visualId,
          ...data,
          id: +this.configIdInfo[data.tagId || data.id],
        })
      } else {
        res = await io.saveVisualExt({
          projectId: this.projectId,
          derivativeSchemeId: this.visualId,
          ...data,
        })
      }

      runInAction(() => {
        if (data.type) {
          if (cb) {
            cb(res)
          }
        } else {
          const tagTreeData = toJS(this.tagTreeData)
          this.canEditCondition = false
          for (let i = 0; i < tagTreeData.length; i += 1) {
            if (+tagTreeData[i].tagId === +this.currentTag) {
              tagTreeData[i].canEdit = 1
              tagTreeData[i].canSubmit = 1

              if (i + 1 < tagTreeData.length) {
                tagTreeData[i + 1].canEdit = 1
              }
            }
          }

          this.tagTreeData = tagTreeData
          this.relVisualExtRspList[+this.currentTag] = data
          console.log(this.relVisualExtRspList)
        }
      })
    } catch (e) {
      errorTip(e.message)
    }
  }

  // 更新可视化方案（第一个页面
  @action async updateBaseInfo() {
    console.log(this.visualId)
    try {
      const res = await io.updateBaseInfo({
        projectId: this.projectId,
        id: this.visualId,
        displayable: 1,
      })

      runInAction(() => {
        console.log(res)
      })
    } catch (e) {
      errorTip(e.message)
    }
  }

  @observable ruleList = []
  @action.bound clearAll() {
    this.ruleList.clear()
  }
  //* ****************** 设置数据过滤规则 end *********************** //
}

export default new Store()
