import type { NextApiRequest, NextApiResponse } from 'next'
import { getS3SignedUrlById } from '../../services/s3-helper'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    if (req.query.imageKey) {
      const imageKey = req.query.imageKey as string
      const url = getS3SignedUrlById(imageKey)
      return res.status(200).json(url)
    }
  } catch (error) {
    console.error(error)
  }
}
