/**
 * End-to-End Headless Verification Test for Universal Scroll Compare Pro SaaS:
 * 1. User Registration & 72-Hour Free Trial Activation
 * 2. Remote Session Rendering & Scroll Sync under active trial
 * 3. Strict Backend Trial Expiration Enforcement (HTTP 403 SUBSCRIPTION_EXPIRED)
 * 4. Automated ₹399 Payment Verification & 30-Day Pro License Activation
 * 5. Re-check Remote Session Rendering under active Pro license
 * 6. User Payment History & Strict Tenant Isolation
 */

const http = require("http");
const { app, server, browserManager } = require("../server");
const db = require("../src/database");

const TEST_PORT = 3099;
const BASE_URL = `http://127.0.0.1:${TEST_PORT}`;

function makeRequest(method, endpoint, body = null, token = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(endpoint, BASE_URL);
    const headers = { "Content-Type": "application/json" };
    if (token) headers["Authorization"] = `Bearer ${token}`;

    const req = http.request(
      url,
      {
        method,
        headers
      },
      (res) => {
        let raw = "";
        res.on("data", (chunk) => (raw += chunk));
        res.on("end", () => {
          try {
            const data = JSON.parse(raw);
            resolve({ status: res.statusCode, headers: res.headers, data });
          } catch (e) {
            resolve({ status: res.statusCode, headers: res.headers, raw });
          }
        });
      }
    );

    req.on("error", reject);
    if (body) req.write(JSON.stringify(body));
    req.end();
  });
}

