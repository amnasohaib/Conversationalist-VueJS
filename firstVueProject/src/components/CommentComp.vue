<script setup>
import { ref, onMounted, computed } from 'vue'
import { UserFilled, DeleteFilled } from '@element-plus/icons-vue'
import store from '@/store'
import axios from 'axios';


const currUser = JSON.parse(localStorage.getItem('user-info'))

const description = ref('')

const API_BASE_URL = 'http://localhost:3000/'

// const items = computed(() => {
//   let x = store.getters.getComments
//   console.log(x)
//   return x
// })

const items = ref({})

const postId = computed(() => {
  let x = store.getters.getPostId
  console.log(x)
  return x
})

// const user = computed(() => {
//   let x = store.getters.getUsers
//   console.log(x)
//   return x
// })

onMounted(async () => {
  // await store.dispatch('fetchComments')
  
  fetchData();

  await store.dispatch('fetchUser')
  // console.log(user.value)
})

async function fetchData() {
  console.log('post id ', postId.value)
  console.log('connecting with  machine ')
    const response = await axios.post(`${API_BASE_URL}dashboard`, {
      transition: 'GETCOMMENTS',
      data: {
        PostId: postId.value
      }
    })

    console.log(response.data)

    items.value = response.data.comments
}


async function post() {
  try {
    console.log('description commentcomp ',description)
    if (!description.value) {
      alert('Description is Empty!')
      return
    }

    const payload = { username: currUser.username, description: description.value }
    console.log('payload ',payload)
    // const response = await axios.post(`http://localhost:3000/api/posts/${post}/comments`, payload)
    
    const response = await axios.post(`${API_BASE_URL}dashboard`, {
      transition: 'POSTCOMMENTS',
      data: {
        PostId: postId.value,
        username: currUser.username, 
        description: description.value
      }
    })
    
    console.log(response.data)

    fetchData();
    // location.reload()
  } catch (error) {
    console.error('Error during post:', error)
    alert('An error occurred. Please try again later.')
  }
}

async function deletePost(CommentId) {
  try {
    console.log(CommentId)
    store.dispatch('deleteComment', CommentId)
    fetchData();
    // location.reload()
  } catch (error) {
    console.log(error)
    return error
  }
}


async function hasClickedLike(commentId) {
  try {
    console.log('comment id ',commentId,' curr user id ',currUser._id)
    // store.dispatch('fetchCommentLikes', {commentId: commentId, userId: currUser._id})

    const response = await axios.post(`${API_BASE_URL}dashboard`, {
      transition: 'LIKECOMMENT',
      data: {
        PostId: postId.value,
        UserId: currUser._id, 
        CommentId: commentId
      }
    })
    
    console.log(response.data)

    fetchData();
    // location.reload()
  } catch (error) {
    console.log(error)
    return error
  }
}

</script>

<template>
  <div
    v-for="item in items"
    :key="item._id"
    style="display: flex; flex-direction: column"
    class="post-card"
  >
    <div style="display: flex">
      <div style="width: 100%">
        <div class="post-icon">
          <div class="icon-container">
            <div class="icon">
              <el-icon><UserFilled /></el-icon>
            </div>
            <div class="name">{{ item.username }}</div>
          </div>
          <div>
            <p class="description">
              {{ item.description }}
            </p>
          </div>
        </div>
      </div>

      <div style="display: flex; flex-direction: row-reverse">
        <div>
          <div class="like-comment">
            <div>
              <el-icon
              v-if="item.likes.includes(currUser._id)"
              class="interactive-icon"
              @click="hasClickedLike(item._id)"
            >
            <StarFilled/>
            </el-icon>

            <el-icon class="interactive-icon" v-else @click="hasClickedLike(item._id)"
              ><Star/>
            </el-icon>
            <label>{{ item.likes.length }}</label>
            </div>
            <div v-if="item.username == currUser.username" class="delete-icon">
          <el-icon @click="deletePost(item._id)"><DeleteFilled /></el-icon
            >
        </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <el-container class="container">
        <div class="input-comment">
          <div class="icon-container-comment">
            <div class="icon">
              <el-icon><UserFilled /></el-icon>
            </div>
            <div class="name">{{ currUser.username }}</div>
          </div>
          <!-- <div class="input-card"> -->
          <textarea
            v-model="description"
            class="input-card"
            placeholder="Add a Comment"
          ></textarea>
          <el-button class="postButton" type="info" round @click="post">Post</el-button>
          <!-- </div> -->
        </div>
      </el-container>

</template>

<style scoped>
.material-symbols-outlined {
  color: #e5e5e5;
  margin: 5px;
  align-content: center;
  cursor: pointer;

  font-variation-settings:
    'FILL' 0,
    'wght' 300,
    'GRAD' 0,
    'opsz' 24;
}

.post-card {
  display: flex;
  justify-content: space-between;
  padding-left: 40px;
  padding-right: 20px;
}

.post-icon {
  margin-top: 10px;
  display: flex;
  width: 100%;
}

.icon {
  background-color: #808d84;
  width: 40px;
  height: 40px;
  text-align: center;
  align-content: center;
  border-radius: 50%;
}

.description {
  width: 100%;
}

.delete-icon {
  color: #e5e5e5;
}

.el-dropdown-link {
  color: #e5e5e5;
  cursor: pointer;
}

.dropdown {
  background-color: #e5e5e5;
}

.icon-container {
  margin-right: 2%;
  margin-top: 1%;
  margin-bottom: 2%;
}

.name {
  color: #e5e5e5;
  font-size: 13px;
  text-align: center;
}

p {
  align-content: center;
  margin-left: 20px;
  color: #e5e5e5;
}

.dialog-content p {
  font-size: 16px;
  color: #4d5d53;
}

.input {
  color: #4d5d53;
  height: 25px;
  border-radius: 5px;
  background-color: #e5e5e5;
  margin-left: 15px;
  padding-left: 15px;
  padding-right: 15px;
  border-color: transparent;
}

.like-comment {
  margin-top: 30px;
  display: flex;
  width: 100%;
}

.interactive-icon {
  color: white;
  margin-right: 10px;
}

label {
  color: white;
  margin-left: 4px;
  margin-bottom: 10px;
  font-size: 13px;
}

.comments {
  display: flex;
  flex-direction: row;
  width: 100%;
  margin-bottom: 10px;
  background-color: #808d84;
}

a.router-link-exact-active {
  background-color: transparent;
  color: #e5e5e5;
}

.container {
  padding-left: 40px;
  padding-right: 20px;
  
  /* width: 90%; */
  display: flex;
  flex-direction: column;
}

.input-comment {
  display: flex;
  flex-direction: row;
  /* width: 50%; */
  margin: 20px;
}

.input-card {
  resize: none;
  color: white;
  background-color: #4d5d53;
  width: 100%;
  height: 30px;
  margin: 1%;
  margin-top: 5%;
  border-radius: 20px;
  padding: 2%;
  align-content: center;
}

.input-card:focus {
  outline: none;
}

::placeholder {
  color: rgb(195, 194, 194);
}

.icon-container-comment {
  margin-top: 5%;
}

.postButton {
  margin-top: 6%;
}

</style>
