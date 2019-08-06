import {Component} from 'react'
import {observable, action} from 'mobx'
import {observer} from 'mobx-react'
import {SearchForm} from './search-form'

import store from './store-scene-tags'

@observer
export default class Scene extends Component {
  searchForm = null

  render() {
    return (
      <div className="scene-tags p16">
        <SearchForm 
          ref={form => this.searchForm = form}
          onChange={() => {}}
          onSearch={() => {}}
          onReset={() => {}}
        />
        scene-tags
      </div>
    )
  }
}
