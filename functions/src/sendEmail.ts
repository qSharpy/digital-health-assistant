import {createTransport} from 'nodemailer';
import * as functions from 'firebase-functions';
import { from } from 'rxjs';

export const sendEmail = functions.https.onRequest((request, response) => {
    const transport = createTransport({
      service: 'gmail',
      auth: {
        user: 'digitalhealthassistant@gmail.com',
        pass: 'Parola#2019'
      }
    });
    from(transport.sendMail({
      from: 'Digital Health Assistant <digitalhealthassistant@gmail.com>',
      to: request.body.to,
      subject: request.body.subject,
      html: request.body.html
    })).subscribe(() => {
      response.send({success: true});
    },
    e => {
      response.send({success: false, error: e});
    });
});
