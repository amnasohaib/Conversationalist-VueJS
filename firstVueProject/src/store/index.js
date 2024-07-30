import axios from 'axios'
import { createStore } from 'vuex'
import { ElMessage } from 'element-plus'

export default createStore({
  state: {
    user: [],
    posts: [],
    specificUser: {},
    specificData: [],
    postId: null,
    comments: []
  },
  mutations: {
    // user 
    SET_USER(state, data) {
      state.user = data
    },
    SET_SPECIFIC_USER(state, data) {
      state.specificUser = data
    },
    ADD_USER(state, data) {
      state.user.push(data)
    },
    UPDATE_USER(state, updatedItem) {
      const index = state.user.findIndex((item) => item.id === updatedItem.id)
      if (index !== -1) {
        state.user.splice(index, 1, updatedItem)
      }
    },

    // posts
    SET_DATA(state, data) {
      state.posts = data
    },
    SET_SPECIFIC_DATA(state, data) {
      state.specificData = data
    },
    DELETE_DATA(state, id) {
      state.posts = state.posts.filter(post => post._id !== id)
    },
    UPDATE_DATA(state, updatedItem) {
      const index = state.posts.findIndex((item) => item._id === updatedItem.id)
      if (index !== -1) {
        state.posts.splice(index, 1, updatedItem)
      }
    },
    SET_POSTID(state, data) {
      state.postId = data
    },

    // comments
    SET_COMMENTS(state, data) {
      state.comments = data
    },
    DELETE_COMMENT(state, id) {
      state.comments = state.comments.filter(comment => comment._id !== id)
    },
  },
  actions: {
    // user
    async fetchUser({ commit }) {
      const response = await axios.get('http://localhost:3550/api/users/')
      
      commit('SET_USER', response.data)
    },

    async fetchSpecificUser({ commit }, {id}) {
      const response = await axios.get(`http://localhost:3550/api/users/${id}`)
      console.log(response.data.password)
      commit('SET_SPECIFIC_USER', response.data)
    },

    async addUser({ commit }, user) {
      const response = await axios.post('http://localhost:3550/api/users/', user)
      
      commit('ADD_USER', response.data)
      localStorage.setItem('user-info', JSON.stringify(response.data))
    },

    async loginUser({ commit }, { email, password }) {
      console.log('logging user')
      console.log(email, password)
      const response = await axios.post('http://localhost:3550/api/users/login/', {
        email,
        password
      })
      console.log(response.data)
      if (response.status === 200) {
        localStorage.setItem('user-info', JSON.stringify(response.data))
      } else if (response.status === 400) {
        ElMessage.error('Incorrect Email or Password')
      }
    },

    async updateUser({ commit }, updatedItem) {
      try {
        const response = await axios.put(`http://localhost:3550/api/users/${updatedItem._id}`, updatedItem)
        commit('UPDATE_USER', updatedItem)
        localStorage.clear()
        localStorage.setItem('user-info', JSON.stringify(response.data))
      } catch (error) {
        if (error.response.status == 400) {
          ElMessage.error('User already exists.')
          return
        }
        ElMessage.error('An error occurred. Please try again later.')
      }
    },

    // posts
    async fetchData({ commit }) {
      const response = await axios.get('http://localhost:3550/api/posts/')
      commit('SET_DATA', response.data)
    },

    async fetchSpecificData({ commit }, username) {
      const response = await axios.get(`http://localhost:3550/api/posts/${username}`)
      console.log('store specific data ',response.data)
      commit('SET_SPECIFIC_DATA', response.data)
    },

    async fetchLikes({commit}, {id, userId}) {
      console.log('post id ',id,' curr user id ',userId)
      await axios.post(`http://localhost:3550/api/posts/${id}/like`, {
        userId: userId
      });
    },

    async deleteData({ commit }, id) {
      console.log('store ',id)
      const response = await axios.delete(`http://localhost:3550/api/posts/${id}`)
      if (response.status === 200) {
        commit('DELETE_DATA', id)
      }
    },

    async updateData({ commit }, updatedItem) {
      await axios.put(`http://localhost:3550/api/posts/${updatedItem._id}`, updatedItem)
      commit('UPDATE_DATA', updatedItem)
    },

    updatePostId({ commit }, id) {
      commit('SET_POSTID', id)
    },

    // comments
    async fetchComments({ commit }) {
      const response = await axios.get(`http://localhost:3550/api/posts/${this.state.postId}/comments`)
      commit('SET_COMMENTS', response.data)
    },

    async fetchCommentLikes({commit}, {commentId, userId}) {
      console.log('comment id ',commentId,' curr user id ',userId)
      await axios.post(`http://localhost:3550/api/posts/${this.state.postId}/comment/like`, {
        commentId: commentId,
        userId: userId
      });
    },

    async deleteComment({ commit }, id) {
      console.log('store ',id)
      const response = await axios.delete(`http://localhost:3550/api/posts/${this.state.postId}/comment/${id}`)
      if (response.status === 200) {
        commit('DELETE_COMMENT', id)
      }
    },
  },
  getters: {
    getUsers: (state) => state.user,

    getSpecificUser: (state) => state.specificUser,

    getData: (state) => state.posts,

    getSpecificData: (state) => state.specificData,

    getPostId: (state) => state.postId,

    getComments: (state) => state.comments,
  }
})
