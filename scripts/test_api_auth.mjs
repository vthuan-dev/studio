import handler from '../api/auth.js';

function mockReqRes(method, body = null) {
  const req = {
    method,
    body,
    headers: {}
  };
  const res = {
    statusCode: 200,
    headers: {},
    setHeader(k, v) { this.headers[k] = v; },
    status(code) { this.statusCode = code; return this; },
    json(data) { this.data = data; return this; },
    end() { return this; }
  };
  return { req, res };
}

async function test() {
  console.log('--- 1. Testing GET /api/auth ---');
  const { req: r1, res: res1 } = mockReqRes('GET');
  await handler(r1, res1);
  console.log('Result GET:', res1.statusCode, res1.data);

  console.log('\n--- 2. Testing Login Wrong Password ---');
  const { req: r2, res: res2 } = mockReqRes('POST', { action: 'login', username: 'admin', password: 'wrongpassword' });
  await handler(r2, res2);
  console.log('Result Wrong:', res2.statusCode, res2.data);

  console.log('\n--- 3. Testing Login Correct Password ---');
  const { req: r3, res: res3 } = mockReqRes('POST', { action: 'login', username: 'admin', password: '10102020' });
  await handler(r3, res3);
  console.log('Result Correct:', res3.statusCode, res3.data);

  console.log('\n--- 4. Testing Logout ---');
  const { req: r4, res: res4 } = mockReqRes('POST', { action: 'logout' });
  await handler(r4, res4);
  console.log('Result Logout:', res4.statusCode, res4.data);

  process.exit(0);
}

test();
