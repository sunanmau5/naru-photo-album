import Header from './Header'

const Layout = (props) => {
  const { children } = props
  return (
    <div>
      <Header />
      <div className='container mx-auto max-w-5xl my-12 px-5'>{children}</div>
    </div>
  )
}

export default Layout
