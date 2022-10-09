import { Post } from '@prisma/client'
import cx from 'classnames'

type IAwesomePost = Pick<Post, 'id' | 'imageUrl' | 'description' | 'tags'>

interface Props {
  post: IAwesomePost
  className?: React.HTMLAttributes<HTMLDivElement>['className']
}

export const AwesomePost = (props: Props) => {
  const {
    post: { imageUrl, description, tags, id },
    className = ''
  } = props

  return (
    <div key={id} className={cx('shadow rounded', className)}>
      <img className='m-auto' src={imageUrl} />
      <div className='flex justify-between p-5'>
        <div className='flex flex-col space-y-2'>
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
      </div>
    </div>
  )
}
