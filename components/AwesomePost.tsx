import { Post } from '@prisma/client'

type IAwesomePost = Pick<Post, 'id' | 'imageUrl' | 'description' | 'tags'>

export const AwesomePost = (props: IAwesomePost) => {
  const { imageUrl, description, tags, id } = props
  return (
    <div key={id} className='shadow max-w-md rounded'>
      <img src={imageUrl} />
      <div className='p-5 flex flex-col space-y-2'>
        <p>{description}</p>
        <div className='flex items-center flex-wrap gap-2'>
          {tags.map((tag) => (
            //
            //
            <div className='bg-gray-200 rounded-md px-2'>
              <span className='text-sm text-gray-600'>{`#${tag}`}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
