// vue.config.js

module.exports = {
  devServer: {
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:8000', // 실제 백엔드 서버 주소
        changeOrigin: true, // 원본 서버의 도메인과 상관없이 요청을 전달
        pathRewrite: {
          '^/api': '', // API 경로를 수정할 경우 사용 (예: /api/users -> /users)
        },
      },
    },
  },
}
