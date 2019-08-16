const path = require('path')
const pkg = require('./package.json')

const env = require(process.env.ONER_SERVER_ENV === 'development' ? '../@dtwave/oner-server/common/env' : '@dtwave/oner-server/common/env')
const plugins = require('./server')

const {nattyStorage} = env
const {SERVER_ENV} = env

let config = {
  apps: {},
}
try {
  config = require(process.env.CONFIG_PATH || '/opt/conf/front/config.json')
} catch (e) {
  // console.error('/opt/conf/front/config.json  配置文件不存在')
}
const appConfig = config.apps[pkg.name] || {}

module.exports = {
  client: {
    // 项目名称 影响生产环境的cdn地址
    name: `platform/${pkg.name}`,

    // 项目版本号 影响生产环境的cdn地址
    version: pkg.version,

    // 前端监听静态资源服务的端口号
    port: 3003,

    // 是否的单页面项目
    spa: false,

    // 是否开启静态服务，针对私有化部署
    privateCdn: nattyStorage.env(SERVER_ENV, {
      default: true,
    }),
    
    // 页面配置
    page: {
      title: '数据资产管理中心',
      css: ['common.css'],
      js: [
        'common.js',
        '//cdn.dtwave.com/public/babel-polyfill/6.23.0/polyfill.min.js',
        '//cdn.dtwave.com/public/react/16.7.0/react.min.js',
        '//cdn.dtwave.com/public/react-dom/16.7.0/react-dom.min.js',
        '//cdn.dtwave.com/public/mobx/3.1.9/mobx.umd.min.js',
        '//cdn.dtwave.com/public/mobx-react/4.1.8/mobx-react.min.js',
        '//cdn.dtwave.com/public/react-router-dom/4.3.1/react-router-dom.js',
        '//cdn.dtwave.com/public/moment/2.18.1/moment.min.js',
        '//cdn.dtwave.com/public/antd/3.18.2/antd.min.js',
        '//cdn.dtwave.com/public/lodash/4.17.4/lodash.min.js',
      ],
      // 场景
      scene: {
        js: [
          '//cdn.dtwave.com/public/echarts/4.2.0/echarts.min.js',
        ],
      },
      // 标签池
      pool: {
        js: [
          '//cdn.dtwave.com/public/echarts/4.2.0/echarts.min.js',
          '//cdn.dtwave.com/public/ide/d3.v3.js',
          '//cdn.dtwave.com/public/ide/data-manage-dagre.js',
        ],
      },
      njkPath: path.join(__dirname, 'template.njk'),
      commonPage: {
        js: [
          '//cdn.dtwave.com/oner-common-page/1.1.3/common.js',
          '//cdn.dtwave.com/oner-common-page/1.1.3/main.js',
        ],
        css: [
          '//cdn.dtwave.com/public/antd/2.13.2/antd.min.css',
          '//cdn.dtwave.com/oner-common-page/1.1.3/main.css',
        ],
      },
    },

    resource: [
      // '//cdn.dtwave.com/public/logo/shuxi.svg',
      '//cdn.dtwave.com/oner-common-page/1.1.3/P404.chunk.js',
      '//cdn.dtwave.com/oner-common-page/1.1.3/low-version.chunk.js',
      '//cdn.dtwave.com/oner-common-page/1.1.3/no-permission.chunk.js',
      '//cdn.dtwave.com/oner-common-page/1.1.3/tenant-choose.chunk.js',
      // '//cdn.dtwave.com/oner-common-page/1.1.3/citic_select_tenant_gb.38665899.jpeg',
      '//cdn.dtwave.com/oner-common-page/1.1.3/status-fail.6b33b609.svg',
    ],
  },

  server: {
    // 这个port仅用在前端开发环境
    port: appConfig.port || 9995,

    // 向每一个请求注入自定义 header 键值对
    apiHeader: {
      // k: 'v',
    },

    pathPrefix: appConfig.pathPrefix || '',

    // 自定义日志路径
    logRoot: config.logRoot || '',

    // 白名单，不在白名单里的请求均为无效请求
    refererWhiteList: nattyStorage.env(SERVER_ENV, {
      default: appConfig.domain || config.domain || config.accountDomain || '',
      development: [
        '0.0.0.0:9995',
        'localhost:9995',
        '127.0.0.1:9995',
      ],
      // 测试环境
      test: [
        `${pkg.name}.test.dtwave-inc.com`,
      ],
      // 数澜生产环境
      production: [
        'dac.dtwave-inc.com',
        // `${pkg.name}.dtwave-inc.com`,
      ],
    }),

    // 是不是把用户的功能点列表注入到页面中 window.__onerConfig.functionCodes
    showFunCode: true,

    // 是否使用私有化 cdn
    // cdnHost: '//cdn.dtwave.com/',

    // 多页应用用的到 自定义路由，默认文件夹 page- 后面的名字
    router: {
      // 'overview' : '/',
    },

    // Node层代理API的域名，网关的，一般不用改
    apiPrefix: nattyStorage.env(SERVER_ENV, {
      // 成飞开发
      development: 'http://192.168.90.74:9018',
      // 成飞测试  
      // development: 'http://192.168.90.111:9018',
      test: 'http://10.51.44.149:9018',
      production: 'http://api-in.dtwave-inc.com',
      // default: config.gatewayDomain,
      default: appConfig.apiDomain || config.gatewayDomain,
    }),

    // 自定义插件
    plugins,

    // node层自动注入的参数 ，userId , tenantId , productId 前两个是从 cookie 里读的，productId 是在下面配的
    autoInjectApiData: ['productId', 'userId', 'tenantId', 'sessionId'],

    // 鉴权模块配置
    authorize: {
      // sessionIdName: 'sessionId4',
      sessionIdName: config.sessionIdName || 'sessionIdSaaS',
      // productId 找晓涛要，每个项目都会有的
      productId: nattyStorage.env(SERVER_ENV, {
        default: appConfig.productId || '',
        development: 1111,
        test: 1111,
        production: 1111,
      }),

      // 每个项目都有自己的 code ，用户中心配权限用得到
      pageFunctionCode: 'asset_tag',

      // 用户中心的使用方式， private : 私有化部署    public : 跳转到用户中心
      useUserCenter: 'public',

      // 是否禁用登录
      disabled: false,

      // 和用户中心有关接口前缀
      apiPrefix: nattyStorage.env(SERVER_ENV, {
        default: `${config.gatewayDomain}/api/v4/uic`,
        development: 'http://192.168.90.74:9018/api/v4/uic',
        test: 'http://10.27.232.131:9018/api/v4/uic',
        production: 'http://api-in.dtwave-inc.com/api/v4/uic',
      }),

      // 使用用户中心的时候开启，用户中心的域名，主要要用这个拼登录/注册页地址
      loginUrlPrefix: nattyStorage.env(SERVER_ENV, {
        default: config.accountDomain,
        // default: `http://127.0.0.1:${config.apps.account4.port}`, // config.accountDomain,
        development: 'http://192.168.90.75:8899',
        test: 'http://account4.test.dtwave-inc.com',
        production: 'http://account4.dtwave-inc.com',
        saas: 'http://account4.dtwave.com',
      }),
    },

    // 文件模块配置
    fs: {
      apiPrefix: nattyStorage.env(SERVER_ENV, {
        default: config.gatewayDomain,
        development: 'http://192.168.90.75:9018',
        test: 'http://10.51.44.149:9018',
        production: 'http://api-in.dtwave-inc.com',
      }),
      // 是否保存文件名及类型，设为true后，同名文件会被覆盖
      // saveWithName: false,
    },
  },
}
