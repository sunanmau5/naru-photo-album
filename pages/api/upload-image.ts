import aws from 'aws-sdk'
import { randomUUID } from 'crypto'
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { fileType } = req.query
  const uuid = randomUUID()
  const imageKey = `${uuid}.${(fileType as string).split('/')[1]}`

  try {
    const s3 = new aws.S3({
      accessKeyId: process.env.APP_AWS_ACCESS_KEY,
      secretAccessKey: process.env.APP_AWS_SECRET_KEY,
      region: process.env.APP_AWS_REGION
    })

    aws.config.update({
      accessKeyId: process.env.APP_AWS_ACCESS_KEY,
      secretAccessKey: process.env.APP_AWS_SECRET_KEY,
      region: process.env.APP_AWS_REGION,
      signatureVersion: 'v4'
    })

    const post = await s3.createPresignedPost({
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Fields: {
        key: imageKey,
        id: uuid
      },
      Expires: 60, // seconds
      Conditions: [
        ['content-length-range', 0, 5048576] // up to 1 MB
      ]
    })

    return res.status(200).json(post)
  } catch (error) {
    console.error(error)
  }
}
