<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar style="background-color: white; color: black">
        <q-btn flat dense round icon="menu" aria-label="Menu" @click="toggleLeftDrawer" />

        <q-img
          src="icons/cncitylogo.png"
          style="width: 120px; height: 50px; margin-left: 20px"
          alt="Logo"
          class="cursor-pointer"
          @click="onLogoClick"
        />

        <div class="q-toolbar__menu">
          <!-- 조건부 렌더링: roles 배열에 0이 포함되어 있을 때만 표시 -->
          <q-btn
            v-if="hasMemberManagementRole"
            flat
            dense
            label="회원 관리"
            @click="goToMemberManagement"
            class="menu-button"
          />

          <q-btn
            v-if="hasMemberManagementRole"
            flat
            dense
            label="접속 이력"
            @click="goToAccessHistory"
            class="menu-button"
          />
        </div>

        <div style="margin-left: auto">
          <!-- 로그인된 사용자 이름 표시 -->
          <q-btn
            v-if="isLoggedIn"
            flat
            dense
            :label="`${loginName} 님`"
            class="menu-button with-underline"
            @click="openUserInfoModal"
          />

          <q-btn
            flat
            dense
            :label="isLoggedIn ? '로그아웃' : '로그인'"
            @click="isLoggedIn ? logout() : goToLoginPage()"
            class="menu-button"
          />
        </div>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" bordered>
      <q-list>
        <q-item-label header> Examples </q-item-label>
        <!-- <EssentialLink title="Quasar Docs" icon="school" link="https://quasar.dev" /> -->
        <!-- 개발모음 quasar -->
        <EssentialLink title="test" icon="edit" link="/examples/testPage" />
        <EssentialLink title="icon" icon="edit" link="/examples/iconPage" />
        <EssentialLink title="input" icon="edit" link="/examples/inputPage" />
        <EssentialLink title="selbox" icon="edit" link="/examples/selboxPage" />

        <!-- <EssentialLink title="접속 이력" icon="history" link="/admin/accessHistory" /> -->
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view :loginSuccess="loginSuccess" />
    </q-page-container>

    <UserInfoModal v-if="userInfoModalOpen" v-model="userInfoModalOpen" />
  </q-layout>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import EssentialLink from 'components/EssentialLink.vue'
import { useQuasar } from 'quasar'
import UserInfoModal from 'pages/UserInfoModal.vue' // UserInfoModal 컴포넌트 임포트

const $q = useQuasar()
const router = useRouter()

// 페이지 로드 시 sessionStorage에서 토큰과 역할 가져오기
const accessToken = ref(sessionStorage.getItem('access_token'))
const roles = ref(JSON.parse(sessionStorage.getItem('roles')) || []) // roles를 ref로 설정
const user = ref(JSON.parse(sessionStorage.getItem('user')) || {}) // user를 ref로 설정

const leftDrawerOpen = ref(false) // 왼쪽 툴바를 처음에 닫힌 상태로 설정
const userInfoModalOpen = ref(false) // 사용자 정보 모달 상태

function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value
}

function goToMemberManagement() {
  router.push({ path: '/admin/memberList' })
}

function goToAccessHistory() {
  router.push({ path: '/admin/accessHistory' }) // 접속 이력 페이지 경로 설정
}

function goToLoginPage() {
  router.push({ path: '/login' })
}

function onLogoClick() {
  router.push({ path: '/' })
}

const isLoggedIn = computed(() => {
  return !!accessToken.value // access_token이 있으면 로그인 상태
})

const loginName = computed(() => {
  return user.value.name // access_token이 있으면 로그인 상태
})

// 권한 체크: roles 배열에 0이 포함되어 있는지 확인
const hasMemberManagementRole = computed(() => {
  return (
    roles.value.includes(0) || // 슈퍼관리자 권한
    (roles.value.includes(1) && user.value.approval_status === 'Y')
  ) // 관리자 권한과 승인 상태 'Y'
})

async function logout() {
  // 'async' 추가
  // 로그아웃 히스토리 남기기
  const logoutHistory = {
    user_id: user.value.user_id, // 현재 사용자 ID
    request_path: '/logout', // 로그아웃 경로
    memo: '로그아웃 성공', // 메모
  }

  try {
    // 로그아웃 히스토리 API에 전송
    const response = await fetch('http://127.0.0.1:8000/logout', {
      // '/api/logout' 경로로 수정
      method: 'POST',
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem('access_token')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(logoutHistory),
    })

    if (!response.ok) {
      throw new Error(`Failed to log out history: ${response.status}`)
    }

    // 성공적인 로그아웃 알림
    $q.notify({
      message: '로그아웃이 되었습니다.',
      color: 'green',
      position: 'top',
    })

    // 로그인 화면으로 리디렉션
    router.push('/')
  } catch (error) {
    console.error('Error logging out history:', error)

    // 로그아웃 실패 시 알림
    $q.notify({
      message: '로그아웃에 실패하였습니다.',
      color: 'red',
      position: 'top',
    })
  }

  // 세션 스토리지에서 사용자 정보 제거
  sessionStorage.removeItem('access_token')
  sessionStorage.removeItem('roles') // roles도 제거
  sessionStorage.removeItem('user') // user도 제거

  // 상태 초기화
  accessToken.value = null // 상태 업데이트
  roles.value = [] // roles 배열 초기화
  user.value = {} // user 객체 초기화

  // 홈 화면으로 리디렉션
  router.push('/')
}

// 로그인 성공 시 호출되는 함수
function loginSuccess(token, newRoles, newUser) {
  sessionStorage.setItem('access_token', token) // sessionStorage에 토큰 저장
  sessionStorage.setItem('roles', JSON.stringify(newRoles)) // roles 배열을 JSON 문자열로 저장
  sessionStorage.setItem('user', newUser) // roles 배열을 JSON 문자열로 저장
  accessToken.value = token // accessToken 업데이트
  roles.value = newRoles // roles 업데이트
  user.value = JSON.parse(sessionStorage.getItem('user')) || {} // user 업데이트
}

// 사용자 정보 모달 열기
function openUserInfoModal() {
  userInfoModalOpen.value = true
}
</script>

<style>
.q-toolbar__menu {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 15px;
  height: 100%;
}

.menu-button {
  margin-left: 10px;
  font-weight: bold;
  color: #333;
  height: 100%;
  padding: 10px;
}

.menu-button:hover {
  color: #1976d2;
  transition: color 0.3s;
}

/* 밑줄 스타일을 위한 클래스 추가 */
.with-underline {
  position: relative;
}

.with-underline::after {
  content: '';
  display: block;
  height: 2px; /* 밑줄 두께 */
  background-color: #1976d2; /* 밑줄 색상 */
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0; /* 버튼의 하단에 위치 */
  transition: all 0.3s;
}

.with-underline:hover::after {
  background-color: #004080; /* 마우스 오버 시 밑줄 색상 변경 */
}
</style>
