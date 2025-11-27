import express from 'express';
import { body, validationResult } from 'express-validator';

const router = express.Router();

// Eupago API configuration
const EUPAGO_API_KEY = process.env.EUPAGO_API_KEY || '';
const EUPAGO_BASE_URL = process.env.EUPAGO_BASE_URL || 'https://sandbox.eupago.pt/api/v1.02';
const EUPAGO_OLD_BASE_URL = 'https://sandbox.eupago.pt/clientes/rest_api';

if (!EUPAGO_API_KEY) {
  console.error('⚠️  EUPAGO_API_KEY not configured!');
} else {
  console.log('✅ Eupago configured with key:', EUPAGO_API_KEY.substring(0, 10) + '...');
}

// Generate Multibanco reference
router.post(
  '/multibanco',
  [
    body('amount').isFloat({ min: 0.01 }).withMessage('Amount must be positive'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('order_id').isInt().withMessage('Order ID is required')
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        console.error('Validation errors:', errors.array());
        res.status(400).json({ errors: errors.array() });
        return;
      }

      const { amount, email, order_id } = req.body;

      console.log('Generating Multibanco reference for order:', order_id);

      const requestData = {
        chave: EUPAGO_API_KEY,
        valor: amount.toFixed(2),
        id: `ORDER-${order_id}-${Date.now()}`,
        per_dup: '0'
      };

      console.log('Multibanco Request:', requestData);

      const response = await fetch(`${EUPAGO_OLD_BASE_URL}/multibanco/create`, {
        method: 'POST',
        headers: {
          'accept': 'application/json',
          'content-type': 'application/json'
        },
        body: JSON.stringify(requestData)
      });

      const contentType = response.headers.get('content-type');
      console.log('Response status:', response.status);
      console.log('Response content-type:', contentType);

      if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text();
        console.error('Non-JSON response:', text);
        res.status(500).json({ 
          error: 'Invalid response from Eupago', 
          details: text.substring(0, 200) 
        });
        return;
      }

      const data = await response.json();
      console.log('Multibanco response:', data);

      if (!response.ok || data.estado === 'error' || data.resposta === 'erro') {
        console.error('Eupago error:', data);
        res.status(500).json({ 
          error: 'Failed to generate Multibanco reference', 
          details: data.mensagem || data.resposta || data 
        });
        return;
      }

      // Response format from Eupago
      res.json({
        success: true,
        entity: data.entidade,
        reference: data.referencia,
        value: parseFloat(data.valor),
        identifier: requestData.id
      });
    } catch (error: any) {
      console.error('Error generating Multibanco reference:', error);
      res.status(500).json({ 
        error: 'Failed to generate payment reference',
        message: error.message 
      });
    }
  }
);

// Generate MB WAY payment
router.post(
  '/mbway',
  [
    body('amount').isFloat({ min: 0.01 }).withMessage('Amount must be positive'),
    body('phone').trim().notEmpty().withMessage('Phone is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('order_id').isInt().withMessage('Order ID is required')
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
      }

      const { amount, phone, email, order_id } = req.body;

      // Format phone number
      let formattedPhone = phone.replace(/\s+/g, '');
      if (formattedPhone.startsWith('+351')) {
        formattedPhone = formattedPhone.substring(4);
      } else if (formattedPhone.startsWith('351')) {
        formattedPhone = formattedPhone.substring(3);
      } else if (formattedPhone.startsWith('00351')) {
        formattedPhone = formattedPhone.substring(5);
      }

      // Validate Portuguese mobile number
      if (!/^9\d{8}$/.test(formattedPhone)) {
        res.status(400).json({ error: 'Número de telemóvel inválido. Use formato: 912345678' });
        return;
      }

      console.log('Generating MB WAY payment for order:', order_id);

      const requestData = {
        chave: EUPAGO_API_KEY,
        valor: amount.toFixed(2),
        id: `ORDER-${order_id}-${Date.now()}`,
        alias: formattedPhone,
        email: email
      };

      console.log('MB WAY Request:', requestData);

      const response = await fetch(`${EUPAGO_OLD_BASE_URL}/mbway/create`, {
        method: 'POST',
        headers: {
          'accept': 'application/json',
          'content-type': 'application/json'
        },
        body: JSON.stringify(requestData)
      });

      const contentType = response.headers.get('content-type');
      console.log('Response status:', response.status);
      console.log('Response content-type:', contentType);

      if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text();
        console.error('Non-JSON response:', text);
        res.status(500).json({ 
          error: 'Invalid response from Eupago', 
          details: text.substring(0, 200) 
        });
        return;
      }

      const data = await response.json();
      console.log('MB WAY response:', data);

      if (!response.ok || data.estado === 'error' || data.resposta === 'erro') {
        console.error('Eupago MB WAY error:', data);
        res.status(500).json({ 
          error: 'Failed to generate MB WAY payment', 
          details: data.mensagem || data.resposta || data 
        });
        return;
      }

      res.json({
        success: true,
        transactionId: data.transacao || data.id,
        status: data.estado,
        message: 'Verifique a sua app MB WAY para autorizar o pagamento',
        identifier: requestData.id
      });
    } catch (error: any) {
      console.error('Error generating MB WAY payment:', error);
      res.status(500).json({ 
        error: 'Failed to generate MB WAY payment',
        message: error.message 
      });
    }
  }
);

