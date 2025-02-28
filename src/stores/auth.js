// stores/auth.js
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useAuthStore = defineStore('auth', () => {
  // 상태 정의
  const accessToken = ref(sessionStorage.getItem('access_token'))
  const roles = ref(JSON.parse(sessionStorage.getItem('roles')) || [])
  const user = ref(JSON.parse(sessionStorage.getItem('user')) || {})

  // 계산된 속성
  const isLoggedIn = computed(() => !!accessToken.value)
  const loginName = computed(() => user.value.name || '')

  // 권한 체크
  const hasMemberManagementRole = computed(() => {
    return (
      roles.value.includes(0) || // 슈퍼관리자 권한
      (roles.value.includes(1) && user.value.approval_status === 'Y')
    ) // 관리자 권한과 승인 상태 'Y'
  })

  // 로그인
  const login = (token, newRoles, newUser) => {
    sessionStorage.setItem('access_token', token)
    sessionStorage.setItem('roles', JSON.stringify(newRoles))
    sessionStorage.setItem('user', JSON.stringify(newUser))
    accessToken.value = token
    roles.value = newRoles
    user.value = newUser
  }

  // 로그아웃
  const logout = async ($q, router) => {
    const logoutHistory = {
      user_id: user.value.user_id,
      request_path: '/logout',
      memo: '로그아웃 성공',
    }

    try {
      const response = await fetch('http://127.0.0.1:8000/logout', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken.value}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(logoutHistory),
      })

      if (!response.ok) {
        throw new Error(`Failed to log out history: ${response.status}`)
      }

      // 로그아웃 성공 시 알림
      $q.notify({
        message: '로그아웃이 되었습니다.',
        color: 'green',
        position: 'top',
      })

      // 홈 화면으로 리디렉션
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
    sessionStorage.removeItem('roles')
    sessionStorage.removeItem('user')

    // 상태 초기화
    accessToken.value = null
    roles.value = []
    user.value = {}

    // 홈 화면으로 리디렉션
    router.push('/')
  }

  return { accessToken, roles, user, isLoggedIn, loginName, hasMemberManagementRole, login, logout }
})
