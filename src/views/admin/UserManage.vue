<template>
  <div class="user-manage">
    <el-card>
      <template #header>
        <div class="header-container">
          <span>用户管理</span>
          <el-input
            v-model="keyword"
            placeholder="搜索用户名"
            style="width: 200px;"
            clearable
            @keyup.enter="loadUsers"
          >
            <template #append>
              <el-button @click="loadUsers" :icon="Search" />
            </template>
          </el-input>
        </div>
      </template>
      
      <el-table :data="users" v-loading="loading">
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="username" label="用户名" width="150" />
        <el-table-column label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="row.status === 1 ? 'danger' : 'success'">
              {{ row.status === 1 ? '封禁' : '正常' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="violationCount" label="违约次数" width="120" />
        <el-table-column label="VIP" width="100">
          <template #default="{ row }">
            <el-tag :type="row.isVip === 1 ? 'warning' : 'info'">
              {{ row.isVip === 1 ? '是' : '否' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="注册时间" width="180" />
        <el-table-column label="操作" width="120">
          <template #default="{ row }">
            <el-button
              type="text"
              @click="handleUpdateStatus(row)"
            >
              {{ row.status === 1 ? '解封' : '封禁' }}
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      
      <el-pagination
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        :total="total"
        @current-change="loadUsers"
        layout="total, prev, pager, next"
        style="margin-top: 20px; justify-content: flex-end;"
      />
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Search } from '@element-plus/icons-vue'
import { getAdminUserList, updateAdminUserStatus } from '@/api'

const users = ref([])
const loading = ref(false)
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)
const keyword = ref('')

const loadUsers = async () => {
  loading.value = true
  try {
    const params = {
      page: currentPage.value,
      pageSize: pageSize.value
    }
    if (keyword.value) {
      params.keyword = keyword.value
    }
    const data = await getAdminUserList(params)
    if (data) {
      users.value = data.records || []
      total.value = data.total || 0
    }
  } catch (e) {
    ElMessage.error('加载用户列表失败')
  } finally {
    loading.value = false
  }
}

const handleUpdateStatus = async (row) => {
  const newStatus = row.status === 1 ? 0 : 1
  const action = newStatus === 1 ? '封禁' : '解封'
  
  try {
    await ElMessageBox.confirm(`确定要${action}该用户吗？`, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    
    await updateAdminUserStatus(row.id, { status: newStatus })
    ElMessage.success(`${action}成功`)
    loadUsers()
  } catch (e) {
    if (e !== 'cancel') {
      ElMessage.error(`${action}失败`)
    }
  }
}

onMounted(() => {
  loadUsers()
})
</script>

<style scoped>
.user-manage {
  padding: 10px;
}

.header-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
