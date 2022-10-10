import { gql, useMutation } from '@apollo/client'
import { getSession } from '@auth0/nextjs-auth0'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import toast, { Toaster } from 'react-hot-toast'
import prisma from '../lib/prisma'

const CreatePostMutation = gql`
  mutation (
    $id: String!
    $imageUrl: String!
    $description: String!
    $tags: [String]
  ) {
    createPost(
      id: $id
      imageUrl: $imageUrl
      description: $description
      tags: $tags
    ) {
      id
      imageUrl
      description
      tags
    }
  }
`

const Admin = () => {
  const [createPost, { loading, error }] = useMutation(CreatePostMutation)
  const { register, handleSubmit }= useForm()
  const [assignedId, setAssignedId] = useState<string | null>(null)
  const [imageKey, setImageKey] = useState<string | null>(null)

  const uploadImage = async (e) => {
    const file = e.target.files[0]
    const res = await fetch(`/api/upload-image?fileType=${file.type}`)
    const { fields, url } = await res.json()

    const formData = new FormData()

    Object.entries({ ...fields, file }).forEach(([key, value]) => {
      // @ts-ignore
      formData.append(key, value)
    })

    toast.promise(
      fetch(url, {
        method: 'POST',
        body: formData
      }),
      {
        loading: 'Uploading...',
        success: () => {
          setAssignedId(fields.id)
          setImageKey(fields.key)
          return 'Image successfully uploaded!🎉'
        },
        error: `Upload failed 😥 Please try again ${error}`
      }
    )
  }

  const onSubmit = async (data) => {
    const { description, tags } = data

    const tagsArr = tags
      .split(',')
      .map((tag) => tag.trim())
      .filter((tag) => tag !== '')

    const variables = {
      id: assignedId,
      description,
      imageUrl: imageKey,
      tags: tagsArr
    }

    try {
      toast.promise(createPost({ variables }), {
        loading: 'Creating new post..',
        success: 'Post successfully created!🎉',
        error: `Something went wrong 😥 Please try again -  ${error}`
      })
    } catch (error) {
      console.error(error)
    } finally {
    }
  }

  return (
    <div className='container mx-auto max-w-md py-12'>
      <Toaster />
      <h1 className='text-3xl font-medium my-5'>Create a new post</h1>
      <form
        className='grid grid-cols-1 gap-y-6 shadow-lg p-8 rounded-lg'
        onSubmit={handleSubmit(onSubmit)}
      >
        <label className='block'>
          <span className='text-gray-700'>Description</span>
          <input
            placeholder='Description'
            {...register('description', { required: true })}
            name='description'
            type='text'
            className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50'
          />
        </label>
        <label className='block'>
          <span className='text-gray-700'>Tags</span>
          <input
            placeholder='Tags'
            {...register('tags', { required: false })}
            name='tags'
            type='text'
            className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50'
          />
        </label>
        <label className='block'>
          <span className='text-gray-700'>
            Upload a .png or .jpg image (max 1MB).
          </span>
          <input
            {...register('image', { required: true })}
            onChange={uploadImage}
            type='file'
            accept='image/png, image/jpeg'
            name='image'
          />
        </label>

        <button
          disabled={loading}
          type='submit'
          className='my-4 capitalize bg-blue-500 text-white font-medium py-2 px-4 rounded-md hover:bg-blue-600'
        >
          {loading ? (
            //
            //
            <span className='flex items-center justify-center'>
              <svg
                className='w-6 h-6 animate-spin mr-1'
                fill='currentColor'
                viewBox='0 0 20 20'
                xmlns='http://www.w3.org/2000/svg'
              >
                <path d='M11 17a1 1 0 001.447.894l4-2A1 1 0 0017 15V9.236a1 1 0 00-1.447-.894l-4 2a1 1 0 00-.553.894V17zM15.211 6.276a1 1 0 000-1.788l-4.764-2.382a1 1 0 00-.894 0L4.789 4.488a1 1 0 000 1.788l4.764 2.382a1 1 0 00.894 0l4.764-2.382zM4.447 8.342A1 1 0 003 9.236V15a1 1 0 00.553.894l4 2A1 1 0 009 17v-5.764a1 1 0 00-.553-.894l-4-2z' />
              </svg>
              Creating...
            </span>
          ) : (
            //
            //
            <span>Create Post</span>
          )}
        </button>
      </form>
    </div>
  )
}

export default Admin

export const getServerSideProps = async ({ req, res }) => {
  const session = getSession(req, res)

  if (!session) {
    return {
      redirect: {
        permanent: false,
        destination: '/api/auth/login'
      },
      props: {}
    }
  }

  const user = await prisma.user.findUnique({
    select: {
      email: true,
      role: true
    },
    where: {
      email: session.user.email
    }
  })

  if (user.role !== 'ADMIN') {
    return {
      redirect: {
        permanent: false,
        destination: '/404'
      },
      props: {}
    }
  }

  return {
    props: {}
  }
}
