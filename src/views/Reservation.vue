<template>
  <div class="reservation">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>座位预约</span>
        </div>
      </template>

      <el-tabs v-model="bookingMode" class="booking-tabs">
        <el-tab-pane label="按座位选时段" name="seat">
          <div class="booking-content">
            <el-form :inline="true" class="search-form">
              <el-form-item label="选择自习室">
                <el-select v-model="selectedRoom" placeholder="请选择自习室" @change="loadSeatsForSeatMode">
                  <el-option v-for="room in rooms" :key="room.id" :label="room.name" :value="room.id" />
                </el-select>
              </el-form-item>
              <el-form-item label="选择日期">
                <el-date-picker
                  v-model="selectedDate"
                  type="date"
                  placeholder="选择日期"
                  :disabled-date="disabledDate"
                  @change="loadSeatsForSeatMode"
                />
              </el-form-item>
            </el-form>

            <div v-if="selectedRoom && seats.length > 0" class="seats-container">
              <div class="seats-legend">
                <span class="legend-item"><span class="seat-available"></span> 可用</span>
                <span class="legend-item"><span class="seat-booked"></span> 已预约</span>
                <span class="legend-item"><span class="seat-maintenance"></span> 维修中</span>
                <span class="legend-item"><span class="seat-disabled"></span> 禁用</span>
                <span class="legend-item"><span class="seat-selected"></span> 已选</span>
              </div>
              <div class="seats-grid">
                <div
                  v-for="seat in seats"
                  :key="seat.id"
                  class="seat"
                  :class="getSeatClass(seat)"
                  @click="selectSeatForSeatMode(seat)"
                >
                  {{ seat.seatNo }}
                </div>
              </div>
            </div>

            <div v-if="selectedSeatForSeatMode" class="time-slot-container">
              <h4>选择时段（可多选连续时段）</h4>
              <el-checkbox-group v-model="selectedSlotsForSeatMode" class="time-slots-grid">
                <el-checkbox
                  v-for="slot in allTimeSlots"
                  :key="slot.value"
                  :label="slot.value"
                  :disabled="isSlotBookedForSeatMode(slot.value)"
                  class="time-slot-checkbox"
                >
                  {{ slot.label }}
                </el-checkbox>
              </el-checkbox-group>
              <div class="booking-actions">
                <el-button type="primary" @click="confirmBookingBySeat" :disabled="selectedSlotsForSeatMode.length === 0">
                  确认预约
                </el-button>
              </div>
            </div>
          </div>
        </el-tab-pane>

        <el-tab-pane label="按时段选座位" name="time">
          <div class="booking-content">
            <el-form :inline="true" class="search-form">
              <el-form-item label="选择日期">
                <el-date-picker
                  v-model="selectedDateForTimeMode"
                  type="date"
                  placeholder="选择日期"
                  :disabled-date="disabledDate"
                  style="width: 200px;"
                />
              </el-form-item>
              <el-form-item label="开始时间">
                <el-select v-model="startTimeForTimeMode" placeholder="请选择" style="width: 150px;">
                  <el-option v-for="slot in allTimeSlots.slice(0, -1)" :key="slot.value" :label="slot.label" :value="slot.value" />
                </el-select>
              </el-form-item>
              <el-form-item label="结束时间">
                <el-select v-model="endTimeForTimeMode" placeholder="请选择" style="width: 150px;">
                  <el-option v-for="slot in getEndTimeOptions()" :key="slot.value" :label="slot.label" :value="slot.value" />
                </el-select>
              </el-form-item>
              <el-form-item label="选择自习室（可选）">
                <el-select v-model="selectedRoomForTimeMode" placeholder="全部自习室" clearable style="width: 180px;">
                  <el-option v-for="room in rooms" :key="room.id" :label="room.name" :value="room.id" />
                </el-select>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="searchAvailableSeats">查询可用座位</el-button>
              </el-form-item>
            </el-form>

            <div v-if="availableSeats.length > 0" class="available-seats-container">
              <h4>可用座位列表</h4>
              <el-table :data="availableSeatsList" style="width: 100%" @row-click="selectSeatForTimeMode">
                <el-table-column prop="seatNo" label="座位号" width="120" />
                <el-table-column prop="roomName" label="所属自习室" width="180" />
                <el-table-column label="座位属性" width="180">
                  <template #default="{ row }">
                    <el-tag v-if="row.hasWindow" type="success" size="small" style="margin-right: 5px">靠窗</el-tag>
                    <el-tag v-if="row.hasPower" type="primary" size="small">有电源</el-tag>
                  </template>
                </el-table-column>
                <el-table-column label="操作">
                  <template #default="{ row }">
                    <el-button type="primary" size="small" @click="confirmBookingByTime(row)">
                      选择此座位
                    </el-button>
                  </template>
                </el-table-column>
              </el-table>
              <div class="pagination-container">
                <el-pagination
                  v-model:current-page="currentPageForTimeMode"
                  v-model:page-size="pageSizeForTimeMode"
                  :page-sizes="[5, 10, 20, 50]"
                  :total="totalForTimeMode"
                  layout="total, sizes, prev, pager, next, jumper"
                  @size-change="searchAvailableSeats"
                  @current-change="searchAvailableSeats"
                />
              </div>
            </div>

            <div v-else-if="hasSearched" class="no-seats">
              <el-empty description="暂无可用座位" />
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { ElMessage } from 'element-plus'
import { getRoomList, getRoomSeats, getSeatSlots, bookBySeat, queryAvailableSeats } from '@/api'

