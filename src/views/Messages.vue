<template>
  <div class="messages">
    <el-card>
      <template #header>
        <span>消息中心</span>
      </template>
      
      <el-table :data="messages" v-loading="loading">
        <el-table-column prop="title" label="标题" />
        <el-table-column prop="content" label="内容" show-overflow-tooltip />
        <el-table-column label="类型" width="100">
          <template #default="{ row }">
            <el-tag :type="getMessageType(row.type)">{{ getMessageTypeText(row.type) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="状态" width="100">
          <template #default="{ row }">
            <el-tag v-if="row.isRead === 1" type="info">已读</el-tag>
            <el-tag v-else type="primary">未读</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="时间" width="180" />
        <el-table-column label="操作" width="120">
          <template #default="{ row }">
            <el-button 
              v-if="row.isRead !== 1" 
              type="text" 
              @click="handleMarkRead(row)"
            >标记已读</el-button>
          </template>
        </el-table-column>
      </el-table>
      
      <el-pagination
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        :total="total"
        @current-change="loadMessages"
        layout="total, prev, pager, next"
        style="margin-top: 20px; justify-content: flex-end;"
      />
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { getMessageList, markMessageRead } from '@/api'

const messages = ref([])
const loading = ref(false)
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)

const getMessageType = (type) => {
  const map = {
    1: 'primary',
    2: 'success',
    3: 'warning',
    4: 'danger'
  }
  return map[type] || 'info'
}

const getMessageTypeText = (type) => {
  const map = {
    1: '系统',
    2: '通知',
    3: '提醒',
    4: '警告'
  }
  return map[type] || '其他'
}

const loadMessages = async () => {
  loading.value = true
  try {
    const data = await getMessageList({
      page: currentPage.value,
      pageSize: pageSize.value
    })
    if (data) {
      messages.value = data.records || []
      total.value = data.total || 0
    }
  } catch (e) {
    ElMessage.error('加载消息失败')
  } finally {
    loading.value = false
  }
}

const handleMarkRead = async (row) => {
  try {
    await markMessageRead(row.id)
    ElMessage.success('已标记为已读')
    loadMessages()
  } catch (e) {
    ElMessage.error('操作失败')
  }
}

onMounted(() => {
  loadMessages()
})
</script>

<style scoped>
.messages {
  padding: 10px;
}
</style>
