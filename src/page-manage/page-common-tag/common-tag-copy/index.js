import {asyncComponent} from '../../../common/util'
import './main.styl'

export default asyncComponent(async () => {
  console.log(2)
  try {
    const module = await import('./main')
    console.log(2)
    return module.default
  } catch (error) {
    console.log(error)
  }
  return null
})
