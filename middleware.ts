/* © 2026 酒Ann ｜ SME AOS ｜ 僅供課程學員本人使用；禁止再製、商用、轉售、改作營利。詳見 LICENSE.md */
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { readToken, COOKIE, atLeast } from "./lib/auth";

const PUBLIC = new Set(["/login", "/api/login", "/robots.txt", "/favicon.ico",
  "/api/line/webhook", "/api/telegram/webhook", "/api/whatsapp/webhook"]);

/* 前綴放行：路徑本身帶著認證資訊，沒辦法列成固定字串。
   /api/hooks/<進站權杖> 是給 n8n／Make／Pabbly 反向觸發用的，
   外部平台不可能帶著登入 cookie，認證完全靠網址最後那段權杖，
   由該路由自己用固定長度比對驗證。 */
const PUBLIC_PREFIX = ["/api/hooks/", "/api/mcp/"];

/* 只有管理員可以碰的路徑：金鑰、清空、品牌空間、使用者、模型路由設定，
   以及會整批寫入資料或改動結構的匯入與遷移（v4.1 補上） */
const OWNER_ONLY = ["/api/settings", "/api/reset", "/api/spaces", "/api/users", "/api/ai",
  "/api/seed", "/api/migrate"];

export async function middleware(req: NextRequest) {
  /* middleware 一拋錯，整站每個請求都變成 Vercel 那張看不懂的
     MIDDLEWARE_INVOCATION_FAILED 卡片，學員連錯在哪都不知道。
     包一層 try：真的出錯時把原因用人話吐出來，並提示最常見的解法。 */
  try {
    return await guard(req);
  } catch (e: any) {
    const msg = String(e?.message || e).slice(0, 300);
    return new NextResponse(JSON.stringify({
      error: "系統的門口（middleware）出錯了：" + msg,
      fix: "最常見的解法：到 Vercel 的 Deployments，最新那筆按 Redeploy，並取消勾選 Use existing Build Cache 重新建置。若還是不行，確認 Settings 裡 AUTH_SECRET 與 APP_PASSWORD 兩個環境變數都在，改完要再 Redeploy。"
    }), { status: 500, headers: { "content-type": "application/json; charset=utf-8" } });
  }
}

async function guard(req: NextRequest) {
  const { pathname } = req.nextUrl;
  if (PUBLIC.has(pathname) || PUBLIC_PREFIX.some(p => pathname.startsWith(p)) || pathname.startsWith("/_next")) return NextResponse.next();

  const s = await readToken(req.cookies.get(COOKIE)?.value, process.env.AUTH_SECRET || "");
  if (!s.ok) {
    if (pathname.startsWith("/api/"))
      return new NextResponse(JSON.stringify({ error: "unauthorized" }), { status: 401, headers: { "content-type": "application/json" } });
    const url = req.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  if (pathname.startsWith("/api/")) {
    const write = req.method !== "GET" && req.method !== "HEAD";
    /* 唯讀角色：一律擋掉所有會改東西的請求 */
    if (write && !atLeast(s.role, "editor"))
      return deny("這個帳號是唯讀權限，不能修改資料。");
    /* 管理員專屬區：連讀取都要管理員，因為裡面看得到設定狀態 */
    if (OWNER_ONLY.some(p => pathname.startsWith(p)) && !atLeast(s.role, "owner"))
      return deny("只有管理員可以操作這一區。");
  }
  return NextResponse.next();
}

function deny(msg: string) {
  return new NextResponse(JSON.stringify({ error: msg }), { status: 403, headers: { "content-type": "application/json" } });
}

export const config = { matcher: ["/((?!_next/static|_next/image).*)"] };
