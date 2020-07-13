const newman = require('newman');
const get = require('simple-get');
const fs = require('fs-extra');

runSmokeTest("chipmunk");
runSmokeTest("lion");


function runSmokeTest(instance){

  let env= fs.readFileSync('tests/'+instance+'.postman_environment.json', { encoding: 'utf8' }, (err, data) => {
    if (err) throw err;
    console.log(data);
  });

  // call newman.run to pass `options` object and wait for callback
  newman.run({
    collection: require('../tests/monitor.postman_collection.json'),
    reporters: 'cli',
    insecure: true,
    environment: JSON.parse(env)
  }).on('start', function (err, args) { // on start of run, log to console
    console.log('running a collection...');
  }).on('done', function (err, summary) {
    if (err || summary.error) {
      console.error('collection run encountered an error.');
    } else {
      const opts = {
        url: 'https://kgrid-dashboard.herokuapp.com/widgets/' + instance,
        body: '{ "auth_token": "kgridiscool", "message": "Happy Happy", "type": "happy"}'
      }
      get.post(opts, function (err, res) {
        if (err) throw err
        res.pipe(process.stdout) // `res` is a stream
      });

      console.log('collection run completed.');
    }

    const message = {
      attachments: [
        {
          title: "Smoke Test " + instance.toUpperCase(),
          color: summary.run.failures.length > 0 ? "danger" : "good",
          text: summary.run.failures.length > 0 ? "HOUSTON WE HAVE A PROBLEM"
              : "Happy Happy Joy Joy all is good"
        }
      ]
    };

    const opts = {
      url: process.env.SLACK_WEBHOOK,
      body: JSON.stringify(message),
      headers: {
        'Content-type': 'application/json'
      }
    }

    if (summary.run.failures.length > 0) {

      get.post(opts, function (err, res) {
        if (err) throw err
        res.pipe(process.stdout) // `res` is a stream
      });

    } else {
      console.log(message.attachments.title + ":"+ message.attachments.text);
    }

  });
}
