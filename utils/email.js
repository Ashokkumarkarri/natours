const nodemailer = require('nodemailer');
const pug = require('pug');
const htmlToText = require('html-to-text');

//new Email(user, url).sendWelcome(); //This is how we call the function
//new Email(user, url).sendPasswordReset(); //This is how we call the function

module.exports = class Email {
  constructor(user, url) {
    this.to = user.email;
    this.firstName = user.name.split(' ')[0];
    this.url = url;
    this.from = `Ashok Kumar <${process.env.EMAIL_FROM}>`;
  }
  newTransport() {
    if (process.env.NODE_ENV === 'production') {
      //SendGrid
      return nodemailer.createTransport({
        host: 'smtp.resend.com', // Resend SMTP host
        port: 587,
        secure: false, // Set to true for port 465
        auth: {
          user: 'resend', // ✅ Resend uses a fixed username "resend"
          pass: process.env.RESEND_API_KEY, // Your Resend API Key
        },
      });
    }
    return nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
      //enable or aCTIVATE IN GMAIL: "LESS SECURE APP" OPTION
    });
  }
  //Send the actual email
  async send(template, subject) {
    //1) Render HTML based on a pug template
    const html = pug.renderFile(`${__dirname}/../views/email/${template}.pug`, {
      firstName: this.firstName,
      url: this.url,
      subject,
    });

    //2) Define the email options
    const mailOptions = {
      from: this.from,
      to: this.to,
      subject: subject,
      html: html,
      text: htmlToText.convert(html),
      // html:
    };

    //3) Create a transport and send email
    await this.newTransport().sendMail(mailOptions);
  }

  async sendWelcome() {
    await this.send('welcome', 'Welcome to the Natours Family!'); // this is the template name and subject of the email we are sending
  }

  async sendPasswordReset() {
    await this.send(
      'passwordReset',
      'Your password reset token (valid for only 10 minutes)',
    ); // this is the template name and subject of the email we are sending
  }
};
