<template>
  <div class="admin-dashboard">
    <el-row :gutter="20" class="stats-cards">
      <el-col :span="6">
        <el-card class="stat-card">
          <div class="stat-content">
            <div class="stat-icon" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);">
              <el-icon :size="32"><Calendar /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-value">{{ todayReservations }}</div>
              <div class="stat-label">今日预约</div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="stat-card">
          <div class="stat-content">
            <div class="stat-icon" style="background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%);">
              <el-icon :size="32"><SuccessFilled /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-value">{{ todayCheckins }}</div>
              <div class="stat-label">今日签到</div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="stat-card">
          <div class="stat-content">
            <div class="stat-icon" style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);">
              <el-icon :size="32"><UserFilled /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-value">{{ totalUsers }}</div>
              <div class="stat-label">总用户数</div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="stat-card">
          <div class="stat-content">
            <div class="stat-icon" style="background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);">
              <el-icon :size="32"><OfficeBuilding /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-value">{{ activeRooms }}</div>
              <div class="stat-label">活跃自习室</div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="20" class="charts-row">
      <el-col :span="16">
        <el-card class="chart-card">
          <template #header>
            <div class="card-header">
              <span>预约趋势（近7天）</span>
            </div>
          </template>
          <div ref="trendChartRef" class="chart-container"></div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card class="chart-card">
          <template #header>
            <div class="card-header">
              <span>预约时段分布</span>
            </div>
          </template>
          <div ref="pieChartRef" class="chart-container"></div>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="20" class="charts-row">
      <el-col :span="12">
        <el-card class="chart-card">
          <template #header>
            <div class="card-header">
              <span>自习室使用率</span>
            </div>
          </template>
          <div ref="barChartRef" class="chart-container"></div>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card class="chart-card">
          <template #header>
            <div class="card-header">
              <span>用户增长趋势</span>
            </div>
          </template>
          <div ref="userChartRef" class="chart-container"></div>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="20" class="bottom-row">
      <el-col :span="12">
        <el-card class="list-card">
          <template #header>
            <div class="card-header">
              <span>最近预约</span>
            </div>
          </template>
          <el-table :data="recentReservations" style="width: 100%">
            <el-table-column prop="userName" label="用户" width="120" />
            <el-table-column prop="roomName" label="自习室" width="150" />
            <el-table-column prop="seatNo" label="座位号" width="100" />
            <el-table-column prop="time" label="时间" />
            <el-table-column label="状态" width="100">
              <template #default="{ row }">
                <el-tag :type="getStatusType(row.status)" size="small">
                  {{ getStatusText(row.status) }}
                </el-tag>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card class="list-card">
          <template #header>
            <div class="card-header">
              <span>快捷操作</span>
            </div>
          </template>
          <el-space wrap :size="20">
            <el-button type="primary" size="large" @click="$router.push('/admin/rooms')">
              <el-icon><OfficeBuilding /></el-icon>
              自习室管理
            </el-button>
            <el-button type="success" size="large" @click="$router.push('/admin/users')">
              <el-icon><User /></el-icon>
              用户管理
            </el-button>
            <el-button type="warning" size="large" @click="$router.push('/admin/announcements')">
              <el-icon><Document /></el-icon>
              公告管理
            </el-button>
            <el-button type="info" size="large" @click="$router.push('/admin/system')">
              <el-icon><Setting /></el-icon>
              系统设置
            </el-button>
          </el-space>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import * as echarts from 'echarts'
import { Calendar, SuccessFilled, UserFilled, OfficeBuilding, Document, Setting, User } from '@element-plus/icons-vue'

const router = useRouter()

const trendChartRef = ref(null)
const pieChartRef = ref(null)
const barChartRef = ref(null)
const userChartRef = ref(null)

let trendChart = null
let pieChart = null
let barChart = null
let userChart = null

const todayReservations = ref(128)
const todayCheckins = ref(95)
const totalUsers = ref(1024)
const activeRooms = ref(8)

const recentReservations = ref([
  { userName: '张三', roomName: '一楼自习室', seatNo: 'A01', time: '2024-01-15 09:00-11:00', status: 0 },
  { userName: '李四', roomName: '二楼自习室', seatNo: 'B05', time: '2024-01-15 10:00-12:00', status: 1 },
  { userName: '王五', roomName: '一楼自习室', seatNo: 'A12', time: '2024-01-15 14:00-16:00', status: 2 },
  { userName: '赵六', roomName: '三楼自习室', seatNo: 'C08', time: '2024-01-15 15:00-17:00', status: 1 },
  { userName: '钱七', roomName: '二楼自习室', seatNo: 'B15', time: '2024-01-15 18:00-20:00', status: 0 },
])

