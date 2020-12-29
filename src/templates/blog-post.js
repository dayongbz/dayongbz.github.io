import React from "react"
import { Link, graphql } from "gatsby"
import { MDXRenderer } from "gatsby-plugin-mdx"
import Image from "gatsby-image"
import { css } from "@emotion/react"

import Layout from "../components/Layout"
import SEO from "../components/Seo"
import Utterances from "../components/Utterances"
import TableOfContents from "../components/TableOfContents"
import SponsorButton from "../components/SponsorButton"

const markdownBody = css`
  ul,
  ol {
    ul,
    ol {
      margin-top: var(--spacing-0);
      margin-bottom: var(--spacing-0);
    }
  }

  table {
    display: block;
    width: 100%;
    margin-bottom: var(--spacing-8);
    tr {
      background-color: var(--color-background);
      border-top: 1px solid var(--color-markdown-table-tr-border);
      :nth-of-type(2n) {
        background-color: var(--color-bg-tertiary);
      }
    }

    td,
    th {
      padding: var(--spacing-2) var(--spacing-3);
      border: 1px solid var(--color-markdown-table-border);
    }
  }

  blockquote {
    color: var(--color-text-light);
    padding: var(--spacing-0) var(--spacing-4);
    border-left: var(--spacing-1) solid var(--color-markdown-blockquote-border);
    margin: var(--spacing-0);
  }

  code {
    font-size: var(--fontSize-0);
    padding: var(--spacing-1) var(--spacing-1);
    background-color: var(--color-markdown-code-bg);
    border-radius: 6px;
  }
`

const BlogPostTemplate = ({ data, location }) => {
  const post = data.mdx
  const author = data.site.siteMetadata?.author
  const siteTitle = data.site.siteMetadata?.title || `Title`
  const { previous, next } = data
  const avatar = data.avatar?.childImageSharp.fixed
  const tocItems = post.tableOfContents?.items
  const isTOCVisible = tocItems?.length
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
        <div css={markdownBody} className="markdown-body">
          <article itemProp="articleBody">
            <MDXRenderer>{post.body}</MDXRenderer>
          </article>
        </div>
        {isTOCVisible && (
          <TableOfContents items={tocItems} location={location} depth={3} />
        )}
      </article>
      <div className="sponsor-button-wrapper">
        <SponsorButton
          href="https://www.buymeacoffee.com/dayongbz"
          text="🍗 Buy me a chicken"
        />
      </div>
      <hr />
      <Utterances repo="dayongbz/utterances_comment" />
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
    mdx(id: { eq: $id }) {
      id
      excerpt(pruneLength: 160)
      body
      tableOfContents
      frontmatter {
        title
        date(formatString: "YYYY.MM.DD")
        description
      }
    }
    previous: mdx(id: { eq: $previousPostId }) {
      fields {
        slug
      }
      frontmatter {
        title
      }
    }
    next: mdx(id: { eq: $nextPostId }) {
      fields {
        slug
      }
      frontmatter {
        title
      }
    }
  }
`
