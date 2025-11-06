export const agentRequestTemplate =
  ` 
    <body style="font-family:'Segoe UI', Arial, sans-serif; background:#f5f7fa; margin:0; padding:40px;">
    <table align="center" width="100%" cellpadding="0" cellspacing="0"
      style="max-width:600px; background:#ffffff; border-radius:12px; box-shadow:0 2px 8px rgba(0,0,0,0.08); overflow:hidden;">

      <!-- HEADER (consistent) -->
      <tr>
        <td style="background:#0d1117; text-align:center; padding:22px 12px;">
          <h2 style="color:#ffffff; margin:0;">New Client Request</h2>
          <p style="color:#9ca3af; margin:6px 0 0; font-size:14px;">
            A {{companyName}} has requested your service on Black Monolith
          </p>
        </td>
      </tr>

      <!-- BODY -->
      <tr>
        <td style="padding:28px 36px;">
          <p style="color:#333; font-size:15px; margin:0 0 14px;">
            Hi <strong>{{agentName}}</strong>,
          </p>
          <p style="color:#444; font-size:15px; line-height:1.7; margin:0 0 20px;">
            You’ve received a new request. Here are the details:
          </p>

          <!-- DETAILS CARD -->
          <div style="background:#f3f4f6; border:1px solid #e0e0e0; border-radius:8px; padding:18px 20px; margin:0 0 22px;">
            <table width="100%" cellpadding="0" cellspacing="0" style="font-size:15px;">
              <tr>
                <td style="width:42%; color:#444; font-weight:600;">Company</td>
                <td style="color:#111;">{{companyName}}</td>
              </tr>
              <tr>
                <td style="padding-top:10px; color:#444; font-weight:600;">Contact Person</td>
                <td style="padding-top:10px; color:#111;">{{contactPersonName}}</td>
              </tr>
              <tr>
                <td style="padding-top:10px; color:#444; font-weight:600;">Service</td>
                <td style="padding-top:10px; color:#111;">{{serviceName}}</td>
              </tr>
              <tr>
                <td style="padding-top:10px; color:#444; font-weight:600;">Meeting Type</td>
                <td style="padding-top:10px;">
                  <span style="background:#e9f5ff; color:#0b5ed7; padding:4px 10px; border-radius:6px; font-weight:600;">
                    {{meetingType}} 
                  </span>
                </td>
              </tr>
              <tr>
                <td style="padding-top:10px; color:#444; font-weight:600; vertical-align:top;">Message</td>
                <td style="padding-top:10px; color:#111; white-space:pre-line;">{{message}}</td>
              </tr>
            </table>
          </div>

          <p style="color:#555; font-size:14px; line-height:1.7; margin:0 0 18px;">
            Please review and respond to the request at your earliest convenience.
          </p>

          <!-- CTA -->
          <div style="text-align:center; margin:26px 0;">
            <a href="{{review_link}}"
               style="display:inline-block; background:#1f6feb; color:#ffffff; text-decoration:none; font-weight:600; padding:12px 28px; border-radius:6px;">
              Review Request
            </a>
          </div>

          <!-- THANKS -->
          <p style="color:#444; font-size:14px; line-height:1.7; text-align:center; margin:8px 0 0;">
            Thanks & Regards,<br />
            <strong>The Black Monolith Team</strong>
          </p>
        </td>
      </tr>

      <!-- FOOTER (consistent) -->
      <tr>
        <td style="background:#f0f2f5; padding:15px 25px; text-align:center; font-size:12px; color:#888;">
          Need help? Contact
          <a href="mailto:{{blackMonolithEmail}}" style="color:#1f6feb; text-decoration:none;">{{blackMonolithEmail}}</a>.
        </td>
      </tr>
    </table>
  </body>
  `;
