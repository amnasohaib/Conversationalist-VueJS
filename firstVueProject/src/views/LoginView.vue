<template>
  <div class="background">
    <div class="shape"></div>
    <div class="shape"></div>
  </div>
  <form @submit.prevent="fetch">
    <h3>Login Here</h3>

    <label>Email</label>
    <input type="text" placeholder="Enter Email" @input="checkEmail" v-model="email" />

    <span v-if="emailError" class="error-message">{{ emailError }}</span>

    <label>Password</label>
    <input
      type="password"
      placeholder="Enter Password"
      @input="(event) => checkPassCaps(event)"
      v-model="password"
    />

    <span v-if="passwordCaps" class="error-message">{{ passwordCaps }}</span>

    <button type="submit">Log In</button>
    <RouterLink to="/signup" class="button">Create an Account</RouterLink>
  </form>
</template>

<script setup>
// import {toggleMachine, transition} from '../../../../fsmSErver/fsmSErver/machine';
// import { createMachine, assign, interpret } from 'xstate';
// import store from '@/store'
import { ElMessage } from 'element-plus'
import { ref } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import axios from 'axios'

const router = useRouter()

const email = ref('')
const password = ref('')

const emailError = ref('')
const passwordCaps = ref('')

const API_BASE_URL = 'http://localhost:3000/'

function checkEmail() {
  if (!email.value) {
    emailError.value = ''
  } else if (!/\S+@\S+\.\S+/.test(email.value)) {
    emailError.value = 'Please enter a valid email address.'
  } else {
    emailError.value = ''
  }
}

function checkPassCaps(event) {
  if (!password.value) {
    passwordCaps.value = ''
  } else if (
    password.value.toUpperCase() === password.value &&
    password.value.toLowerCase() !== password.value &&
    !event.shiftKey
  ) {
    passwordCaps.value = 'Warning: Caps Lock is on!'
  } else {
    passwordCaps.value = ''
  }
}

async function fetch() {
  try {
    if (!email.value || !password.value) {
      ElMessage.error('Please fill out all the fields')
      return
    }

    if (emailError.value != '') {
      return
    }

    console.log('connecting with  machine')
    
    const response = await axios.post(`${API_BASE_URL}`, {
      transition: 'LOGIN',
      data: {
        email: email.value,
        password: password.value
      }
    })

    console.log(response.data)
    if (!response.data.errorMessage) {
      localStorage.setItem('user-info', JSON.stringify(response.data.users))
    } else if (response.data.errorMessage == 400) {
      ElMessage.error('Incorrect Email or Password')
    }

    // if (response.data.users !== undefined) {
    //   localStorage.setItem('user-info', JSON.stringify(response.data.users))
    // }
    // await store.dispatch('loginUser', { email: email.value, password: password.value })

    router.push({ name: 'posts' })
  } catch (error) {
    console.error('Error during fetch:', error)
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
  background: linear-gradient(to left, #638071, #61bd92);
  left: -80px;
  top: -80px;
}
.shape:last-child {
  background: linear-gradient(to right, #638071, #c3dbd3);
  right: -30px;
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
  line-height: 42px;
  text-align: center;
}

a:hover {
  text-decoration: underline;
}

label {
  display: block;
  margin-top: 40px;
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
  width: 82%;
  text-align: center;
}

button {
  text-align: center;
  margin-top: 70px;
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

::placeholder {
  color: rgba(128, 128, 128, 0.532);
}
</style>
