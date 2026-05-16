<template>
  <div class="announcement-manage">
    <el-card>
      <template #header>
        <div class="header-container">
          <span>公告管理</span>
          <el-button type="primary" @click="dialogVisible = true">新增公告</el-button>
        </div>
      </template>
      
      <el-table :data="announcements" v-loading="loading">
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="title" label="标题" width="200" />
        <el-table-column prop="content" label="内容" show-overflow-tooltip />
        <el-table-column label="是否置顶" width="100">
          <template #default="{ row }">
            <el-tag :type="row.isTop === 1 ? 'danger' : 'info'">
              {{ row.isTop === 1 ? '是' : '否' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="row.status === 1 ? 'success' : 'info'">
              {{ row.status === 1 ? '上架' : '下架' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="expireTime" label="过期时间" width="180" />
        <el-table-column prop="createTime" label="创建时间" width="180" />
      </el-table>
      
      <el-pagination
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        :total="total"
        @current-change="loadAnnouncements"
        layout="total, prev, pager, next"
        style="margin-top: 20px; justify-content: flex-end;"
      />
    </el-card>

    <el-dialog v-model="dialogVisible" title="新增公告" width="600px">
      <el-form :model="form" label-width="100px">
        <el-form-item label="标题">
          <el-input v-model="form.title" placeholder="请输入公告标题" />
        </el-form-item>
        <el-form-item label="内容">
          <el-input
            v-model="form.content"
            type="textarea"
            :rows="6"
            placeholder="请输入公告内容"
          />
        </el-form-item>
        <el-form-item label="是否置顶">
          <el-switch v-model="form.isTop" :active-value="1" :inactive-value="0" />
        </el-form-item>
        <el-form-item label="过期时间">
          <el-date-picker
            v-model="form.expireTime"
            type="datetime"
            placeholder="选择过期时间"
            format="YYYY-MM-DD HH:mm:ss"
            value-format="YYYY-MM-DD HH:mm:ss"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleAdd">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { getAdminAnnouncementList, addAdminAnnouncement } from '@/api'

const announcements = ref([])
const loading = ref(false)
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)
const dialogVisible = ref(false)
const form = ref({
  title: '',
  content: '',
  isTop: 0,
  expireTime: ''
})

const loadAnnouncements = async () => {
  loading.value = true
  try {
    const data = await getAdminAnnouncementList({
      page: currentPage.value,
      pageSize: pageSize.value
    })
    if (data) {
      announcements.value = data.records || []
      total.value = data.total || 0
    }
  } catch (e) {
    ElMessage.error('加载公告列表失败')
  } finally {
    loading.value = false
  }
}

const handleAdd = async () => {
  if (!form.value.title || !form.value.content || !form.value.expireTime) {
    ElMessage.warning('请填写完整信息')
    return
  }
  
  try {
    await addAdminAnnouncement(form.value)
    ElMessage.success('添加成功')
    dialogVisible.value = false
    form.value = {
      title: '',
      content: '',
      isTop: 0,
      expireTime: ''
    }
    loadAnnouncements()
  } catch (e) {
    ElMessage.error('添加失败')
  }
}

onMounted(() => {
  loadAnnouncements()
})
</script>

<style scoped>
.announcement-manage {
  padding: 10px;
}

.header-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
