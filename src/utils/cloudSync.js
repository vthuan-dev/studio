/**
 * cloudSync.js - Cloud Synchronization Service for Meyzi Studio
 * 
 * Cho phép đồng bộ tức thì toàn bộ lịch hẹn (customers) và nhân viên (staffList)
 * giữa nhiều thiết bị (Máy tính 1, Máy tính 2, Điện thoại, iPad...) thông qua Cloud Storage.
 * 
 * Cơ chế hoạt động:
 * 1. Lưu trữ đồng bộ 2 tầng: Primary (ExtendsClass JSON Bin) + Backup (Restful-API Objects)
 * 2. Tự động dự phòng nếu một trong hai dịch vụ gặp sự cố mạng.
 * 3. Hỗ trợ Local Cache (localStorage) để mở app là hiện ngay tức thì (0ms).
 * 4. Tự động kiểm tra và đồng bộ khi chuyển tab, mở app, hoặc định kỳ mỗi 20 giây.
 */

export const PRIMARY_CLOUD_URL = 'https://extendsclass.com/api/json-storage/bin/bdbbdae';
export const BACKUP_CLOUD_URL = 'https://api.restful-api.dev/objects/ff808181a09d98f701a135cb556a5566';

const TIMEOUT_MS = 6000;

function fetchWithTimeout(url, options = {}, timeout = TIMEOUT_MS) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);
  return fetch(url, { ...options, signal: controller.signal })
    .finally(() => clearTimeout(id));
}

/**
 * Tải dữ liệu mới nhất từ Cloud
 * @returns {Promise<{ success: boolean, data?: { customers: Array, staffList: Array, updatedAt: number }, source?: string, error?: string }>}
 */
export async function fetchCloudData() {
  // 1. Thử tải từ Primary Cloud Bin
  try {
    const res = await fetchWithTimeout(`${PRIMARY_CLOUD_URL}?t=${Date.now()}`, {
      headers: { 'Cache-Control': 'no-cache' },
      cache: 'no-store'
    });
    if (res.ok) {
      const data = await res.json();
      if (data && Array.isArray(data.customers)) {
        return {
          success: true,
          data: {
            customers: data.customers,
            staffList: Array.isArray(data.staffList) ? data.staffList : null,
            userProfile: data.userProfile || null,
            updatedAt: typeof data.updatedAt === 'number' ? data.updatedAt : Date.now()
          },
          source: 'primary'
        };
      }
    }
  } catch (err) {
    console.warn('[CloudSync] Primary endpoint unreachable, falling back to backup...', err?.message);
  }

  // 2. Dự phòng: Thử tải từ Backup Cloud Store
  try {
    const res = await fetchWithTimeout(BACKUP_CLOUD_URL, {
      cache: 'no-store'
    });
    if (res.ok) {
      const resJson = await res.json();
      const payload = resJson.data || resJson;
      if (payload && Array.isArray(payload.customers)) {
        return {
          success: true,
          data: {
            customers: payload.customers,
            staffList: Array.isArray(payload.staffList) ? payload.staffList : null,
            userProfile: payload.userProfile || null,
            updatedAt: typeof payload.updatedAt === 'number' ? payload.updatedAt : Date.now()
          },
          source: 'backup'
        };
      }
    }
  } catch (err) {
    console.warn('[CloudSync] Backup endpoint unreachable...', err?.message);
  }

  return { success: false, error: 'Không thể kết nối đến máy chủ Cloud' };
}

/**
 * Đẩy dữ liệu lên Cloud Storage (cả Primary và Backup song song)
 * @param {{ customers: Array, staffList: Array, userProfile?: object, updatedAt: number }} payload 
 * @returns {Promise<{ success: boolean, results: object }>}
 */
export async function saveCloudData({ customers, staffList, userProfile = null, updatedAt = Date.now() }) {
  const syncPayload = {
    customers: customers || [],
    staffList: staffList || [],
    userProfile: userProfile || null,
    updatedAt
  };

  const results = {
    primary: false,
    backup: false,
    localVite: false
  };

  // 1. Ghi lên Primary Cloud Bin
  const primaryPromise = (async () => {
    try {
      const res = await fetchWithTimeout(PRIMARY_CLOUD_URL, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(syncPayload)
      });
      if (res.ok) results.primary = true;
    } catch (e) {
      console.warn('[CloudSync] Save to primary failed:', e?.message);
    }
  })();

  // 2. Ghi lên Backup Cloud Store
  const backupPromise = (async () => {
    try {
      const res = await fetchWithTimeout(BACKUP_CLOUD_URL, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'Meyzi Cloud Sync',
          data: syncPayload
        })
      });
      if (res.ok) results.backup = true;
    } catch (e) {
      console.warn('[CloudSync] Save to backup failed:', e?.message);
    }
  })();

  // 3. Nếu đang chạy localhost có Vite API server, ghi vào file json local để giữ code sync
  const localVitePromise = (async () => {
    try {
      await fetch('/api/customers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(syncPayload.customers)
      });
      if (staffList && staffList.length > 0) {
        await fetch('/api/staff', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(syncPayload.staffList)
        });
      }
      results.localVite = true;
    } catch {
      // Bỏ qua nếu chạy trên Vercel (không có local Vite dev server)
    }
  })();

  await Promise.allSettled([primaryPromise, backupPromise, localVitePromise]);

  const isSuccess = results.primary || results.backup || results.localVite;
  return { success: isSuccess, results };
}
