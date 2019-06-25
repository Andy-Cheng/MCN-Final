/**
 * @file Manages routings and api designs.
 */
const healthRouter = require('express').Router();
const { ecgModel, emgModel } = require('./DB/db');
const apiMsg = require('./apiMessage');
const MessagingResponse = require('twilio').twiml.MessagingResponse;

// Read ecg
healthRouter.get('/read/ecg', async (req, res, next) => {
    console.log('api: read ecg');
    const { userId } = req.query;
    // Read the recent 10 sample data
    await ecgModel.find({ userId: userId }).sort({ createdAt: -1 }).limit(5).exec(function (err, ecg) {
        if (err) {
            console.log(`read ecg error: ${err}`);
            res.status(200).json({ apiMsg: "Wrong" });
        }
        console.log(`the result is:\n `);
        console.log((ecg[0].createdAt).toString())
        res.status(200).json(ecg);
    });
});

const parseSMS = (body) =>{
    let result={type: "", userId: ""};
    const parsedBody = body.split("/");
    result.userId = parsedBody[0];
    result.type = parsedBody[1];
    result.number = parsedBody[2];
    console.log(`result: ${result}`)
    return result;
}

// Read ecg through sms
healthRouter.post('/sms', async (req, res) => {
    const twiml = new MessagingResponse();
    const userQuery = parseSMS(req.body.Body);
    const { number } = userQuery;
    const queryNum = parseInt(number, 10);
    if (userQuery.type == 'ecg') {
      let reply = "ECG data:\n";

      console.log('api: read ecg');
      // Read the recent queryNum sample data
      await ecgModel.find({ userId: userQuery.userId }).sort({ createdAt: -1 }).limit(queryNum).exec(function (err, ecg) {
          if (err) {
              console.log(`read ecg error: ${err}`);
          }
          console.log(`the result is:\n ${ecg}`);
          reply = reply + "Monitored at: " + ecg[0].createdAt + "\n";
          reply += "Signal: \n";
          ecg.map((data)=>{
            reply = reply + data.signal + " ";
          });
          
        twiml.message(reply);
        console.log(`reply is :${reply}`);
        res.writeHead(200, { 'Content-Type': 'text/xml' });
        res.end(twiml.toString());
      });

    } else if (userQuery.type == 'emg') {
        let reply = "EMG data:\n";

        console.log('api: read emg');
        // Read the recent queryNum sample data
        await emgModel.find({ userId: userQuery.userId }).sort({ createdAt: -1 }).limit(queryNum).exec(function (err, ecg) {
            if (err) {
                console.log(`read emg error: ${err}`);
            }
            console.log(`the result is:\n ${emg}`);
            reply = reply + "Monitored at: " + emg[0].createdAt + "\n";
            reply += "Signal: \n";
            emg.map((data)=>{
              reply = reply + data.signal + " ";
            });
            
          twiml.message(reply);
          console.log(`reply is :${reply}`);
          res.writeHead(200, { 'Content-Type': 'text/xml' });
          res.end(twiml.toString());
        });
  
    } else {
      twiml.message(
        'No match. Please type <type>/<user id>/<query number> e.g ecg/1/10'
      );
      res.writeHead(200, { 'Content-Type': 'text/xml' });
      res.end(twiml.toString());
    }
  

  });

// Add a ecg data
healthRouter.post('/add/ecg', async (req, res, next) => {
    console.log('api: add ecg');
    // add a new ecg
    const ecgData = req.body.data;
    console.log(req.body)
    console.log(`Data: ${ecgData}`)

    const newECG = new ecgModel(ecgData);
    await newECG.save((err) => {
        if (err) {
            console.log(`New ECG saved  error: ${err}`);
            res.status(200).json("save error");
        }
        else {
            console.log('New ecgInstance saved successfully');
            res.status(200).json({ apiMsg: apiMsg.ecgSaveSuccessfully });
        }
    });
}
);

// Read emg
healthRouter.get('/read/emg', async (req, res, next) => {
    console.log('api: read emg');
    const { userId } = req.query;
    // Read the recent 10 sample data
    await emgModel.find({ userId: userId }).sort({ createdAt: -1 }).limit(5).exec(function (err, emg) {
        if (err) {
            console.log(`read emg error: ${err}`);
            res.status(200).json({ apiMsg: "Wrong" });
        }
        console.log(`the result is:\n ${emg}`);
        res.status(200).json(emg);
    });
});


// Add a emg data
healthRouter.post('/add/emg', async (req, res, next) => {
    console.log('api: add emg');
    // add a new emg
    const emgData = req.body.data;
    console.log(req.body)
    console.log(`Data: ${emgData}`)

    const newEMG = new emgModel(emgData);
    await newEMG.save((err) => {
        if (err) {
            console.log(`New EMG saved  error: ${err}`);
            res.status(200).json("save error");
        }
        else {
            console.log('New ecgInstance saved successfully');
            res.status(200).json({ apiMsg: apiMsg.emgSaveSuccessfully });
        }
    });
}
);



module.exports = {
    healthRouter
};
