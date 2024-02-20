/**
 * Updated by trungquandev.com's author on August 17 2023
 * YouTube: https://youtube.com/@trungquandev
 * "A bit of fragrance clings to the hand that gives flowers!"
 */

//Những domain được phép truy cập đến tài nguyên của server
export const WHITELIST_DOMAINS = [
  //'http://localhost:5173' //không cần localhost nữa vì ở file config/cors đã luôn cho phép môi trường dev (env.BUILD_MODE === 'dev')

]

export const BOARD_TYPE = {
  PUBLIC: 'public',
  PRIVATE: 'private'
}
