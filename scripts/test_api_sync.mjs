import handler from '../api/sync.js';

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
  console.log('--- Testing GET /api/sync ---');
  const { req, res } = mockReqRes('GET');
  await handler(req, res);
  console.log('Status:', res.statusCode);
  console.log('Customers count:', res.data?.customers?.length);
  console.log('Staff count:', res.data?.staffList?.length);
  console.log('Services count:', res.data?.servicesList?.length);
  console.log('Accessories count:', res.data?.accessoriesList?.length);
  console.log('User profile:', res.data?.userProfile);
  process.exit(0);
}

test();
