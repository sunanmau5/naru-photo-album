import { useUser } from '@auth0/nextjs-auth0'
import Link from 'next/link'

export const AuthGate = (props) => {
  const { children } = props
  const { user } = useUser()

  if (!user) {
    return (
      <div className='flex flex-1 items-center justify-center'>
        <Link href='/api/auth/login'>
          <a className='inline-flex items-center bg-gray-100 border-0 py-1 px-3 focus:outline-none hover:bg-gray-200 rounded text-base'>
            Login
          </a>
        </Link>
      </div>
    )
  }

  return <>{children}</>
}
