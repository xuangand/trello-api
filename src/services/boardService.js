/* eslint-disable no-useless-catch */

import { slugify } from '~/utils/formatters'

/**
 * Updated by trungquandev.com's author on August 17 2023
 * YouTube: https://youtube.com/@trungquandev
 * "A bit of fragrance clings to the hand that gives flowers!"
 */
const createNew = async (reqBody) => {
  try {
    //Xử lý logic dữ liệu tùy đặc thù dự án
    const newBoard = {
      ...reqBody,
      slug: slugify(reqBody.title)
    }

    //Gọi tới thằng model để xử lý lưu bản ghi newBoard vào trong database
    //
    //Làm thêm các xử lý logic khác với các Collection khác tùy đặc thù dự án...
    //Bắn email, notification về cho admin khi có một cái board mới được tạo...

    //Trả kết quả về, trong Service luôn phải có return
    return newBoard

  } catch (error) { throw error }
}

export const boardService = {
  createNew
}
