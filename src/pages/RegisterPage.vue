<template>
  <q-card
    class="shadow-2 rounded-borders"
    style="width: 100%; max-width: 520px; padding: 0px 0px 10px 0px"
  >
    <q-card-section class="header-section">
      <div class="header-title q-ml-xs">{{ isAdmin ? '회원 추가' : '회원가입' }}</div>
      <q-btn flat icon="close" @click="closeDialog" class="close-btn" />
    </q-card-section>

    <q-card-section>
      <div class="flex flex-left">
        <q-input
          v-model="user_id"
          label="아이디 *"
          outlined
          class="q-mr-md input-form"
          ref="userIdInput"
        />
        <q-btn label="중복 확인" color="primary" @click="checkUserId" class="check-btn" />
      </div>
      <q-input
        v-model="password"
        label="비밀번호 *"
        type="password"
        outlined
        class="q-mt-xs input-form"
      />
      <q-input
        v-model="confirmPassword"
        label="비밀번호 확인 *"
        type="password"
        outlined
        class="q-mt-xs input-form"
      />
      <div v-if="passwordMismatch" class="error-message">비밀번호가 일치하지 않습니다.</div>
      <q-input v-model="name" label="이름 *" outlined class="q-mt-xs input-form" />
      <q-input v-model="email" label="이메일 *" type="email" outlined class="q-mt-xs input-form" />
      <q-input
        v-model="phone"
        label="핸드폰 번호 *"
        type="tel"
        outlined
        class="q-mt-xs input-form"
      />

      <div class="flex flex-left q-mt-xs">
        <q-input v-model="address" label="주소 *" outlined class="q-mr-md input-form" readonly />
        <q-btn label="주소 찾기" color="primary" @click="openAddressPopup" class="check-btn" />
      </div>
      <q-input
        v-model="addressDetail"
        label="상세주소"
        type="text"
        outlined
        class="q-mt-xs input-form"
      />

      <!-- 권한 선택 -->
      <div class="q-mt-xs">
        <q-select
          v-model="role_id"
          :options="isAdmin ? adminRoleOptions : roleOptions"
          label="권한 선택 *"
          outlined
          class="input-form"
          multiple
          use-input
        />
      </div>
    </q-card-section>

    <q-card-actions class="q-mt-xs flex flex-center">
      <q-btn
        :label="isAdmin ? '추가' : '가입'"
        color="primary"
        @click="register"
        class="check-btn"
        style="width: 100px"
        :disabled="!userIdAvailable"
      />
    </q-card-actions>
  </q-card>
</template>

<script>
import { defineComponent, ref, computed, nextTick } from 'vue'
import axios from 'axios'
import { useQuasar } from 'quasar'

