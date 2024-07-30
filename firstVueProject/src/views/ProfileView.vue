<script setup>
import { RouterLink } from 'vue-router'
</script>

<template>
  <h1>Profile</h1>
  <el-container class="container">
    <el-aside>
      <ul>
        <li><RouterLink to="/profile">Account</RouterLink></li>
        <li><RouterLink to="/profile/settings">Settings</RouterLink></li>
      </ul>
    </el-aside>
    <el-main>
      <Router-View />
    </el-main>
  </el-container>
</template>

<style scoped>
main {
  display: flex;
  flex-direction: column;
  margin: 2rem;
}

.container {
  display: flex;
  flex-direction: column;
}

ul {
  display: flex;
  flex-direction: row;
  width: 100%;
  justify-content: center;
  margin-right: 40px
}

aside {
  width: 100%;
  display: flex;
  flex-direction: row
}

h1 {
  font-family: mainFont;
  color: gray;
  font-family: mainFont;
  text-align: center;
}

li {
  list-style: none;
  margin-bottom: 10px;
}

a {
  margin-left: -10;
  padding-top: 5px;
  padding-bottom: 5px;
  padding-left: 15px;
  padding-right: 15px;
  color: #e5e5e5;
  background-color: #738678;
}

@media (min-width: 1000px) {
  aside {
    width: 400px;
  }

  .container {
    flex-direction: row
  }

  ul {
    flex-direction: column;
    justify-content: start;
  }
}
</style>
