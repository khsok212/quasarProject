<template>
  <q-page class="q-pa-lg">
    <q-toolbar>
      <q-toolbar-title>접속 이력</q-toolbar-title>
    </q-toolbar>

    <div class="filter-container q-mb-md">
      <div class="filter-item">
        <label for="userId">ID</label>
        <q-input v-model="filterUserId" debounce="300" @keyup.enter="fetchHistory" id="userId" />
      </div>
      <div class="filter-item">
        <label for="loginIp">접속 IP</label>
        <q-input v-model="filterLoginIp" debounce="300" @keyup.enter="fetchHistory" id="loginIp" />
      </div>
      <div class="filter-item">
        <label for="requestPath">요청 경로</label>
        <q-input
          v-model="filterRequestPath"
          debounce="300"
          @keyup.enter="fetchHistory"
          id="requestPath"
        />
      </div>
      <div class="filter-item">
        <label for="loginDate">날짜</label>
        <q-input type="date" v-model="filterLoginDate" @keyup.enter="fetchHistory" id="loginDate" />
      </div>
      <div class="filter-item">
        <q-btn label="조회" color="primary" @click="fetchHistory" :loading="loading" />
      </div>
    </div>

    <q-table
      :rows="history"
      :columns="columns"
      row-key="index"
      :loading="loading"
      :rows-per-page-options="[5, 10, 20, 50]"
      v-model:pagination="pagination"
    >
      <template v-slot:body-cell-login_time="props">
        <q-td :props="props">
          {{ formatDate(props.row.login_time) }}
        </q-td>
      </template>
      <template v-slot:body-cell-action="props">
        <q-td :props="props">
          <q-btn
            v-if="isAdmin"
            :label="blockedIps.includes(props.row.login_ip) ? '차단 해제' : '차단'"
            :color="blockedIps.includes(props.row.login_ip) ? 'orange' : 'negative'"
            @click="toggleBlockStatus(props.row.login_ip, props.row.user_id)"
          />
        </q-td>
      </template>
    </q-table>
  </q-page>
</template>

<script>
import { ref, onMounted, computed } from 'vue'
import { useQuasar } from 'quasar'

