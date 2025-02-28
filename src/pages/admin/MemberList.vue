<template>
  <q-page class="q-pa-lg">
    <q-toolbar>
      <q-toolbar-title>회원 관리</q-toolbar-title>
    </q-toolbar>

    <div class="filter-container q-mb-md">
      <div class="filter-item">
        <label for="userId">ID</label>
        <q-input v-model="filterUserId" debounce="300" @keyup.enter="fetchMembers" id="userId" />
      </div>
      <div class="filter-item">
        <label for="name">이름</label>
        <q-input v-model="filterName" debounce="300" @keyup.enter="fetchMembers" id="name" />
      </div>
      <div class="filter-item">
        <label for="email">이메일</label>
        <q-input v-model="filterEmail" debounce="300" @keyup.enter="fetchMembers" id="email" />
      </div>
      <div class="filter-item">
        <label for="phone">전화번호</label>
        <q-input v-model="filterPhone" debounce="300" @keyup.enter="fetchMembers" id="phone" />
      </div>
      <div class="filter-item">
        <label for="approvalStatus">승인여부</label>
        <q-select
          v-model="filterApprovalStatus"
          :options="approvalStatusOptions"
          clearable
          :emit-value="true"
          :map-options="true"
          @keyup.enter="fetchMembers"
          class="approval-status-select"
          id="approvalStatus"
        />
      </div>
      <div class="filter-item">
        <label for="roleIds">권한</label>
        <q-select
          v-model="filterRoleIds"
          :options="roleOptions"
          clearable
          :emit-value="true"
          :map-options="true"
          multiple
          @keyup.enter="fetchMembers"
          class="role-select"
          id="roleIds"
        />
      </div>
      <div class="filter-item">
        <q-btn label="조회" color="primary" @click="fetchMembers" :loading="loading" />
      </div>
    </div>

    <div class="action-buttons q-mb-md">
      <q-btn
        label="회원 등록"
        color="primary"
        @click="registerMemberPopup = true"
        class="q-ml-md"
        v-if="isAdmin"
      />
      <q-btn
        v-if="isAdmin"
        label="승인처리"
        color="positive"
        @click="approveSelectedMembers"
        class="q-ml-md"
        :disabled="!selected.length"
      />
      <q-btn
        v-if="isAdmin"
        label="회원 삭제"
        color="negative"
        @click="deleteSelectedMembers"
        class="q-ml-md"
        :disabled="!selected.length"
      />
    </div>

    <q-table
      :rows="members"
      :columns="columns"
      row-key="user_id"
      :loading="loading"
      :hide-pagination="false"
      :selection="isAdmin ? 'multiple' : 'none'"
      v-model:selected="selected"
      :rows-per-page-options="[5, 10, 20, 50]"
      v-model:pagination="pagination"
    >
      <template v-slot:body-cell-approval_status="props">
        <q-td
          :props="props"
          :class="{
            'text-red': props.row.approval_status === 'N',
            'text-green': props.row.approval_status === 'Y',
          }"
        >
          {{ props.row.approval_status === 'Y' ? '승인' : '미승인' }}
        </q-td>
      </template>
      <template v-slot:body-cell-role_ids="props">
        <q-td :props="props">
          {{ getRoleNames(props.row.role_ids).join(', ') }}
        </q-td>
      </template>
      <template v-slot:body-cell-created_at="props">
        <q-td :props="props">
          {{ formatDate(props.row.created_at) }}
        </q-td>
      </template>
    </q-table>

    <q-dialog v-model="memberPopup">
      <UserInfoModal :userId="selectedMemberId" @close="handleClose" />
    </q-dialog>

    <!-- 회원등록 모달 -->
    <q-dialog v-model="registerMemberPopup">
      <RegisterPage @close="handleClose" />
    </q-dialog>
  </q-page>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import RegisterPage from '@/pages/RegisterPage.vue'
import UserInfoModal from '@/pages/UserInfoModal.vue'
import { useQuasar } from 'quasar'

