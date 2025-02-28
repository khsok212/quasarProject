export function guardRoute(to, from, next) {
  const accessToken = sessionStorage.getItem('access_token')
  const roles = JSON.parse(sessionStorage.getItem('roles')) || []

  const userString = sessionStorage.getItem('user') // sessionStorage에서 user 가져오기
  const user = userString ? JSON.parse(userString) : {} // user가 null일 경우 빈 객체로 설정
  const approvalStatus = user.approval_status !== undefined ? user.approval_status : '' // 승인 상태 체크

  // 로그인 여부 및 역할 확인
  if (!accessToken) {
    if (to.path === '/login') {
      next() // 로그인 페이지에 접근할 경우 그대로 진행
    } else if (to.path === '/welcome') {
      next() // welcome 페이지에 접근할 경우 그대로 진행
    } else if (to.path.startsWith('/examples/')) {
      next()
    } else {
      next({ path: '/welcome' }) // 다른 페이지는 welcome 페이지로 리다이렉트
    }
  } else {
    if (to.path === '/welcome') {
      // 승인 상태가 'N'이면 '/request' 페이지로 이동
      if (approvalStatus === 'N' && to.path !== '/request') {
        next({ path: '/request' })
      }
      // roles에 0 또는 1이 포함되면 '/admin/*' 접근 시 '/admin/dashboard'로 리다이렉트
      else if (roles.includes(0) || roles.includes(1)) {
        next({ path: '/admin/dashboard' })
      } else if (approvalStatus === 'Y' && to.path !== '/approval') {
        next({ path: '/approval' })
      } else {
        next()
      }
    } else if (to.path.startsWith('/admin/')) {
      // roles에 0 또는 1이 포함되면 '/admin/*' 접근 가능
      if (roles.includes(0) || roles.includes(1)) {
        next()
      } else {
        next({ path: '/' })
      }
    } else {
      next()
    }
  }
}
