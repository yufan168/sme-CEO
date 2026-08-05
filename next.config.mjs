/** noindex 防爬；建置不因 lint／型別警告而失敗（型別檢查留給開發階段） */
const nextConfig = {
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
  /* PGlite 自己會去讀 wasm 與檔案系統，被 bundler 打包過就會壞掉
     （症狀是 path 參數收到 URL 而不是字串）。交給 Node 原生載入。
     只有本機零設定模式會用到它，正式部署走 Neon 完全不碰。 */
  serverExternalPackages: ["@electric-sql/pglite"],
  async headers() {
    return [{ source: "/:path*", headers: [
      { key: "X-Robots-Tag", value: "noindex, nofollow, noarchive" },
      { key: "X-Frame-Options", value: "DENY" }
    ]}];
  }
};
export default nextConfig;