export const agentAcceptTemplate = `
  <body style="font-family:'Segoe UI', Arial, sans-serif; background:#f5f7fa; margin:0; padding:40px;">
    <table align="center" width="100%" cellpadding="0" cellspacing="0"
      style="max-width:600px; background:#ffffff; border-radius:12px; box-shadow:0 2px 8px rgba(0,0,0,0.08); overflow:hidden;">

      <tr>
        <td style="background:#0d1117; text-align:center; padding:22px 12px;">
          <h2 style="color:#ffffff; margin:0;">
            Request Accepted <span style="font-size:18px;">✅</span>
          </h2>
          <p style="color:#9ca3af; margin:6px 0 0; font-size:14px;">
            {{agentName}} has approved your service request on Black Monolith
          </p>
        </td>
      </tr>

      <!-- BODY -->
      <tr>
        <td style="padding:28px 36px;">
          <p style="color:#333; font-size:15px; margin:0 0 14px;">
            Hi <strong>{{contactPersonName}}</strong>,
          </p>
          <p style="color:#444; font-size:15px; line-height:1.7; margin:0 0 20px;">
            Good news! <strong>{{agentName}}</strong> has accepted your request. Here are the details:
          </p>

          <!-- DETAILS CARD -->
          <div style="background:#f3f4f6; border:1px solid #e0e0e0; border-radius:8px; padding:18px 20px; margin:0 0 22px;">
            <table width="100%" cellpadding="0" cellspacing="0" style="font-size:15px;">
              <tr>
                <td style="width:42%; color:#444; font-weight:600;">Company</td>
                <td style="color:#111;">{{companyName}}</td>
              </tr>
              <tr>
                <td style="padding-top:10px; color:#444; font-weight:600;">Agent</td>
                <td style="padding-top:10px; color:#111;">{{agentName}}</td>
              </tr>
              <tr>
                <td style="padding-top:10px; color:#444; font-weight:600;">Service</td>
                <td style="padding-top:10px; color:#111;">{{serviceName}}</td>
              </tr>
              <tr>
                <td style="padding-top:10px; color:#444; font-weight:600;">Meeting Type</td>
                <td style="padding-top:10px;">
                  <span style="background:#e9f5ff; color:#0b5ed7; padding:4px 10px; border-radius:6px; font-weight:600;">
                    {{meetingType}}
                  </span>
                </td>
              </tr>
              <tr>
                <td style="padding-top:10px; color:#444; font-weight:600; vertical-align:top;">Message</td>
                <td style="padding-top:10px; color:#111; white-space:pre-line;">{{message}}</td>
              </tr>
            </table>
          </div>

          <p style="color:#555; font-size:14px; line-height:1.7; margin:0 0 18px;">
            Please proceed with the next steps as discussed. You can view the request and continue communication from your dashboard.
          </p>

          <!-- CTA (button only) -->
          <div style="text-align:center; margin:26px 0;">
            <a href="{{request_link}}"
               style="display:inline-block; background:#1f6feb; color:#ffffff; text-decoration:none; font-weight:600; padding:12px 28px; border-radius:6px;">
              Open Request
            </a>
          </div>

          <!-- THANKS -->
          <p style="color:#444; font-size:14px; line-height:1.7; text-align:center; margin:8px 0 0;">
            Thanks & Regards,<br />
            <strong>The Black Monolith Team</strong>
          </p>
        </td>
      </tr>

      <!-- FOOTER (consistent) -->
      <tr>
        <td style="background:#f0f2f5; padding:15px 25px; text-align:center; font-size:12px; color:#888;">
          Need help? Contact
          <a href="mailto:{{blackMonolithEmail}}" style="color:#1f6feb; text-decoration:none;">{{blackMonolithEmail}}</a>.
        </td>
      </tr>
    </table>
  </body>
`;
export const agentRejectTemplate = `
  <body style="font-family:'Segoe UI', Arial, sans-serif; background:#f5f7fa; margin:0; padding:40px;">
    <table align="center" width="100%" cellpadding="0" cellspacing="0"
      style="max-width:600px; background:#ffffff; border-radius:12px; box-shadow:0 2px 8px rgba(0,0,0,0.08); overflow:hidden;">

      <!-- HEADER (consistent) -->
      <tr>
        <td style="background:#0d1117; text-align:center; padding:22px 12px;">
          <h2 style="color:#ffffff; margin:0;">
            Request Rejected <span style="font-size:18px;">❌</span>
          </h2>
          <p style="color:#9ca3af; margin:6px 0 0; font-size:14px;">
            {{agentName}} declined your service request on Black Monolith
          </p>
        </td>
      </tr>

      <!-- BODY -->
      <tr>
        <td style="padding:28px 36px;">
          <p style="color:#333; font-size:15px; margin:0 0 14px;">
            Hi <strong>{{contactPersonName}}</strong>,
          </p>

          <p style="color:#444; font-size:15px; line-height:1.7; margin:0 0 18px;">
            Unfortunately, <strong>{{agentName}}</strong> has <strong style="color:#e63946;">rejected</strong> your request.
          </p>


          <!-- REQUEST SUMMARY -->
          <div style="background:#f3f4f6; border:1px solid #e0e0e0; border-radius:8px; padding:18px 20px; margin:0 0 22px;">
            <table width="100%" cellpadding="0" cellspacing="0" style="font-size:15px;">
              <tr>
                <td style="width:42%; color:#444; font-weight:600;">Company</td>
                <td style="color:#111;">{{companyName}}</td>
              </tr>
              <tr>
                <td style="padding-top:10px; color:#444; font-weight:600;">Service</td>
                <td style="padding-top:10px; color:#111;">{{serviceName}}</td>
              </tr>
              <tr>
                <td style="padding-top:10px; color:#444; font-weight:600; vertical-align:top;">Message</td>
                <td style="padding-top:10px; color:#111; white-space:pre-line;">{{message}}</td>
              </tr>
            </table>
          </div>

          <p style="color:#555; font-size:14px; line-height:1.7; margin:0 0 18px;">
            You may contact another agent or update the request details and try again.
          </p>

          <!-- CTA (button only) -->
          <div style="text-align:center; margin:24px 0;">
            <a href="{{request_link}}"
               style="display:inline-block; background:#1f6feb; color:#ffffff; text-decoration:none; font-weight:600; padding:12px 28px; border-radius:6px;">
              View Request
            </a>
          </div>

          <!-- THANKS -->
          <p style="color:#444; font-size:14px; line-height:1.7; text-align:center; margin:8px 0 0;">
            Thanks & Regards,<br />
            <strong>The Black Monolith Team</strong>
          </p>
        </td>
      </tr>

      <!-- FOOTER (consistent) -->
      <tr>
        <td style="background:#f0f2f5; padding:15px 25px; text-align:center; font-size:12px; color:#888;">
          Need help? Contact
          <a href="mailto:{{blackMonolithEmail}}" style="color:#1f6feb; text-decoration:none;">{{blackMonolithEmail}}</a>.
        </td>
      </tr>
    </table>
  </body>
`;
export const forgotPasswordTemplate = `
  <body style="font-family:'Segoe UI', Arial, sans-serif; background:#f5f7fa; margin:0; padding:40px;">
    <table align="center" width="100%" cellpadding="0" cellspacing="0"
      style="max-width:600px; background:#ffffff; border-radius:12px; box-shadow:0 2px 8px rgba(0,0,0,0.08); overflow:hidden;">

      <!-- HEADER -->
      <tr>
        <td style="background:#0d1117; text-align:center; padding:22px 12px;">
          <h2 style="color:#ffffff; margin:0;">Reset Your Password</h2>
          <p style="color:#9ca3af; margin:6px 0 0; font-size:14px;">
            A password reset was requested for your Black Monolith account
          </p>
        </td>
      </tr>

      <!-- BODY -->
      <tr>
        <td style="padding:28px 36px;">
          <p style="color:#333; font-size:15px; line-height:1.6; margin:0 0 12px;">
            Hi <strong>{{name}}</strong>,
          </p>

          <p style="color:#444; font-size:15px; line-height:1.7; margin:0 0 22px;">
            We received a request to reset the password for your 
            <strong>Black Monolith</strong> account. Please click the button below 
            to securely set a new password.
          </p>

          <!-- CTA BUTTON -->
          <div style="text-align:center; margin:24px 0;">
            <a href="{{resetUrl}}"
               style="display:inline-block; background:#1f6feb; color:#ffffff; text-decoration:none; font-weight:600; padding:12px 28px; border-radius:6px;">
              Reset Password
            </a>
          </div>

          <!-- INFO -->
          <p style="color:#666; font-size:13px; line-height:1.7; text-align:center; margin:14px 0;">
            If you didn’t request this, you can safely ignore this email — 
            your password will remain unchanged.
          </p>

          <!-- THANK YOU -->
          <p style="color:#444; font-size:14px; line-height:1.7; margin:32px 0 0; text-align:center;">
            Thanks & Regards,<br />
            <strong>The Black Monolith Team</strong>
          </p>
        </td>
      </tr>

      <!-- FOOTER -->
      <tr>
        <td style="background:#f0f2f5; padding:15px 25px; text-align:center; font-size:12px; color:#888;">
          Need help? Contact 
          <a href="mailto:{{blackMonolithEmail}}" style="color:#1f6feb; text-decoration:none;">
            {{blackMonolithEmail}}
          </a>
        </td>
      </tr>
    </table>
  </body>
`;

