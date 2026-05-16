<template>
  <div class="vip-center">
    <el-card class="my-vip-card" v-if="myVip">
      <template #header>
        <span>我的VIP</span>
      </template>
      <el-alert v-if="myVip.isVip === 1" type="success" title="VIP会员">
        <template #default>
          <p>会员卡：{{ myVip.cardName }}</p>
          <p>到期时间：{{ myVip.expireTime }}</p>
          <p>剩余次数：{{ myVip.remainingTimes }}</p>
        </template>
      </el-alert>
      <el-alert v-else type="info" title="普通用户">
        <p>您还不是VIP会员，升级会员享受更多特权！</p>
      </el-alert>
    </el-card>

    <el-card style="margin-top: 20px;">
      <template #header>
        <span>会员套餐</span>
      </template>
      <el-row :gutter="20">
        <el-col :span="8" v-for="card in vipCards" :key="card.id">
          <el-card class="vip-card" :class="{ 'vip-card-hot': card.type === 2 }">
            <div class="vip-card-header">
              <h3>{{ card.name }}</h3>
              <div class="vip-price">
                <span class="price-symbol">¥</span>
                <span class="price-value">{{ card.price }}</span>
              </div>
            </div>
            <div class="vip-card-body">
              <p><el-icon><Check /></el-icon> 有效期 {{ card.duration }} 天</p>
              <p><el-icon><Check /></el-icon> 单次预约最长 {{ card.maxBookingHours }} 小时</p>
              <p><el-icon><Check /></el-icon> 可提前 {{ card.advanceDays }} 天预约</p>
              <p><el-icon><Check /></el-icon> 违约限制 {{ card.violationLimit }} 次</p>
            </div>
            <div class="vip-card-footer">
              <el-button type="primary" @click="handlePurchase(card)">立即购买</el-button>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Check } from '@element-plus/icons-vue'
import { getVipCards, getMyVip, purchaseVip } from '@/api'

const vipCards = ref([])
const myVip = ref(null)

const loadVipCards = async () => {
  try {
    const data = await getVipCards()
    vipCards.value = data || []
  } catch (e) {
    ElMessage.error('加载VIP套餐失败')
  }
}

const loadMyVip = async () => {
  try {
    const data = await getMyVip()
    myVip.value = data
  } catch (e) {
    ElMessage.error('加载我的VIP信息失败')
  }
}

const handlePurchase = async (card) => {
  try {
    await ElMessageBox.confirm(`确定购买 ${card.name} 吗？`, '确认购买', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    await purchaseVip({ cardId: card.id })
    ElMessage.success('购买成功！')
    loadMyVip()
  } catch (e) {
    if (e !== 'cancel') {
      ElMessage.error('购买失败')
    }
  }
}

onMounted(() => {
  loadVipCards()
  loadMyVip()
})
</script>

<style scoped>
.vip-center {
  padding: 10px;
}

.vip-card {
  text-align: center;
  transition: all 0.3s;
}

.vip-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.vip-card-hot {
  border: 2px solid #e6a23c;
}

.vip-card-header {
  padding: 20px 0;
  border-bottom: 1px solid #ebeef5;
}

.vip-card-header h3 {
  margin: 0 0 15px 0;
}

.vip-price {
  color: #f56c6c;
}

.price-symbol {
  font-size: 18px;
  vertical-align: top;
}

.price-value {
  font-size: 36px;
  font-weight: bold;
}

.vip-card-body {
  padding: 20px 0;
}

.vip-card-body p {
  margin: 10px 0;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
}

.vip-card-footer {
  padding-top: 15px;
  border-top: 1px solid #ebeef5;
}
</style>
