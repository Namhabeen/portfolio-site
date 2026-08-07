import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// base를 상대경로('./')로 지정해두면 레포 이름이 뭐든(예: username.github.io/repo-name)
// 별도 수정 없이 그대로 배포됩니다.
export default defineConfig({
  plugins: [react()],
  base: './',
});
