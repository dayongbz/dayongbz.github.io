import React, { useEffect, useRef, memo, useContext } from "react"

import postList from "../css/components/post-list"
import PostItem from "./PostItem"

import {
  GlobalDispatchContext,
  GlobalStateContext,
} from "../context/GlobalContextProvider"

const PostList = memo(({ defaultPosts, seriesGroup }) => {
  const state = useContext(GlobalStateContext)
  const dispatch = useContext(GlobalDispatchContext)
  const parentRef = useRef()

  useEffect(() => {
    // filtering posts each tab
    if (state.postTab !== "all") {
      console.log(seriesGroup.filter(item => item.series === state.postTab))
      dispatch({
        type: "SET_POSTS",
        posts:
          seriesGroup.filter(item => item.series === state.postTab)[0].nodes ||
          defaultPosts,
      })
    } else {
      dispatch({ type: "SET_POSTS", posts: defaultPosts })
    }
  }, [state.postTab, defaultPosts, seriesGroup, dispatch])

  useEffect(() => {
    // lazy load
    if (parentRef.current) {
      const parent = parentRef.current
      const elements = Array.from(parent.children)
      const target = elements[state.visiblePostCount - 1]

      const observer = new IntersectionObserver(
        entries => {
          entries.forEach(entry => {
            if (
              entry.isIntersecting &&
              state.posts.length > state.visiblePostCount
            ) {
              dispatch({ type: "ADD_VISIBLE_POST_COUNT" })
            }
          })
        },
        { threshold: 0.8 }
      )
      if (target) observer.observe(target)
      return () => {
        if (target) observer.unobserve(target)
      }
    }
  }, [dispatch, state.posts, state.visiblePostCount])

  return (
    <>
      {state.posts?.length ? (
        <ol ref={parentRef} css={postList}>
          {state.visiblePostCount &&
            state.posts
              ?.slice(0, state.visiblePostCount)
              .map(post => <PostItem key={post.fields.slug} post={post} />)}
        </ol>
      ) : (
        <p>No blog posts found.</p>
      )}
    </>
  )
})

export default PostList
