export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { amount } = req.body;
    
    // In Vercel, process.env is populated with exactly what is in your Vercel Environment Variables
    const keyId = process.env.VITE_RAZORPAY_KEY_ID;
    const keySecret = process.env.VITE_RAZORPAY_KEY_SECRET;

    if (!keyId || !keySecret) {
      return res.status(400).json({ error: 'Missing Razorpay credentials in Vercel project settings.' });
    }

    const auth = Buffer.from(`${keyId}:${keySecret}`).toString('base64');
    
    const rzpReq = await fetch('https://api.razorpay.com/v1/orders', {
      method: 'POST',
      headers: { 
        'Authorization': `Basic ${auth}`, 
        'Content-Type': 'application/json' 
      },
      body: JSON.stringify({ 
        amount: Math.round(amount * 100), // convert to paise
        currency: 'INR', 
        receipt: 'rcpt_' + Date.now(),
        payment_capture: 1
      })
    });
    
    const rzpData = await rzpReq.json();
    return res.status(rzpReq.status).json(rzpData);

  } catch (error) {
    console.error("Razorpay Vercel Function Error:", error);
    return res.status(500).json({ error: error.message });
  }
}
