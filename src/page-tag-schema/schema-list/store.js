import ListStore from './store-list'
import CodeStore from './store-code'
import DrawerStore from './store-drawer'

export default class StoreRoot {
  constructor() {
    this.listStore = new ListStore(this)
    this.codeStore = new CodeStore(this)
    this.drawerStore = new DrawerStore(this)
  }
}
