import { randomUUID } from 'crypto'
import type { NextApiRequest, NextApiResponse } from 'next'
import { getPresignedPost } from '../../services/s3-helper'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { fileType } = req.query
  const uuid = randomUUID()
  const imageKey = `${uuid}.${(fileType as string).split('/')[1]}`

  try {
    const post = getPresignedPost(uuid, imageKey)
    return res.status(200).json(post)
  } catch (error) {
    console.error(error)
  }
}
