const AWS = require("aws-sdk");
const ses = new AWS.SES();

const receiverEmail = process.env.EMAIL_DESTINATION;
const senderEmail = process.env.EMAIL_DESTINATION;

const sendEmail = (event, callback) => {
  const content = JSON.parse(event.body);

  ses.sendEmail(
    {
      Destination: {
        ToAddresses: [receiverEmail],
      },
      Message: {
        Body: {
          Text: {
            Data: `Name: ${content.from}\n Email: ${content.replyto} \n\nMessage:\n ${content.message}`,
            Charset: "UTF-8",
          },
        },
        Subject: {
          Data: `Website Referral Form: ${content.from}`,
          Charset: "UTF-8",
        },
      },
      Source: senderEmail,
      ReplyToAddresses: [event.replyto],
    },
    callback
  );
};

exports.handler = (event, context, callback) => {
  console.log("Received event:", JSON.stringify(event));
  sendEmail(event, (err, data) => {
    callback(err, {
      sBase64Encoded: false,
      statusCode: err ? 500 : 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({ data, err }),
    });
  });
};
