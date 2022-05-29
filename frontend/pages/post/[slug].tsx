import { GetStaticProps } from 'next'
import PortableText from 'react-portable-text'
import Header from '../../components/Header'
import { sanityClient, urlFor } from '../../sanity'
import { Post } from '../../typings'

interface Props {
  post: Post
}

function Post({ post }: Props) {
  return (
    <main>
      <Header />
      <img
        className="lg:max-w-5xl mx-auto"
        src={urlFor(post.secondaryImage)?.url()}
        alt={post.title}
      />

      <article className="max-w-3xl mx-auto p-5">
        <h1 className="text-3xl mt-10 mb-3">{post.title}</h1>
        <h2 className="text-xl font-light text-gray-500 mb-2">
          {post.description}
        </h2>

        <div className="flex items-center space-x-2 mb-6">
          <img
            className="h-14 w-14 rounded-full"
            src={urlFor(post.author.image).url()}
            alt={post.author.name}
          />
          <p className="font-extralight text-md">
            Blog Post by{' '}
            <span className="text-green-600">{post.author.name}</span> -
            Published At {new Date(post._createdAt).toLocaleString()}
          </p>
        </div>

        <div className="mt-10">
          <PortableText
            dataset={process.env.NEXT_PUBLIC_SANITY_DATASET}
            projectId={process.env.NEXT_PUBLIC_SANITY_PROJECT_ID}
            content={post.body}
            serializers={{
              h1: (props: any) => (
                <h1 className="text-2xl font-bold my-5" {...props} />
              ),
              h2: (props: any) => (
                <h2 className="text-xl font-bold my-5" {...props} />
              ),
              li: ({ children }: any) => (
                <li className="ml-4 list-disc" {...children} />
              ),
              link: ({ href, children }: any) => (
                <a
                  href={href}
                  className="text-blue-500 hover:underline"
                  {...children}
                />
              )
            }}
          />
        </div>
      </article>
    </main>
  )
}

export default Post

export const getStaticPaths = async () => {
  const query = `
  *[_type == "post"] {
    _id,
    slug {
        current
    }
   }
  `

  const posts = await sanityClient.fetch(query)
  const paths = posts.map((post: Post) => ({
    params: {
      slug: post.slug.current
    }
  }))

  return {
    paths,
    fallback: 'blocking'
  }
}

//* getStaticPaths and getStaticProps are always used together

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const query = `
  *[_type == "post" && slug.current == $slug][0] {
      _id,
      _createdAt,
      title,
      author -> {
          name, 
          image
      },
      "comments": *[
          _type == "comments" &&
          post._ref == ^._id &&
          approved == true
      ],
      description,
      mainImage,
      secondaryImage,
      slug,
      body
  }
  `

  const post = await sanityClient.fetch(query, {
    slug: params?.slug
  })

  if (!post) {
    return {
      notFound: true
    }
  }

  return {
    props: {
      post
    },
    revalidate: 60
  }
}
