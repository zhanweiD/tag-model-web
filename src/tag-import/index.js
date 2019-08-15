import {asyncComponent} from '../common/util'
import './tag-import.styl'

export default asyncComponent(async () => {
  try {
    const module = await import('./tag-import')
    return module.default
  } catch (error) {
    console.log(error)
  }
  return null
})
