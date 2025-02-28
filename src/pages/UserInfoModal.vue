<template>
  <q-dialog v-model="isOpen">
    <q-card style="min-width: 450px; max-width: 600px; padding: 0px 0px 10px 0px">
      <q-card-section class="header-section">
        <div class="header-title q-ml-xs">마이 페이지</div>
        <q-btn flat icon="close" @click="closeModal" class="close-btn" />
      </q-card-section>

      <q-card-section>
        <div class="q-gutter-md">
          <!-- 아이디 입력 -->
          <q-input
            v-model="userInfo.user_id"
            label="아이디 *"
            outlined
            class="q-mt-xs input-form"
          />

          <!-- 비밀번호 입력 -->
          <q-input
            v-model="userInfo.password"
            label="비밀번호*"
            type="password"
            outlined
            class="q-mt-xs input-form"
          />

          <!-- 비밀번호 확인 입력 -->
          <q-input
            v-model="userInfo.passwordConfirm"
            label="비밀번호 확인 *"
            type="password"
            outlined
            class="q-mt-xs input-form"
          />

          <!-- 이름 입력 -->
          <q-input v-model="userInfo.name" label="이름 *" outlined class="q-mt-xs input-form" />

          <!-- 이메일 입력 -->
          <q-input
            v-model="userInfo.email"
            label="이메일 *"
            type="email"
            outlined
            class="q-mt-xs input-form"
          />

          <!-- 핸드폰 번호 입력 -->
          <q-input
            v-model="userInfo.phone"
            label="핸드폰 번호 *"
            type="tel"
            outlined
            class="q-mt-xs input-form"
          />

          <div class="flex flex-left q-mt-xs">
            <!-- 주소 입력 -->
            <q-input
              v-model="userInfo.address1"
              label="주소 *"
              outlined
              class="q-mr-md input-form"
              readonly
            />

            <!-- 주소 찾기 버튼 -->
            <q-btn label="주소 찾기" @click="findAddress" color="primary" class="check-btn" />
          </div>
          <!-- 상세주소 입력 -->
          <q-input
            v-model="userInfo.address2"
            label="상세주소"
            outlined
            class="q-mt-xs input-form"
          />

          <!-- 권한 선택 -->
          <q-select
            v-model="userInfo.role"
            :options="roleOptions"
            label="권한 선택 *"
            outlined
            multiple
            emit-value
            map-options
            class="q-mt-xs input-form"
          />
        </div>
      </q-card-section>
      <q-card-actions class="q-mt-xs flex flex-center">
        <q-btn
          label="수정"
          style="width: 100px"
          color="primary"
          @click="submitForm"
          class="check-btn"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref, computed, onMounted, defineEmits } from 'vue'
import { useQuasar } from 'quasar'

const $q = useQuasar()
const emit = defineEmits(['update:modelValue']) // 👈 `defineEmits` 사용해야 함

// 모달 상태
const isOpen = ref(true)

// 사용자 정보 (초기 데이터)
const originalUserInfo = ref({})

// 현재 입력된 사용자 정보
const userInfo = ref({
  user_id: '',
  password: '',
  passwordConfirm: '',
  name: '',
  email: '',
  phone: '',
  address1: '',
  address2: '',
  detailedAddress: '',
  role: [],
})

const closeModal = () => {
  isOpen.value = false // 모달 닫기
  emit('update:modelValue', false) // 부모 컴포넌트에도 닫기 이벤트 전달
}

// 권한 옵션
const roleOptions = ref([
  { label: '슈퍼 관리자', value: 0 },
  { label: '관리자', value: 1 },
  { label: '일반 사용자', value: 2 },
])

const validationMessage = computed(() => {
  if (userInfo.value.user_id.trim() === '') return '아이디를 입력하세요.'
  if (userInfo.value.password.trim() === '') return '비밀번호를 입력하세요.'
  if (userInfo.value.passwordConfirm.trim() === '') return '비밀번호 확인을 입력하세요.'
  if (userInfo.value.password !== userInfo.value.passwordConfirm)
    return '비밀번호가 일치하지 않습니다.'
  if (userInfo.value.name.trim() === '') return '이름을 입력하세요.'
  if (userInfo.value.email.trim() === '') return '이메일을 입력하세요.'
  if (userInfo.value.phone.trim() === '') return '핸드폰 번호를 입력하세요.'
  if (userInfo.value.address1.trim() === '') return '주소를 입력하세요.'
  return ''
})

