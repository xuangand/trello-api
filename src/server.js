/* eslint-disable no-console */
/**
 * Updated by trungquandev.com's author on August 17 2023
 * YouTube: https://youtube.com/@trungquandev
 * "A bit of fragrance clings to the hand that gives flowers!"
 */

import express from 'express'
import cors from 'cors'
import { corsOptions } from '~/config/cors'
import exitHook from 'async-exit-hook'
import { CONNECT_DB, CLOSED_DB } from '~/config/mongodb'
import { env } from '~/config/environment'
import { APIs_V1 } from '~/routes/v1'
import { errorHandlingMiddleware } from './middlewares/errorHandlingMiddleware'

const START_SERVER = () => {
  const app = express()

  //Xử lý CORS
  app.use(cors(corsOptions))

  //Enable req.body json data
  app.use(express.json())

  //Use APIs v1
  app.use('/v1', APIs_V1)

  //Middleware xử lý lỗi tập trung
  app.use(errorHandlingMiddleware)

  //Môi trường production (cụ thể hiện tại là đang support Render.com)
  if (env.BUILD_MODE === 'production') {
    app.listen(process.env.PORT, () => {
      console.log(`Production: Hello ${env.AUTHOR}, I am running successfully at ${process.env.PORT}/`)
    })
  } else {
    //Môi trường local dev
    app.listen(env.LOCAL_DEV_APP_PORT, env.LOCAL_DEV_APP_HOST, () => {
      console.log(`Local dev: Hello ${env.AUTHOR}, I am running at ${env.LOCAL_DEV_APP_HOST}:${env.LOCAL_DEV_APP_PORT}/`)
    })
  }

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