// Generate Credit/Debit Card payment
router.post(
  '/creditcard',
  [
    body('amount').isFloat({ min: 0.01 }).withMessage('Amount must be positive'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('order_id').isInt().withMessage('Order ID is required')
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        console.error('Validation errors:', errors.array());
        res.status(400).json({ errors: errors.array() });
        return;
      }

      const { amount, email, order_id } = req.body;

      console.log('Generating Credit Card payment form for order:', order_id);

      const identifier = `ORDER-${order_id}-${Date.now()}`;

      // Get the frontend URL for success/fail/back URLs
      const frontendUrl = process.env.FRONTEND_URL?.split(',')[0] || 'http://localhost:5173';

      const requestData = {
        payment: {
          amount: {
            currency: 'EUR',
            value: parseFloat(amount.toFixed(2))
          },
          lang: 'PT',
          minutesFormUp: 1440, // 24 hours
          identifier: identifier,
          successUrl: `${frontendUrl}/checkout/success?order=${order_id}`,
          failUrl: `${frontendUrl}/checkout/fail?order=${order_id}`,
          backUrl: `${frontendUrl}/checkout`
        },
        customer: {
          notify: true,
          email: email
        }
      };

      console.log('Credit Card Request:', JSON.stringify(requestData, null, 2));

      const response = await fetch(`${EUPAGO_BASE_URL}/creditcard/create`, {
        method: 'POST',
        headers: {
          'accept': 'application/json',
          'content-type': 'application/json',
          'Authorization': `ApiKey ${EUPAGO_API_KEY}`
        },
        body: JSON.stringify(requestData)
      });

      const contentType = response.headers.get('content-type');
      console.log('Response status:', response.status);
      console.log('Response content-type:', contentType);

      if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text();
        console.error('Non-JSON response:', text);
        res.status(500).json({
          error: 'Invalid response from Eupago',
          details: text.substring(0, 200)
        });
        return;
      }

      const data = await response.json();
      console.log('Credit Card response:', JSON.stringify(data, null, 2));

      if (!response.ok || data.status === 'error') {
        console.error('Eupago error:', data);
        res.status(500).json({
          error: 'Failed to generate Credit Card payment',
          details: data.message || data.error || data
        });
        return;
      }

      // Response format from Eupago
      // The API returns a URL where the customer should be redirected to complete the payment
      res.json({
        success: true,
        paymentUrl: data.url || data.payment_url || data.redirectUrl,
        transactionId: data.transactionID || data.id,
        identifier: identifier,
        message: 'Redirecione o cliente para completar o pagamento'
      });
    } catch (error: any) {
      console.error('Error generating Credit Card payment:', error);
      res.status(500).json({
        error: 'Failed to generate Credit Card payment',
        message: error.message
      });
    }
  }
);

// Webhook to receive payment notifications from Eupago
router.post('/webhook', async (req, res) => {
  try {
    console.log('Eupago webhook received:', req.body);

    const {
      identificador,
      estado,
      valor,
      canal,
      referencia,
      transactionID,
      mp_token
    } = req.body;

    // TODO: Validate webhook authenticity using mp_token

    // Extract order ID from identificador
    const orderIdMatch = identificador?.match(/ORDER-(\d+)-/) || identificador?.match(/ORDER-(\d+)$/);
    if (!orderIdMatch) {
      console.error('Invalid identifier format:', identificador);
      res.status(400).json({ error: 'Invalid identifier' });
      return;
    }

    const orderId = parseInt(orderIdMatch[1]);

    // Update order status based on payment status
    if (estado === 'ok' || estado === 'success' || estado === 'paid') {
      console.log(`✅ Payment confirmed for order ${orderId}`);
      // TODO: Update order status in database
    } else if (estado === 'error' || estado === 'failed') {
      console.log(`❌ Payment failed for order ${orderId}`);
      // TODO: Update order status in database
    }

    res.json({ success: true, message: 'Webhook processed' });
  } catch (error) {
    console.error('Error processing webhook:', error);
    res.status(500).json({ error: 'Failed to process webhook' });
  }
});

export default router;