const rooms = ref([])
const seats = ref([])
const selectedRoom = ref(null)
const selectedDate = ref(new Date())
const selectedSeatForSeatMode = ref(null)
const selectedSlotsForSeatMode = ref([])
const seatSlots = ref([])

const selectedDateForTimeMode = ref(new Date())
const startTimeForTimeMode = ref('')
const endTimeForTimeMode = ref('')
const selectedRoomForTimeMode = ref(null)
const availableSeats = ref([])
const hasSearched = ref(false)
const currentPageForTimeMode = ref(1)
const pageSizeForTimeMode = ref(10)
const totalForTimeMode = ref(0)

const bookingMode = ref('seat')

const allTimeSlots = [
  { label: '06:00', value: '06:00' },
  { label: '07:00', value: '07:00' },
  { label: '08:00', value: '08:00' },
  { label: '09:00', value: '09:00' },
  { label: '10:00', value: '10:00' },
  { label: '11:00', value: '11:00' },
  { label: '12:00', value: '12:00' },
  { label: '13:00', value: '13:00' },
  { label: '14:00', value: '14:00' },
  { label: '15:00', value: '15:00' },
  { label: '16:00', value: '16:00' },
  { label: '17:00', value: '17:00' },
  { label: '18:00', value: '18:00' },
  { label: '19:00', value: '19:00' },
  { label: '20:00', value: '20:00' },
  { label: '21:00', value: '21:00' },
  { label: '22:00', value: '22:00' }
]

const loadRooms = async () => {
  try {
    const res = await getRoomList()
    rooms.value = res.data || []
  } catch (e) {
    ElMessage.error('加载自习室失败')
  }
}

const loadSeatsForSeatMode = async () => {
  if (!selectedRoom.value) return
  try {
    const dateStr = selectedDate.value.toISOString().split('T')[0]
    const res = await getRoomSeats(selectedRoom.value, dateStr)
    seats.value = res.data || []
    selectedSeatForSeatMode.value = null
    selectedSlotsForSeatMode.value = []
  } catch (e) {
    ElMessage.error('加载座位失败')
  }
}

const loadSeatSlots = async (seatId) => {
  try {
    const dateStr = selectedDate.value.toISOString().split('T')[0]
    const res = await getSeatSlots(seatId, dateStr)
    seatSlots.value = res.data || []
  } catch (e) {
    ElMessage.error('加载时段失败')
  }
}

const selectSeatForSeatMode = async (seat) => {
  if (seat.status !== 0) {
    ElMessage.warning('该座位不可用')
    return
  }
  selectedSeatForSeatMode.value = seat
  selectedSlotsForSeatMode.value = []
  await loadSeatSlots(seat.id)
}

const getSeatClass = (seat) => {
  return {
    'seat-available': seat.status === 0,
    'seat-booked': seat.status === 1,
    'seat-maintenance': seat.status === 2,
    'seat-disabled': seat.status === 3,
    'seat-selected': selectedSeatForSeatMode.value?.id === seat.id
  }
}

const isSlotBookedForSeatMode = (slotValue) => {
  const slot = seatSlots.value.find(s => s.slot === slotValue)
  return slot && slot.available !== 1
}

const confirmBookingBySeat = async () => {
  if (!selectedSeatForSeatMode.value || selectedSlotsForSeatMode.length === 0) {
    ElMessage.warning('请选择座位和时段')
    return
  }

  const sortedSlots = [...selectedSlotsForSeatMode.value].sort()
  
  // 验证选中的时段是否连续
  const startIndex = allTimeSlots.findIndex(s => s.value === sortedSlots[0])
  const endIndex = allTimeSlots.findIndex(s => s.value === sortedSlots[sortedSlots.length - 1])
  
  // 检查中间的时段是否都被选中
  for (let i = startIndex; i <= endIndex; i++) {
    if (!selectedSlotsForSeatMode.value.includes(allTimeSlots[i].value)) {
      ElMessage.warning('请选择连续的时段')
      return
    }
  }
  
  const startTime = sortedSlots[0]
  const endTime = allTimeSlots[endIndex + 1]?.value

  if (!endTime) {
    ElMessage.error('时段选择无效')
    return
  }

  try {
    const dateStr = selectedDate.value.toISOString().split('T')[0]
    await bookBySeat({
      seatId: selectedSeatForSeatMode.value.id,
      date: dateStr,
      startTime,
      endTime
    })
    ElMessage.success('预约成功！')
    loadSeatsForSeatMode()
  } catch (e) {
    ElMessage.error('预约失败：' + (e.message || '未知错误'))
  }
}

