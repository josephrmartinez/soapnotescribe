export default async function handler(req, res) {
    console.log("incoming webhook!", req.body.id);
    const prediction = req.body;
    console.log("prediction:", prediction)
    // await saveToMyDatabase(prediction);
    // await sendSlackNotification(prediction);
    return res.end(JSON.stringify(req.body));
  }