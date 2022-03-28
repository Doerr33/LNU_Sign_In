const cloud = require('wx-server-sdk')
cloud.init()
var xlsx = require('node-xlsx');
const db = cloud.database().collection('activity')

exports.main = async (event, context) => {
  let {
    fileID,
    creatId
  } = event
  //1,通过fileID下载云存储里的excel文件
  const res = await cloud.downloadFile({
    fileID: fileID,
  })
  const buffer = res.fileContent

  const tasks = [] //用来存储所有的添加数据操作
  //2,解析excel文件里的数据
  var sheets = xlsx.parse(buffer); //获取到所有sheets
  sheets.forEach(function (sheet) {
    console.log(sheet['name']);
    for (var rowId in sheet['data']) {
      console.log(rowId);
      var row = sheet['data'][rowId]; //第几行数据
      if (rowId > 0 && row) { //第一行是表格标题，所有我们要从第2行开始读
        //3，把解析到的数据存到excelList数据表里
        const data = {
          name: row[0], //姓名
          college: row[1], //学院
          grade: row[2], //年级
          profession: row[3] //专业
        }
        tasks.push(data)
      }
    }
  });

  await db.where({
      creatId: creatId
    }).update({
      data: {
        membersPre: tasks
      }
    })
    .then(res => {
      console.log("members update", res);
    }).catch(err => {
      console.log(err);
    })

}