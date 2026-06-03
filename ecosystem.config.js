// ─────────────────────────────────────────────────────────────────────────────
// PM2 ecosystem config cho Frontend (Next.js)
//
// Cài PM2 lần đầu trên server (chạy 1 lần duy nhất):
//   npm install -g pm2
//
// Khởi động FE lần đầu:
//   cd /home/vsoftware.vn        # hoặc đường dẫn repo FE trên server
//   npm ci && npm run build
//   pm2 start ecosystem.config.js
//   pm2 save                     # nhớ trạng thái sau reboot
//   pm2 startup                  # chạy theo lệnh PM2 in ra
//
// Lệnh hàng ngày:
//   pm2 status                   # xem trạng thái
//   pm2 logs vsoftware-fe        # xem log realtime
//   pm2 reload vsoftware-fe      # restart không downtime
//   pm2 restart vsoftware-fe     # restart có downtime ngắn
//   pm2 stop vsoftware-fe        # tạm dừng
// ─────────────────────────────────────────────────────────────────────────────

module.exports = {
  apps: [
    {
      name: 'vsoftware-fe',
      script: 'npm',
      args: 'start',
      cwd: './',                     // chạy từ thư mục chứa ecosystem.config.js
      instances: 1,                  // Tăng lên 'max' nếu muốn dùng nhiều CPU core
      exec_mode: 'fork',
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',      // restart nếu RAM dùng > 1GB

      env: {
        NODE_ENV: 'production',
        PORT: 3000,
      },

      // Log
      error_file: './logs/fe-error.log',
      out_file: './logs/fe-out.log',
      merge_logs: true,
      log_date_format: 'YYYY-MM-DD HH:mm:ss',
    },
  ],
}
