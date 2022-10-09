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

      <AuthGate>
        <Posts />
      </AuthGate>
    </div>
  )
}

export default Home
