<script setup>
import { RouterLink } from 'vue-router'
import { UserFilled } from '@element-plus/icons-vue'
</script>

<template>
  <div class="common-layout">
    <el-container>
      <el-header class="header">
        <h2>Conversationalist</h2>

        <nav>
          <RouterLink to="/">Home</RouterLink>
          <RouterLink to="/profile">
            <el-icon><UserFilled class="icon" /></el-icon>
          </RouterLink>
        </nav>
      </el-header>

      <el-main>
        <router-view />
        <!-- to show the data at said route -->
      </el-main>
    </el-container>
  </div>
</template>

<style>
@import url('https://fonts.googleapis.com/css2?family=Cinzel+Decorative:wght@400;700;900&family=EB+Garamond:ital,wght@0,400..800;1,400..800&display=swap');
</style>

<style scoped>
main {
  min-height: 100%;
  background-image: url("../assets/bg.avif");
  background-size: cover;
}
</style>

<style>
html,
body, .common-layout {
  height: 100%;
  margin: 0;
  padding: 0;
}

@font-face {
  src: url(../assets/font.otf);
  font-family: mainFont;
}

* {
  font-family: 'EB Garamond', serif;
}

h2 {
  font-family: 'Cinzel Decorative', serif;
  font-weight: 400;
  font-style: normal;
  color: #e5e5e5;
}

.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: #4d5d53;
  line-height: 1.5;
}

.textField {
  margin-right: 5px;
  width: 150px;
  border-radius: 30px;
  background-color: #738678;
  border-color: transparent;
}

.icon {
  margin-top: 5px;
  color: rgb(207, 199, 199);
}

nav {
  display: flex;
}

a.router-link-exact-active {
  color: var(--color-text);
  background-color: #738678;
  color: #e5e5e5;
}

a {
  display: inline-block;
  padding: 0 1rem;
  border-radius: 40px;
  margin-left: 5px;
}

a :active {
  text-decoration: none;
  border: none;
  border-color: transparent;
}

a:not(.router-link-exact-active):hover {
  background-color: #738678;
}

@media (min-width: 1024px) {
  .textField {
    width: 300px;
  }
}
</style>