export const AddUserTemplate = `
  <body style="font-family: 'Segoe UI', Arial, sans-serif; background-color: #f5f7fa; margin: 0; padding: 40px;">
    <table align="center" width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; background-color: #ffffff; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.08); overflow: hidden;">
      <tr>
        <td style="background-color: #0d1117; text-align: center; padding: 25px 10px;">
          <h2 style="color: #ffffff; margin: 0;">Welcome to <span style="color: #1f6feb;">Black Monolith</span></h2>
        </td>
      </tr>

      <tr>
        <td style="padding: 30px 40px;">
          <p style="font-size: 15px; color: #333333; margin-bottom: 20px;">
            Hello <strong>{{name}}</strong>,<br><br>
            Your admin account has been successfully created. Below are your secure login credentials:
          </p>

          <div style="background-color: #f3f4f6; border: 1px solid #e0e0e0; border-radius: 8px; padding: 18px 20px; margin-bottom: 25px;">
            <table width="100%" cellpadding="0" cellspacing="0" style="font-size: 15px;">
              <tr>
                <td style="font-weight: 600; color: #444; width: 40%;">Email</td>
                <td style="color: #333;">{{email}}</td>
              </tr>
              <tr>
                <td style="font-weight: 600; color: #444; padding-top: 10px;">Temporary Password</td>
                <td style="padding-top: 10px;">
                  <span style="background: #1f6feb; color: #fff; padding: 4px 10px; border-radius: 6px; font-weight: 600; letter-spacing: 0.3px;">
                    {{password}}
                  </span>
                </td>
              </tr>
              <tr>
                <td style="font-weight: 600; color: #444; padding-top: 10px;">User Role</td>
                <td style="padding-top: 10px;">
                  <span style="background: #e9f5ff; color: #0b5ed7; padding: 4px 10px; border-radius: 6px; font-weight: 600;">
                    {{role}}
                  </span>
                </td>
              </tr>
            </table>
          </div>

          <p style="color: #444; font-size: 15px; line-height: 1.6;">
            Click the button below to log in to your account. You’ll be prompted to set a new password on your first login for security purposes.
          </p>

          <div style="text-align: center; margin: 30px 0;">
            <a href="{{loginUrl}}" style="display: inline-block; background-color: #1f6feb; color: #ffffff; text-decoration: none; font-weight: 600; padding: 12px 28px; border-radius: 6px;">
              Login to Your Account
            </a>
          </div>

          <p style="font-size: 14px; color: #666; line-height: 1.6; text-align: center;">
            Welcome aboard,<br>
            <strong>The Black Monolith Team</strong>
          </p>
        </td>
      </tr>

      <tr>
        <td style="background-color: #f0f2f5; padding: 15px 25px; text-align: center; font-size: 12px; color: #888;">
          If you didn’t request this account, please ignore this email or contact us at
          <a href="mailto:{{blackMonolithEmail}}" style="color: #1f6feb; text-decoration: none;">{{blackMonolithEmail}}</a>.
        </td>
      </tr>
    </table>
  </body>
`;
export const agentRegisterTemplate = `
                     <body style="font-family:'Segoe UI', Arial, sans-serif; background:#f5f7fa; margin:0; padding:40px;">
    <table align="center" width="100%" cellpadding="0" cellspacing="0"
      style="max-width:600px; background:#ffffff; border-radius:12px; box-shadow:0 2px 8px rgba(0,0,0,0.08); overflow:hidden;">
      
      <!-- HEADER (consistent) -->
      <tr>
        <td style="background:#0d1117; text-align:center; padding:22px 10px;">
          <h2 style="color:#fff; margin:0;">New Agent Registration</h2>
          <p style="color:#9ca3af; margin:6px 0 0; font-size:14px;">
            A new agent has signed up and is pending review
          </p>
        </td>
      </tr>

      <!-- BODY -->
      <tr>
        <td style="padding:28px 36px;">
          <p style="color:#333; font-size:15px; margin:0 0 16px;">
            Hello <strong>Super Admin</strong>,
          </p>
          <p style="color:#444; font-size:15px; line-height:1.6; margin:0 0 20px;">
            An agent has registered on <strong>Black Monolith</strong>. Please review the details below and approve or reject the registration.
          </p>

          <!-- DETAILS CARD -->
          <div style="background:#f3f4f6; border:1px solid #e0e0e0; border-radius:8px; padding:18px 20px; margin:18px 0 26px;">
            <table width="100%" cellpadding="0" cellspacing="0" style="font-size:15px;">
              <tr>
                <td style="width:42%; color:#444; font-weight:600;">Agent Name</td>
                <td style="color:#111;">{{name}}</td>
              </tr>
              <tr>
                <td style="padding-top:10px; color:#444; font-weight:600;">Email</td>
                <td style="padding-top:10px; color:#111;">{{email}}</td>
              </tr>
              <tr>
                <td style="padding-top:10px; color:#444; font-weight:600;">Phone</td>
                <td style="padding-top:10px; color:#111;">{{phoneNumber}}</td>
              </tr>
              <tr>
                <td style="padding-top:10px; color:#444; font-weight:600;">Country</td>
                <td style="padding-top:10px; color:#111;">{{country}}</td>
              </tr>
            </table>
          </div>

          <!-- ACTION -->
              <div style="text-align:center; margin:28px 0 6px;">
            <div style="text-align:center; margin:26px 0;">
            <a href="{{loginUrl}}"
               style="display:inline-block; background:#1f6feb; color:#ffffff; text-decoration:none; font-weight:600; padding:12px 28px; border-radius:6px;">
              View
            </a>
          </div>
          </div>
          <p style="text-align:center; font-size:13px; color:#666; margin-top:10px;">
            You can approve or reject from the agent review screen.
          </p>
        </td>
      </tr>

      <!-- FOOTER (consistent) -->
      <tr>
        <td style="background:#f0f2f5; padding:15px 25px; text-align:center; font-size:12px; color:#888;">
          If this wasn’t expected, please contact
          <a href="mailto:{{blackMonolithEmail}}" style="color:#1f6feb; text-decoration:none;">{{blackMonolithEmail}}</a>.
        </td>
      </tr>
    </table>
  </body>
                `;


