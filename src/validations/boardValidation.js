/**
 * Updated by trungquandev.com's author on August 17 2023
 * YouTube: https://youtube.com/@trungquandev
 * "A bit of fragrance clings to the hand that gives flowers!"
 */
import Joi from 'joi'
import { StatusCodes } from 'http-status-codes'

const createNew = async (req, res, next) => {
  //Note: mặc định chúng ta không cần phải custom message ở phía BE làm gì vì để cho FE tự validate và custom message phía BE cho đẹp
  //BE chỉ cần validate đảm bảo dữ liệu chuẩn xác và trả về message mặc định từ phía thư viện là được.
  //QUAN TRỌNG: việv validate dữ liệu BẮT BUỘC phải có ở phía BE vì đây là điểm cuối để lưu trữ dữ liệu vào database
  //Và thông thường trong thực tế, điều tốt nhất cho hệ thống là hãy luôn validate dữ liệu ở cả 2 phía BE và FE.
  const correctCondition = Joi.object({
    title: Joi.string().required().min(3).max(50).trim().strict().messages({
      'any.required': 'Title is required (custom message)'
    }),
    description: Joi.string().required().min(3).max(256).trim().strict()
  })

  try {
    //Chỉ định abortEarly: false để trường hợp có nhiều lỗi thì trả về tất cả lỗi (video 52)
    await correctCondition.validateAsync(req.body, { abortEarly: false })
    //next()
    res.status(StatusCodes.CREATED).json({ message: 'POST: API from Validation create new board' })
  } catch (error) {
    res.status(StatusCodes.UNPROCESSABLE_ENTITY).json({
      errors: new Error(error).message
    })
  }
}

export const boardValidation = {
  createNew
}
