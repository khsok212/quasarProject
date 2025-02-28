<template>
  <q-page class="q-pa-md">
    <div class="row q-col-gutter-md">
      <!-- 주요 통계 카드 -->
      <div class="col-12 col-md-3">
        <q-card flat bordered class="q-pa-sm">
          <q-card-section class="text-center">
            <q-icon name="group" size="2em" class="text-primary" />
            <div class="text-h6">총 사용자</div>
            <div class="text-h5">1,234명</div>
          </q-card-section>
        </q-card>
      </div>

      <div class="col-12 col-md-3">
        <q-card flat bordered class="q-pa-sm">
          <q-card-section class="text-center">
            <q-icon name="attach_money" size="2em" class="text-secondary" />
            <div class="text-h6">이번 달 매출</div>
            <div class="text-h5">₩12,345,678</div>
          </q-card-section>
        </q-card>
      </div>

      <div class="col-12 col-md-3">
        <q-card flat bordered class="q-pa-sm">
          <q-card-section class="text-center">
            <q-icon name="trending_up" size="2em" class="text-accent" />
            <div class="text-h6">방문자 수</div>
            <div class="text-h5">89,456명</div>
          </q-card-section>
        </q-card>
      </div>

      <div class="col-12 col-md-3">
        <q-card flat bordered class="q-pa-sm">
          <q-card-section class="text-center">
            <q-icon name="build" size="2em" class="text-teal" />
            <div class="text-h6">서버 상태</div>
            <div class="text-h5 text-positive">정상</div>
          </q-card-section>
        </q-card>
      </div>
    </div>

    <div class="row q-mt-md q-col-gutter-md">
      <!-- 차트 (매출 통계) -->
      <div class="col-12 col-md-6">
        <q-card flat bordered class="q-pa-sm">
          <q-card-section>
            <div class="text-h6">📊 매출 추이</div>
          </q-card-section>
          <q-separator />
          <q-card-section class="q-pa-none">
            <BarChart />
          </q-card-section>
        </q-card>
      </div>

      <!-- 차트 (방문자 추이) -->
      <div class="col-12 col-md-6">
        <q-card flat bordered class="q-pa-sm">
          <q-card-section>
            <div class="text-h6">📈 방문자 추이</div>
          </q-card-section>
          <q-separator />
          <q-card-section class="q-pa-none">
            <LineChart />
          </q-card-section>
        </q-card>
      </div>
    </div>

    <div class="row q-mt-md q-col-gutter-md">
      <!-- 공지사항 -->
      <div class="col-12 col-md-6">
        <q-card flat bordered class="q-pa-sm">
          <q-card-section>
            <div class="text-h6">📢 공지사항</div>
          </q-card-section>
          <q-separator />
          <q-list separator>
            <q-item v-for="(notice, index) in notices" :key="index">
              <q-item-section>
                <q-item-label>{{ notice.title }}</q-item-label>
                <q-item-label caption>{{ notice.date }}</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-card>
      </div>

      <!-- 최근 사용자 -->
      <div class="col-12 col-md-6">
        <q-card flat bordered class="q-pa-sm">
          <q-card-section>
            <div class="text-h6">👤 최근 가입한 사용자</div>
          </q-card-section>
          <q-separator />
          <q-list separator>
            <q-item v-for="(user, index) in recentUsers" :key="index">
              <q-item-section avatar>
                <q-avatar color="primary" text-color="white">{{ user.initials }}</q-avatar>
              </q-item-section>
              <q-item-section>
                <q-item-label>{{ user.name }}</q-item-label>
                <q-item-label caption>{{ user.joined }}</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref } from 'vue'
import BarChart from '@/components/BarChart.vue'
import LineChart from '@/components/LineChart.vue'

const notices = ref([
  { title: '서버 점검 안내 (2/20)', date: '2025-02-19' },
  { title: '신규 기능 업데이트!', date: '2025-02-18' },
  { title: '보안 패치 적용 완료', date: '2025-02-15' },
])

const recentUsers = ref([
  { name: '김철수', joined: '2025-02-18', initials: '김' },
  { name: '이영희', joined: '2025-02-17', initials: '이' },
  { name: '박민수', joined: '2025-02-16', initials: '박' },
])
</script>

<style scoped>
.chart-container {
  height: 300px; /* 차트 높이 조정 */
}
</style>