const getEndTimeOptions = () => {
  if (!startTimeForTimeMode.value) return []
  const startIndex = allTimeSlots.findIndex(s => s.value === startTimeForTimeMode.value)
  return allTimeSlots.slice(startIndex + 1)
}

const availableSeatsList = computed(() => {
  const start = (currentPageForTimeMode.value - 1) * pageSizeForTimeMode.value
  const end = start + pageSizeForTimeMode.value
  return availableSeats.value.slice(start, end)
})

const searchAvailableSeats = async () => {
  if (!selectedDateForTimeMode.value || !startTimeForTimeMode.value || !endTimeForTimeMode.value) {
    ElMessage.warning('请选择日期和时段')
    return
  }

  try {
    const dateStr = selectedDateForTimeMode.value.toISOString().split('T')[0]
    const res = await queryAvailableSeats({
      date: dateStr,
      startTime: startTimeForTimeMode.value,
      endTime: endTimeForTimeMode.value,
      roomId: selectedRoomForTimeMode.value || undefined,
      page: currentPageForTimeMode.value,
      pageSize: pageSizeForTimeMode.value
    })
    // 新的分页数据结构：{ total, page, pageSize, records }
    if (res.total !== undefined && res.records) {
      availableSeats.value = res.records
      totalForTimeMode.value = res.total
    } else if (Array.isArray(res)) {
      // 兼容旧的数组返回格式
      availableSeats.value = res
      totalForTimeMode.value = res.length
    } else {
      availableSeats.value = []
      totalForTimeMode.value = 0
    }
    hasSearched.value = true
  } catch (e) {
    ElMessage.error('查询失败：' + (e.message || '未知错误'))
  }
}

const selectSeatForTimeMode = (row) => {
  ElMessage.info('点击"选择此座位"按钮进行预约')
}

const confirmBookingByTime = async (seat) => {
  try {
    const dateStr = selectedDateForTimeMode.value.toISOString().split('T')[0]
    await bookBySeat({
      seatId: seat.seatId,
      date: dateStr,
      startTime: startTimeForTimeMode.value,
      endTime: endTimeForTimeMode.value
    })
    ElMessage.success('预约成功！')
    searchAvailableSeats()
  } catch (e) {
    ElMessage.error('预约失败：' + (e.message || '未知错误'))
  }
}

const disabledDate = (time) => {
  return time.getTime() < Date.now() - 8.64e7
}

onMounted(() => {
  loadRooms()
})
</script>

<style scoped>
.reservation {
  padding: 10px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.booking-tabs {
  margin-top: 20px;
}

.booking-content {
  min-height: 400px;
}

.search-form {
  margin-bottom: 20px;
}

.seats-container {
  margin-top: 20px;
}

.seats-legend {
  display: flex;
  gap: 20px;
  margin-bottom: 15px;
  flex-wrap: wrap;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 5px;
}

.legend-item span {
  display: inline-block;
  width: 20px;
  height: 20px;
  border-radius: 4px;
}

.seats-grid {
  display: grid;
  grid-template-columns: repeat(8, 1fr);
  gap: 10px;
}

.seat {
  padding: 15px 10px;
  text-align: center;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s;
  font-size: 14px;
  border: 2px solid transparent;
}

.seat-available {
  background-color: #e1f3d8;
  color: #67c23a;
}

.seat-available:hover {
  background-color: #b3e19d;
}

.seat-booked {
  background-color: #fde2e2;
  color: #f56c6c;
  cursor: not-allowed;
}

.seat-maintenance {
  background-color: #fdf6ec;
  color: #e6a23c;
  cursor: not-allowed;
}

.seat-disabled {
  background-color: #f4f4f5;
  color: #909399;
  cursor: not-allowed;
}

.seat-selected {
  border-color: #409eff !important;
  box-shadow: 0 0 0 2px rgba(64, 158, 255, 0.2);
}

.time-slot-container {
  margin-top: 30px;
  padding: 20px;
  background: #f5f7fa;
  border-radius: 8px;
}

.time-slots-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 10px;
  margin: 20px 0;
}

.time-slot-checkbox {
  padding: 10px;
  background: white;
  border-radius: 6px;
  text-align: center;
}

.booking-actions {
  margin-top: 20px;
  text-align: center;
}

.available-seats-container {
  margin-top: 20px;
}

.no-seats {
  margin-top: 40px;
}

.pagination-container {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}
</style>
