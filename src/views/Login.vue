<template>
  <div class="login-container">
    <div class="login-box">
      <div class="login-header">
        <h2>自习室预约系统</h2>
        <p>{{ isAdmin ? '管理员登录' : '学生登录' }}</p>
      </div>
      
      <el-form :model="form" ref="formRef" label-width="80px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="form.username" placeholder="请输入用户名" />
        </el-form-item>
        
        <el-form-item label="密码" prop="password">
          <el-input v-model="form.password" type="password" placeholder="请输入密码" />
        </el-form-item>
        
        <el-form-item>
          <el-button type="primary" @click="handleLogin" class="login-btn">登录</el-button>
        </el-form-item>
      </el-form>
      
      <div class="demo-buttons">
        <el-button type="success" @click="demoLoginStudent" class="demo-btn">
          🎯 演示登录（学生端）
        </el-button>
        <el-button type="warning" @click="demoLoginAdmin" class="demo-btn">
          🔑 演示登录（管理端）
        </el-button>
      </div>
      
      <div class="login-footer">
        <span @click="toggleRole" class="toggle-role">
          {{ isAdmin ? '切换到学生登录' : '切换到管理员登录' }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { login, adminLogin } from '@/api'
import { useRouter } from 'vue-router'

const router = useRouter()
const isAdmin = ref(false)
const formRef = ref(null)

const form = reactive({
  username: '',
  password: ''
})

const toggleRole = () => {
  isAdmin.value = !isAdmin.value
  form.username = ''
  form.password = ''
}

const demoLoginStudent = () => {
  localStorage.setItem('token', 'demo-token-student')
  localStorage.setItem('userId', '1')
  localStorage.setItem('username', '演示学生')
  localStorage.setItem('isAdmin', 'false')
  router.push('/dashboard')
}

const demoLoginAdmin = () => {
  localStorage.setItem('token', 'demo-token-admin')
  localStorage.setItem('userId', '1')
  localStorage.setItem('username', '演示管理员')
  localStorage.setItem('isAdmin', 'true')
  router.push('/admin/dashboard')
}

const handleLogin = async () => {
  if (!form.username || !form.password) {
    alert('请输入用户名和密码')
    return
  }
  
  try {
    const res = isAdmin.value ? await adminLogin(form) : await login(form)
    localStorage.setItem('token', res.token)
    localStorage.setItem('userId', res.id.toString())
    localStorage.setItem('username', res.username)
    localStorage.setItem('isAdmin', isAdmin.value.toString())
    
    if (isAdmin.value) {
      router.push('/admin/dashboard')
    } else {
      router.push('/dashboard')
    }
  } catch (error) {
    console.error(error)
  }
}
</script>

<style scoped>
.login-container {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.login-box {
  background: white;
  padding: 40px;
  border-radius: 12px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
  width: 400px;
}

.login-header {
  text-align: center;
  margin-bottom: 30px;
}

.login-header h2 {
  color: #333;
  margin-bottom: 8px;
}

.login-header p {
  color: #999;
  font-size: 14px;
}

.login-btn {
  width: 100%;
  height: 44px;
  font-size: 16px;
}

.demo-buttons {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid #eee;
}

.demo-btn {
  width: 100%;
  height: 40px;
}

.login-footer {
  margin-top: 20px;
  text-align: center;
}

.toggle-role {
  color: #667eea;
  cursor: pointer;
  font-size: 14px;
}

.toggle-role:hover {
  text-decoration: underline;
}
</style>
