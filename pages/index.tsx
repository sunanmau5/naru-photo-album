import Head from 'next/head'
import { AuthGate } from '../components/AuthGate'
import { Posts } from '../components/Posts'

function Home() {
  return (
    <div>
      <Head>
        <title>Awesome Posts</title>
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <div className='container mx-auto max-w-5xl my-20 px-5'>
        <AuthGate>
          <Posts />
        </AuthGate>
      </div>
    </div>
  )
}

export default Home
