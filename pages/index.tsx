import { gql, useQuery } from '@apollo/client'
import Head from 'next/head'
import Link from 'next/link'
import { AwesomePost } from '../components/AwesomePost'

const AllPostsQuery = gql`
  query allPostsQuery($first: Int, $after: String) {
    posts(first: $first, after: $after) {
      pageInfo {
        endCursor
        hasNextPage
      }
      edges {
        cursor
        node {
          imageUrl
          description
          tags
          id
        }
      }
    }
  }
`

function Home() {
  const { data, loading, error, fetchMore } = useQuery(AllPostsQuery, {
    variables: { first: 3 }
  })

  if (loading) return <p>Loading...</p>
  if (error) return <p>Oh no... {error.message}</p>

  const { endCursor, hasNextPage } = data?.posts.pageInfo

  return (
    <div>
      <Head>
        <title>Awesome Posts</title>
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <div className='container mx-auto max-w-5xl my-20 px-5'>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5'>
          {data?.posts.edges.map(({ node }, i) => (
            //
            //
            <Link href={`/post/${node.id}`} key={i}>
              <a>
                <AwesomePost
                  id={node.id}
                  description={node.description}
                  imageUrl={node.imageUrl}
                  tags={node.tags}
                />
              </a>
            </Link>
          ))}
        </div>
        {hasNextPage ? (
          <button
            className='px-4 py-2 bg-blue-500 text-white rounded my-10'
            onClick={() => {
              //
              //
              fetchMore({
                variables: { after: endCursor }
              })
            }}
          >
            more
          </button>
        ) : (
          <p className='my-10 text-center font-medium'>
            You've reached the end!
          </p>
        )}
      </div>
    </div>
  )
}

export default Home