export const GovernmentBodyRegisterTemplate = `
                     <body style="font-family:'Segoe UI', Arial, sans-serif; background:#f5f7fa; margin:0; padding:40px;">
    <table align="center" width="100%" cellpadding="0" cellspacing="0"
      style="max-width:600px; background:#ffffff; border-radius:12px; box-shadow:0 2px 8px rgba(0,0,0,0.08); overflow:hidden;">
      
      <!-- HEADER (consistent) -->
      <tr>
        <td style="background:#0d1117; text-align:center; padding:22px 10px;">
          <h2 style="color:#fff; margin:0;">New Agent Registration</h2>
          <p style="color:#9ca3af; margin:6px 0 0; font-size:14px;">
            A new government body has signed up and is pending review
          </p>
        </td>
      </tr>

      <!-- BODY -->
      <tr>
        <td style="padding:28px 36px;">
          <p style="color:#333; font-size:15px; margin:0 0 16px;">
            Hello <strong>Super Admin</strong>,
          </p>
          <p style="color:#444; font-size:15px; line-height:1.6; margin:0 0 20px;">
            An government body has registered on <strong>Black Monolith</strong>. Please review the details below and approve or reject the registration.
          </p>

          <!-- DETAILS CARD -->
          <div style="background:#f3f4f6; border:1px solid #e0e0e0; border-radius:8px; padding:18px 20px; margin:18px 0 26px;">
            <table width="100%" cellpadding="0" cellspacing="0" style="font-size:15px;">
              <tr>
                <td style="width:42%; color:#444; font-weight:600;">Agent Name</td>
                <td style="color:#111;">{{name}}</td>
              </tr>
              <tr>
                <td style="padding-top:10px; color:#444; font-weight:600;">Email</td>
                <td style="padding-top:10px; color:#111;">{{email}}</td>
              </tr>
              <tr>
                <td style="padding-top:10px; color:#444; font-weight:600;">Phone</td>
                <td style="padding-top:10px; color:#111;">{{phoneNumber}}</td>
              </tr>
            </table>
          </div>

          <!-- ACTION -->
          <div style="text-align:center; margin:28px 0 6px;">
            <div style="text-align:center; margin:26px 0;">
            <a href="{{loginUrl}}"
               style="display:inline-block; background:#1f6feb; color:#ffffff; text-decoration:none; font-weight:600; padding:12px 28px; border-radius:6px;">
              View
            </a>
          </div>
          </div>
          <p style="text-align:center; font-size:13px; color:#666; margin-top:10px;">
            You can approve or reject from the government body review screen.
          </p>
        </td>
      </tr>

      <!-- FOOTER (consistent) -->
      <tr>
        <td style="background:#f0f2f5; padding:15px 25px; text-align:center; font-size:12px; color:#888;">
          If this wasn’t expected, please contact
          <a href="mailto:{{blackMonolithEmail}}" style="color:#1f6feb; text-decoration:none;">{{blackMonolithEmail}}</a>.
        </td>
      </tr>
    </table>
  </body>
                `;

export const AgentApprovedTemplate = `
   <body style="font-family:'Segoe UI', Arial, sans-serif; background:#f5f7fa; margin:0; padding:40px;">
    <table align="center" width="100%" cellpadding="0" cellspacing="0"
      style="max-width:600px; background:#ffffff; border-radius:12px; box-shadow:0 2px 8px rgba(0,0,0,0.08); overflow:hidden;">

      <!-- HEADER (consistent) -->
      <tr>
        <td style="background:#0d1117; text-align:center; padding:22px 12px;">
          <h2 style="color:#ffffff; margin:0;">Welcome to <span style="color:#1f6feb;">Black Monolith</span></h2>
          <p style="color:#9ca3af; margin:6px 0 0; font-size:14px;">
            Your agent registration has been <strong style="color:#8bff8b;">approved</strong> by the admin
          </p>
        </td>
      </tr>

      <!-- BODY -->
      <tr>
        <td style="padding:28px 36px;">
          <p style="color:#333; font-size:15px; margin:0 0 14px;">
            Hi <strong>{{name}}</strong>,
          </p>
          <p style="color:#444; font-size:15px; line-height:1.7; margin:0 0 22px;">
            We’re excited to welcome you to our Agent Network. Your account is now active. 
            Here are your login details:
          </p>

          <!-- DETAILS CARD -->
          <div style="background:#f3f4f6; border:1px solid #e0e0e0; border-radius:8px; padding:18px 20px; margin:0 0 24px;">
            <table width="100%" cellpadding="0" cellspacing="0" style="font-size:15px;">
              <tr>
                <td style="width:42%; color:#444; font-weight:600;">Email</td>
                <td style="color:#111;">{{email}}</td>
              </tr>
              <tr>
                <td style="padding-top:10px; color:#444; font-weight:600;">Temporary Password</td>
                <td style="padding-top:10px;">
                  <span style="background:#1f6feb; color:#ffffff; padding:4px 10px; border-radius:6px; font-weight:600; letter-spacing:0.3px;">
                    {{password}}
                  </span>
                </td>
              </tr>
              <tr>
                <td style="padding-top:10px; color:#444; font-weight:600;">Role</td>
                <td style="padding-top:10px;">
                  <span style="background:#e9f5ff; color:#0b5ed7; padding:4px 10px; border-radius:6px; font-weight:600;">
                    {{role}}
                  </span>
                </td>
              </tr>
            </table>
          </div>

          <p style="color:#444; font-size:14px; line-height:1.7; margin:0 0 18px;">
            For security, you’ll be prompted to set a new password on your first login.
          </p>

          <!-- CTA -->
          <div style="text-align:center; margin:26px 0;">
            <a href="{{loginUrl}}"
               style="display:inline-block; background:#1f6feb; color:#ffffff; text-decoration:none; font-weight:600; padding:12px 28px; border-radius:6px;">
              Login to Your Account
            </a>
          </div>

          <!-- THANKS -->
          <p style="color:#444; font-size:14px; line-height:1.7; text-align:center; margin:8px 0 0;">
            Thanks & Regards,<br />
            <strong>The Black Monolith Team</strong>
          </p>
        </td>
      </tr>

      <!-- FOOTER (consistent) -->
      <tr>
        <td style="background:#f0f2f5; padding:15px 25px; text-align:center; font-size:12px; color:#888;">
          Need help? Contact
          <a href="mailto:{{blackMonolithEmail}}" style="color:#1f6feb; text-decoration:none;">
            {{blackMonolithEmail}}
          </a>.
        </td>
      </tr>
    </table>
  </body>
`;

export const AgentRejectedTemplate = `
   <body style="font-family:'Segoe UI', Arial, sans-serif; background:#f5f7fa; margin:0; padding:40px;">
    <table align="center" width="100%" cellpadding="0" cellspacing="0"
      style="max-width:600px; background:#ffffff; border-radius:12px; box-shadow:0 2px 8px rgba(0,0,0,0.08); overflow:hidden;">
      
      <!-- HEADER -->
      <tr>
        <td style="background:#0d1117; text-align:center; padding:22px 12px;">
          <h2 style="color:#ffffff; margin:0;">Application Status: 
            <span style="color:#ff6b6b;">Rejected</span>
          </h2>
          <p style="color:#9ca3af; margin:6px 0 0; font-size:14px;">
            Your agent registration was reviewed by the admin
          </p>
        </td>
      </tr>

      <!-- BODY -->
      <tr>
        <td style="padding:28px 36px;">
          <p style="color:#333; font-size:15px; line-height:1.6; margin:0 0 14px;">
            Hi <strong>{{name}}</strong>,
          </p>

          <p style="color:#444; font-size:15px; line-height:1.7; margin:0 0 22px;">
            We appreciate your interest in joining <strong>Black Monolith</strong>.  
            Unfortunately, your agent registration request has been 
            <strong style="color:#e63946;">rejected</strong> after review.
          </p>

          <p style="color:#555; font-size:14px; line-height:1.7;">
            You can reach out to our support team if you’d like to know more or reapply in the future.
          </p>

          <!-- THANKS -->
          <p style="color:#444; font-size:14px; line-height:1.7; text-align:center; margin:28px 0 0;">
            Best regards,<br />
            <strong>The Black Monolith Team</strong>
          </p>
        </td>
      </tr>

      <!-- FOOTER -->
      <tr>
        <td style="background:#f0f2f5; padding:15px 25px; text-align:center; font-size:12px; color:#888;">
          Need help? Contact 
          <a href="mailto:{{blackMonolithEmail}}" style="color:#1f6feb; text-decoration:none;">
            {{blackMonolithEmail}}
          </a>.
        </td>
      </tr>
    </table>
  </body>
`;

