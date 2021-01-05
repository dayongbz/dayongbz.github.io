import React, { useMemo, memo } from "react"
import { graphql } from "gatsby"

import Layout from "../components/Layout"
import SEO from "../components/Seo"
import PostList from "../components/PostList"
import PostTab from "../components/PostTab"

const BlogIndex = memo(({ data, location }) => {
  const siteTitle = data.site.siteMetadata?.title || `Title`
  const author = data.site.siteMetadata?.author
  const avatar = data.avatar?.childImageSharp.fluid
  const postsAll = data.allMdx.nodes
  const categories = useMemo(
    () =>
      Array.from(new Set(postsAll.map(item => item.frontmatter.categories[0]))),
    [postsAll]
  )

  return (
    <Layout
      location={location}
      title={siteTitle}
      author={author}
      avatar={avatar}
    >
      <SEO title="All posts" />
      <PostTab categories={categories} />
      <PostList postsAll={postsAll} categories={categories} />
    </Layout>
  )
})

export default BlogIndex

export const pageQuery = graphql`
  query {
    avatar: file(absolutePath: { regex: "/profile-pic.jpg/" }) {
      childImageSharp {
        fluid(maxWidth: 300, maxHeight: 300, cropFocus: CENTER) {
          ...GatsbyImageSharpFluid
        }
      }
    }
    site {
      siteMetadata {
        title
        author {
          name
          summary
        }
      }
    }
    allMdx(sort: { fields: [frontmatter___date], order: DESC }) {
      nodes {
        excerpt
        fields {
          slug
        }
        frontmatter {
          date(formatString: "YYYY.MM.DD")
          title
          description
          categories
          tags
          featuredImage {
            childImageSharp {
              fluid(maxWidth: 700, maxHeight: 300, cropFocus: CENTER) {
                ...GatsbyImageSharpFluid
              }
            }
          }
        }
      }
      distinct(field: frontmatter___categories)
    }
  }
`