export default {
  components: {
    RegisterPage,
    UserInfoModal,
  },
  // props: {
  //   userId: {
  //     type: String,
  //     required: true,
  //   },
  // },
  setup() {
    const $q = useQuasar()
    const loading = ref(true)
    const filterUserId = ref('') // ID 필터
    const filterName = ref('') // 이름 필터
    const filterEmail = ref('') // 이메일 필터
    const filterPhone = ref('') // 전화번호 필터
    const filterApprovalStatus = ref('') // 기본값 설정
    const filterRoleIds = ref([]) // 선택된 권한 ID를 배열로 저장
    const members = ref([])
    const selected = ref([])
    const roles = ref(JSON.parse(sessionStorage.getItem('roles')) || [])
    const pagination = ref({ page: 1, rowsPerPage: 10 }) // 기본 페이지당 행 수를 10으로 설정

    const isAdmin = computed(() => roles.value.includes(0))
    const registerMemberPopup = ref(false) // 모달 상태
    const memberPopup = ref(false) // 모달 상태
    const selectedMemberId = ref(null) // 선택한 멤버의 ID를 저장할 ref

    const approvalStatusOptions = [
      { label: '승인', value: 'Y' },
      { label: '미승인', value: 'N' },
    ]

    const roleOptions = [
      { label: '슈퍼관리자', value: 0 },
      { label: '관리자', value: 1 },
      { label: '일반사용자', value: 2 },
    ]

    const columns = [
      { name: 'index', label: '순번', align: 'left', field: 'index', sortable: true },
      { name: 'user_id', label: 'ID', align: 'left', field: 'user_id', sortable: true },
      { name: 'name', label: '이름', align: 'left', field: 'name', sortable: true },
      { name: 'email', label: '이메일', align: 'left', field: 'email', sortable: true },
      { name: 'phone', label: '전화번호', align: 'left', field: 'phone', sortable: true },
      { name: 'address', label: '주소', align: 'left', field: 'address', sortable: true },
      {
        name: 'approval_status',
        label: '승인여부',
        align: 'left',
        field: 'approval_status',
        sortable: true,
      },
      {
        name: 'role_ids', // 역할 컬럼 추가
        label: '권한',
        align: 'left',
        field: 'role_ids',
      },
      {
        name: 'created_at',
        label: '가입일',
        align: 'left',
        field: 'created_at',
        sortable: true,
      },
    ]

    // 회원 목록 조회 함수 (필터 적용)
    const fetchMembers = async () => {
      loading.value = true
      try {
        const token = sessionStorage.getItem('access_token')

        // 필터 값으로 쿼리스트링 생성
        const queryParams = new URLSearchParams({
          user_id: filterUserId.value.trim(),
          name: filterName.value.trim(),
          email: filterEmail.value.trim(),
          phone: filterPhone.value.trim(),
          approval_status: filterApprovalStatus.value || '',
          role_ids:
            filterRoleIds.value && filterRoleIds.value.length > 0
              ? filterRoleIds.value.join(',')
              : '',
        })

        const response = await fetch(`http://127.0.0.1:8000/api/users?${queryParams}`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        })

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const data = await response.json()

        members.value = data.map((member, index) => ({
          ...member,
          index: index + 1,
        }))
      } catch (error) {
        console.error('데이터 불러오기 실패:', error)
      } finally {
        loading.value = false
      }
    }

    const handleClose = async () => {
      registerMemberPopup.value = false // 팝업 닫기
      memberPopup.value = false // 팝업 닫기
      await fetchMembers() // 회원 목록 다시 조회
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

    const getRoleNames = (roleIds) => {
      const roleNames = {
        0: '슈퍼관리자',
        1: '관리자',
        2: '일반사용자',
      }
      return roleIds.map((id) => roleNames[id] || '알 수 없음') // 역할 이름 변환
    }

    const deleteSelectedMembers = async () => {
      if (!isAdmin.value || selected.value.length === 0) return

      const confirmed = confirm('선택한 회원을 삭제하시겠습니까?')
      if (!confirmed) return

      try {
        const token = sessionStorage.getItem('access_token')
        const userIds = selected.value.map((member) => member.user_id)

        const response = await fetch(`http://127.0.0.1:8000/api/users/`, {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ user_ids: userIds }),
        })

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        await fetchMembers()
        selected.value = []
      } catch (error) {
        console.error('회원 삭제 실패:', error)
      }
    }

    const handleRowClick = (row, event) => {
      selectedMemberId.value = event.user_id // 선택한 멤버의 user_id 저장
      console.log('selectedMemberId.value', selectedMemberId.value)
    }

    const approveSelectedMembers = async () => {
      if (!isAdmin.value || selected.value.length === 0) return

      $q.dialog({
        title: '회원 승인',
        message: '선택한 회원을 승인하시겠습니까?',
        cancel: true,
        persistent: true,
      })
        .onOk(async () => {
          try {
            const token = sessionStorage.getItem('access_token')
            const userIds = selected.value.map((member) => member.user_id)

            const response = await fetch(`http://127.0.0.1:8000/api/users/approve`, {
              method: 'POST',
              headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ user_ids: userIds }),
            })

            if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`)
            }

            await fetchMembers() // ✅ 승인 후 회원 목록 다시 불러오기
            selected.value = []
          } catch (error) {
            console.error('회원 승인 실패:', error)
          }
        })
        .onCancel(() => {
          console.log('승인 취소됨')
        })
    }

    onMounted(fetchMembers)

    return {
      loading,
      filterUserId,
      filterName,
      filterEmail,
      filterPhone,
      filterApprovalStatus,
      approvalStatusOptions,
      members,
      selected,
      columns,
      isAdmin,
      fetchMembers,
      deleteSelectedMembers,
      approveSelectedMembers,
      pagination,
      formatDate,
      getRoleNames,
      roleOptions,
      filterRoleIds,
      registerMemberPopup,
      memberPopup,
      handleClose,
      handleRowClick,
    }
  },
}
</script>

<style scoped>
.text-red {
  color: red;
}

.text-green {
  color: green;
}

.filter-container {
  display: flex;
  flex-wrap: wrap;
  gap: 50px;
  align-items: center;
}

.filter-item {
  margin-bottom: 16px;
  min-width: 170px;
}

.filter-item:last-child {
  margin-left: auto; /* 마지막 필터 항목은 왼쪽 정렬을 풀고 오른쪽 정렬 */
  min-width: 20px;
}

.action-buttons {
  display: flex;
  margin-bottom: 20px;
  justify-content: flex-end; /* 오른쪽 정렬 */
}

.approval-status-select {
  min-width: 100px;
}

.role-select {
  min-width: 250px;
}
</style>
