import { gql, useMutation } from '@apollo/client'
import { useForm } from 'react-hook-form'
import toast, { Toaster } from 'react-hot-toast'
import { IDetailedPost } from './DetailedPost'

const UpdatePostMutation = gql`
  mutation ($id: String!, $description: String, $tags: [String]) {
    updatePost(id: $id, description: $description, tags: $tags) {
      id
      description
      tags
    }
  }
`

type Props = Pick<IDetailedPost, 'id' | 'description' | 'tags'>

export const GeneralForm = (props: Props) => {
  const { id, description, tags } = props

  const [updatePost, { loading, error }] = useMutation(UpdatePostMutation)
  const { register, handleSubmit } = useForm()

  const onSubmit = async (data) => {
    const { description, tags } = data

    console.log(data)
    const tagsArr = tags
      ?.split(',')
      .map((tag) => tag.trim())
      .filter((tag) => tag !== '')

    const variables = {
      id,
      description,
      tags: tagsArr
    }

    try {
      toast.promise(updatePost({ variables }), {
        loading: 'Updating post..',
        success: 'Post successfully updated!🎉',
        error: `Something went wrong 😥 Please try again -  ${error}`
      })
    } catch (error) {
      console.error(error)
    } finally {
    }
  }

  return (
    <>
      <Toaster />
      <form
        className='grid grid-cols-1 gap-y-6 p-8'
        onSubmit={handleSubmit(onSubmit)}
      >
        <label className='block'>
          <span className='text-gray-700'>Description</span>
          <input
            placeholder='Description'
            {...register('description', {
              required: true,
              value: description
            })}
            name='description'
            type='text'
            className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50'
          />
        </label>
        <label className='block'>
          <span className='text-gray-700'>Tags</span>
          <input
            placeholder='Tags'
            {...register('tags', {
              required: false,
              value: tags && tags.length > 0 ? tags.join(',') : undefined
            })}
            name='tags'
            type='text'
            className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50'
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
              Saving changes...
            </span>
          ) : (
            //
            //
            <span>Save changes</span>
          )}
        </button>
      </form>
    </>
  )
}
