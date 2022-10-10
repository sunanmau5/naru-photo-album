import Link from 'next/link'
import { useEffect, useState } from 'react'
import { ArrowLeft, Download } from 'react-feather'
import { AwesomePost } from '../../components/AwesomePost'
import prisma from '../../lib/prisma'

// TODO Add comments
// TODO Share functionality

const Post = (props) => {
  const { post } = props
  const { imageUrl } = post

  const [signedUrl, setSignedUrl] = useState<string | null>(null)

  useEffect(() => {
    const fetchImage = async () => {
      const res = await fetch(`/api/get-image?imageKey=${imageUrl}`)
      const json = await res.json()
      setSignedUrl(json)
    }

    fetchImage().catch(console.error)
  }, [imageUrl])

  return (
    <div className='flex flex-col gap-4'>
      <div className='flex justify-between'>
        <Link href='/' className=''>
          <a className='inline-flex items-center text-base capitalize gap-1 bg-gray-100 hover:bg-gray-200 rounded-md py-1 px-2 w-max transition-all'>
            <ArrowLeft size={16} />
            <span>Back</span>
          </a>
        </Link>

        <div className='flex gap-2'>
          {/* <a
            className='inline-flex justify-center items-center text-base capitalize gap-1 bg-gray-100 hover:bg-gray-200 rounded-md p-2 w-max transition-all'
            href={imageUrl}
          >
            <Share size={16} />
          </a> */}
          <a
            className='inline-flex justify-center items-center text-base capitalize gap-1 bg-gray-100 hover:bg-gray-200 rounded-md p-2 w-max transition-all'
            href={signedUrl}
            download
          >
            <Download size={16} />
          </a>
        </div>
      </div>

      <AwesomePost post={{ ...post, imageUrl: signedUrl }} />
    </div>
  )
}

export default Post

export const getServerSideProps = async ({ params }) => {
  const { id } = params
  const post = await prisma.post.findUnique({
    where: { id },
    select: {
      id: true,
      description: true,
      imageUrl: true,
      tags: true
    }
  })
  return {
    props: {
      post
    }
  }
}
