/**
 * cloudSync.js - Cloud Synchronization Service for Meyzi Studio
 * 
 * Kết nối đồng bộ đa thiết bị (Máy 1, Máy 2, Điện thoại, iPad...)
 * trực tiếp qua Backend MongoDB Atlas Serverless (/api/sync).
 */

const TIMEOUT_MS = 10000;

function fetchWithTimeout(url, options = {}, timeout = TIMEOUT_MS) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);
  return fetch(url, { ...options, signal: controller.signal })
    .finally(() => clearTimeout(id));
}

/**
 * Tải toàn bộ dữ liệu mới nhất từ MongoDB Atlas
 */
export async function fetchCloudData() {
  try {
    const res = await fetchWithTimeout(`/api/sync?t=${Date.now()}`, {
      cache: 'no-store',
      headers: { 'Cache-Control': 'no-cache' }
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
          source: 'mongodb-atlas'
        };
      }
    }
  } catch (err) {
    console.warn('[CloudSync] Lỗi kết nối MongoDB Atlas Backend:', err?.message);
  }

  return { success: false, error: 'Không thể kết nối máy chủ MongoDB Atlas' };
}

/**
 * Đẩy dữ liệu lên MongoDB Atlas
 */
export async function saveCloudData({ customers, staffList, userProfile = null, updatedAt = Date.now() }) {
  const syncPayload = {
    customers: customers || [],
    staffList: staffList || [],
    userProfile: userProfile || null,
    updatedAt
  };

  try {
    const res = await fetchWithTimeout('/api/sync', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(syncPayload)
    });

    if (res.ok) {
      const data = await res.json();
      return { success: true, count: data?.count || syncPayload.customers.length };
    }
  } catch (err) {
    console.warn('[CloudSync] Lỗi lưu vào MongoDB Atlas:', err?.message);
  }

  return { success: false, error: 'Lỗi lưu trữ dữ liệu lên đám mây' };
}
