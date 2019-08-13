module.exports = function({currentPage}) {

  const data = Array(22).fill(0).map((d, i) => {
    return {
      "name":"标签名称" + (i+1),
      "score": i + 10,       //   --分数              
   }
  })

  console.log(data)

  return {
    "success":true,
    "message":null,
    "code":"0",
    "content":{
        "pageSize":5,
        currentPage,
        "totalCount": data.length + 30,
        "data": data
    }
  }
}
