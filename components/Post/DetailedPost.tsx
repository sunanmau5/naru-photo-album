import { Post } from '@prisma/client'
import cx from 'classnames'
import { useEffect, useState } from 'react'
import { Edit, X } from 'react-feather'
import { GeneralForm } from './GeneralForm'
import { GeneralRenderer } from './GeneralRenderer'

export type IDetailedPost = Pick<
  Post,
  'id' | 'imageUrl' | 'description' | 'tags'
>

export interface DetailedPostProps {
  post: IDetailedPost
  className?: React.HTMLAttributes<HTMLDivElement>['className']
  editable?: boolean
}

export const useDetailedPostEdit = (
  editable: boolean,
  editControl?: boolean
) => {
  const [editing, setEditing] = useState<boolean>(false)

  useEffect(() => {
    editControl !== undefined && setEditing(editControl)
  }, [editControl])

  const iconProps = {
    className: 'absolute right-4 top-4 cursor-pointer',
    size: 20
  }

  const headerActions = editable ? (
    <>
      {!editing && <Edit {...iconProps} onClick={() => setEditing(true)} />}
      {editing && <X {...iconProps} onClick={() => setEditing(false)} />}
    </>
  ) : undefined
  return { editing, headerActions }
}

export const DetailedPost = (props: DetailedPostProps) => {
  const { post, className = '', editable = false } = props
  const { imageUrl, id } = post

  const { editing, headerActions } = useDetailedPostEdit(editable)

  return (
    <div key={id} className={cx('shadow rounded overflow-hidden', className)}>
      <img className='m-auto' src={imageUrl} />
      <div className='relative'>
        {headerActions}
        {editing ? <GeneralForm {...post} /> : <GeneralRenderer {...post} />}
      </div>
    </div>
  )
}
