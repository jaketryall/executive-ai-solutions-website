import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

// Initialize Resend with API key if available, otherwise use a placeholder
// This prevents build errors when the environment variable is not set
const resend = new Resend(process.env.RESEND_API_KEY || 'placeholder_key_for_build');

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, company, message } = body;

    // Validate required fields
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Check if we have a valid API key
    if (!process.env.RESEND_API_KEY || process.env.RESEND_API_KEY === 'placeholder_key_for_build') {
      console.warn('RESEND_API_KEY is not configured. Email will not be sent.');
      // Return success to prevent form errors in development/preview
      return NextResponse.json(
        { success: true, message: 'Message received (email service not configured)', warning: 'Email service not configured' },
        { status: 200 }
      );
    }

    // Send email using Resend
    // Note: On free tier, we can only send to the account owner's email
    const { data, error } = await resend.emails.send({
      from: 'Executive AI Solutions <onboarding@resend.dev>',
      to: 'jaker@executiveaisolutions.com', // Your Resend account email
      replyTo: email,
      subject: `New Contact Form Submission from ${name}`,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <style>
              body {
                font-family: Arial, sans-serif;
                line-height: 1.6;
                color: #333;
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
              }
              .header {
                background: linear-gradient(to right, #0066ff, #00a3ff);
                color: white;
                padding: 20px;
                border-radius: 8px 8px 0 0;
                text-align: center;
              }
              .content {
                background: #f9f9f9;
                padding: 30px;
                border-radius: 0 0 8px 8px;
                border: 1px solid #e0e0e0;
                border-top: none;
              }
              .field {
                margin-bottom: 20px;
              }
              .label {
                font-weight: bold;
                color: #0066ff;
                margin-bottom: 5px;
              }
              .value {
                background: white;
                padding: 10px;
                border-radius: 4px;
                border: 1px solid #e0e0e0;
              }
              .message {
                white-space: pre-wrap;
              }
              .footer {
                text-align: center;
                margin-top: 20px;
                font-size: 12px;
                color: #666;
              }
            </style>
          </head>
          <body>
            <div class="header">
              <h2>New Contact Form Submission</h2>
            </div>
            <div class="content">
              <div class="field">
                <div class="label">Name:</div>
                <div class="value">${name}</div>
              </div>
              <div class="field">
                <div class="label">Email:</div>
                <div class="value">${email}</div>
              </div>
              <div class="field">
                <div class="label">Company:</div>
                <div class="value">${company || 'Not provided'}</div>
              </div>
              <div class="field">
                <div class="label">Message:</div>
                <div class="value message">${message}</div>
              </div>
            </div>
            <div class="footer">
              <p>This email was sent from the Executive AI Solutions website contact form.</p>
              <p>Timestamp: ${new Date().toLocaleString()}</p>
            </div>
          </body>
        </html>
      `,
    });

    if (error) {
      console.error('Resend error:', error);
      return NextResponse.json(
        { error: 'Failed to send email' },
        { status: 500 }
      );
    }

    console.log('Email sent successfully:', data);

    // Return success response
    return NextResponse.json(
      { success: true, message: 'Message sent successfully', id: data?.id },
      { status: 200 }
    );
  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.json(
      { error: 'Failed to send message' },
      { status: 500 }
    );
  }
}