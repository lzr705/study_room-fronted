<template>
  <div class="dashboard">
    <el-card class="welcome-card">
      <h2>欢迎使用自习室预约系统</h2>
      <p>选择座位，开始您的学习之旅！</p>
    </el-card>
    
    <el-row :gutter="20" style="margin-top: 20px;">
      <el-col :span="12">
        <el-card class="function-card">
          <template #header>
            <span class="card-title">快速预约</span>
          </template>
          <p>快速找到心仪的座位</p>
          <el-button type="primary" @click="$router.push('/reservation')">去预约</el-button>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card class="function-card">
          <template #header>
            <span class="card-title">我的预约</span>
          </template>
          <p>查看和管理您的预约</p>
          <el-button type="success" @click="$router.push('/my-reservations')">查看预约</el-button>
        </el-card>
      </el-col>
    </el-row>
    
    <el-card class="announcement-card" style="margin-top: 20px;">
      <template #header>
        <span class="card-title">最新公告</span>
      </template>
      <el-empty description="暂无公告" v-if="announcements.length === 0" />
      <div v-else>
        <div v-for="item in announcements" :key="item.id" class="announcement-item">
          <div class="announcement-header">
            <span class="announcement-title">{{ item.title }}</span>
            <el-tag v-if="item.isTop === 1" type="danger" size="small">置顶</el-tag>
          </div>
          <p class="announcement-content">{{ item.content }}</p>
          <div class="announcement-time">{{ item.createTime }}</div>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getAnnouncementList } from '@/api'

const announcements = ref([])

onMounted(async () => {
  try {
    const data = await getAnnouncementList()
    announcements.value = data || []
  } catch (e) {
    console.error(e)
  }
})
</script>

<style scoped>
.dashboard {
  padding: 10px;
}

.welcome-card {
  text-align: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
}

.welcome-card h2 {
  margin-bottom: 10px;
}

.welcome-card :deep(.el-card__body) {
  padding: 40px;
}

.function-card {
  text-align: center;
}

.function-card p {
  margin-bottom: 20px;
  color: #666;
}

.card-title {
  font-weight: bold;
  font-size: 16px;
}

.announcement-item {
  padding: 15px 0;
  border-bottom: 1px solid #eee;
}

.announcement-item:last-child {
  border-bottom: none;
}

.announcement-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
}

.announcement-title {
  font-weight: bold;
  color: #333;
}

.announcement-content {
  color: #666;
  margin-bottom: 8px;
}

.announcement-time {
  color: #999;
  font-size: 12px;
}
</style>