export const CompanyRegistrationTemplate = `
  <body style="font-family: 'Segoe UI', Arial, sans-serif; background-color: #f5f7fa; margin: 0; padding: 40px;">
    <table align="center" width="100%" cellpadding="0" cellspacing="0"
      style="max-width: 600px; background-color: #ffffff; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.08); overflow: hidden;">
      
      <!-- HEADER -->
      <tr>
        <td style="background-color: #0d1117; text-align: center; padding: 25px 10px;">
          <h2 style="color: #ffffff; margin: 0;">
            Welcome to <span style="color: #1f6feb;">Black Monolith</span>
          </h2>
          <p style="color: #9ca3af; margin-top: 6px; font-size: 14px;">
            Your company account has been successfully registered
          </p>
        </td>
      </tr>

      <!-- BODY -->
      <tr>
        <td style="padding: 30px 40px;">
          <p style="font-size: 15px; color: #333; line-height: 1.6;">
            Hello <strong>{{companyName}}</strong>,
          </p>
          <p style="font-size: 15px; color: #444; line-height: 1.6;">
            We’re thrilled to have you on board! Your company profile has been created successfully. 
            Below are your account details:
          </p>

          <!-- ACCOUNT DETAILS CARD -->
          <div style="background-color: #f3f4f6; border: 1px solid #e0e0e0; border-radius: 8px; padding: 18px 20px; margin: 25px 0;">
            <table width="100%" cellpadding="0" cellspacing="0" style="font-size: 15px;">
              <tr>
                <td style="font-weight: 600; color: #444; width: 45%;">Company Name</td>
                <td style="color: #333;">{{companyName}}</td>
              </tr>
              <tr>
                <td style="font-weight: 600; color: #444; padding-top: 10px;">Contact Person</td>
                <td style="padding-top: 10px; color: #333;">{{contactPersonName}}</td>
              </tr>
              <tr>
                <td style="font-weight: 600; color: #444; padding-top: 10px;">Email</td>
                <td style="padding-top: 10px; color: #333;">{{email}}</td>
              </tr>
              <tr>
                <td style="font-weight: 600; color: #444; padding-top: 10px;">Temporary Password</td>
                <td style="padding-top: 10px;">
                  <span style="background: #1f6feb; color: #fff; padding: 4px 10px; border-radius: 6px; font-weight: 600; letter-spacing: 0.3px;">
                    {{password}}
                  </span>
                </td>
              </tr>
              <tr>
                <td style="font-weight: 600; color: #444; padding-top: 10px;">User Role</td>
                <td style="padding-top: 10px;">
                  <span style="background: #e9f5ff; color: #0b5ed7; padding: 4px 10px; border-radius: 6px; font-weight: 600;">
                    {{role}}
                  </span>
                </td>
              </tr>
            </table>
          </div>

          <p style="color: #444; font-size: 15px; line-height: 1.6;">
            Please log in to your account using the button below. 
            You’ll be prompted to set a new password during your first login for security reasons.
          </p>

          <div style="text-align: center; margin: 30px 0;">
            <a href="{{loginUrl}}"
              style="display: inline-block; background-color: #1f6feb; color: #fff; text-decoration: none; font-weight: 600; padding: 12px 28px; border-radius: 6px;">
              Login to Your Account
            </a>
          </div>

          <p style="font-size: 14px; color: #666; text-align: center; line-height: 1.6;">
            Thank you for joining <strong>Black Monolith</strong>.<br />
            We look forward to building something great together!
          </p>
        </td>
      </tr>

      <!-- FOOTER -->
      <tr>
        <td style="background-color: #f0f2f5; padding: 15px 25px; text-align: center; font-size: 12px; color: #888;">
          If you didn’t initiate this registration, please ignore this email or contact our support team at 
          <a href="mailto:{{blackMonolithEmail}}" style="color: #1f6feb; text-decoration: none;">{{blackMonolithEmail}}</a>.
        </td>
      </tr>
    </table>
  </body>
`;

export const userStatusActive = `
  <body style="font-family: 'Segoe UI', Arial, sans-serif; background-color: #f5f7fa; margin: 0; padding: 40px;">
    <table align="center" width="100%" cellpadding="0" cellspacing="0"
      style="max-width: 600px; background-color: #ffffff; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.08); overflow: hidden;">

      <!-- HEADER -->
      <tr>
        <td style="background-color: #0d1117; text-align: center; padding: 25px 10px;">
          <h2 style="color: #ffffff; margin: 0;">Account Status <span style="color: #1f6feb;">Updated</span></h2>
          <p style="color: #9ca3af; margin-top: 6px; font-size: 14px;">Your account is now active</p>
        </td>
      </tr>

      <!-- BODY -->
      <tr>
        <td style="padding: 30px 40px;">
          <p style="font-size: 15px; color: #333;">Hello <strong>{{name}}</strong>,</p>
          <p style="font-size: 15px; color: #444; line-height: 1.6;">
            We’re pleased to inform you that your account has been 
            <strong style="color: {{statusColor}};">{{statusText}}</strong> by <strong>{{adminName}}</strong>.
          </p>

          <!-- ACCOUNT DETAILS CARD -->
          <div style="background-color: #f3f4f6; border: 1px solid #e0e0e0; border-radius: 8px; padding: 18px 20px; margin: 25px 0;">
            <table width="100%" cellpadding="0" cellspacing="0" style="font-size: 15px;">
              <tr>
                <td style="font-weight: 600; color: #444; width: 45%;">Name</td>
                <td style="color: #333;">{{name}}</td>
              </tr>
              <tr>
                <td style="font-weight: 600; color: #444; padding-top: 10px;">Email</td>
                <td style="padding-top: 10px; color: #333;">{{email}}</td>
              </tr>
              <tr>
                <td style="font-weight: 600; color: #444; padding-top: 10px;">Current Status</td>
                <td style="padding-top: 10px;">
                  <span style="background: #e9f5ff; color: {{statusColor}}; padding: 4px 10px; border-radius: 6px; font-weight: 600;">
                    {{statusText}}
                  </span>
                </td>
              </tr>
            </table>
          </div>

          <p style="color: #444; font-size: 15px; line-height: 1.6;">
            You can now log in to your account and continue using our services.
          </p>

          <div style="text-align: center; margin: 30px 0;">
            <a href="{{loginUrl}}" 
              style="display: inline-block; background-color: #1f6feb; color: #fff; text-decoration: none; font-weight: 600; padding: 12px 28px; border-radius: 6px;">
              Login to Your Account
            </a>
          </div>

          <p style="font-size: 14px; color: #666; text-align: center; line-height: 1.6;">
            Thank you for being part of <strong>Black Monolith</strong>.<br />
            We’re excited to have you back!
          </p>
        </td>
      </tr>

      <!-- FOOTER -->
      <tr>
        <td style="background-color: #f0f2f5; padding: 15px 25px; text-align: center; font-size: 12px; color: #888;">
          Need help? Contact us at 
          <a href="mailto:{{blackMonolithEmail}}" style="color: #1f6feb; text-decoration: none;">{{blackMonolithEmail}}</a>.
        </td>
      </tr>
    </table>
  </body>
`;

