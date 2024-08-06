import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import LayoutView from '../views/LayoutView.vue'
import LoginView from '@/views/LoginView.vue'
import SignupView from '@/views/SignupView.vue'
import ProfileView from '../views/ProfileView.vue'
import Settings from '../components/SettingsComp.vue'
import PostCard from '../components/PostCard.vue'
import UserAccount from '@/views/UserAccount.vue'
import CommentComp from '../components/CommentComp.vue'

function guardRoute(to, from, next) {
  var isAuthenticated = false

  console.log(localStorage.getItem('user-info'))
  if (localStorage.getItem('user-info')) {
    isAuthenticated = true
  } else isAuthenticated = false

  if (isAuthenticated) {
    next() // allow to enter route
  } else {
    next('/login') // go to '/login';
  }
}

function unGuardRoute(to, from, next) {
  var isAuthenticated = false

  console.log(localStorage.getItem('user-info'))
  if (localStorage.getItem('user-info')) {
    isAuthenticated = true
  } else isAuthenticated = false

  if (!isAuthenticated) {
    next() // allow to enter route
  } else {
    next('/') // go to '/';
  }
}

const router = createRouter({
  history: createWebHistory('/'),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: LoginView,
      beforeEnter: unGuardRoute
    },
    {
      path: '/signup',
      name: 'signup',
      component: SignupView,
      beforeEnter: unGuardRoute
    },
    {
      path: '/',
      name: 'landing',
      component: LayoutView,
      beforeEnter: guardRoute,
      children: [
        {
          path: '',
          name: 'home',
          component: HomeView,
          children: [
            {
              path: '',
              name: 'posts',
              component: PostCard,
              children: [
                {
                  path: 'comments',
                  name: 'home-comments',
                  component: CommentComp,
                }
              ]
            }
          ]
        },
        {
          path: 'profile',
          name: 'profile',
          component: ProfileView,
          children: [
            {
              // UserProfile will be rendered inside User's <router-view>
              path: '',
              component: UserAccount,
              children: [
                {
                  path: 'comments',
                  name: 'profile-comments',
                  component: CommentComp,
                }
              ]
            },
            {
              path: 'settings',
              component: Settings
            }
          ]
        }
      ]
    }
  ]
})

export default router
