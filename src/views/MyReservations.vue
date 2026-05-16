<template>
  <div class="my-reservations">
    <el-card>
      <template #header>
        <div class="header-container">
          <span>我的预约</span>
          <el-select v-model="statusFilter" placeholder="选择状态" @change="loadReservations" style="width: 150px;">
            <el-option label="全部" value="" />
            <el-option label="待签到" :value="0" />
            <el-option label="使用中" :value="1" />
            <el-option label="已完成" :value="2" />
            <el-option label="已取消" :value="3" />
            <el-option label="已违约" :value="4" />
          </el-select>
        </div>
      </template>
      
      <el-table :data="reservations" v-loading="loading">
        <el-table-column prop="reservationNo" label="预约编号" width="180" />
        <el-table-column prop="roomName" label="自习室" />
        <el-table-column prop="seatNo" label="座位号" width="100" />
        <el-table-column prop="date" label="日期" width="120" />
        <el-table-column label="时段" width="180">
          <template #default="{ row }">
            {{ row.startTime }} - {{ row.endTime }}
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="getStatusType(row.status)">{{ getStatusText(row.status) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" width="180" />
        <el-table-column label="操作" width="250">
          <template #default="{ row }">
            <el-button 
              v-if="row.status === 0" 
              type="primary" 
              size="small"
              @click="handleCheckIn(row)"
            >签到</el-button>
            <el-button 
              v-if="row.status === 1" 
              type="success" 
              size="small"
              @click="handleCheckOut(row)"
            >签退</el-button>
            <el-button 
              v-if="row.status === 0" 
              type="warning" 
              size="small"
              @click="handleCancel(row)"
            >取消预约</el-button>
          </template>
        </el-table-column>
      </el-table>
      
      <el-pagination
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        :total="total"
        @current-change="loadReservations"
        layout="total, prev, pager, next"
        style="margin-top: 20px; justify-content: flex-end;"
      />
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getMyReservations, cancelReservation, checkIn, checkOut } from '@/api'

const reservations = ref([])
const loading = ref(false)
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)
const statusFilter = ref('')

const getStatusType = (status) => {
  const map = {
    0: 'primary',
    1: 'success',
    2: 'info',
    3: 'warning',
    4: 'danger'
  }
  return map[status] || 'info'
}

const getStatusText = (status) => {
  const map = {
    0: '待签到',
    1: '使用中',
    2: '已完成',
    3: '已取消',
    4: '已违约'
  }
  return map[status] || '未知'
}

const loadReservations = async () => {
  loading.value = true
  try {
    const params = {
      page: currentPage.value,
      pageSize: pageSize.value
    }
    if (statusFilter !== '') {
      params.status = statusFilter.value
    }
    const data = await getMyReservations(params)
    if (data) {
      reservations.value = data.records || []
      total.value = data.total || 0
    }
  } catch (e) {
    ElMessage.error('加载预约记录失败')
  } finally {
    loading.value = false
  }
}

const handleCancel = async (row) => {
  try {
    await ElMessageBox.confirm('确定要取消该预约吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    await cancelReservation(row.id)
    ElMessage.success('取消成功')
    loadReservations()
  } catch (e) {
    if (e !== 'cancel') {
      ElMessage.error('取消失败')
    }
  }
}

const handleCheckIn = async (row) => {
  try {
    await checkIn({ reservationId: row.id })
    ElMessage.success('签到成功')
    loadReservations()
  } catch (e) {
    // 错误信息由后端返回，直接显示
    ElMessage.error(e.message || '签到失败')
  }
}

const handleCheckOut = async (row) => {
  try {
    await checkOut({ reservationId: row.id })
    ElMessage.success('签退成功')
    loadReservations()
  } catch (e) {
    ElMessage.error('签退失败')
  }
}

onMounted(() => {
  loadReservations()
})
</script>

<style scoped>
.my-reservations {
  padding: 10px;
}

.header-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
