<template>
  <div class="room-manage">
    <el-card>
      <template #header>
        <div class="header-container">
          <span>自习室管理</span>
          <el-button type="primary" @click="dialogVisible = true">新增自习室</el-button>
        </div>
      </template>
      
      <el-table :data="rooms" v-loading="loading">
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="name" label="名称" />
        <el-table-column prop="location" label="位置" />
        <el-table-column prop="totalSeats" label="座位数" width="100" />
        <el-table-column label="开放时间" width="200">
          <template #default="{ row }">
            {{ row.openTime }} - {{ row.closeTime }}
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="row.status === 1 ? 'success' : 'danger'">
              {{ row.status === 1 ? '正常' : '关闭' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200">
          <template #default="{ row }">
            <el-button type="text" @click="handleViewSeats(row)">查看座位</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-dialog v-model="dialogVisible" title="新增自习室" width="500px">
      <el-form :model="form" label-width="100px">
        <el-form-item label="自习室名称">
          <el-input v-model="form.name" placeholder="请输入名称" />
        </el-form-item>
        <el-form-item label="位置">
          <el-input v-model="form.location" placeholder="请输入位置" />
        </el-form-item>
        <el-form-item label="开放时间">
          <el-time-picker 
            v-model="form.openTime" 
            placeholder="选择时间"
            :picker-options="{ selectableRange: '06:00:00 - 22:00:00', step: '01:00:00' }"
            format="HH:mm"
            value-format="HH:mm"
          />
        </el-form-item>
        <el-form-item label="关闭时间">
          <el-time-picker 
            v-model="form.closeTime" 
            placeholder="选择时间"
            :picker-options="{ selectableRange: '06:00:00 - 22:00:00', step: '01:00:00' }"
            format="HH:mm"
            value-format="HH:mm"
          />
        </el-form-item>
        <el-form-item label="总行数">
          <el-input v-model.number="form.totalRow" type="number" placeholder="请输入总行数" min="1" />
        </el-form-item>
        <el-form-item label="总列数">
          <el-input v-model.number="form.totalCol" type="number" placeholder="请输入总列数" min="1" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleAddRoom">确定</el-button>
      </template>
    </el-dialog>

    <el-dialog v-model="seatsDialogVisible" title="座位管理" width="1000px">
      <el-table :data="seats">
        <el-table-column prop="id" label="座位ID" width="80" />
        <el-table-column label="位置" width="150">
          <template #default="{ row }">
            第{{ row.row }}排 第{{ row.col }}列
          </template>
        </el-table-column>
        <el-table-column label="是否靠窗" width="120">
          <template #default="{ row }">
            <el-tag :type="row.hasWindow === 1 ? 'success' : 'info'">
              {{ row.hasWindow === 1 ? '是' : '否' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="是否有电源" width="120">
          <template #default="{ row }">
            <el-tag :type="row.hasPower === 1 ? 'success' : 'info'">
              {{ row.hasPower === 1 ? '是' : '否' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="120">
          <template #default="{ row }">
            <el-tag :type="getStatusType(row.status)">{{ getStatusText(row.status) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200">
          <template #default="{ row }">
            <el-select v-model="row.editStatus" placeholder="修改状态" style="width: 120px;">
              <el-option label="可用" :value="1" />
              <el-option label="不可用" :value="0" />
            </el-select>
            <el-button type="text" @click="handleUpdateStatus(row)">更新</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { getAdminRoomList, addRoom, getAdminSeatList, updateSeatStatus } from '@/api'

const rooms = ref([])
const seats = ref([])
const loading = ref(false)
const dialogVisible = ref(false)
const seatsDialogVisible = ref(false)
const selectedRoom = ref(null)
const form = ref({
  name: '',
  location: '',
  openTime: null,
  closeTime: null,
  totalRow: null,
  totalCol: null
})

const getStatusType = (status) => {
  const map = {
    0: 'danger',
    1: 'success'
  }
  return map[status] || 'info'
}

const getStatusText = (status) => {
  const map = {
    0: '不可用',
    1: '可用'
  }
  return map[status] || '未知'
}

const loadRooms = async () => {
  loading.value = true
  try {
    const data = await getAdminRoomList()
    rooms.value = data || []
  } catch (e) {
    ElMessage.error('加载自习室失败')
  } finally {
    loading.value = false
  }
}

const handleAddRoom = async () => {
  try {
    await addRoom({
      name: form.value.name,
      location: form.value.location,
      openTime: form.value.openTime,
      closeTime: form.value.closeTime,
      totalRow: form.value.totalRow,
      totalCol: form.value.totalCol
    })
    ElMessage.success('添加成功')
    dialogVisible.value = false
    form.value = { name: '', location: '', openTime: null, closeTime: null, totalRow: null, totalCol: null }
    loadRooms()
  } catch (e) {
    ElMessage.error('添加失败')
  }
}

const handleViewSeats = async (row) => {
  selectedRoom.value = row
  try {
    const data = await getAdminSeatList(row.id)
    seats.value = (data || []).map(s => ({ ...s, editStatus: s.status }))
    seatsDialogVisible.value = true
  } catch (e) {
    ElMessage.error('加载座位失败')
  }
}

const handleUpdateStatus = async (row) => {
  try {
    await updateSeatStatus(row.id, { status: row.editStatus })
    ElMessage.success('更新成功')
    row.status = row.editStatus
  } catch (e) {
    ElMessage.error('更新失败')
  }
}

onMounted(() => {
  loadRooms()
})
</script>

<style scoped>
.room-manage {
  padding: 10px;
}

.header-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
