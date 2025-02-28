<template>
  <q-page class="flex flex-center">
    <q-card class="q-pa-md shadow-2 rounded-borders" style="width: 100%; max-width: 450px">
      <q-card-section>
        <div class="text-h5 text-center">로그인</div>
      </q-card-section>

      <q-card-section>
        <q-input v-model="user_id" label="아이디" type="text" outlined @keyup.enter="login" />
        <q-input
          v-model="password"
          label="비밀번호"
          type="password"
          outlined
          class="q-mt-md"
          @keyup.enter="login"
        />
      </q-card-section>

      <q-card-actions class="q-mt-md flex flex-center">
        <q-btn label="로그인" color="primary" @click="login" class="full-width" />
      </q-card-actions>

      <q-card-section class="text-center">
        <q-btn flat label="회원가입" color="blue" @click="showRegisterModal = true" />
      </q-card-section>
    </q-card>

    <!-- 회원가입 모달 -->
    <q-dialog v-model="showRegisterModal">
      <RegisterPage @close="showRegisterModal = false" />
    </q-dialog>
  </q-page>
</template>

<script>
import { defineComponent, ref } from 'vue'
import { useRouter } from 'vue-router'
import RegisterPage from '@/pages/RegisterPage.vue'
import { useQuasar } from 'quasar'

export default defineComponent({
  components: {
    RegisterPage,
  },

  props: {
    loginSuccess: {
      type: Function,
      required: true,
    },
  },

  setup(props) {
    const user_id = ref('')
    const password = ref('')
    const showRegisterModal = ref(false)
    const router = useRouter()
    const $q = useQuasar()

    // 토큰을 저장할 ref
    const token = ref('')

    const login = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:8000/login/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            user_id: user_id.value.trim(),
            password: password.value,
          }),
        })

        if (response.ok) {
          const result = await response.json()

          if (result.status === 'block') {
            $q.notify({
              message: '차단된 IP 사용자입니다.',
              color: 'red',
              position: 'top',
            })
            return
          }

          token.value = result.access_token // 토큰을 ref에 저장
          sessionStorage.setItem('access_token', token.value) // sessionStorage에 토큰 저장
          sessionStorage.setItem('roles', JSON.stringify(result.roles)) // roles 저장
          sessionStorage.setItem('user', JSON.stringify(result.user))

          // 로그인 성공 시 MainLayout의 loginSuccess 함수 호출
          props.loginSuccess(token.value, JSON.stringify(result.roles), JSON.stringify(result.user)) // props에서 loginSuccess를 호출하여 토큰을 전달

          $q.notify({
            message: result.message,
            color: 'green',
            position: 'top',
          })

          router.push('/') // 로그인 성공 시 이동
        } else {
          console.error('로그인 실패:', response.statusText)
          $q.dialog({
            title: '로그인 실패',
            message: '사용자 ID 또는 비밀번호를 확인하세요.',
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
      } catch (error) {
        console.error('로그인 중 오류 발생:', error)

        $q.dialog({
          title: '로그인 오류',
          message: '로그인 중 오류가 발생했습니다.',
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

    return {
      user_id,
      password,
      showRegisterModal,
      login,
    }
  },
})
</script>
