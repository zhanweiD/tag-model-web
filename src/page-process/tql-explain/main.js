import intl from 'react-intl-universal'
import { Anchor, Table } from 'antd'
import 'github-markdown-css/github-markdown.css'

const { Link } = Anchor

const Explain = () => {
  function onClick(e, link) {
    e.preventDefault()
    if (link.href) {
      // 找到锚点
      const anchorElement = document.getElementById(link.href.substr(1))
      if (anchorElement) {
        anchorElement.scrollIntoView()
      }
    }
  }
  return (
    <div className="FBH group-explain">
      <Anchor className="anchor" onClick={onClick}>
        <Link
          href="#tql-explain"
          title={intl
            .get('ide.src.page-process.tql-explain.main.kfi210eg3y')
            .d('TQL是什么')}
        />
        <Link
          href="#tql-search"
          title={intl
            .get('ide.src.page-process.tql-explain.main.0paq8ejns3n')
            .d('TQL查询数据')}
        >
          <Link
            href="#limit"
            title={intl
              .get('ide.src.page-process.tql-explain.main.mg7s00a3i4l')
              .d('限制')}
          />
          <Link
            href="#function"
            title={intl
              .get(
                'ide.src.page-process.schema-list.drawer-two-tree.2tsi343i4g8'
              )
              .d('函数')}
          />
          <Link
            href="#params"
            title={intl
              .get('ide.src.page-process.tql-explain.main.hh40lo0h1s4')
              .d('使用参数')}
          />
          <Link href="#order-by" title="ORDER BY" />
          <Link href="#group-by" title="GROUP BY" />
          <Link href="#like" title="Like" />
          <Link href="#case-when" title="CASE WHEN" />
          <Link
            href="#connect"
            title={intl
              .get('ide.src.page-process.tql-explain.main.whcjuf3mvsf')
              .d('连接')}
          />
        </Link>
        <Link
          href="#case"
          title={intl
            .get('ide.src.page-process.tql-explain.main.r0xj15nboh')
            .d('案例')}
        >
          <Link
            href="#case-object"
            title={intl
              .get('ide.src.page-process.tql-explain.main.ad7p82ubg5')
              .d('对象object')}
          />
          <Link
            href="#case-object-tag"
            title={intl
              .get('ide.src.page-process.tql-explain.main.ooj3mbo60c')
              .d('对象下的标签tag')}
          />
          <Link
            href="#case-object-table"
            title={intl
              .get('ide.src.page-process.tql-explain.main.l3av6ltxmhp')
              .d('对象下绑定的表')}
          />
          <Link
            href="#tql-example"
            title={intl
              .get('ide.src.page-process.tql-explain.main.v7zkjkqqntp')
              .d('TQL例子')}
          />
        </Link>
      </Anchor>
      <div className="anchor-content markdown-body">
        <div>
          <h2 id="tql-explain">
            {intl
              .get('ide.src.page-process.tql-explain.main.kfi210eg3y')
              .d('TQL是什么')}
          </h2>
          <p>
            {intl
              .get('ide.src.page-process.tql-explain.main.iizc5gd52g')
              .d(
                'TQL（Tag Query Language）是标签查询语言，是一种基于业务逻辑模型的数据查询语言。标签查询语言与结构化查询语言（SQL）中的数据查询语言（DQL）类似，用以在业务逻辑模型之上从表中获得数据。TQL仅支持SELECT(不区分大小写)开头的语法，不支持 INSERT INTO、DELETE、UPDATE 等，常与WHERE，ORDER BY，GROUP BY等结合起来使用。语法上与mysql类似。业务逻辑模型即标签体系，通过Object对象、tag标签将库表中的数据重新组织。'
              )}
          </p>
          <h2 id="tql-search">
            {intl
              .get('ide.src.page-process.tql-explain.main.0paq8ejns3n')
              .d('TQL查询数据')}
          </h2>
          <p>
            {intl
              .get('ide.src.page-process.tql-explain.main.nmsdv5pcve')
              .d('TQL为数据查询而生，用户可以写如下通用SELECT模版语法：')}
          </p>
          <pre>
            <code>
              {`
                SELECT 
                  tag_name,select_expr [, select_expr ...]
                FROM
                  object_references [WHERE where_condition]
                  [GROUP BY {tag_name | expr}] 
                  [HAVING where_condition]
                  [ORDER BY {tag_name | expr }
                  [ASC | DESC],...] [LIMIT { OFFSET }]
                `}
            </code>
          </pre>
          <ul>
            <li>
              {intl
                .get('ide.src.page-process.tql-explain.main.gatujhh7y2r')
                .d('SELECT语句可以使用多个标签，会返回相应标签数据')}
            </li>
            <li>
              {intl
                .get('ide.src.page-process.tql-explain.main.delu55vhwao')
                .d('你可以使用 WHERE 语句来包含任何条件')}
            </li>
            <li>
              {intl
                .get('ide.src.page-process.tql-explain.main.ch3tyn5b1m8')
                .d('条件中某个标签为空时候，需要使用关键字IS NULL 来表示')}
            </li>
            <li>
              {intl
                .get('ide.src.page-process.tql-explain.main.qmn40q2eii')
                .d('可以使用GROUP BY结合COUNT函数来分组统计')}
            </li>
            <li>
              {intl
                .get('ide.src.page-process.tql-explain.main.83vd0aymeuy')
                .d('可以使用ORDER BY 对结果进行排序')}
            </li>
            <li>
              {intl
                .get('ide.src.page-process.tql-explain.main.6mytftch2go')
                .d(
                  '你可以使用 LIMIT 属性来设定返回的记录数，目前支持最大的记录条数为5000'
                )}
            </li>
          </ul>
          <h3 id="limit">
            {intl
              .get('ide.src.page-process.tql-explain.main.mg7s00a3i4l')
              .d('限制')}
          </h3>
          <pre>
            <code>
              {`
                SELECT
                  select_expr [, select_expr ...]
                FROM
                  object_references [WHERE where_condition]
                `}
            </code>
          </pre>
          <ul>
            <li>
              {intl
                .get('ide.src.page-process.tql-explain.main.tn1xyebbzx')
                .d('不支持SELECT * 这种全量标签形式，必须要指定明确的查询列')}
            </li>
            <li>
              {intl
                .get('ide.src.page-process.tql-explain.main.xgk4wcv2z3')
                .d('标签、对象可以使用别名，但是别名不能是以"$" 开头的字符串')}
            </li>
            <li>
              {intl
                .get('ide.src.page-process.tql-explain.main.4dky60h3q1p')
                .d('不支持子查询，类似如下这种')}
            </li>
          </ul>
          <pre>
            <code>
              {`
                SELECT
                  select_expr [, select_expr ]
                FROM
                  object_references [, object2 ]
                WHERE
                  select_expr OPERATOR （
                SELECT
                  select_expr [, select_expr ...]
                FROM
                  object_references [WHERE where_condition] ）
                `}
            </code>
          </pre>
          <h3 id="function">
            {intl
              .get(
                'ide.src.page-process.schema-list.drawer-two-tree.2tsi343i4g8'
              )
              .d('函数')}
          </h3>
          <p>
            {intl
              .get('ide.src.page-process.tql-explain.main.hv64z3qtv7r')
              .d('目前TQL仅支持如下的函数')}
          </p>
          <Table
            columns={[
              {
                title: intl
                  .get(
                    'ide.src.page-process.schema-list.drawer-two-tree.2tsi343i4g8'
                  )
                  .d('函数'),
                dataIndex: 'type',
              },
              {
                title: intl
                  .get('ide.src.page-process.tql-explain.main.5jbagji56ua')
                  .d('说明'),
                dataIndex: 'desrc',
              },
            ]}
            dataSource={[
              {
                type: 'AVG(col)',
                desrc: intl
                  .get('ide.src.page-process.tql-explain.main.lbdisjeo35d')
                  .d('返回指定列的平均值'),
              },
              {
                type: 'COUNT(col)',
                desrc: intl
                  .get('ide.src.page-process.tql-explain.main.7fww4bug0ed')
                  .d(
                    '返回指定列中非NULL值/行的个数（当函数参数为星号*时不会忽略）'
                  ),
              },
              {
                type: 'MIN(col)',
                desrc: intl
                  .get('ide.src.page-process.tql-explain.main.7ob9m0orrir')
                  .d('返回指定列的最小值'),
              },
              {
                type: 'MAX(col)',
                desrc: intl
                  .get('ide.src.page-process.tql-explain.main.bpqvcbeeesa')
                  .d('返回指定列的最大值'),
              },
              {
                type: 'SUM(col)',
                desrc: intl
                  .get('ide.src.page-process.tql-explain.main.xsdxy0dycp')
                  .d('返回指定列的所有值之和'),
              },
              {
                type: 'SUBSTR(str,start,end)',
                desrc: intl
                  .get('ide.src.page-process.tql-explain.main.48hc18f22wa')
                  .d('取str左边第start位置起，到end位置字长的字符串'),
              },
              {
                type: 'DATE_FORMAT(date,fmt)',
                desrc: intl
                  .get('ide.src.page-process.tql-explain.main.6ya3m722nmg')
                  .d('依照字符串fmt格式化日期date值'),
              },
              {
                type: 'DATEDIFF(day1,day2)',
                desrc: intl
                  .get('ide.src.page-process.tql-explain.main.4q449th6ume')
                  .d('返回两个日期之间的天数'),
              },
            ]}
            bordered
            size="small"
            className="pr16 pl16 mb16"
            pagination={false}
          />

          <h3 id="params">
            {intl
              .get('ide.src.page-process.tql-explain.main.hh40lo0h1s4')
              .d('使用参数')}
          </h3>
          <ul>
            <li>
              {intl
                .get('ide.src.page-process.tql-explain.main.kzwrxtwwh0e')
                .d('WHERE条件中的参数格式必须为${参数名}')}
            </li>
            <li>
              {intl
                .get('ide.src.page-process.tql-explain.main.54731o3km3l')
                .d('样例')}
            </li>
          </ul>
          <pre>
            <code>
              {`
                SELECT
                  select_expr [, select_expr ]
                FROM
                  object_references [, object2 ]
                WHERE
                  tag_name=\${tag_parameter}
                `}
            </code>
          </pre>
          <h3 id="order-by">ORDER BY</h3>
          <ul>
            <li>
              {intl
                .get('ide.src.page-process.tql-explain.main.lbcpowxoi8d')
                .d(
                  '支持使用任何标签来作为排序的条件，从而返回排序后的查询结果'
                )}
            </li>
            <li>
              {intl
                .get('ide.src.page-process.tql-explain.main.qb9pghg2ta')
                .d('支持设定多个标签来排序')}
            </li>
            <li>
              {intl
                .get('ide.src.page-process.tql-explain.main.7p30fw8yv23')
                .d(
                  '支持使用 ASC 或 DESC 关键字来设置查询结果是按升序或降序排列。 默认情况下，它是按升序ASC排列'
                )}
            </li>
            <li>
              {intl
                .get('ide.src.page-process.tql-explain.main.ze1lzzikkzf')
                .d(
                  '被排序的标签必须要出现在SELECT 后面的标签中，否则会查询失败'
                )}
            </li>
            <li>
              {intl
                .get('ide.src.page-process.tql-explain.main.54731o3km3l')
                .d('样例')}
            </li>
          </ul>
          <pre>
            <code>
              {`
                SELECT
                  select_expr [, select_expr ...]
                FROM
                  object_references [WHERE where_condition]
                ORDER BY
                  { tag_name | expr  } [ASC | DESC],...]
                `}
            </code>
          </pre>
          <h3 id="group-by">GROUP BY</h3>
          <ul>
            <li>
              {intl
                .get('ide.src.page-process.tql-explain.main.poji14si9w7')
                .d(
                  'GROUP BY 语句根据一个或多个列对结果集进行分组。在分组的列上我们可以使用 COUNT, SUM, AVG,等函数。被分组的标签必须要出现在SELECT 后面的标签中，否则会查询失败'
                )}
            </li>
            <li>
              {intl
                .get('ide.src.page-process.tql-explain.main.54731o3km3l')
                .d('样例')}
            </li>
          </ul>
          <pre>
            <code>
              {`
                SELECT
                  select_expr [, select_expr ],
                  aggregate_function (aggregate_expression)
                FROM
                  object_name [WHERE conditions]
                GROUP BY
                  [GROUP BY {tag_name | expr } ]
                `}
            </code>
          </pre>

          <h3 id="like">Like</h3>
          <ul>
            <li>
              {intl
                .get('ide.src.page-process.tql-explain.main.xvy8l6rsbmd')
                .d('精确匹配：')}
            </li>
            <ul>
              <li>
                {intl
                  .get('ide.src.page-process.tql-explain.main.mqrve5rxizh')
                  .d('id：用户传入的标签数据等于id')}
              </li>
            </ul>
            <li>
              {intl
                .get('ide.src.page-process.tql-explain.main.ibsf74k81td')
                .d('前缀匹配：')}
            </li>
            <ul>
              <li>
                {intl
                  .get('ide.src.page-process.tql-explain.main.r1as2s6ukw')
                  .d('id%：标签数据以Id开头，以一至多个字符结尾')}
              </li>
            </ul>
            <li>
              {intl
                .get('ide.src.page-process.tql-explain.main.aabvj3h2s7r')
                .d('后缀匹配：')}
            </li>
            <ul>
              <li>
                {intl
                  .get('ide.src.page-process.tql-explain.main.egkkpz11vxg')
                  .d('%id：标签数据以一至多个任意字符开头，以Id结尾')}
              </li>
            </ul>
            <li>
              {intl
                .get('ide.src.page-process.tql-explain.main.opgwgo295x')
                .d('全模糊匹配：')}
            </li>
            <ul>
              <li>
                {intl
                  .get('ide.src.page-process.tql-explain.main.gcvpbxhjyow')
                  .d(
                    '%id%：标签数据以一至多个任意字符开头，中间匹配Id，以一至多个任意字符结尾'
                  )}
              </li>
            </ul>
            <li>
              {intl
                .get('ide.src.page-process.tql-explain.main.54731o3km3l')
                .d('样例')}
            </li>
          </ul>
          <pre>
            <code>
              {`
                SELECT
                  select_expr [, select_expr ...]
                FROM
                  object_references
                WHERE
                  select_expr LIKE '%sid' [AND [OR]] select_expr = LIKE  'id%'
                `}
            </code>
          </pre>
          <h3 id="case-when">CASE WHEN</h3>
          <p>
            {intl
              .get('ide.src.page-process.tql-explain.main.b33hve8v2b')
              .d('TQL的case when操作Mysql里面一样，支持：')}
          </p>
          <ul>
            <li>
              {intl
                .get('ide.src.page-process.tql-explain.main.4acjechuse')
                .d('支持两种方式，简单case 函数，case搜索函数')}
            </li>
            <li>
              {intl
                .get('ide.src.page-process.tql-explain.main.54731o3km3l')
                .d('样例')}
            </li>
          </ul>
          <pre>
            <code>
              {intl
                .get('ide.src.page-process.tql-explain.main.xoti6w8szuf')
                .d(
                  "                 -- 简单case 函数                 SELECT                  case sex                   when '1' then '男'                   when '2' then '女’                   else '其他' end sex                 FROM                   object_references [WHERE where_condition]                                    --case搜索函数                 SELECT                      case when sex = '1' then '男'                      when sex = '2' then '女'                      else '其他' end   sex                 FROM                   object_references [WHERE where_condition]                 "
                )}
            </code>
          </pre>
          <h3 id="connect">
            {intl
              .get('ide.src.page-process.tql-explain.main.whcjuf3mvsf')
              .d('连接')}
          </h3>
          <p>
            {intl
              .get('ide.src.page-process.tql-explain.main.tu52m5bespt')
              .d('TQL的连接操作Mysql里面一样，支持：')}
          </p>
          <ul>
            <li>
              {intl
                .get('ide.src.page-process.tql-explain.main.5jnyq50v5iu')
                .d(
                  'INNER JOIN（内连接,或等值连接）：获取两个表中字段匹配关系的记录'
                )}
            </li>
            <li>
              {intl
                .get('ide.src.page-process.tql-explain.main.mp51atuh1o')
                .d(
                  'LEFT JOIN（左连接）：获取左表所有记录，即使右表没有对应匹配的记录'
                )}
            </li>
            <li>
              {intl
                .get('ide.src.page-process.tql-explain.main.usbic25ue3j')
                .d(
                  'RIGHT JOIN（右连接）： 与 LEFT JOIN 相反，用于获取右表所有记录，即使左表没有对应匹配的记录'
                )}
            </li>
            <li>
              {intl
                .get('ide.src.page-process.tql-explain.main.54731o3km3l')
                .d('样例')}
            </li>
          </ul>
          <pre>
            <code>
              {`
              SELECT
                select_expr [, select_expr ...]
              FROM
                object_reference {LEFT|RIGHT} [OUTER] JOIN object_reference on join_specification
                `}
            </code>
          </pre>
          <h2 id="case">
            {intl
              .get('ide.src.page-process.tql-explain.main.r0xj15nboh')
              .d('案例')}
          </h2>
          <p>
            {intl
              .get('ide.src.page-process.tql-explain.main.k85z8n3der')
              .d('需求：加工出会员最近三十天购买金额、最近三十天下单次数')}
          </p>
          <p>
            {intl
              .get('ide.src.page-process.tql-explain.main.vahocmghs6')
              .d('在这里我们有如下对象和标签信息：')}
          </p>
          <h3 id="case-object">
            {intl
              .get('ide.src.page-process.tql-explain.main.ad7p82ubg5')
              .d('对象object')}
          </h3>
          <ul>
            <li>
              {intl
                .get('ide.src.page-process.tql-explain.main.ny94ikobsfp')
                .d('实体对象：会员（member）、购买记录（buyer）')}
            </li>
            <li>
              {intl
                .get('ide.src.page-process.tql-explain.main.gfjeh45a1ct')
                .d('简单关系对象：会员产生购买记录（member_buyer）')}
            </li>
          </ul>
          <h3 id="case-object-tag">
            {intl
              .get('ide.src.page-process.tql-explain.main.ooj3mbo60c')
              .d('对象下的标签tag')}
          </h3>
          <ul>
            <li>
              {intl
                .get('ide.src.page-process.tql-explain.main.pm2dnjowwuk')
                .d(
                  '会员（member）：会员号（id_number）、手机号（phone）、姓名（name）、性别（sex）'
                )}
            </li>
            <li>
              {intl
                .get('ide.src.page-process.tql-explain.main.4m56536w4ts')
                .d(
                  '购买记录（buyer）：购买id（buyer_id）、购买时间（buyer_time）、购买金额（buyer_money）'
                )}
            </li>
            <li>
              {intl
                .get('ide.src.page-process.tql-explain.main.40bpvf8hffc')
                .d(
                  '会员产生购买记录（member_buyer）：购买id（buyer_id）、会员号（id_number）'
                )}
            </li>
          </ul>
          <h3 id="case-object-table">
            {intl
              .get('ide.src.page-process.tql-explain.main.l3av6ltxmhp')
              .d('对象下绑定的表')}
          </h3>
          <ul>
            <li>
              {intl
                .get('ide.src.page-process.tql-explain.main.gk9zsrcyqyq')
                .d('会员（member）：member')}
            </li>
            <li>
              {intl
                .get('ide.src.page-process.tql-explain.main.0ye4oxea7cr')
                .d('浏览记录（Browse）：Browse_record')}
            </li>
            <li>
              {intl
                .get('ide.src.page-process.tql-explain.main.gkjrebl98qt')
                .d('购买记录（buyer）：buyer_record')}
            </li>
            <li>
              {intl
                .get('ide.src.page-process.tql-explain.main.vjfht0jb94g')
                .d('会员产生浏览记录（member_Browse）：Browse_record')}
            </li>
          </ul>
          <p>
            {intl
              .get('ide.src.page-process.tql-explain.main.6tthne671ym')
              .d(
                '分析：我们在写TQL的时候，无需关心表有几张，只需要从对象和标签角度出发，直接将对象当作表，标签当作字段来处理！，我们在编写TQL界面，自定义一个time参数，值为昨天'
              )}
          </p>
          <h3 id="tql-example">
            {intl
              .get('ide.src.page-process.tql-explain.main.v7zkjkqqntp')
              .d('TQL例子')}
          </h3>
          <pre>
            <code>
              {intl
                .get('ide.src.page-process.tql-explain.main.4jn3njmm5mp')
                .d(
                  "               select                 member.id_number ,               case                  when member.sex = '1' then '男'                 when member.sex = '2' then '女'               else '未知' end sex,                 count（*） as charge,                 sum(buyer.buyer_money) as money               from                 member                 left join member_buyer  on member.id_number = member_buyer.id_number                 left join buyer on member_buyer.buyer_id = buyer.buyer_id                 where datediff(buyer.buyer_time,${time})<=30               group by                 member.id_number，                 member.sex                 "
                )}
            </code>
          </pre>
        </div>
      </div>
    </div>
  )
}

export default Explain
