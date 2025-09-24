export const emailTemplates = [
  {
    type: "signup",
    subject: "Welcome to Expense Tracker!",
    body: (username: string, password: string) =>
      `Hello ${username},

        Your account has been created successfully!
        Your temporary password is: ${password}

        Please login and change your password immediately for security reasons.

        Thank you,
        Expense Tracker Team`
  },
  {
    type: "forgotPassword",
    subject: "Expense Tracker - Password Reset",
    body: (username: string, password: string) =>
      `Hello ${username},

        You have requested to reset your password.
        Your new temporary password is: ${password}

        Please login using this password and change it immediately to secure your account.

        If you did not request this change, please contact support immediately.

        Thank you,
        Expense Tracker Team`
  }
];