export default {
  setup() {
    const $q = useQuasar()
    const loading = ref(false)
    const filterUserId = ref('') // ID 필터
    const filterLoginIp = ref('') // 접속 IP 필터
    const filterRequestPath = ref('') // 요청 경로 필터
    const filterLoginDate = ref('') // 날짜 필터
    const history = ref([])
    const pagination = ref({ page: 1, rowsPerPage: 10 })
    const blockedIps = ref([]) // 차단된 IP 목록
    const roles = ref(JSON.parse(sessionStorage.getItem('roles')) || [])

    const isAdmin = computed(() => roles.value.includes(0))

    const columns = computed(() => {
      const baseColumns = [
        { name: 'index', label: '순번', align: 'left', field: 'index', sortable: true },
        { name: 'user_id', label: 'ID', align: 'left', field: 'user_id', sortable: true },
        { name: 'login_ip', label: '접속 IP', align: 'left', field: 'login_ip', sortable: true },
        {
          name: 'request_path',
          label: '요청 경로',
          align: 'left',
          field: 'request_path',
          sortable: true,
        },
        { name: 'memo', label: '메모', align: 'left', field: 'memo', sortable: false },
        { name: 'login_time', label: '날짜', align: 'left', field: 'login_time', sortable: true },
      ]

      // Add the action column only if isAdmin is true
      if (isAdmin.value) {
        baseColumns.push({
          name: 'action',
          label: '작업',
          align: 'center',
          field: 'action',
          sortable: false,
        })
      }

      return baseColumns
    })

    const fetchHistory = async () => {
      loading.value = true
      try {
        const token = sessionStorage.getItem('access_token')
        const queryParams = new URLSearchParams({
          user_id: filterUserId.value.trim(),
          login_ip: filterLoginIp.value.trim(),
          request_path: filterRequestPath.value.trim(),
          login_time: filterLoginDate.value.trim(),
        })

        const response = await fetch(`http://127.0.0.1:8000/api/userHistory?${queryParams}`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        })

        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`)
        const data = await response.json()

        history.value = data.map((item, index) => {
          return {
            ...item,
            index: index + 1,
          }
        })
      } catch (error) {
        console.error('접속 이력 불러오기 실패:', error)
      } finally {
        loading.value = false
      }
    }

    // 차단된 IP 목록을 가져오는 함수
    const fetchBlockedIps = async () => {
      try {
        const token = sessionStorage.getItem('access_token')
        const response = await fetch('http://127.0.0.1:8000/api/blockedIps', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        })

        if (response.ok) {
          const data = await response.json()
          blockedIps.value = data.blocked_ips
        } else {
          throw new Error('차단된 IP 조회 실패')
        }
      } catch (error) {
        console.error('차단된 IP 조회 오류:', error)
      }
    }

    const blockUser = async (loginIp, user_id) => {
      const confirmBlock = confirm(`접속 ip ${loginIp} 를 차단하시겠습니까?`)
      if (!confirmBlock) return

      try {
        const token = sessionStorage.getItem('access_token')
        const response = await fetch(`http://127.0.0.1:8000/api/blockIp`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ ip_address: loginIp, user_id: user_id }),
        })

        if (!response.ok && !response.status)
          throw new Error(`HTTP error! status: ${response.status}`)
        if (response.status === 'ok') {
          $q.notify({
            message: `IP ${loginIp}이(가) 차단되었습니다.`,
            color: 'green',
            position: 'top',
          })
        } else {
          $q.notify({
            message: `IP ${loginIp}이(가) 차단되어 있습니다.`,
            color: 'red',
            position: 'top',
          })
        }
        fetchHistory() // 새로고침
        fetchBlockedIps()
      } catch (error) {
        console.error('IP 차단 실패:', error)
      }
    }

    const formatDate = (timestamp) => {
      const date = new Date(timestamp) // timestamp를 Date 객체로 변환
      return date
        .toLocaleString('ko-KR', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false, // 12시간제 사용 여부 (false는 24시간제)
        })
        .replace(/\./g, '-') // 날짜 형식에서 점(.)을 하이픈(-)으로 변경
    }

    const toggleBlockStatus = async (loginIp, user_id) => {
      const isBlocked = blockedIps.value.includes(loginIp)
      const action = isBlocked ? 'unblock' : 'block'
      const confirmMessage = isBlocked
        ? `접속 IP ${loginIp}의 차단을 해제하시겠습니까?`
        : `접속 IP ${loginIp}를 차단하시겠습니까?`

      $q.dialog({
        title: '차단 알림 팝업',
        message: confirmMessage,
        cancel: true,
        persistent: true,
      })
        .onOk(async () => {
          try {
            const token = sessionStorage.getItem('access_token')
            const response = await fetch(`http://127.0.0.1:8000/api/${action}Ip`, {
              method: 'POST',
              headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ ip_address: loginIp, user_id }),
            })

            if (!response.ok) throw new Error(`${action} IP 실패`)

            $q.notify({
              message: `IP ${loginIp}이(가) ${isBlocked ? '차단 해제' : '차단'}되었습니다.`,
              color: 'green',
              position: 'top',
            })

            fetchHistory() // 새로고침
            fetchBlockedIps() // 차단된 IP 목록 새로 고침
          } catch (error) {
            console.error(`IP ${action} 실패:`, error)
          }
        })
        .onCancel(() => {})
    }

    onMounted(() => {
      fetchHistory()
      fetchBlockedIps() // 컴포넌트 초기화 시 차단된 IP 목록 가져오기
    })

    return {
      loading,
      filterUserId,
      filterLoginIp,
      filterRequestPath,
      filterLoginDate,
      history,
      columns,
      fetchHistory,
      pagination,
      blockUser,
      toggleBlockStatus,
      blockedIps,
      isAdmin,
      formatDate,
    }
  },
}
</script>

<style scoped>
.filter-item {
  margin-bottom: 16px;
  min-width: 170px;
}

.filter-item:last-child {
  margin-left: auto; /* 마지막 필터 항목은 왼쪽 정렬을 풀고 오른쪽 정렬 */
  min-width: 20px;
}

.filter-container {
  display: flex;
  flex-wrap: wrap;
  gap: 50px;
  align-items: center;
}
</style>
