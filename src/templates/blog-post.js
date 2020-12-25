import React, { useState, useEffect } from "react"
import { Link, graphql } from "gatsby"
import Image from "gatsby-image"

import Layout from "../components/layout"
import SEO from "../components/seo"
import Utterances from "../components/Utterances"
import TableOfContents from "../components/TableOfContents"

const BlogPostTemplate = ({ data, location }) => {
  const post = data.markdownRemark
  const author = data.site.siteMetadata?.author
  const siteTitle = data.site.siteMetadata?.title || `Title`
  const { previous, next } = data
  const avatar = data?.avatar?.childImageSharp?.fixed
  const isToc = post.tableOfContents.length > 0
  const [currentHeaderUrl, setCurrentHeaderUrl] = useState()
  const isDark = document
    .getElementsByTagName("body")[0]
    .classList.contains("dark")

  useEffect(() => {
    const scroll = () => {
      // toc
      const isToc =
        document.getElementsByClassName("toc-wrapper")[0].offsetWidth > 0
      if (isToc) {
        let tempCurrentUrl
        const currentOffsetY = window.pageYOffset
        const headerElements = document.getElementsByClassName("anchor-header")
        for (const elem of headerElements) {
          const elemTop = elem.getBoundingClientRect().top + currentOffsetY
          if (currentOffsetY > elemTop) {
            tempCurrentUrl = elem.href.split(location.origin)[1]
          }
        }
        setCurrentHeaderUrl(tempCurrentUrl)
      }
    }
    window.addEventListener("scroll", scroll)
    return () => {
      window.removeEventListener("scroll", scroll)
    }
  }, [location.origin])

  return (
    <Layout location={location} title={siteTitle}>
      <SEO
        title={post.frontmatter.title}
        description={post.frontmatter.description || post.excerpt}
      />
      <article
        className="blog-post"
        itemScope
        itemType="http://schema.org/Article"
      >
        <header>
          <h1 itemProp="headline">{post.frontmatter.title}</h1>
          <div className="info-wrapper">
            {avatar && (
              <Image
                fixed={avatar}
                alt={author?.name || ``}
                imgStyle={{
                  borderRadius: `50%`,
                }}
              />
            )}
            <p>
              {author.name} / {post.frontmatter.date}
            </p>
          </div>
        </header>
        <div className="section-wrapper">
          <section
            dangerouslySetInnerHTML={{ __html: post.html }}
            itemProp="articleBody"
          />
          {isToc && (
            <TableOfContents
              items={post.tableOfContents}
              currentHeaderUrl={currentHeaderUrl}
            />
          )}
        </div>
        <hr />
        <Utterances
          repo="dayongbz/utterances_comment"
          theme={isDark ? "github-dark" : "github-light"}
        ></Utterances>
        <hr />
      </article>
      <nav className="blog-post-nav">
        <ul
          style={{
            display: `flex`,
            flexWrap: `wrap`,
            justifyContent: `space-between`,
            listStyle: `none`,
            padding: 0,
          }}
        >
          <li>
            {previous && (
              <Link to={previous.fields.slug} rel="prev">
                ← {previous.frontmatter.title}
              </Link>
            )}
          </li>
          <li>
            {next && (
              <Link to={next.fields.slug} rel="next">
                {next.frontmatter.title} →
              </Link>
            )}
          </li>
        </ul>
      </nav>
    </Layout>
  )
}

export default BlogPostTemplate

export const pageQuery = graphql`
  query BlogPostBySlug(
    $id: String!
    $previousPostId: String
    $nextPostId: String
  ) {
    avatar: file(absolutePath: { regex: "/profile-pic.jpg/" }) {
      childImageSharp {
        fixed(width: 30, height: 30, quality: 95) {
          ...GatsbyImageSharpFixed
        }
      }
    }
    site {
      siteMetadata {
        author {
          name
        }
        title
      }
    }
    markdownRemark(id: { eq: $id }) {
      id
      excerpt(pruneLength: 160)
      html
      tableOfContents
      frontmatter {
        title
        date(formatString: "YYYY.MM.DD")
        description
      }
    }
    previous: markdownRemark(id: { eq: $previousPostId }) {
      fields {
        slug
      }
      frontmatter {
        title
      }
    }
    next: markdownRemark(id: { eq: $nextPostId }) {
      fields {
        slug
      }
      frontmatter {
        title
      }
    }
  }
`
