<template>
  <el-container class="home-container">
    <el-aside width="220px">
      <div class="logo">自习室系统</div>
      <el-menu
        :default-active="activeMenu"
        router
        background-color="#304156"
        text-color="#bfcbd9"
        active-text-color="#409EFF"
      >
        <el-menu-item index="/dashboard">
          <el-icon><House /></el-icon>
          <span>首页</span>
        </el-menu-item>
        <el-menu-item index="/reservation">
          <el-icon><Document /></el-icon>
          <span>座位预约</span>
        </el-menu-item>
        <el-menu-item index="/my-reservations">
          <el-icon><List /></el-icon>
          <span>我的预约</span>
        </el-menu-item>
        <el-menu-item index="/messages">
          <el-icon><Bell /></el-icon>
          <span>消息中心</span>
        </el-menu-item>
        <el-menu-item index="/vip">
          <el-icon><Star /></el-icon>
          <span>VIP中心</span>
        </el-menu-item>
      </el-menu>
    </el-aside>
    
    <el-container>
      <el-header>
        <div class="header-right">
          <span class="username">{{ username }}</span>
          <el-button type="text" @click="handleLogout">退出</el-button>
        </div>//1111111
      </el-header>
      
      <el-main>
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { House, Document, List, Bell, Star } from '@element-plus/icons-vue'

const router = useRouter()
const route = useRoute()
const username = ref(localStorage.getItem('username') || '')

const activeMenu = computed(() => route.path)

const handleLogout = () => {
  localStorage.clear()
  router.push('/login')
}
</script>

<style scoped>
.home-container {
  height: 100vh;
}

.el-aside {
  background-color: #304156;
  overflow-x: hidden;
}

.logo {
  height: 60px;
  line-height: 60px;
  text-align: center;
  color: white;
  font-size: 18px;
  font-weight: bold;
  background-color: #263445;
}

.el-header {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  background-color: white;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
}

.header-right {
  display: flex;
  align-items: center;
  gap: 20px;
}

.username {
  color: #333;
}

.el-main {
  background-color: #f0f2f5;
  padding: 20px;
}
</style>
