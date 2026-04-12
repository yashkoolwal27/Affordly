import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import crypto from 'crypto'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  
  return {
    plugins: [
      react(),
      {
        name: 'razorpay-local-dev-api',
        configureServer(server) {
          server.middlewares.use(async (req, res, next) => {
            // Mock API for creating Order
            if (req.url === '/api/create-razorpay-order' && req.method === 'POST') {
              let body = '';
              req.on('data', chunk => body += chunk.toString());
              req.on('end', async () => {
                try {
                  const data = JSON.parse(body);
                  const keyId = env.VITE_RAZORPAY_KEY_ID;
                  const keySecret = env.VITE_RAZORPAY_KEY_SECRET;
                  
                  res.setHeader('Content-Type', 'application/json');

                  if (!keyId || !keySecret) {
                    res.statusCode = 400;
                    return res.end(JSON.stringify({ error: 'Missing VITE_RAZORPAY_KEY_SECRET in .env file.' }));
                  }

                  const auth = Buffer.from(`${keyId}:${keySecret}`).toString('base64');
                  const rzpReq = await fetch('https://api.razorpay.com/v1/orders', {
                    method: 'POST',
                    headers: { 'Authorization': `Basic ${auth}`, 'Content-Type': 'application/json' },
                    body: JSON.stringify({ 
                      amount: Math.round(data.amount * 100), 
                      currency: 'INR', 
                      receipt: 'rcpt_' + Date.now(),
                      payment_capture: 1
                    })
                  });
                  
                  const rzpData = await rzpReq.json();
                  res.statusCode = rzpReq.status;
                  res.end(JSON.stringify(rzpData));
                } catch (e) {
                  res.statusCode = 500;
                  res.end(JSON.stringify({ error: e.message }));
                }
              });
              return;
            }

            // Mock API for Verifying Payment
            if (req.url === '/api/verify-razorpay-payment' && req.method === 'POST') {
              let body = '';
              req.on('data', chunk => body += chunk.toString());
              req.on('end', async () => {
                try {
                  res.setHeader('Content-Type', 'application/json');
                  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = JSON.parse(body);
                  const secret = env.VITE_RAZORPAY_KEY_SECRET;

                  if (!secret) return res.end(JSON.stringify({ success: false, error: 'No secret configured' }));

                  const generated_signature = crypto
                    .createHmac('sha256', secret)
                    .update(razorpay_order_id + "|" + razorpay_payment_id)
                    .digest('hex');

                  if (generated_signature === razorpay_signature) {
                    res.end(JSON.stringify({ success: true }));
                  } else {
                    res.statusCode = 400;
                    res.end(JSON.stringify({ success: false, error: 'Invalid signature' }));
                  }
                } catch (e) {
                  res.statusCode = 500;
                  res.end(JSON.stringify({ success: false, error: e.message }));
                }
              });
              return;
            }
            next();
          });
        }
      }
    ],
  }
})
