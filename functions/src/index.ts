import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import * as nodemailer from 'nodemailer';
import { CallableContext } from 'firebase-functions/v1/https';
import { Change, EventContext } from 'firebase-functions';
import { DocumentSnapshot } from 'firebase-admin/firestore';

admin.initializeApp();
const db = admin.firestore();

// Email configuration
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

// Trigger when order status changes to 'completed'
export const sendProductDeliveryEmail = functions.firestore
  .document('orders/{orderId}')
  .onUpdate(async (change: Change<DocumentSnapshot>, context: EventContext) => {
    const afterData = change.after.data() as Record<string, any>;
    const beforeData = change.before.data() as Record<string, any>;

    // Only send email when status changes to 'completed'
    if (afterData.status === 'completed' && beforeData.status !== 'completed') {
      try {
        // Fetch product to get Google Drive link
        const productDoc = await db.collection('products').doc(afterData.productId).get();
        const product = productDoc.data();

        if (!product?.googleDriveLink) {
          console.error('No Google Drive link found for product:', afterData.productId);
          return null;
        }

        // Send email with product link
        const mailOptions = {
          from: '"ZaiLearn" <noreply@zailearn.com>',
          to: afterData.customerEmail as string,
          subject: `Your ${product.title} is ready!`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2>Thank you for your purchase, ${afterData.customerName}!</h2>
              <p>Your order for <strong>${product.title}</strong> has been confirmed.</p>
              <p>You can access your ${product.type === 'course' ? 'course' : 'ebook'} here:</p>
              <a href="${product.googleDriveLink}" style="display: inline-block; padding: 12px 24px; background-color: #0ea5e9; color: white; text-decoration: none; border-radius: 8px; margin: 20px 0;">
                Access Your Content
              </a>
              <p>This link is for your personal use only. Please do not share it.</p>
              <hr />
              <p>Need help? Contact us at support@zailearn.com</p>
            </div>
          `,
        };

        await transporter.sendMail(mailOptions);
        console.log('Delivery email sent to:', afterData.customerEmail);

        // Log email delivery
        await db.collection('orders').doc(context.params.orderId).update({
          emailSent: true,
          emailSentAt: admin.firestore.FieldValue.serverTimestamp(),
        });
      } catch (error) {
        console.error('Error sending email:', error);
      }
    }

    return null;
  });

// Cloud function to verify payment
export const verifyPayment = functions.https.onCall(
  async (data: { transactionId: string; orderId: string }, context: CallableContext) => {
    const { transactionId, orderId } = data;

    // Optional: check if user is authenticated
    if (!context.auth) {
      throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated.');
    }

    // Verify with Flutterwave API (implement based on Flutterwave docs)
    // Update order status accordingly

    console.log('Verifying payment for transaction:', transactionId, 'order:', orderId);

    return { success: true };
  }
);