export const userStatusInactive = `
  <body style="font-family: 'Segoe UI', Arial, sans-serif; background-color: #f5f7fa; margin: 0; padding: 40px;">
    <table align="center" width="100%" cellpadding="0" cellspacing="0"
      style="max-width: 600px; background-color: #ffffff; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.08); overflow: hidden;">

      <!-- HEADER -->
      <tr>
        <td style="background-color: #0d1117; text-align: center; padding: 25px 10px;">
          <h2 style="color: #ffffff; margin: 0;">Account Status <span style="color: #e63946;">Updated</span></h2>
          <p style="color: #9ca3af; margin-top: 6px; font-size: 14px;">Your account has been deactivated</p>
        </td>
      </tr>

      <!-- BODY -->
      <tr>
        <td style="padding: 30px 40px;">
          <p style="font-size: 15px; color: #333;">Hello <strong>{{name}}</strong>,</p>
          <p style="font-size: 15px; color: #444; line-height: 1.6;">
            Your account has been <strong style="color: {{statusColor}};">{{statusText}}</strong> by <strong>{{adminName}}</strong>.
          </p>

          <!-- ACCOUNT DETAILS CARD -->
          <div style="background-color: #f3f4f6; border: 1px solid #e0e0e0; border-radius: 8px; padding: 18px 20px; margin: 25px 0;">
            <table width="100%" cellpadding="0" cellspacing="0" style="font-size: 15px;">
              <tr>
                <td style="font-weight: 600; color: #444; width: 45%;">Name</td>
                <td style="color: #333;">{{name}}</td>
              </tr>
              <tr>
                <td style="font-weight: 600; color: #444; padding-top: 10px;">Email</td>
                <td style="padding-top: 10px; color: #333;">{{email}}</td>
              </tr>
              <tr>
                <td style="font-weight: 600; color: #444; padding-top: 10px;">Current Status</td>
                <td style="padding-top: 10px;">
                  <span style="background: #ffe9e9; color: {{statusColor}}; padding: 4px 10px; border-radius: 6px; font-weight: 600;">
                    {{statusText}}
                  </span>
                </td>
              </tr>
            </table>
          </div>

          <p style="color: #444; font-size: 15px; line-height: 1.6;">
            Your access has been temporarily disabled. If you believe this is a mistake, please contact our support team.
          </p>

          <p style="font-size: 14px; color: #666; text-align: center; line-height: 1.6; margin-top: 30px;">
            Thank you for your understanding,<br />
            The <strong>Black Monolith</strong> Team
          </p>
        </td>
      </tr>

      <!-- FOOTER -->
      <tr>
        <td style="background-color: #f0f2f5; padding: 15px 25px; text-align: center; font-size: 12px; color: #888;">
          For assistance, contact our support at 
          <a href="mailto:{{blackMonolithEmail}}" style="color: #1f6feb; text-decoration: none;">{{blackMonolithEmail}}</a>.
        </td>
      </tr>
    </table>
  </body>
`;


export const GovermentBodyApprovedTemplate = `
   <body style="font-family:'Segoe UI', Arial, sans-serif; background:#f5f7fa; margin:0; padding:40px;">
    <table align="center" width="100%" cellpadding="0" cellspacing="0"
      style="max-width:600px; background:#ffffff; border-radius:12px; box-shadow:0 2px 8px rgba(0,0,0,0.08); overflow:hidden;">

      <!-- HEADER (consistent) -->
      <tr>
        <td style="background:#0d1117; text-align:center; padding:22px 12px;">
          <h2 style="color:#ffffff; margin:0;">Welcome to <span style="color:#1f6feb;">Black Monolith</span></h2>
          <p style="color:#9ca3af; margin:6px 0 0; font-size:14px;">
            Your goverment body registration has been <strong style="color:#8bff8b;">approved</strong> by the admin
          </p>
        </td>
      </tr>

      <!-- BODY -->
      <tr>
        <td style="padding:28px 36px;">
          <p style="color:#333; font-size:15px; margin:0 0 14px;">
            Hi <strong>{{name}}</strong>,
          </p>
          <p style="color:#444; font-size:15px; line-height:1.7; margin:0 0 22px;">
            We’re excited to welcome you to our Goverment Body Network. Your account is now active. 
            Here are your login details:
          </p>

          <!-- DETAILS CARD -->
          <div style="background:#f3f4f6; border:1px solid #e0e0e0; border-radius:8px; padding:18px 20px; margin:0 0 24px;">
            <table width="100%" cellpadding="0" cellspacing="0" style="font-size:15px;">
              <tr>
                <td style="width:42%; color:#444; font-weight:600;">Email</td>
                <td style="color:#111;">{{email}}</td>
              </tr>
              <tr>
                <td style="padding-top:10px; color:#444; font-weight:600;">Temporary Password</td>
                <td style="padding-top:10px;">
                  <span style="background:#1f6feb; color:#ffffff; padding:4px 10px; border-radius:6px; font-weight:600; letter-spacing:0.3px;">
                    {{password}}
                  </span>
                </td>
              </tr>
              <tr>
                <td style="padding-top:10px; color:#444; font-weight:600;">Role</td>
                <td style="padding-top:10px;">
                  <span style="background:#e9f5ff; color:#0b5ed7; padding:4px 10px; border-radius:6px; font-weight:600;">
                    {{role}}
                  </span>
                </td>
              </tr>
            </table>
          </div>

          <p style="color:#444; font-size:14px; line-height:1.7; margin:0 0 18px;">
            For security, you’ll be prompted to set a new password on your first login.
          </p>

          <!-- CTA -->
          <div style="text-align:center; margin:26px 0;">
            <a href="{{loginUrl}}"
               style="display:inline-block; background:#1f6feb; color:#ffffff; text-decoration:none; font-weight:600; padding:12px 28px; border-radius:6px;">
              Login to Your Account
            </a>
          </div>

          <!-- THANKS -->
          <p style="color:#444; font-size:14px; line-height:1.7; text-align:center; margin:8px 0 0;">
            Thanks & Regards,<br />
            <strong>The Black Monolith Team</strong>
          </p>
        </td>
      </tr>

      <!-- FOOTER (consistent) -->
      <tr>
        <td style="background:#f0f2f5; padding:15px 25px; text-align:center; font-size:12px; color:#888;">
          Need help? Contact
          <a href="mailto:{{blackMonolithEmail}}" style="color:#1f6feb; text-decoration:none;">
            {{blackMonolithEmail}}
          </a>.
        </td>
      </tr>
    </table>
  </body>
`;