export default defineComponent({
  setup(_, { emit }) {
    const $q = useQuasar()
    const user_id = ref('')
    const userIdInput = ref(null) // 아이디 입력 필드를 참조할 ref
    const name = ref('')
    const email = ref('')
    const phone = ref('')
    const password = ref('')
    const confirmPassword = ref('')
    const address = ref('')
    const addressDetail = ref('')
    const userIdAvailable = ref(false)
    const role_id = ref([]) // 권한 입력을 배열로 변경
    const roles = ref(JSON.parse(sessionStorage.getItem('roles')) || [])

    const isAdmin = computed(() => roles.value.includes(0))

    const passwordMismatch = computed(() => {
      return password.value && confirmPassword.value && password.value !== confirmPassword.value
    })

    const roleOptions = [
      { label: '관리자', value: 1 },
      { label: '사용자', value: 2 },
    ]

    const adminRoleOptions = [
      { label: '슈퍼관리자', value: 0 },
      { label: '관리자', value: 1 },
      { label: '사용자', value: 2 },
    ]

    const checkUserId = async () => {
      if (!user_id.value.trim()) {
        $q.notify({
          message: 'ID를 입력해주세요.',
          color: 'orange',
          position: 'top',
        })

        nextTick(() => {
          userIdInput.value?.focus()
        })
        return
      }

      try {
        const response = await axios.get(`http://127.0.0.1:8000/api/users/check/${user_id.value}`)
        if (response.data.available) {
          userIdAvailable.value = true
          $q.notify({
            message: '사용 가능한 ID입니다.',
            color: 'green',
            position: 'top',
          })
        } else {
          userIdAvailable.value = false
          user_id.value = ''
          $q.notify({
            message: '이미 존재하는 ID입니다. 다른 ID를 입력해주세요.',
            color: 'red',
            position: 'top',
          })
        }
      } catch (error) {
        console.error('ID 중복 확인 오류:', error)
        $q.dialog({
          title: 'ID 중복 확인 오류',
          message: 'ID 중복 확인 중 오류가 발생했습니다.',
          color: 'red',
          icon: 'warning',
          ok: {
            label: '확인',
            color: 'negative',
            handler: () => {
              // 확인 버튼 클릭 시 실행할 코드
            },
          },
        })
      }
    }

    const openAddressPopup = () => {
      new window.daum.Postcode({
        oncomplete: function (data) {
          address.value = data.address
        },
      }).open()
    }

    const register = async () => {
      if (
        !user_id.value ||
        !password.value ||
        !confirmPassword.value ||
        passwordMismatch.value ||
        !name.value ||
        !email.value ||
        !phone.value ||
        !address.value
      ) {
        $q.notify({
          message: '필수 입력 항목을 확인해주세요.',
          color: 'red',
          position: 'top',
        })
        return
      }

      if (password.value !== confirmPassword.value) {
        $q.notify({
          message: '비밀번호가 일치하지 않습니다.',
          color: 'red',
          position: 'top',
        })
        return
      }

      if (!userIdAvailable.value) {
        $q.notify({
          message: 'ID를 입력해주세요.',
          color: 'red',
          position: 'top',
        })
        return
      }

      try {
        await axios.post('http://127.0.0.1:8000/users/', {
          user_id: user_id.value,
          name: name.value,
          email: email.value,
          phone: phone.value,
          password: password.value,
          address1: address.value,
          address2: addressDetail.value,
          role_ids: role_id.value.map((role) => Number(role.value)), // 권한 배열을 숫자로 변환
          approval_status: isAdmin.value ? 'Y' : 'N', // isAdmin에 따라 approval_status 값을 'Y' 또는 'N'으로 설정
        })

        $q.notify({
          message: '회원가입이 완료되었습니다!',
          color: 'green',
          position: 'top',
        })

        emit('close') // 부모 컴포넌트에 close 이벤트 전달
      } catch (error) {
        console.error('회원가입 실패:', error.message)
        $q.dialog({
          title: '회원가입 실패',
          message: '회원가입 실패: ' + error.message,
          color: 'red',
          icon: 'warning',
          ok: {
            label: '확인',
            color: 'negative',
            handler: () => {
              // 확인 버튼 클릭 시 실행할 코드
            },
          },
        })
      }
    }

    const closeDialog = () => {
      emit('close') // 부모 컴포넌트에 close 이벤트 전달
    }

    return {
      user_id,
      name,
      email,
      phone,
      password,
      confirmPassword,
      address,
      addressDetail,
      userIdAvailable,
      passwordMismatch,
      role_id,
      checkUserId,
      openAddressPopup,
      register,
      closeDialog,
      roleOptions,
      isAdmin,
      adminRoleOptions,
      userIdInput,
    }
  },
})
</script>

<style>
.input-form {
  width: 350px;
  height: 40px; /* 높이 줄이기 */
  margin-bottom: 12px;
}

.q-card-section {
  margin-bottom: 12px;
}

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

.error-message {
  color: red; /* 오류 메시지 색상 */
  margin-top: 5px; /* 마진 추가 */
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
</style>
