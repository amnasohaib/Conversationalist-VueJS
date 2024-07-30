<script setup>
import { UserFilled } from '@element-plus/icons-vue'
import axios from 'axios'
import { ElMessage } from 'element-plus'
import { onMounted, ref } from 'vue'

// const data = computed(() => {
//   let x = store.getters.getSpecificUser
//   console.log('user acc computed ', x)
//   return x
// })

const data = ref({})

const API_BASE_URL = 'http://localhost:3000/'

onMounted(async () => {
  try {
    const userdata = JSON.parse(localStorage.getItem('user-info'))
    // await store.dispatch('fetchSpecificUser', { id: userdata._id })

    console.log('connecting with  machine')
    const response = await axios.post(`${API_BASE_URL}dashboard`, {
      transition: 'GETSPECIFICUSER',
      data: {
        userId: userdata._id
      }
    })

    data.value = response.data.user

  } catch (error) {
    return error
  }
})

const description = ref('')
const image = ref(null)

function convertToBase64(file) {
  return new Promise((resolve, reject) => {
    const fileReader = new FileReader()
    fileReader.readAsDataURL(file)
    fileReader.onload = () => {
      resolve(fileReader.result)
    }
    fileReader.onerror = (error) => {
      reject(error)
    }
  })
}

async function handleFileUpload(e) {
  const file = e.target.files[0]
  const base64 = await convertToBase64(file)

//   const img = new Image();
// img.src = base64;

// // Resize the image (e.g., to 300x200)
// const canvas = document.createElement('canvas');
// canvas.width = 300;
// canvas.height = 200;
// const ctx = canvas.getContext('2d');
// ctx.drawImage(img, 0, 0, 300, 200);

// // Get the resized base64 string
// const resizedBase64 = canvas.toDataURL('image/jpeg', 0.8); 



  image.value = base64
  console.log(image.value)
}

async function post() {
  if (!description.value) {
    ElMessage.error('Description is Empty!')
    return
  }

  try {
    const payload = {
      username: data.value.username,
      description: description.value,
      myFile: image.value
    }

    await axios.post('http://localhost:3550/api/posts/', payload)

    // console.log('connecting with  machine')
    // const response = await axios.post(`${API_BASE_URL}dashboard`, {
    //   transition: 'ADDPOST',
    //   data: {
    //     username: data.value.username,
    //   description: description.value,
    //   myFile: image.value
    //   }
    // })

    // console.log(response.data);

    location.reload()
  } catch (error) {
    console.error('Error during post:', error)
  }
}
</script>

<template>
  <h1>all posts</h1>
  <main>
    <el-scrollbar class="scrollbar">
      <el-container class="container">
        <div class="input">
          <div class="icon-container">
              <el-icon class="icon"><UserFilled /></el-icon>
            <div class="name">@{{ data.username }}</div>
          </div>
          <div class="text-image">
          <textarea
            v-model="description"
            class="input-card"
             placeholder="update and post"
            ></textarea>
            <!-- placeholder="What's on your mind?.." -->
          <div class="file-upload">
            <el-icon><PictureFilled /></el-icon>
            <label for="file-upload" class="custom-file-upload">Get Image</label>
          </div>
          <input
            type="file"
            name="myFile"
            id="file-upload"
            accept=".jpeg, .png, .jpg"
            @change="
              (e) => {
                handleFileUpload(e)
              }
            "
          />
        </div>
          <el-button class="postButton" type="info" round @click="post">Post</el-button>
        </div>
      </el-container>
      <router-view />
    </el-scrollbar>
  </main>
</template>

<style scoped>
input[type='file'] {
  display: none;
}

h1 {
  color: #4d5d53;
  font-family: mainFont;
  text-align: center;
}

.container {
  justify-content: center;
  width: 100%;
  display: flex;
  flex-direction: column;
}

.name {
  color: #4d5d53;
  font-size: 17px;
  text-align: center;
}

.text-image {
  width: 100%;
  display: flex;
  margin: 15px;
  padding: 10px;
  background-color: #7386787e;
  border-radius: 5px;
  text-align: center
}

.input {
  display: flex;
  flex-direction: row;
  margin: 20px;
}

.icon-container {
  margin-top: 5%;
  text-align: center
}

.icon {
  position: relative;
  background-color: #738678;
  color: #e5e5e5;
  width: 40px;
  height: 40px;
  text-align: center;
  align-content: center;
  border-radius: 50%;
}

::placeholder {
  color: #000;
}

.input-card {
  resize: none;
  color: #000;
  background-color: transparent;
  width: 100%;
  height: 70px;
  margin: 1%;
  border-radius: 20px;
  padding: 2%;
  font-size: 15px;
  align-content: center;
  border-color: transparent;
}

.input-card:focus {
  outline: none;
}

.file-upload {
  margin-top: 6%;
  margin-left: -2%;
  margin-right: 1%;
  display: flex;
  flex-direction: column;
  background-color: #738678;
  color: #e5e5e5;
  width: 110px;
  height: 40px;
  border-radius: 5px;
  align-items: center;
  justify-content: center;
}

label {
  font-size: 13px;
}

label:hover {
  font-weight: bold;
  cursor: pointer;
}

textarea::-webkit-scrollbar {
  width: 5px;
  margin-right: 5px;
}

textarea::-webkit-scrollbar-track {
  -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
}

textarea::-webkit-scrollbar-thumb {
  background-color: darkgrey;
}

.postButton {
  margin-top: 6%;
}

.scrollbar {
  margin-left: 5%;
  margin-right: 5%;
  padding: 10px;
}

@media (min-width: 1024px) {
  .input {
    display: flex;
    flex-direction: row;
  }
}
</style>