export const GovermentBodyRejectedTemplate = `
   <body style="font-family:'Segoe UI', Arial, sans-serif; background:#f5f7fa; margin:0; padding:40px;">
    <table align="center" width="100%" cellpadding="0" cellspacing="0"
      style="max-width:600px; background:#ffffff; border-radius:12px; box-shadow:0 2px 8px rgba(0,0,0,0.08); overflow:hidden;">
      
      <!-- HEADER -->
      <tr>
        <td style="background:#0d1117; text-align:center; padding:22px 12px;">
          <h2 style="color:#ffffff; margin:0;">Application Status: 
            <span style="color:#ff6b6b;">Rejected</span>
          </h2>
          <p style="color:#9ca3af; margin:6px 0 0; font-size:14px;">
            Your goverment body registration was reviewed by the admin
          </p>
        </td>
      </tr>

      <!-- BODY -->
      <tr>
        <td style="padding:28px 36px;">
          <p style="color:#333; font-size:15px; line-height:1.6; margin:0 0 14px;">
            Hi <strong>{{name}}</strong>,
          </p>

          <p style="color:#444; font-size:15px; line-height:1.7; margin:0 0 22px;">
            We appreciate your interest in joining <strong>Black Monolith</strong>.  
            Unfortunately, your goverment body registration request has been 
            <strong style="color:#e63946;">rejected</strong> after review.
          </p>

          <p style="color:#555; font-size:14px; line-height:1.7;">
            You can reach out to our support team if you’d like to know more or reapply in the future.
          </p>

          <!-- THANKS -->
          <p style="color:#444; font-size:14px; line-height:1.7; text-align:center; margin:28px 0 0;">
            Best regards,<br />
            <strong>The Black Monolith Team</strong>
          </p>
        </td>
      </tr>

      <!-- FOOTER -->
      <tr>
        <td style="background:#f0f2f5; padding:15px 25px; text-align:center; font-size:12px; color:#888;">
          Need help? Contact 
          <a href="mailto:{{blackMonolithEmail}}" style="color:#1f6feb; text-decoration:none;">
            {{blackMonolithEmail}}
          </a>.
        </td>
      </tr>
    </table>
  </body>
`;

export const GovernmentBodyServiceRequestTemplate = `
  <body style="font-family:'Segoe UI', Arial, sans-serif; background:#f5f7fa; margin:0; padding:40px;">
    <table align="center" width="100%" cellpadding="0" cellspacing="0"
      style="max-width:600px; background:#ffffff; border-radius:12px; box-shadow:0 2px 8px rgba(0,0,0,0.08); overflow:hidden;">

      <!-- HEADER -->
      <tr>
        <td style="background:#0d1117; text-align:center; padding:22px 12px;">
          <h2 style="color:#ffffff; margin:0;">New Service Request</h2>
          <p style="color:#9ca3af; margin:6px 0 0; font-size:14px;">
            A new service request has been submitted by a <strong>{{requestedBy}}</strong>.
          </p>
        </td>
      </tr>

      <!-- BODY -->
      <tr>
        <td style="padding:28px 36px;">
          <p style="color:#333; font-size:15px; margin:0 0 14px;">
            Hi <strong>{{superAdminName}}</strong>,
          </p>
          <p style="color:#444; font-size:15px; line-height:1.7; margin:0 0 22px;">
            A government body has submitted a new service request. Please review the details below and take the necessary action.
          </p>

          <!-- DETAILS CARD -->
          <div style="background:#f3f4f6; border:1px solid #e0e0e0; border-radius:8px; padding:18px 20px; margin:0 0 24px;">
            <table width="100%" cellpadding="0" cellspacing="0" style="font-size:15px;">
              <tr>
                <td style="width:42%; color:#444; font-weight:600;">Request Title</td>
                <td style="color:#111;">{{requestTitle}}</td>
              </tr>
              <tr>
                <td style="padding-top:10px; color:#444; font-weight:600;">Description</td>
                <td style="padding-top:10px; color:#111;">{{description}}</td>
              </tr>
              <tr>
                <td style="padding-top:10px; color:#444; font-weight:600;">Purpose</td>
                <td style="padding-top:10px; color:#111;">{{purpose}}</td>
              </tr>
              <tr>
                <td style="padding-top:10px; color:#444; font-weight:600;">Requested By</td>
                <td style="padding-top:10px; color:#111;">{{requestedBy}}</td>
              </tr>
            </table>
          </div>

          <p style="color:#444; font-size:14px; line-height:1.7; margin:0 0 18px;">
            To review and manage this request, please click below:
          </p>

          <!-- CTA -->
          <div style="text-align:center; margin:26px 0;">
            <a href="{{loginUrl}}"
               style="display:inline-block; background:#1f6feb; color:#ffffff; text-decoration:none; font-weight:600; padding:12px 28px; border-radius:6px;">
              View Request
            </a>
          </div>

          <!-- THANKS -->
          <p style="color:#444; font-size:14px; line-height:1.7; text-align:center; margin:8px 0 0;">
            Thanks & Regards,<br />
            <strong>The Black Monolith Team</strong>
          </p>
        </td>
      </tr>

      <!-- FOOTER -->
      <tr>
        <td style="background:#f0f2f5; padding:15px 25px; text-align:center; font-size:12px; color:#888;">
          Need help? Contact
          <a href="mailto:{{blackMonolithEmail}}" style="color:#1f6feb; text-decoration:none;">
            {{blackMonolithEmail}}
          </a>.
        </td>
      </tr>
    </table>
  </body>
`;

