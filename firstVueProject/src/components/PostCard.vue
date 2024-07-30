<script setup>
import { ref, onMounted} from 'vue'
import { UserFilled, DeleteFilled, Edit, Comment } from '@element-plus/icons-vue'
import store from '@/store'
import { RouterView } from 'vue-router'
import axios from 'axios';

const showModal = ref(false)

const editItem = ref({})

const currUser = JSON.parse(localStorage.getItem('user-info'))

const showComments = ref([false])

const API_BASE_URL = 'http://localhost:3000/'

// const items = computed(() => {
//   let x = store.getters.getData
//   console.log(x)
//   return x
// })

const items = ref(null)

// const user = computed(() => {
//   let x = store.getters.getUsers
//   console.log(x)
//   return x
// })

onMounted(async () => {
  // await store.dispatch('fetchData')

  console.log('connecting with  machine')
    const response = await axios.post(`${API_BASE_URL}dashboard`, {
      transition: 'GETPOSTS',
      data: {
      }
    })

    console.log(response.data)
    items.value = response.data.posts

  // await store.dispatch('fetchUser')
})


async function deletePost(Postid) {
  try {
    console.log(Postid)
    // store.dispatch('deleteData', Postid)
    console.log('connecting with  machine')
    const response = await axios.post(`${API_BASE_URL}dashboard`, {
      transition: 'DELETEPOST',
      data: {
        id: Postid
      }
    })

    console.log(response.data)
  } catch (error) {
    console.log(error)
    return error
  }
}

function openDialog(data) {
  editItem.value = { ...data }
  showModal.value = true
}

async function updatePost() {
  try {
    // store.dispatch('updateData', editItem.value)

    console.log(editItem.value)

    console.log('connecting with  machine ', editItem.value)
    const response = await axios.post(`${API_BASE_URL}dashboard`, {
      transition: 'UPDATEPOST',
      data: {
        post: editItem.value
      }
    })

    console.log(response.data)
    
    showModal.value = false
    // location.reload()
  } catch (error) {
    console.log(error)
    return error
  }
}

async function hasClickedLike(Postid) {
  try {
    console.log('post id ', Postid, ' curr user id ', currUser._id)
    await store.dispatch('fetchLikes', { id: Postid, userId: currUser._id })
    location.reload()
  } catch (error) {
    console.log(error)
    return error
  }
}

async function comments(id) {
  showComments.value[id] = !showComments.value[id]
  console.log(id)
  await store.dispatch('updatePostId', id)
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
            <div class="name">@{{ item.username }}</div>
          </div>
          <div style="width: 100%;">
            <p class="description">
              {{ item.description }}
            </p>
            <div class="image" v-if="item.myFile">
              <img :src="item.myFile" />
            </div>
            <div v-else></div>
          </div>
        </div>
      </div>

      <div style="display: flex; flex-direction: row-reverse">
        <div v-if="item.username == currUser.username" class="delete-icon">
          <el-dropdown>
            <span class="el-dropdown-link"> ••• </span>
            <template #dropdown>
              <el-dropdown-menu class="dropdown">
                <el-dropdown-item
                  ><el-icon @click="openDialog(item)"><Edit /></el-icon
                ></el-dropdown-item>
                <el-dropdown-item
                  ><el-icon @click="deletePost(item._id)"><DeleteFilled /></el-icon
                ></el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>

        <div style="position: absolute">
          <div class="like-comment">
            <el-icon
              v-if="item.likes.includes(currUser._id)"
              class="interactive-icon"
              @click="hasClickedLike(item._id)"
            >
              <StarFilled />
            </el-icon>

            <el-icon class="interactive-icon" v-else @click="hasClickedLike(item._id)"
              ><Star />
            </el-icon>

            <RouterLink :to="{ name: 'home-comments' }">
              <el-icon class="interactive-icon" @click="comments(item._id)"><Comment /></el-icon>
            </RouterLink>
          </div>

          <div class="count">
            <label>{{ item.likes.length }}</label>
            <label>{{ item.comments.length }}</label>
          </div>
        </div>
      </div>
    </div>
    <div v-if="showComments[item._id]" class="comments">
      <RouterView />
    </div>
    <div v-else></div>
  </div>

  <el-dialog v-model="showModal" title="Edit Data" width="500" align-center class="editModal">
    <div class="dialog-content">
      <p>Edit your description</p>
      <input class="input" v-model="editItem.description" />
    </div>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="showModal = false">Cancel</el-button>
        <el-button type="primary" @click="updatePost"> Confirm </el-button>
      </div>
    </template>
  </el-dialog>
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
  background-color: #808d84;
  border-radius: 7px;
  padding-left: 20px;
  padding-right: 20px;
  margin-bottom: 10px;
}

.post-icon {
  margin-top: 10px;
  display: flex;
  width: 100%;
}

.icon {
  background-color: #4d5d53;
  width: 40px;
  height: 40px;
  text-align: center;
  align-content: center;
  border-radius: 50%;
}

.description {
  width: 82%;
  padding: 10px;
  border-radius: 5px;
}

.delete-icon {
  margin-top: 5px;
  margin-left: 15px;
  margin-right: -8px;
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
  justify-content: center;
}

.name {
  color: #e5e5e5;
  font-size: 17px;
  text-align: center;
}

p {
  align-content: center;
  margin-left: 20px;
  color: #e5e5e5;
}

img {
  width: 50%;
  margin-top: 25px;
  margin-bottom: 25px;
}

.image {
  text-align: center
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
  justify-content: space-between;
}

.count {
  display: flex;
  justify-content: space-between;
  margin-left: 5px;
  width: 60%;
}

.interactive-icon {
  cursor: pointer;
  color: white;
  margin-right: 10px;
}

label {
  color: white;
  margin-bottom: 10px;
  font-size: 13px;
}

.comments {
  display: flex;
  flex-direction: column;
  width: 90%;
  margin-bottom: 10px;
  border-radius: 3px;
  align-self: flex-end;
  margin-right: 20px;
  background-color: #4d5d53ad;
}

a.router-link-exact-active {
  /* color: var(--color-text); */
  background-color: transparent;
  color: #e5e5e5;
}

a:not(.router-link-exact-active):hover {
  background-color: transparent;
}
</style>
