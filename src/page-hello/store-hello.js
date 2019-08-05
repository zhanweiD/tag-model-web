import {observable, action, runInAction} from 'mobx'
import {message} from 'antd'
import io from './io'

export default class HelloStore {
  @observable tableLoading = false
  @observable list = []
  @observable list2 = []
  @observable pagination = {
    pageSize: 10,
    currentPage: 1,
    count: 0,
  }

  @action async getList() {
    try {
      const res = await io.getContent({
        param: '1',
      })
      runInAction(() => {
        const data = [
          {
            key: 1,
            name: 'John Brown',
            age: 32,
            address: 'New York No. 1 Lake Park',
            description: 'My name is John Brown, I am 32 years old, living in New York No. 1 Lake Park.',
          },
          {
            key: 2,
            name: 'Jim Green',
            age: 42,
            address: 'London No. 1 Lake Park',
            description: 'My name is Jim Green, I am 42 years old, living in London No. 1 Lake Park.',
          },
          {
            key: 3,
            name: 'Joe Black',
            age: 32,
            address: 'Sidney No. 1 Lake Park',
            description: 'My name is Joe Black, I am 32 years old, living in Sidney No. 1 Lake Park.',
          },
        ]
        this.list.replace(data)
      })
    } catch (e) {
      message.error(e.message)
    }
  }


  @action async getList2(expanded, record) {
    if (!expanded) return false
    try {
      const res = await io.getContent({
        param: '22222',
      })
      runInAction(() => {
        const data = [
          {
            key: 1,
            name: 'John Brown',
            age: 32,
            address: 'New York No. 1 Lake Park',
            description: 'My name is John Brown, I am 32 years old, living in New York No. 1 Lake Park.',
          },
          {
            key: 2,
            name: 'Jim Green',
            age: 42,
            address: 'London No. 1 Lake Park',
            description: 'My name is Jim Green, I am 42 years old, living in London No. 1 Lake Park.',
          },
          {
            key: 3,
            name: 'Joe Black',
            age: 32,
            address: 'Sidney No. 1 Lake Park',
            description: 'My name is Joe Black, I am 32 years old, living in Sidney No. 1 Lake Park.',
          },
        ]
        this.list2.replace(data)
      })
    } catch (e) {
      console.log(e.message)
      message.error(e.message)
    }
  }
}
