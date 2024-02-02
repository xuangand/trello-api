/* eslint-disable no-useless-catch */

import { slugify } from '~/utils/formatters'
import { boardModel } from '~/models/boardModel'
import ApiError from '~/utils/ApiError'
import { StatusCodes } from 'http-status-codes'
import { cloneDeep } from 'lodash'

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
    const createdBoard = await boardModel.createNew(newBoard)
    //console.log(createdBoard)

    //Lấy bản ghi board sau khi gọi (tùy mục đích dự án mà có cần bước này hay không)
    const getNewBoard = await boardModel.findOneById(createdBoard.insertedId)

    //Làm thêm các xử lý logic khác với các Collection khác tùy đặc thù dự án...
    //Bắn email, notification về cho admin khi có một cái board mới được tạo...

    //Trả kết quả về, trong Service luôn phải có return
    return getNewBoard

  } catch (error) { throw error }
}

const getDetails = async (boardId) => {
  try {
    const board = await boardModel.getDetails(boardId)
    // console.log(board)
    if (!board) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Board not found')
    }

    //B1: Deep clone board ra một cái mới để xử lý, không ảnh hưởng tới board ban đầu, từy mục đích về sau mà có cần deep clone hay không.
    //https://www.javascripttutorial.net/javascript-primitive-vs-reference-values/
    const resBoard = cloneDeep(board)

    //B2: Đưa card về đúng column của nó
    resBoard.columns.forEach(column => {
      //Cách dùng .equals này là bởi vì chúng ta hiểu ObjectId trong mongoDB có support method .equals
      //column.cards = resBoard.cards.filter(card => card.columnId.equals(column._id))

      //Cách khác đơn giản là convert ObjectId về string bằng hàm toString() của JavaScript
      column.cards = resBoard.cards.filter(card => card.columnId.toString() === column._id.toString())
    })

    //B3: Xóa mảng cards khỏi board ban đầu
    delete resBoard.cards

    return resBoard

  } catch (error) { throw error }
}

const update = async (boardId, reqBody) => {
  try {
    const updateData = {
      ...reqBody,
      updatedAt: Date.now()
    }
    const updatedBoard = await boardModel.update(boardId, updateData)
    return updatedBoard
  } catch (error) { throw error }
}

export const boardService = {
  createNew,
  getDetails,
  update
}
