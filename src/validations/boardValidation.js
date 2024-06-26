/**
 * Updated by trungquandev.com's author on August 17 2023
 * YouTube: https://youtube.com/@trungquandev
 * "A bit of fragrance clings to the hand that gives flowers!"
 */
import Joi from 'joi'
import { StatusCodes } from 'http-status-codes'
import ApiError from '~/utils/ApiError'
import { BOARD_TYPE } from '~/utils/constants'
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validators'

const createNew = async (req, res, next) => {
  //Note: mặc định chúng ta không cần phải custom message ở phía BE làm gì vì để cho FE tự validate và custom message phía BE cho đẹp
  //BE chỉ cần validate đảm bảo dữ liệu chuẩn xác và trả về message mặc định từ phía thư viện là được.
  //QUAN TRỌNG: việv validate dữ liệu BẮT BUỘC phải có ở phía BE vì đây là điểm cuối để lưu trữ dữ liệu vào database
  //Và thông thường trong thực tế, điều tốt nhất cho hệ thống là hãy luôn validate dữ liệu ở cả 2 phía BE và FE.
  const correctCondition = Joi.object({
    title: Joi.string().required().min(3).max(50).trim().strict().messages({
      'any.required': 'Title is required (custom message)'
    }),
    description: Joi.string().required().min(3).max(256).trim().strict(),
    type: Joi.string().valid(BOARD_TYPE.PUBLIC, BOARD_TYPE.PRIVATE).required()
  })

  try {
    //Chỉ định abortEarly: false để trường hợp có nhiều lỗi thì trả về tất cả lỗi (video 52)
    await correctCondition.validateAsync(req.body, { abortEarly: false })
    //Validate dữ liệu, xong xuôi hợp lệ thì cho request đi tiếp sang Controller (dòng 18 bên boardRoute.js)
    next() //next không có gì thì nó sẽ đưa request sang một nơi khác (cụ thể ở đây là controller ở dòng 18 bên boardRoute.js)

  } catch (error) {
    // const errorMessage = new Error(error).message
    // const customError = new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, errorMessage)
    // next(customError) //3 dòng này kết hợp tạo ra dòng ở dưới
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, new Error(error).message)) //next có dữ liệu thì nó sẽ đẩy sang dòng 25 của server.js
    // res.status(StatusCodes.UNPROCESSABLE_ENTITY).json({
    //   errors: new Error(error).message
    // })
  }
}

const update = async (req, res, next) => {
  //Lưu ý: không required() trong trường hợp update
  const correctCondition = Joi.object({
    title: Joi.string().min(3).max(50).trim().strict(),
    description: Joi.string().min(3).max(256).trim().strict(),
    type: Joi.string().valid(BOARD_TYPE.PUBLIC, BOARD_TYPE.PRIVATE)
  })

  try {
    //Chỉ định abortEarly: false để trường hợp có nhiều lỗi thì trả về tất cả lỗi (video 52)
    //Đối với trường hợp update, cho phép Unknown để đẩy một số field mà không có được định nghĩa trước.
    await correctCondition.validateAsync(req.body, {
      abortEarly: false,
      allowUnknown: true
    })
    next()

  } catch (error) {
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, new Error(error).message))
  }
}

const moveCardToDifferentColumn = async (req, res, next) => {
  //Lưu ý: không required() trong trường hợp update
  const correctCondition = Joi.object({
    currentCardId: Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
    prevColumnId: Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
    prevCardOrderIds: Joi.array().items(Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE)),

    nextColumnId: Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
    nextCardOrderIds: Joi.array().items(Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE))
  })

  try {
    await correctCondition.validateAsync(req.body, { abortEarly: false })
    next()

  } catch (error) {
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, new Error(error).message))
  }
}

export const boardValidation = {
  createNew,
  update,
  moveCardToDifferentColumn
}
