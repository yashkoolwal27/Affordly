import crypto from 'crypto';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method Not Allowed' });
  }

  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
    
    const secret = process.env.VITE_RAZORPAY_KEY_SECRET;

    if (!secret) {
      return res.status(400).json({ success: false, error: 'Missing VITE_RAZORPAY_KEY_SECRET in Vercel project settings.' });
    }

    const generated_signature = crypto
      .createHmac('sha256', secret)
      .update(razorpay_order_id + "|" + razorpay_payment_id)
      .digest('hex');

    if (generated_signature === razorpay_signature) {
      return res.status(200).json({ success: true });
    } else {
      return res.status(400).json({ success: false, error: 'Invalid signature' });
    }

  } catch (error) {
    console.error("Razorpay Vercel Function Error:", error);
    return res.status(500).json({ success: false, error: error.message });
  }
}
