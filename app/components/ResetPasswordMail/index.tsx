export const ResetPasswordMail = (
  url: string,
  token: string,
  username: string
) => `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Email Verification</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f0f0f0;
            margin: 0;
            padding: 0;
            height: 100vh;
            display: flex;
            justify-content: center;
            align-items: center;
        }
        .container {
            max-width: 600px;
            margin: auto;
            padding: 20px;
            border: 1px solid #ddd;
            border-radius: 10px;
            background-color: #fff;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }
        .header {
            text-align: center;
            padding-bottom: 20px;
            border-bottom: 2px solid #007bff; !important;
            margin-bottom: 20px;
        }
        .header h1 {
            color: #007bff; !important;
        }
        .content {
            padding: 20px 0;
        }
        .content p {
            margin-bottom: 15px;
            line-height: 1.6;
        }
        .footer {
            text-align: center;
            padding-top: 20px;
            border-top: 1px solid #ddd;
            color: #666;
        }
        .link-button {
            display: inline-block;
            padding: 10px 20px;
            background-color: #007bff !important;
            color: #fff;
            text-decoration: none;
            border-radius: 5px;
            transition: background-color 0.3s;
        }
        .link-button:hover {
            background-color: #0056b3 !important;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Reset password</h1>
        </div>
        <div class="content">
            <p><b>Hi ${username}!</b></p>
            <p><b>We have sent this email because you have forgotten your password!</b></p>
            <p>You can reset your password with the link below:</p>
            <p><a class="link-button" href="${url}/reset-password?token=${token}">Click here to reset</a></p>
        </div>
        <div class="footer">
            <p>If you did not create an account, please ignore this email.</p>
        </div>
    </div>
</body>
</html>
`;
