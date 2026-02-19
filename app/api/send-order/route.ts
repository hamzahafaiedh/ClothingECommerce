import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

interface OrderItem {
  title: string;
  variant?: string;
  quantity: number;
  price: number;
}

interface OrderEmailData {
  orderId: string;
  customer: {
    full_name: string;
    email?: string;
    phone: string;
    address?: {
      street?: string;
      city?: string;
      postal?: string;
      country?: string;
    };
  };
  items: OrderItem[];
  subtotal: number;
  discount?: {
    code: string;
    amount: number;
  };
  shipping: number;
  total: number;
  currency: string;
}

function generateStoreOwnerEmailTemplate(order: OrderEmailData): string {
  const itemsHtml = order.items
    .map(
      (item) => `
        <tr>
          <td style="padding: 16px 0; border-bottom: 1px solid #262626;">
            <div style="color: #ffffff !important; font-weight: 500;">${item.title}</div>
            ${item.variant ? `<div style="color: #a3a3a3 !important; font-size: 14px; margin-top: 4px;">${item.variant}</div>` : ''}
          </td>
          <td style="padding: 16px 0; border-bottom: 1px solid #262626; text-align: center; color: #a3a3a3 !important;">
            ${item.quantity}
          </td>
          <td style="padding: 16px 0; border-bottom: 1px solid #262626; text-align: right; color: #ffffff !important; font-weight: 500;">
            ${item.price.toFixed(2)} ${order.currency}
          </td>
        </tr>
      `
    )
    .join('');

  const addressHtml = order.customer.address
    ? `
      <div style="margin-top: 24px;">
        <h3 style="color: #f59e0b !important; font-size: 14px; text-transform: uppercase; letter-spacing: 1px; margin: 0 0 12px 0; font-weight: 600;">
          Shipping Address
        </h3>
        <div style="color: #a3a3a3 !important; line-height: 1.6;">
          ${order.customer.address.street ? `<div>${order.customer.address.street}</div>` : ''}
          ${order.customer.address.city || order.customer.address.postal ? `<div>${order.customer.address.city || ''}${order.customer.address.city && order.customer.address.postal ? ', ' : ''}${order.customer.address.postal || ''}</div>` : ''}
          ${order.customer.address.country ? `<div>${order.customer.address.country}</div>` : ''}
        </div>
      </div>
    `
    : '';

  return `
<!DOCTYPE html>
<html lang="en" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="color-scheme" content="light dark">
  <meta name="supported-color-schemes" content="light dark">
  <title>New Order #${order.orderId}</title>
  <!--[if mso]>
  <style type="text/css">
    table {border-collapse: collapse;}
    .fallback-font {font-family: Arial, sans-serif !important;}
  </style>
  <![endif]-->
  <style>
    :root {
      color-scheme: light dark;
      supported-color-schemes: light dark;
    }
    @media (prefers-color-scheme: dark) {
      .email-bg { background-color: #1a1a1a !important; }
      .dark-card { background-color: #171717 !important; }
      .dark-card-inner { background-color: #262626 !important; }
    }
    /* Prevent Gmail from changing colors */
    u + .body .email-bg { background-color: #f5f5f5 !important; }
    u + .body .dark-card { background-color: #171717 !important; }
    u + .body .dark-card-inner { background-color: #262626 !important; }
  </style>
</head>
<body class="body" style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
  <div style="display: none; max-height: 0; overflow: hidden;">
    New order from ${order.customer.full_name} - ${order.total.toFixed(2)} ${order.currency}
  </div>
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" class="email-bg" style="background-color: #f5f5f5;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table role="presentation" width="600" cellspacing="0" cellpadding="0" style="max-width: 600px; width: 100%;">
          
          <!-- Header -->
          <tr>
            <td class="dark-card" style="padding: 32px 40px; background-color: #171717; border-radius: 16px 16px 0 0; border-bottom: 3px solid #f59e0b;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                <tr>
                  <td>
                    <h1 style="margin: 0; color: #ffffff !important; font-size: 28px; font-weight: 700; letter-spacing: -0.5px;">
                      ✨ New Order Received
                    </h1>
                    <div style="margin-top: 8px; color: #f59e0b !important; font-size: 16px; font-weight: 500;">
                      Order #${order.orderId.substring(0, 8).toUpperCase()}
                    </div>
                  </td>
                  <td align="right" style="vertical-align: top;">
                    <div style="background-color: #f59e0b !important; color: #000000 !important; padding: 8px 16px; border-radius: 20px; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px;">
                      Pending
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
          <!-- Customer Details -->
          <tr>
            <td class="dark-card" style="padding: 32px 40px; background-color: #171717;">
              <h2 style="color: #f59e0b !important; font-size: 14px; text-transform: uppercase; letter-spacing: 1px; margin: 0 0 16px 0; font-weight: 600;">
                Customer Details
              </h2>
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                <tr>
                  <td class="dark-card-inner" style="padding: 12px 16px; background-color: #262626; border-radius: 8px;">
                    <div style="color: #ffffff !important; font-size: 18px; font-weight: 600; margin-bottom: 8px;">
                      ${order.customer.full_name}
                    </div>
                    <div style="color: #a3a3a3 !important; font-size: 14px; line-height: 1.6;">
                      <div>📱 ${order.customer.phone}</div>
                      ${order.customer.email ? `<div>✉️ ${order.customer.email}</div>` : ''}
                    </div>
                  </td>
                </tr>
              </table>
              ${addressHtml}
            </td>
          </tr>
          
          <!-- Order Items -->
          <tr>
            <td class="dark-card" style="padding: 32px 40px; background-color: #171717; border-top: 1px solid #262626;">
              <h2 style="color: #f59e0b !important; font-size: 14px; text-transform: uppercase; letter-spacing: 1px; margin: 0 0 20px 0; font-weight: 600;">
                Order Items
              </h2>
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                <tr style="border-bottom: 2px solid #262626;">
                  <th style="padding: 12px 0; text-align: left; color: #737373 !important; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; font-weight: 600;">
                    Item
                  </th>
                  <th style="padding: 12px 0; text-align: center; color: #737373 !important; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; font-weight: 600;">
                    Qty
                  </th>
                  <th style="padding: 12px 0; text-align: right; color: #737373 !important; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; font-weight: 600;">
                    Price
                  </th>
                </tr>
                ${itemsHtml}
              </table>
            </td>
          </tr>
          
          <!-- Order Summary -->
          <tr>
            <td class="dark-card" style="padding: 24px 40px; background-color: #171717; border-top: 1px solid #262626;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                <tr>
                  <td style="color: #a3a3a3 !important; padding: 8px 0;">Subtotal</td>
                  <td style="color: #ffffff !important; text-align: right; padding: 8px 0;">${order.subtotal.toFixed(2)} ${order.currency}</td>
                </tr>
                ${
                  order.discount
                    ? `
                <tr>
                  <td style="color: #f59e0b !important; padding: 8px 0;">
                    Discount (${order.discount.code})
                  </td>
                  <td style="color: #f59e0b !important; text-align: right; padding: 8px 0;">-${order.discount.amount.toFixed(2)} ${order.currency}</td>
                </tr>
                `
                    : ''
                }
                <tr>
                  <td style="color: #a3a3a3 !important; padding: 8px 0;">Shipping</td>
                  <td style="color: #ffffff !important; text-align: right; padding: 8px 0;">${order.shipping === 0 ? 'Free' : `${order.shipping.toFixed(2)} ${order.currency}`}</td>
                </tr>
                <tr>
                  <td colspan="2" style="padding: 16px 0 0 0;">
                    <div style="border-top: 2px solid #f59e0b; padding-top: 16px;">
                      <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                        <tr>
                          <td style="color: #ffffff !important; font-size: 20px; font-weight: 700;">Total</td>
                          <td style="color: #f59e0b !important; font-size: 24px; font-weight: 700; text-align: right;">${order.total.toFixed(2)} ${order.currency}</td>
                        </tr>
                      </table>
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td class="dark-card" style="padding: 24px 40px; background-color: #1f1f1f; border-radius: 0 0 16px 16px; text-align: center;">
              <div style="color: #737373 !important; font-size: 13px; line-height: 1.6;">
                This order was placed on ${new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </div>
              <div style="margin-top: 16px; padding-top: 16px; border-top: 1px solid #404040;">
                <span style="color: #f59e0b !important; font-weight: 600;">🛍️ ${process.env.NEXT_PUBLIC_SITE_NAME || 'Clothing E-Commerce'}</span>
              </div>
            </td>
          </tr>
          
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
}

function generateCustomerConfirmationEmailTemplate(order: OrderEmailData): string {
  const itemsHtml = order.items
    .map(
      (item) => `
        <tr>
          <td style="padding: 16px 0; border-bottom: 1px solid #262626;">
            <div style="color: #ffffff !important; font-weight: 500;">${item.title}</div>
            ${item.variant ? `<div style="color: #a3a3a3 !important; font-size: 14px; margin-top: 4px;">${item.variant}</div>` : ''}
          </td>
          <td style="padding: 16px 0; border-bottom: 1px solid #262626; text-align: center; color: #a3a3a3 !important;">
            ${item.quantity}
          </td>
          <td style="padding: 16px 0; border-bottom: 1px solid #262626; text-align: right; color: #ffffff !important; font-weight: 500;">
            ${item.price.toFixed(2)} ${order.currency}
          </td>
        </tr>
      `
    )
    .join('');

  const addressHtml = order.customer.address
    ? `
      <div style="margin-top: 24px;">
        <h3 style="color: #f59e0b !important; font-size: 14px; text-transform: uppercase; letter-spacing: 1px; margin: 0 0 12px 0; font-weight: 600;">
          Delivery Address
        </h3>
        <div style="color: #a3a3a3 !important; line-height: 1.6;">
          ${order.customer.address.street ? `<div>${order.customer.address.street}</div>` : ''}
          ${order.customer.address.city || order.customer.address.postal ? `<div>${order.customer.address.city || ''}${order.customer.address.city && order.customer.address.postal ? ', ' : ''}${order.customer.address.postal || ''}</div>` : ''}
          ${order.customer.address.country ? `<div>${order.customer.address.country}</div>` : ''}
        </div>
      </div>
    `
    : '';

  return `
<!DOCTYPE html>
<html lang="en" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="color-scheme" content="light dark">
  <meta name="supported-color-schemes" content="light dark">
  <title>Order Confirmed</title>
  <!--[if mso]>
  <style type="text/css">
    table {border-collapse: collapse;}
    .fallback-font {font-family: Arial, sans-serif !important;}
  </style>
  <![endif]-->
  <style>
    :root {
      color-scheme: light dark;
      supported-color-schemes: light dark;
    }
    @media (prefers-color-scheme: dark) {
      .email-bg { background-color: #1a1a1a !important; }
      .dark-card { background-color: #171717 !important; }
      .dark-card-inner { background-color: #262626 !important; }
    }
    /* Prevent Gmail from changing colors */
    u + .body .email-bg { background-color: #f5f5f5 !important; }
    u + .body .dark-card { background-color: #171717 !important; }
    u + .body .dark-card-inner { background-color: #262626 !important; }
  </style>
</head>
<body class="body" style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
  <div style="display: none; max-height: 0; overflow: hidden;">
    Thank you for your order! Your order has been confirmed.
  </div>
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" class="email-bg" style="background-color: #f5f5f5;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table role="presentation" width="600" cellspacing="0" cellpadding="0" style="max-width: 600px; width: 100%;">
          
          <!-- Header -->
          <tr>
            <td class="dark-card" style="padding: 32px 40px; background-color: #171717; border-radius: 16px 16px 0 0; border-bottom: 3px solid #f59e0b;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                <tr>
                  <td>
                    <h1 style="margin: 0; color: #ffffff !important; font-size: 28px; font-weight: 700; letter-spacing: -0.5px;">
                      ✅ Order Confirmed!
                    </h1>
                    <div style="margin-top: 8px; color: #f59e0b !important; font-size: 16px; font-weight: 500;">
                      Thank you for shopping with us
                    </div>
                  </td>
                  <td align="right" style="vertical-align: top;">
                    <div style="background-color: #22c55e !important; color: #ffffff !important; padding: 8px 16px; border-radius: 20px; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px;">
                      Confirmed
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
          <!-- Thank You Message -->
          <tr>
            <td class="dark-card" style="padding: 32px 40px; background-color: #171717;">
              <div style="color: #ffffff !important; font-size: 18px; line-height: 1.6; margin-bottom: 16px;">
                Hi ${order.customer.full_name.split(' ')[0]},
              </div>
              <div style="color: #a3a3a3 !important; font-size: 15px; line-height: 1.6;">
                Thank you for your order! We've received it and will begin processing it shortly. You'll receive updates about your order status.
              </div>
              ${addressHtml}
            </td>
          </tr>
          
          <!-- Order Items -->
          <tr>
            <td class="dark-card" style="padding: 32px 40px; background-color: #171717; border-top: 1px solid #262626;">
              <h2 style="color: #f59e0b !important; font-size: 14px; text-transform: uppercase; letter-spacing: 1px; margin: 0 0 20px 0; font-weight: 600;">
                Your Order
              </h2>
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                <tr style="border-bottom: 2px solid #262626;">
                  <th style="padding: 12px 0; text-align: left; color: #737373 !important; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; font-weight: 600;">
                    Item
                  </th>
                  <th style="padding: 12px 0; text-align: center; color: #737373 !important; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; font-weight: 600;">
                    Qty
                  </th>
                  <th style="padding: 12px 0; text-align: right; color: #737373 !important; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; font-weight: 600;">
                    Price
                  </th>
                </tr>
                ${itemsHtml}
              </table>
            </td>
          </tr>
          
          <!-- Order Summary -->
          <tr>
            <td class="dark-card" style="padding: 24px 40px; background-color: #171717; border-top: 1px solid #262626;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                <tr>
                  <td style="color: #a3a3a3 !important; padding: 8px 0;">Subtotal</td>
                  <td style="color: #ffffff !important; text-align: right; padding: 8px 0;">${order.subtotal.toFixed(2)} ${order.currency}</td>
                </tr>
                ${
                  order.discount
                    ? `
                <tr>
                  <td style="color: #f59e0b !important; padding: 8px 0;">
                    Discount (${order.discount.code})
                  </td>
                  <td style="color: #f59e0b !important; text-align: right; padding: 8px 0;">-${order.discount.amount.toFixed(2)} ${order.currency}</td>
                </tr>
                `
                    : ''
                }
                <tr>
                  <td style="color: #a3a3a3 !important; padding: 8px 0;">Shipping</td>
                  <td style="color: #ffffff !important; text-align: right; padding: 8px 0;">${order.shipping === 0 ? 'Free' : `${order.shipping.toFixed(2)} ${order.currency}`}</td>
                </tr>
                <tr>
                  <td colspan="2" style="padding: 16px 0 0 0;">
                    <div style="border-top: 2px solid #f59e0b; padding-top: 16px;">
                      <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                        <tr>
                          <td style="color: #ffffff !important; font-size: 20px; font-weight: 700;">Total</td>
                          <td style="color: #f59e0b !important; font-size: 24px; font-weight: 700; text-align: right;">${order.total.toFixed(2)} ${order.currency}</td>
                        </tr>
                      </table>
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td class="dark-card" style="padding: 24px 40px; background-color: #1f1f1f; border-radius: 0 0 16px 16px; text-align: center;">
              <div style="color: #a3a3a3 !important; font-size: 14px; line-height: 1.6; margin-bottom: 16px;">
                Questions about your order? Contact us and we'll be happy to help!
              </div>
              <div style="color: #737373 !important; font-size: 13px; line-height: 1.6;">
                Order placed on ${new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </div>
              <div style="margin-top: 16px; padding-top: 16px; border-top: 1px solid #404040;">
                <span style="color: #f59e0b !important; font-weight: 600;">🛍️ ${process.env.NEXT_PUBLIC_SITE_NAME || 'Clothing E-Commerce'}</span>
              </div>
            </td>
          </tr>
          
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
}

export async function POST(request: NextRequest) {
  try {
    const orderData: OrderEmailData = await request.json();

    // Validate required environment variables
    const smtpHost = process.env.SMTP_HOST;
    const smtpPort = process.env.SMTP_PORT;
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;
    const storeOwnerEmail = process.env.STORE_OWNER_EMAIL;
    const fromEmail = process.env.FROM_EMAIL || smtpUser;

    if (!smtpHost || !smtpPort || !smtpUser || !smtpPass || !storeOwnerEmail) {
      console.error('Missing email configuration environment variables');
      return NextResponse.json(
        { error: 'Email service not configured' },
        { status: 500 }
      );
    }

    // Create transporter
    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: parseInt(smtpPort),
      secure: parseInt(smtpPort) === 465,
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
    });

    const storeName = process.env.NEXT_PUBLIC_SITE_NAME || 'Store';

    // Send email to store owner
    const storeOwnerEmailHtml = generateStoreOwnerEmailTemplate(orderData);
    await transporter.sendMail({
      from: `"${storeName}" <${fromEmail}>`,
      to: storeOwnerEmail,
      subject: `🛍️ New Order #${orderData.orderId.substring(0, 8).toUpperCase()} - ${orderData.customer.full_name}`,
      html: storeOwnerEmailHtml,
    });

    // Send confirmation email to customer if they provided an email
    if (orderData.customer.email) {
      const customerEmailHtml = generateCustomerConfirmationEmailTemplate(orderData);
      await transporter.sendMail({
        from: `"${storeName}" <${fromEmail}>`,
        to: orderData.customer.email,
        subject: `✅ Your order has been confirmed - Thank you for shopping with us!`,
        html: customerEmailHtml,
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error sending order email:', error);
    return NextResponse.json(
      { error: 'Failed to send email' },
      { status: 500 }
    );
  }
}
