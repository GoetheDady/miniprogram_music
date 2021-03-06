// 云函数入口文件
const cloud = require('wx-server-sdk');
const rq = require('request-promise');
const URL = 'http://47.94.251.164:3000/personalized'

cloud.init()

const db = cloud.database();
const playlistCollection = db.collection('playlist')

const MAX_LIMIT = 100;

// 云函数入口函数
exports.main = async (event, context) => {
  // const list = await playlistCollection.get();

  const countResult = await playlistCollection.count();
  const total = countResult.total;
  const batchTimes = Math.ceil(total / MAX_LIMIT);
  const tasks = [];
  for (let i = 0; i < batchTimes; i++) {
    let promise = playlistCollection.skip(i * MAX_LIMIT).limit(MAX_LIMIT).get();
    tasks.push(promise);
  }
  let list = {
    data: []
  }
  if (tasks.length > 0) {
    list = (await Promise.all(tasks)).reduce((acc, cur) => {
      return {
        data: acc.data.concat(cur.data)
      }
    })
  }


  const playlist = await rq(URL).then((res) => {
    return JSON.parse(res).result
  })

  const newData = [];
  for (let i = 0; i < playlist.length; i++) {
    let flag = true;
    for (let j = 0; j < list.data.length; j++) {
      if (playlist[i].id === list.data[j].id) {
        flag = false;
        break;
      }
    }
    if (flag) {
      newData.push(playlist[i]);
    }
  }

  // console.log(playlist)
  for (let i = 0; i < newData.length; i ++) {
    await playlistCollection.add({
      data: {
        ...newData[i],
        createTime: db.serverDate(),
      }
    }).then(res => {
      console.log('插入成功')
    }).catch(err => {
      cosnole.error('插入失败')
    })
  }

  return newData.length
}