/**
 * Updated by trungquandev.com's author on August 17 2023
 * YouTube: https://youtube.com/@trungquandev
 * "A bit of fragrance clings to the hand that gives flowers!"
 */

import { MongoClient, ServerApiVersion } from 'mongodb'
import { env } from '~/config/environment'

//Khởi tạo một đối tượng trelloDatabaseInstance ban đầu là null (vì chúng ta chưa connect)
let trelloDatabaseInstance = null

//Khởi tạo một đối tượng mongoClientInstance để connect tới mongoDB
const mongoClientInstance = new MongoClient(env.MONGODB_URI, {
  //Lưu ý: cái serverAPI có từ phiên bản MongoDB 5.0.0 trở lên, có thể không cần dùng nó, còn nếu dùng nó là chúng ta sẽ chỉ định
  //một cái stable API version của MongoDB
  //Đọc thêm tại đây: https://www.mongodb.com/docs/drivers/node/current/fundamentals/stable-api/
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true
  }
})

export const CONNECT_DB = async () => {
  //Gọi kết nối tới MongoDB Atlas với URI đã khai báo trong thân của mongoClientInstance
  await mongoClientInstance.connect()

  //Kết nối thành công thì lấy ra Database theo tên và gán ngược nó lại vào biến trelloDatabaseInstance ở trên của chúng ta
  trelloDatabaseInstance = mongoClientInstance.db(env.DATABASE_NAME)
}

//Function GET_DB (không async) này có nhiệm vụ export ra cái Trello Database Instance sau khi đã connect thành công tới MongoDB để
//chúng ta sử dụng ở nhiều nơi khác nhau trong code.
//Lưu ý phải đảm bảo chỉ luôn gọi cái GET_DB này sau khi đã kết nối thành công tới MongoDB
export const GET_DB = () => {
  if (!trelloDatabaseInstance) throw new Error('Must connect to Database first!')
  return trelloDatabaseInstance
}

//Đóng kết nối database khi cần
export const CLOSED_DB = async () => {
  await mongoClientInstance.close()
}
