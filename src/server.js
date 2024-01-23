/* eslint-disable no-console */
/**
 * Updated by trungquandev.com's author on August 17 2023
 * YouTube: https://youtube.com/@trungquandev
 * "A bit of fragrance clings to the hand that gives flowers!"
 */

import express from 'express'
import exitHook from 'async-exit-hook'
import { CONNECT_DB, CLOSED_DB } from '~/config/mongodb'
import { env } from '~/config/environment'
import { APIs_V1 } from '~/routes/v1'

const START_SERVER = () => {
  const app = express()

  //Enable req.body json data
  app.use(express.json())

  //Use APIs v1
  app.use('/v1', APIs_V1)

  app.listen(env.APP_PORT, env.APP_HOST, () => {
    console.log(`Hello ${env.AUTHOR}, I am running at ${env.APP_HOST}:${env.APP_PORT}/`)
  })

  //Thực hiện tác vụ cleanup trước khi dừng server
  //Đọc thêm ở đây: https://stackoverflow.com/questions/14031763/doing-a-cleanup-action-just-before-node-js-exits
  exitHook(() => {
    console.log('Server is shutting down')
    CLOSED_DB()
    console.log('Disconnected from MongoDB Cloud Atlas')
  })
}

//Chỉ khi kết nối tới Database thành công thì mới start server Back-end lên
//Imediately-invoke /Anonymous Async Function (IIFE)
(async () => {
  try {
    console.log('Connecting to MongoDB Cloud Atlas')
    await CONNECT_DB()
    console.log('Connected to MongoDb Cloud Atlas')

    //Khởi động server Back-end sau khi đã connect database thành công
    START_SERVER()
  } catch (error) {
    console.error(error)
    process.exit(0)
  }
})()

//Cách viết thứ 2
//Chỉ khi kết nối tới Database thành công thì mới start server Back-end lên
// CONNECT_DB()
//   .then(() => console.log('Connected to MongoDb Cloud Atlas'))
//   .then(() => START_SERVER())
//   .catch(error => {
//     console.error(error)
//     process.exit(0)
//   })