export const CompanyServicePaymentSuccessTemplate = `
   <body style="font-family:'Segoe UI', Arial, sans-serif; background:#f5f7fa; margin:0; padding:40px;">
    <table align="center" width="100%" cellpadding="0" cellspacing="0"
      style="max-width:600px; background:#ffffff; border-radius:12px; box-shadow:0 2px 8px rgba(0,0,0,0.08); overflow:hidden;">

      <!-- HEADER -->
      <tr>
        <td style="background:#0d1117; text-align:center; padding:22px 12px;">
          <h2 style="color:#ffffff; margin:0;">Payment Successful</h2>
          <p style="color:#9ca3af; margin:6px 0 0; font-size:14px;">
            The company <strong>{{companyName}}</strong> has successfully completed a payment for <strong>{{serviceName}}</strong>.
          </p>
        </td>
      </tr>

      <!-- BODY -->
      <tr>
        <td style="padding:28px 36px;">
          <p style="color:#333; font-size:15px; margin:0 0 14px;">
            Hi <strong>{{agentName}}</strong>,
          </p>
          <p style="color:#444; font-size:15px; line-height:1.7; margin:0 0 22px;">
            The following company has completed their payment for the requested service. Below are the transaction and company details for your reference.
          </p>

          <!-- DETAILS CARD -->
          <div style="background:#f3f4f6; border:1px solid #e0e0e0; border-radius:8px; padding:18px 20px; margin:0 0 24px;">
            <table width="100%" cellpadding="0" cellspacing="0" style="font-size:15px;">
              <tr>
                <td style="width:42%; color:#444; font-weight:600;">Company Name</td>
                <td style="color:#111;">{{companyName}}</td>
              </tr>
              <tr>
                <td style="padding-top:10px; color:#444; font-weight:600;">Amount Paid</td>
                <td style="padding-top:10px; color:#111;">{{amountPaid}}</td>
              </tr>
              <tr>
                <td style="padding-top:10px; color:#444; font-weight:600;">Payment Date</td>
                <td style="padding-top:10px; color:#111;">{{paymentDate}}</td>
              </tr>
              <tr>
                <td style="padding-top:10px; color:#444; font-weight:600;">Company Email</td>
                <td style="padding-top:10px; color:#111;">{{companyEmail}}</td>
              </tr>
                         <tr>
                <td style="padding-top:10px; color:#444; font-weight:600;">Company Website</td>
                <td style="padding-top:10px; color:#111;">{{companyWebsite}}</td>
              </tr>
                                       <tr>
                <td style="padding-top:10px; color:#444; font-weight:600;">Company Address</td>
                <td style="padding-top:10px; color:#111;">{{companyAddress}}</td>
              </tr>
              <tr>
                <td style="padding-top:10px; color:#444; font-weight:600;">Contact Person Name</td>
                <td style="padding-top:10px; color:#111;">{{contactPersonName}}</td>
              </tr> 
          
                            <tr>
                <td style="padding-top:10px; color:#444; font-weight:600;">Contact Person Phone</td>
                <td style="padding-top:10px; color:#111;">{{contactPersonPhone}}</td>
              </tr> 
                                          <tr>
                <td style="padding-top:10px; color:#444; font-weight:600;">Business Type</td>
                <td style="padding-top:10px; color:#111;">{{businessType}}</td>
              </tr> 
              
            </table>
          </div>

          <p style="color:#444; font-size:14px; line-height:1.7; margin:0 0 18px;">
            You can now proceed with the next steps in the service fulfillment process. To view complete details or manage this payment, click the link below:
          </p>

          <!-- CTA -->
          <div style="text-align:center; margin:26px 0;">
            <a href="{{dashboardUrl}}"
               style="display:inline-block; background:#1f6feb; color:#ffffff; text-decoration:none; font-weight:600; padding:12px 28px; border-radius:6px;">
              View Payment Details
            </a>
          </div>

          <!-- THANKS -->
          <p style="color:#444; font-size:14px; line-height:1.7; text-align:center; margin:8px 0 0;">
            Thanks & Regards,<br />
            <strong>The Black Monolith Team</strong>
          </p>
        </td>
      </tr>

      <!-- FOOTER -->
      <tr>
        <td style="background:#f0f2f5; padding:15px 25px; text-align:center; font-size:12px; color:#888;">
          Need help? Contact
          <a href="mailto:{{blackMonolithEmail}}" style="color:#1f6feb; text-decoration:none;">
            {{blackMonolithEmail}}
          </a>.
        </td>
      </tr>
    </table>
  </body>
`;

export const CompanyPaymentSuccessTemplate = `
  <body style="font-family:'Segoe UI', Arial, sans-serif; background:#f5f7fa; margin:0; padding:40px;">
    <table align="center" width="100%" cellpadding="0" cellspacing="0"
      style="max-width:600px; background:#ffffff; border-radius:12px; box-shadow:0 2px 8px rgba(0,0,0,0.08); overflow:hidden;">

      <!-- HEADER -->
      <tr>
        <td style="background:#0d1117; text-align:center; padding:22px 12px;">
          <h2 style="color:#ffffff; margin:0;">Payment Successful</h2>
          <p style="color:#9ca3af; margin:6px 0 0; font-size:14px;">
            Thank you, <strong>{{companyName}}</strong> — your payment for <strong>{{serviceName}}</strong> has been received successfully.
          </p>
        </td>
      </tr>

      <!-- BODY -->
      <tr>
        <td style="padding:28px 36px;">
          <p style="color:#333; font-size:15px; margin:0 0 14px;">
            Dear <strong>{{contactPersonName}}</strong>,
          </p>
          <p style="color:#444; font-size:15px; line-height:1.7; margin:0 0 22px;">
            We’re pleased to inform you that your payment has been successfully processed for the selected service. 
            Our agent, <strong>{{agentName}}</strong>, will review your details and contact you shortly for the next steps.
          </p>

          <!-- DETAILS CARD -->
          <div style="background:#f3f4f6; border:1px solid #e0e0e0; border-radius:8px; padding:18px 20px; margin:0 0 24px;">
            <table width="100%" cellpadding="0" cellspacing="0" style="font-size:15px;">
              <tr>
                <td style="width:42%; color:#444; font-weight:600;">Service Name</td>
                <td style="color:#111;">{{serviceName}}</td>
              </tr>
              <tr>
                <td style="padding-top:10px; color:#444; font-weight:600;">Amount Paid</td>
                <td style="padding-top:10px; color:#111;">{{amountPaid}}</td>
              </tr>
              <tr>
                <td style="padding-top:10px; color:#444; font-weight:600;">Payment Date</td>
                <td style="padding-top:10px; color:#111;">{{paymentDate}}</td>
              </tr>
              <tr>
                <td style="padding-top:10px; color:#444; font-weight:600;">Assigned Agent</td>
                <td style="padding-top:10px; color:#111;">{{agentName}}</td>
              </tr>
            </table>
          </div>

          <p style="color:#444; font-size:14px; line-height:1.7; margin:0 0 18px;">
            You can view your service request and payment details anytime by visiting your company dashboard:
          </p>

          <!-- CTA -->
          <div style="text-align:center; margin:26px 0;">
            <a href="{{dashboardUrl}}"
               style="display:inline-block; background:#1f6feb; color:#ffffff; text-decoration:none; font-weight:600; padding:12px 28px; border-radius:6px;">
              View Dashboard
            </a>
          </div>

          <!-- THANKS -->
          <p style="color:#444; font-size:14px; line-height:1.7; text-align:center; margin:8px 0 0;">
            Thank you for choosing our services.<br />
            <strong>The Black Monolith Team</strong>
          </p>
        </td>
      </tr>

      <!-- FOOTER -->
      <tr>
        <td style="background:#f0f2f5; padding:15px 25px; text-align:center; font-size:12px; color:#888;">
          Need assistance? Contact us at
          <a href="mailto:{{blackMonolithEmail}}" style="color:#1f6feb; text-decoration:none;">
            {{blackMonolithEmail}}
          </a>.
        </td>
      </tr>
    </table>
  </body>
`;

