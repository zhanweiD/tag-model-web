import {Component} from 'react'
import {observable, action} from 'mobx'
import {observer, inject, Provider} from 'mobx-react'


export default class Scene extends Component {
  render() {
    return (
      <div className="scene-wrap p16">
        scene
      </div>
    )
  }
}
