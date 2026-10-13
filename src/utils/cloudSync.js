/**
 * cloudSync.js - Cloud Synchronization Service for Meyzi Studio
 * 
 * Kết nối đồng bộ đa thiết bị (Máy 1, Máy 2, Điện thoại, iPad...)
 * trực tiếp qua Backend MongoDB Atlas Serverless (/api/sync và /api/auth).
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
            servicesList: Array.isArray(data.servicesList) ? data.servicesList : null,
            accessoriesList: Array.isArray(data.accessoriesList) ? data.accessoriesList : null,
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
export async function saveCloudData({ customers, staffList, servicesList = null, accessoriesList = null, userProfile = null, updatedAt = Date.now() }) {
  const syncPayload = {
    customers: customers || [],
    staffList: staffList || [],
    ...(servicesList ? { servicesList } : {}),
    ...(accessoriesList ? { accessoriesList } : {}),
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

/**
 * Xác thực tài khoản Admin trực tiếp qua MongoDB Atlas (/api/auth)
 */
export async function authenticateWithCloud(username, password) {
  try {
    const res = await fetchWithTimeout('/api/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'login', username, password })
    }, 6000);
    if (res.ok) {
      return await res.json();
    }
    const errData = await res.json().catch(() => ({}));
    return { success: false, message: errData?.message || 'Tài khoản hoặc mật khẩu không chính xác!' };
  } catch (err) {
    console.warn('[Auth] Lỗi kết nối MongoDB Auth API:', err?.message);
    return { success: false, message: 'Lỗi kết nối máy chủ xác thực MongoDB Atlas' };
  }
}

/**
 * Đăng xuất tài khoản
 */
export async function logoutCloud() {
  try {
    await fetchWithTimeout('/api/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'logout' })
    }, 4000);
  } catch (err) {
    console.warn('[Auth] Logout warning:', err?.message);
  }
}

/**
 * Đổi mật khẩu tài khoản Admin trực tiếp trên MongoDB Atlas
 */
export async function changePasswordCloud(username, currentPassword, newPassword) {
  try {
    const res = await fetchWithTimeout('/api/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'change-password', username, password: currentPassword, newPassword })
    }, 6000);
    return await res.json();
  } catch (err) {
    return { success: false, message: 'Lỗi kết nối máy chủ MongoDB Atlas' };
  }
}
