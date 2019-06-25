const accountSid = '';
const authToken = '';
const client = require('twilio')(accountSid, authToken);

client.messages
  .create({
     body: '我換用twillo了 aws無法收簡訊 但是twillo有提供webhook xdd 晚安拉meme',
     from: '+14086808163',
     to: '+886917285787'
   })
  .then(message => {console.log(message.sid); console.log(message)});



