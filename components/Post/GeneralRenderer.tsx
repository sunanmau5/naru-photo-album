import { IDetailedPost } from './DetailedPost'

type Props = Pick<IDetailedPost, 'description' | 'tags'>

export const GeneralRenderer = (props: Props) => {
  const { description, tags } = props
  return (
    <div className='flex flex-col space-y-2 p-5'>
      <p>{description}</p>
      <div className='flex items-center flex-wrap gap-2'>
        {tags.map((tag) => (
          //
          //
          <div key={tag} className='bg-gray-200 rounded-md px-2'>
            <span className='text-sm text-gray-600'>{`#${tag}`}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
