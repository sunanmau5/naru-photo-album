import aws from 'aws-sdk'
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
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

    if (req.query.imageKey) {
      const signedUrlExpireSeconds = 60 * 1

      const url = await s3.getSignedUrl('getObject', {
        Bucket: process.env.AWS_S3_BUCKET_NAME,
        Key: req.query.imageKey,
        Expires: signedUrlExpireSeconds
      })

      return res.status(200).json(url)
    } else {
      const results = await s3.listObjects({
        Bucket: process.env.AWS_S3_BUCKET_NAME
      })
      // TODO list bucket objects
      console.log({ results })
    }
  } catch (error) {
    console.error(error)
  }
}
