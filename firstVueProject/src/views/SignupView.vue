<template>
  <div class="background">
    <div class="shape"></div>
    <div class="shape"></div>
  </div>
  <form @submit.prevent="post">
    <h3>Signup</h3>

    <label>Username</label>
    <input type="text" placeholder="Enter Username" v-model="newUser.username" />

    <label>Email</label>
    <input
      type="text"
      placeholder="Enter Email"
      @input="checkEmail"
      v-model="newUser.email"
      required
    />

    <span v-if="emailError" class="error-message">{{ emailError }}</span>

    <label>Password</label>
    <input
      type="password"
      placeholder="Enter Password"
      @input="(event) => checkPassword(event)"
      v-model="newUser.password"
      required
    />

    <span v-if="passwordError" class="error-message">{{ passwordError }}</span>

    <button type="submit">Signup</button>
    <RouterLink to="/login" class="button">Already have an account? Login</RouterLink>
  </form>
</template>

<script setup>
import store from '@/store'
import { ElMessage } from 'element-plus'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const newUser = ref({
  username: '',
  email: '',
  password: ''
})

const emailError = ref('')
const passwordError = ref('')

function checkEmail() {
  if (!newUser.value.email) {
    emailError.value = ''
  } else if (!/\S+@\S+\.\S+/.test(newUser.value.email)) {
    emailError.value = 'Please enter a valid email address.'
  } else {
    emailError.value = ''
  }
}

function checkPassword(event) {
  if (!newUser.value.password) {
    passwordError.value = ''
  } else if (newUser.value.password.toUpperCase() === newUser.value.password && newUser.value.password.toLowerCase() !== newUser.value.password && !event.shiftKey ) {
    passwordError.value = 'Warning: Caps Lock is on!'
  } else if (!/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/.test(newUser.value.password)) {
    passwordError.value =
      'Password must be minimum eight characters, at least one letter and one number.'
  }
  else {
    passwordError.value = ''
  }
}

async function post() {
  try {
    if (!newUser.value.email || !newUser.value.password || !newUser.value.username) {
      ElMessage.error('Please fill out all the fields')
      return
    }

    if (passwordError.value != '' || emailError.value != '') {
      return
    }

    await store.dispatch('addUser', newUser.value)
    newUser.value = {
      username: '',
      email: '',
      password: ''
    }
    
    router.push({ name: 'posts' })
  } catch (error) {
    if (error.response.status == 400) {
      ElMessage.error('user already exists.')
      return
    }
    ElMessage.error('An error occurred. Please try again later.')
  }
}
</script>

<style scoped>
*,
*:before,
*:after {
  padding: 0;
  margin: 0;
  box-sizing: border-box;
}
body {
  background-color: #080710;
}
.background {
  width: 430px;
  height: 520px;
  position: absolute;
  transform: translate(-50%, -50%);
  left: 50%;
  top: 50%;
}
.background .shape {
  height: 200px;
  width: 200px;
  position: absolute;
  border-radius: 50%;
}
.shape:first-child {
  background: linear-gradient(to left, #638071, #c3dbd3);
  right: -30px;
  top: -80px;
}
.shape:last-child {
  background: linear-gradient(to right, #638071, #c3dbd3);
  left: -80px;
  bottom: -80px;
}
form {
  height: 520px;
  width: 400px;
  background-color: rgba(255, 255, 255, 0.13);
  position: absolute;
  transform: translate(-50%, -50%);
  top: 50%;
  left: 50%;
  border-radius: 10px;
  backdrop-filter: blur(10px);
  border: 2px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 0 40px rgba(8, 7, 16, 0.6);
  padding: 50px 35px;
}
form * {
  font-family: 'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', Arial,
    sans-serif;
  color: gray;
  letter-spacing: 0.5px;
  outline: none;
  border: none;
}
form h3 {
  font-size: 32px;
  font-weight: 500;
  line-height: 0px;
  text-align: center;
}

a:hover {
  text-decoration: underline;
}

label {
  display: block;
  margin-top: 30px;
  font-size: 16px;
  font-weight: 500;
}
input {
  display: block;
  height: 50px;
  width: 100%;
  background-color: #c3dbd357;
  border-radius: 3px;
  padding: 0 10px;
  margin-top: 8px;
  font-size: 14px;
  font-weight: 300;
}

.error-message {
  color: rgba(255, 0, 0, 0.675);
  font-size: 12px;
  font-weight: bold;
  margin-top: 3px;
  margin-bottom: 16px;
  position: absolute;
  /* background-color: palegoldenrod; */
  width: 82%;
  text-align: center;
}

::placeholder {
  color: rgba(128, 128, 128, 0.532);
}

button {
  margin-top: 40px;
  width: 100%;
  background-color: #ffffff;
  color: #44574b;
  padding: 15px 0;
  font-size: 18px;
  font-weight: 600;
  border-radius: 5px;
  cursor: pointer;
}
.button {
  text-align: center;
  width: 100%;
  padding: 15px 0;
  font-size: 16px;
  cursor: pointer;
}
</style>
