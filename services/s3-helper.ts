import aws from 'aws-sdk'

// Retrieving the AWS credentials from `.env` file
aws.config.update({
  accessKeyId: process.env.APP_AWS_ACCESS_KEY,
  secretAccessKey: process.env.APP_AWS_SECRET_KEY,
  region: process.env.APP_AWS_REGION,
  signatureVersion: 'v4'
})

const URL_EXPIRE_MINS = 60 * 1
const MAX_CONTENT_SIZE = 5048576

const getS3SignedUrlById = (imageKey: string) => {
  const s3 = new aws.S3({
    params: { Bucket: process.env.AWS_S3_BUCKET_NAME }
  })
  return s3.getSignedUrl('getObject', {
    Key: imageKey,
    Expires: URL_EXPIRE_MINS
  })
}

const getPresignedPost = (uuid: string, imageKey: string) => {
  const s3 = new aws.S3({
    params: { Bucket: process.env.AWS_S3_BUCKET_NAME }
  })

  return s3.createPresignedPost({
    Bucket: process.env.AWS_S3_BUCKET_NAME,
    Fields: {
      key: imageKey,
      id: uuid
    },
    Expires: URL_EXPIRE_MINS, // seconds
    Conditions: [
      ['content-length-range', 0, MAX_CONTENT_SIZE] // up to 1 MB
    ]
  })
}

export { getS3SignedUrlById, getPresignedPost }
