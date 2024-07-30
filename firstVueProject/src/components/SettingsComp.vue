<script setup>
import { computed, onMounted, ref } from 'vue'

const data = computed(() => {
  let x = store.getters.getSpecificUser
  console.log('user acc computed ',x)
  return x
})

const showModal = ref(false)

const editItem = ref({})
const maskedPass = ref('')

onMounted(async () => {
  try {
    const userdata = JSON.parse(localStorage.getItem('user-info'))
  console.log("useracc ",userdata._id)
    await store.dispatch('fetchSpecificUser',{id: userdata._id})
    console.log(data.value)

    maskedPass.value = '• '.repeat(10)

  } catch (error) {
    return error
  }
})

import { useRouter } from 'vue-router'
import store from '@/store'
import { ElMessage } from 'element-plus';
import axios from 'axios';


const API_BASE_URL = 'http://localhost:3000/';

const router = useRouter()

async function logout() {
  
  console.log('connecting with machine')
  const response = await axios.post(`${API_BASE_URL}dashboard`, {
    transition: 'LOGOUT',
    data: {}
  })
  console.log("response.data ",response);
  if (response.status == 200) {
    localStorage.clear()
  }

  router.push({ name: 'login' })
}

function openDialog(item) {
  editItem.value = { ...item }
  showModal.value = true
}

function updateUser() {
  try {
    console.log(editItem.value)
    store.dispatch('updateUser', editItem.value)
    showModal.value = false
    // location.reload()
  } catch (error) {
    if (error.response.status == 400) {
      ElMessage.error('user already exists.')
      return
    }
    ElMessage.error('An error occurred. Please try again later.')
  }
}
</script>

<template>
  <div class="data">
    <label for="">Name</label>
    <p class="textField">{{ data.username }}</p>
    <label for="">Password</label>
    <p class="textField">{{ maskedPass }}</p>
    <label for="">Email</label>
    <p class="textField">{{ data.email }}</p>
    <label for="">Bio</label>
    <p class="textArea">{{ data.bio }}</p>
    <div class="button">
      <el-button @click="logout" type="info">Logout</el-button>
      <el-button @click="openDialog(data)" class="updateButton">Update</el-button>
    </div>
  </div>

  <el-dialog v-model="showModal" title="Edit User" width="500" align-center>
    <div class="dialog-content">
      <div class="input-container">
        <p>Username </p>
        <input class="input" v-model="editItem.username" />
      </div>
      <div class="input-container">
        <p>Edit Email</p>
        <input class="input" v-model="editItem.email" />
      </div>
    </div>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="showModal = false">Cancel</el-button>
        <el-button type="primary" @click="updateUser"> Confirm </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<style scoped>
label {
  margin-bottom: 5px;
  color: #4d5d53;
}

.data {
  display: flex;
  flex-direction: column;
}

.textField {
  padding: 5px;
  color: white;
  height: 30px;
  width: 200px;
  border-radius: 5px;
  background-color: #808d84;
  margin-top: 5px;
  padding-left: 15px;
  padding-right: 15px;
  border-color: transparent;
}

.textArea {
  padding: 5px;
  color: white;
  height: 100px;
  width: 250px;
  border-radius: 5px;
  background-color: #808d84;
  margin-top: 5px;
  padding-left: 15px;
  padding-right: 15px;
  border-color: transparent;
}

.input-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-left: 3rem;
  margin-right: 3rem;
}

.input {
  color: #4d5d53;
  height: 25px;
  border-radius: 5px;
  background-color: #e5e5e5;
  margin-top: 5px;
  padding-left: 15px;
  padding-right: 15px;
  border-color: transparent;
}

.button {
  display: flex;
  flex-direction: row;
  margin-top: 10px;
}

.updateButton {
  background-color: #808d84;
  color: #e5e5e5;
}

.image {
  text-align: center;
}

@media (min-width: 1024px) {
  aside {
    width: 400px;
  }
}
</style>

