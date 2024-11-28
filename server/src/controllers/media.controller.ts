import { randomId } from '@/utils/helpers'
import { MultipartFile } from '@fastify/multipart'
import path from 'path'
import fs from 'fs'
import util from 'util'
import { pipeline } from 'stream'
import envConfig, { API_URL } from '@/config'
import { v2 as cloudinary } from 'cloudinary'
const pump = util.promisify(pipeline)

cloudinary.config({
  cloud_name: envConfig.CLOUDINARY_CLOUD_NAME,
  api_key: envConfig.CLOUDINARY_API_KEY,
  api_secret: envConfig.CLOUDINARY_API_SECRET
})

export const uploadImage = async (data: MultipartFile) => {
  const uniqueId = randomId()
  const ext = path.extname(data.filename)
  const id = uniqueId + ext
  const filepath = path.resolve(envConfig.UPLOAD_FOLDER, id)
  await pump(data.file, fs.createWriteStream(filepath))
  if (data.file.truncated) {
    // Xóa file nếu file bị trucated
    await fs.unlinkSync(filepath)
    throw new Error('Giới hạn file là 10MB')
  }
  const cloudinaryResponse = await cloudinary.uploader.upload(filepath, {
    folder: 'uploads',
    public_id: uniqueId
  })
  console.log('filepath', filepath)

  await fs.unlinkSync(filepath)

  // console.log(cloudinaryResponse)

  const url = cloudinaryResponse.secure_url
  return url
}
