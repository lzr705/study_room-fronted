<template>
  <div class="system-config">
    <el-card>
      <template #header>
        <span>系统设置</span>
      </template>
      
      <el-form :model="form" label-width="200px">
        <el-form-item label="最大提前预约天数">
          <el-input-number v-model="form.maxAdvanceDays" :min="1" :max="30" />
        </el-form-item>
        <el-form-item label="单次预约最长时长(小时)">
          <el-input-number v-model="form.maxBookingHours" :min="1" :max="24" />
        </el-form-item>
        <el-form-item label="单次预约最短时长(小时)">
          <el-input-number v-model="form.minBookingHours" :min="1" :max="12" />
        </el-form-item>
        <el-form-item label="违约封禁次数">
          <el-input-number v-model="form.violationLimit" :min="1" :max="10" />
        </el-form-item>
        <el-form-item label="签到时间窗口(分钟)">
          <el-input-number v-model="form.checkInWindow" :min="5" :max="60" />
        </el-form-item>
        <el-form-item label="可提前签到分钟数">
          <el-input-number v-model="form.checkInBeforeMinutes" :min="0" :max="30" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSave">保存配置</el-button>
          <el-button @click="loadConfig">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { getAdminSystemConfig, updateAdminSystemConfig } from '@/api'

const form = ref({
  maxAdvanceDays: 7,
  maxBookingHours: 4,
  minBookingHours: 1,
  violationLimit: 3,
  checkInWindow: 15,
  checkInBeforeMinutes: 10
})

const loadConfig = async () => {
  try {
    const data = await getAdminSystemConfig()
    if (data) {
      Object.assign(form.value, data)
    }
  } catch (e) {
    ElMessage.error('加载配置失败')
  }
}

const handleSave = async () => {
  try {
    await updateAdminSystemConfig(form.value)
    ElMessage.success('保存成功')
  } catch (e) {
    ElMessage.error('保存失败')
  }
}

onMounted(() => {
  loadConfig()
})
</script>

<style scoped>
.system-config {
  padding: 10px;
}
</style>