const getStatusType = (status) => {
  const types = ['info', 'primary', 'success', 'warning', 'danger']
  return types[status] || 'info'
}

const getStatusText = (status) => {
  const texts = ['待签到', '使用中', '已完成', '已取消', '违约']
  return texts[status] || '未知'
}

const initTrendChart = () => {
  if (!trendChartRef.value) return
  trendChart = echarts.init(trendChartRef.value)
  const option = {
    tooltip: { trigger: 'axis' },
    xAxis: {
      type: 'category',
      data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
    },
    yAxis: { type: 'value' },
    series: [
      {
        name: '预约数',
        type: 'line',
        smooth: true,
        data: [85, 92, 78, 105, 112, 135, 98],
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(102, 126, 234, 0.3)' },
            { offset: 1, color: 'rgba(102, 126, 234, 0.05)' }
          ])
        },
        itemStyle: { color: '#667eea' },
        lineStyle: { width: 3 }
      }
    ]
  }
  trendChart.setOption(option)
}

const initPieChart = () => {
  if (!pieChartRef.value) return
  pieChart = echarts.init(pieChartRef.value)
  const option = {
    tooltip: { trigger: 'item' },
    series: [
      {
        name: '时段分布',
        type: 'pie',
        radius: ['40%', '70%'],
        data: [
          { value: 25, name: '上午(6-12)', itemStyle: { color: '#667eea' } },
          { value: 35, name: '下午(12-18)', itemStyle: { color: '#11998e' } },
          { value: 40, name: '晚上(18-22)', itemStyle: { color: '#f093fb' } }
        ],
        label: {
          formatter: '{b}\n{c}%'
        }
      }
    ]
  }
  pieChart.setOption(option)
}

const initBarChart = () => {
  if (!barChartRef.value) return
  barChart = echarts.init(barChartRef.value)
  const option = {
    tooltip: { trigger: 'axis' },
    xAxis: {
      type: 'category',
      data: ['一楼', '二楼', '三楼', '四楼', '五楼']
    },
    yAxis: { type: 'value', max: 100 },
    series: [
      {
        name: '使用率',
        type: 'bar',
        data: [85, 72, 95, 68, 78],
        itemStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: '#4facfe' },
            { offset: 1, color: '#00f2fe' }
          ]),
          borderRadius: [4, 4, 0, 0]
        }
      }
    ]
  }
  barChart.setOption(option)
}

const initUserChart = () => {
  if (!userChartRef.value) return
  userChart = echarts.init(userChartRef.value)
  const option = {
    tooltip: { trigger: 'axis' },
    xAxis: {
      type: 'category',
      data: ['9月', '10月', '11月', '12月', '1月']
    },
    yAxis: { type: 'value' },
    series: [
      {
        name: '新增用户',
        type: 'bar',
        data: [120, 180, 250, 220, 280],
        itemStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: '#11998e' },
            { offset: 1, color: '#38ef7d' }
          ]),
          borderRadius: [4, 4, 0, 0]
        }
      }
    ]
  }
  userChart.setOption(option)
}

const handleResize = () => {
  trendChart?.resize()
  pieChart?.resize()
  barChart?.resize()
  userChart?.resize()
}

onMounted(() => {
  setTimeout(() => {
    initTrendChart()
    initPieChart()
    initBarChart()
    initUserChart()
  }, 100)
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  trendChart?.dispose()
  pieChart?.dispose()
  barChart?.dispose()
  userChart?.dispose()
  window.removeEventListener('resize', handleResize)
})
</script>

<style scoped>
.admin-dashboard {
  padding: 10px;
}

.stats-cards {
  margin-bottom: 20px;
}

.stat-card {
  cursor: pointer;
  transition: all 0.3s;
}

.stat-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
}

.stat-content {
  display: flex;
  align-items: center;
  gap: 20px;
}

.stat-icon {
  width: 70px;
  height: 70px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}

.stat-info {
  flex: 1;
}

.stat-value {
  font-size: 28px;
  font-weight: bold;
  color: #303133;
}

.stat-label {
  font-size: 14px;
  color: #909399;
  margin-top: 4px;
}

.charts-row {
  margin-bottom: 20px;
}

.chart-card {
  height: 350px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: 600;
}

.chart-container {
  width: 100%;
  height: 280px;
}

.bottom-row {
  margin-bottom: 20px;
}

.list-card {
  min-height: 300px;
}
</style>
