import { connectToDatabase } from './_lib/mongodb.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const { db } = await connectToDatabase();
    const usersCol = db.collection('users');

    // GET /api/auth -> Trả về thông tin quản trị viên hiện tại
    if (req.method === 'GET') {
      const user = await usersCol.findOne({ username: 'admin' });
      if (!user) {
        return res.status(200).json({ exists: false });
      }
      return res.status(200).json({
        exists: true,
        user: {
          username: user.username,
          name: user.name,
          role: user.role,
          updatedAt: user.updatedAt
        }
      });
    }

    // POST /api/auth -> Đăng nhập, Đăng xuất, Đổi mật khẩu
    if (req.method === 'POST') {
      let payload = req.body;
      if (typeof payload === 'string') {
        try {
          payload = JSON.parse(payload);
        } catch {
          payload = {};
        }
      }
      const { action = 'login', username, password, newPassword } = payload || {};

      // 1. Đăng xuất
      if (action === 'logout') {
        return res.status(200).json({ success: true, message: 'Đã đăng xuất khỏi hệ thống.' });
      }

      // 2. Đổi mật khẩu trong MongoDB Atlas
      if (action === 'change-password') {
        if (!username || !password || !newPassword) {
          return res.status(400).json({ success: false, message: 'Vui lòng nhập đầy đủ mật khẩu cũ và mới!' });
        }
        const user = await usersCol.findOne({ username: username.trim() });
        if (!user || user.password !== String(password)) {
          return res.status(400).json({ success: false, message: 'Mật khẩu hiện tại không đúng!' });
        }
        await usersCol.updateOne(
          { username: username.trim() },
          { $set: { password: String(newPassword), updatedAt: Date.now() } }
        );
        return res.status(200).json({ success: true, message: 'Đã cập nhật mật khẩu mới trên MongoDB Atlas thành công!' });
      }

      // 3. Đăng nhập qua MongoDB Atlas
      if (!username || !password) {
        return res.status(400).json({ success: false, message: 'Vui lòng nhập đầy đủ tài khoản và mật khẩu!' });
      }

      const cleanUsername = String(username).trim();
      let user = await usersCol.findOne({ username: cleanUsername });

      // Nếu chưa có tài khoản admin trong MongoDB Atlas, tự động khởi tạo mặc định
      if (!user && cleanUsername === 'admin') {
        const defaultAdmin = {
          username: 'admin',
          password: '10102020',
          name: 'Tuyết Mai (Quản trị viên)',
          role: 'admin',
          updatedAt: Date.now()
        };
        await usersCol.insertOne(defaultAdmin);
        user = defaultAdmin;
      }

      if (!user || user.password !== String(password)) {
        return res.status(200).json({
          success: false,
          message: 'Tài khoản hoặc mật khẩu không chính xác!'
        });
      }

      return res.status(200).json({
        success: true,
        message: 'Đăng nhập thành công qua MongoDB Atlas!',
        user: {
          username: user.username,
          name: user.name,
          role: user.role
        }
      });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('[API /api/auth Error]:', error);
    return res.status(500).json({
      success: false,
      error: 'Lỗi xác thực cơ sở dữ liệu MongoDB Atlas',
      details: error?.message
    });
  }
}
