// See https://github.com/Jias/natty-storage for more details.
// 使用natty-storage作为缓存处理
import nattyStorage from 'natty-storage'

const storage = nattyStorage({
  type: 'localStorage', // 缓存方式, 默认为'localStorage'
  key: 'didp', // !!! 唯一必选的参数, 用于内部存储 !!!
  // tag: 'v1.0',          // 缓存的标记, 用于判断是否有效
  duration: 1000 * 3600 * 24 * 7, // 缓存的有效期长, 以毫秒数指定, 7天
  // until: 1464759086797    // 缓存的到期时间, 以具体日期时间的时间戳指定
})
export default storage