async function runTests() {
  console.log("===============================================================");
  console.log("🧪 Starting SaaS Workflow & Subscription Enforcement Verification");
  console.log("===============================================================\n");

  await new Promise((resolve) => server.listen(TEST_PORT, resolve));
  console.log(`✓ Test Server listening on ${BASE_URL}`);

  try {
    const uniqueSuffix = Date.now();
    const user1Data = {
      fullName: "Priya Sharma",
      username: `priya_${uniqueSuffix}`,
      email: `priya_${uniqueSuffix}@example.com`,
      password: "SecurePassword123!"
    };

    // -------------------------------------------------------------------------
    // Test 1: User Registration & 72-Hour Free Trial
    // -------------------------------------------------------------------------
    console.log("1. Testing Registration and 72-Hour Trial Activation...");
    const regRes = await makeRequest("POST", "/api/auth/register", user1Data);
    if (regRes.status !== 200 || !regRes.data.success) {
      throw new Error(`Registration failed: ${JSON.stringify(regRes.data)}`);
    }
    const token1 = regRes.data.token;
    const userId1 = regRes.data.user.id;
    console.log(`   ✓ Registered User ID: ${userId1}`);
    console.log(`   ✓ Trial expires at: ${new Date(regRes.data.user.trialExpiresAt).toISOString()}`);

    // Verify /api/auth/me shows active trial
    const meRes = await makeRequest("GET", "/api/auth/me", null, token1);
    if (meRes.status !== 200 || !meRes.data.user.hasActiveAccess) {
      throw new Error("User does not have active access after registration");
    }
    console.log(`   ✓ Auth verification: hasActiveAccess = ${meRes.data.user.hasActiveAccess}, remainingHours = ${meRes.data.user.remainingTrialHours}`);

    // -------------------------------------------------------------------------
    // Test 2: Remote Browser Session with Active Trial (200 OK)
    // -------------------------------------------------------------------------
    console.log("\n2. Testing Remote Browser Session with Active Trial...");
    const sessionRes = await makeRequest(
      "POST",
      "/api/session/start",
      {
        targetUrl: `${BASE_URL}/index.html`,
        viewports: [
          { name: "Mobile", width: 375, height: 667, isMobile: true },
          { name: "Desktop", width: 1280, height: 800, isMobile: false }
        ]
      },
      token1
    );
    if (sessionRes.status !== 200 || !sessionRes.data.success) {
      throw new Error(`Failed to start session under active trial: ${JSON.stringify(sessionRes.data)}`);
    }
    const sessionId = sessionRes.data.sessionId;
    console.log(`   ✓ Remote Session Started: ${sessionId}`);
    console.log(`   ✓ Viewports spawned: ${sessionRes.data.viewports.length}`);

    // Sync scroll
    const scrollRes = await makeRequest(
      "POST",
      "/api/session/scroll",
      { sessionId, sourceIndex: 0, progress: 0.35, mode: "percentage" },
      token1
    );
    if (scrollRes.status !== 200) {
      throw new Error(`Scroll failed: ${JSON.stringify(scrollRes.data)}`);
    }
    console.log(`   ✓ Scroll synchronized successfully at 35% depth`);

    // -------------------------------------------------------------------------
    // Test 3: Backend Trial Expiry Enforcement (HTTP 403 SUBSCRIPTION_EXPIRED)
    // -------------------------------------------------------------------------
    console.log("\n3. Testing Strict Backend Enforcement on Trial Expiry...");
    // Simulate trial expiration by setting trial_expires_at to the past
    db.setTrialExpiry(userId1, Date.now() - 1000);
    console.log("   -> Simulated trial expiration (timestamp set to 1s ago)");

    // Attempting to scroll should immediately be rejected with 403
    const blockedScrollRes = await makeRequest(
      "POST",
      "/api/session/scroll",
      { sessionId, sourceIndex: 0, progress: 0.5, mode: "percentage" },
      token1
    );
    if (blockedScrollRes.status !== 403 || blockedScrollRes.data.code !== "SUBSCRIPTION_EXPIRED") {
      throw new Error(`Expected 403 SUBSCRIPTION_EXPIRED, got status ${blockedScrollRes.status}: ${JSON.stringify(blockedScrollRes.data)}`);
    }
    console.log("   ✓ Backend strictly blocked scroll: 403 SUBSCRIPTION_EXPIRED");

    // Attempting to start a new session must also be rejected with 403
    const blockedStartRes = await makeRequest(
      "POST",
      "/api/session/start",
      { targetUrl: `${BASE_URL}/index.html` },
      token1
    );
    if (blockedStartRes.status !== 403 || blockedStartRes.data.code !== "SUBSCRIPTION_EXPIRED") {
      throw new Error(`Expected 403 SUBSCRIPTION_EXPIRED on session start, got ${blockedStartRes.status}`);
    }
    console.log("   ✓ Backend strictly blocked new session start: 403 SUBSCRIPTION_EXPIRED");

    // -------------------------------------------------------------------------
    // Test 4: Automated Payment Verification & ₹399 Subscription Activation
    // -------------------------------------------------------------------------
    console.log("\n4. Testing Automated ₹399 Payment Flow...");
    // Step A: Create order
    const orderRes = await makeRequest("POST", "/api/payment/create-order", null, token1);
    if (orderRes.status !== 200 || !orderRes.data.success) {
      throw new Error(`Order creation failed: ${JSON.stringify(orderRes.data)}`);
    }
    const order = orderRes.data.order;
    console.log(`   ✓ Order created: ID=${order.id}, Amount=₹${order.amount / 100}, Currency=${order.currency}`);

    // Step B: Automatic verification
    const verifyRes = await makeRequest(
      "POST",
      "/api/payment/verify",
      {
        orderId: order.id,
        paymentId: "pay_test_" + Date.now(),
        signature: "sig_verified_mock"
      },
      token1
    );
    if (verifyRes.status !== 200 || !verifyRes.data.verified) {
      throw new Error(`Payment verification failed: ${JSON.stringify(verifyRes.data)}`);
    }
    console.log(`   ✓ Payment verified! Message: "${verifyRes.data.message}"`);
    console.log(`   ✓ Subscription status: ${verifyRes.data.subscription.status}`);
    console.log(`   ✓ Subscription expires at: ${new Date(verifyRes.data.expiresAt).toISOString()}`);

    // -------------------------------------------------------------------------
    // Test 5: Re-testing Remote Browser Session with Active Pro License (200 OK)
    // -------------------------------------------------------------------------
    console.log("\n5. Testing Remote Browser Session with Active Pro License...");
    const proScrollRes = await makeRequest(
      "POST",
      "/api/session/scroll",
      { sessionId, sourceIndex: 0, progress: 0.75, mode: "percentage" },
      token1
    );
    if (proScrollRes.status !== 200 || !proScrollRes.data.success) {
      throw new Error(`Pro scroll failed: ${JSON.stringify(proScrollRes.data)}`);
    }
    console.log("   ✓ Pro license successfully unblocked remote engine! Scroll 200 OK");

    // Close session cleanly
    await makeRequest("POST", "/api/session/stop", { sessionId }, token1);
    console.log("   ✓ Remote session cleanly stopped");

    // -------------------------------------------------------------------------
    // Test 6: Payment Transaction History & Tenant Isolation
    // -------------------------------------------------------------------------
    console.log("\n6. Testing Payment History & Strict Tenant Isolation...");
    const payHistoryRes = await makeRequest("GET", "/api/payment/history", null, token1);
    if (payHistoryRes.status !== 200 || payHistoryRes.data.transactions.length !== 1) {
      throw new Error(`Expected 1 transaction in history, got: ${JSON.stringify(payHistoryRes.data)}`);
    }
    console.log(`   ✓ User 1 Payment History: 1 record, Order: ${payHistoryRes.data.transactions[0].order_id}`);

    // Register User 2
    const user2Data = {
      fullName: "Rahul Verma",
      username: `rahul_${uniqueSuffix}`,
      email: `rahul_${uniqueSuffix}@example.com`,
      password: "Password456!"
    };
    const reg2Res = await makeRequest("POST", "/api/auth/register", user2Data);
    const token2 = reg2Res.data.token;

    // Check User 2 payment history (must be empty, 0 records)
    const payHistory2 = await makeRequest("GET", "/api/payment/history", null, token2);
    if (payHistory2.data.transactions.length !== 0) {
      throw new Error("Tenant isolation breach: User 2 can see User 1 transactions!");
    }
    console.log("   ✓ Tenant Isolation Confirmed: User 2 sees 0 transactions");

    console.log("\n===============================================================");
    console.log("🎉 ALL SAAS WORKFLOW & PAYMENT VERIFICATION TESTS PASSED!");
    console.log("===============================================================");
  } finally {
    // Clean shutdown
    for (const [id] of browserManager.sessions) {
      try { await browserManager.closeSession(id); } catch (e) {}
    }
    await new Promise((resolve) => server.close(resolve));
    console.log("\n✓ Test server shut down cleanly.");
  }
}

runTests().catch((err) => {
  console.error("\n❌ Test execution failed:", err);
  process.exit(1);
});