const isValidForm = computed(() => validationMessage.value === '')

// 세션에서 사용자 정보 가져오기
onMounted(async () => {
  const storedUser = JSON.parse(sessionStorage.getItem('user')) || {}

  if (storedUser.user_id) {
    await fetchUserInfo(storedUser.user_id)
  }
})

// API 호출하여 사용자 정보 가져오기
async function fetchUserInfo(userId) {
  try {
    const response = await fetch(`http://127.0.0.1:8000/api/user/${userId}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    })

    if (response.ok) {
      const data = await response.json()

      // UI에 반영
      userInfo.value.user_id = data.user.user_id || ''
      userInfo.value.name = data.user.name || ''
      userInfo.value.email = data.user.email || ''
      userInfo.value.phone = data.user.phone || ''
      userInfo.value.address1 = data.user.address1 || ''
      userInfo.value.address2 = data.user.address2 || ''
      userInfo.value.role = data.roles.map((role) => Number(role.role_id)) || []

      // 기존 정보 저장 (비교를 위해 깊은 복사)
      originalUserInfo.value = JSON.parse(JSON.stringify(userInfo.value))
    } else {
      console.error('Failed to fetch user info:', response.statusText)
    }
  } catch (error) {
    console.error('Error fetching user info:', error)
  }
}

// 주소 찾기
const findAddress = () => {
  new window.daum.Postcode({
    oncomplete: function (data) {
      userInfo.value.address1 = data.address
    },
  }).open()
}

// 변경 여부 확인 함수
const isModified = computed(() => {
  return JSON.stringify(originalUserInfo.value) !== JSON.stringify(userInfo.value)
})

// 수정 버튼 클릭 시 실행되는 함수
async function submitForm() {
  if (!isValidForm.value) {
    $q.notify({ type: 'negative', message: validationMessage.value })
    return
  }

  if (!isModified.value) {
    $q.notify({ type: 'info', message: '변경된 사항이 없습니다.' })
    return
  }

  try {
    const response = await fetch(`http://127.0.0.1:8000/api/user/${userInfo.value.user_id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userInfo.value),
    })

    if (response.ok) {
      $q.notify({ type: 'positive', message: '사용자 정보가 수정되었습니다.' })
      isOpen.value = false
    } else {
      $q.notify({ type: 'negative', message: '수정 실패. 다시 시도해주세요.' })
    }
  } catch (error) {
    console.error('Error updating user info:', error)
    $q.notify({ type: 'negative', message: '오류가 발생했습니다.' })
  }
}
</script>

<style>
.header-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #f5f5f5; /* 배경색을 밝은 회색으로 변경 */
  color: #333; /* 텍스트 색상을 어두운 회색으로 변경 */
  padding: 10px; /* 패딩 추가 */
  border-top-left-radius: 8px; /* 테두리 둥글게 */
  border-top-right-radius: 8px; /* 테두리 둥글게 */
}

.header-title {
  font-size: 1.2rem; /* 제목 크기 */
  font-weight: bold; /* 제목 굵게 */
}

.close-btn {
  color: #333; /* X 버튼 색상 */
}

.check-btn {
  height: 30px;
  margin-top: 5px;
  background-color: #007bff; /* 버튼 색상 */
  color: white; /* 버튼 텍스트 색상 */
}

.q-field__control {
  height: 46px !important; /* 높이 조정 */
}

.q-field--auto-height .q-field__control,
.q-field--auto-height .q-field__native {
  min-height: 46px;
}

.q-card-section {
  margin-bottom: 12px;
}

.input-form {
  width: 350px;
  height: 40px; /* 높이 줄이기 */
  margin-bottom: 12px;
}

.q-gutter-y-md,
.q-gutter-md {
  margin-top: 5px;
}
</style>
