'use strict';

var AWS = require('aws-sdk');

AWS.config.loadFromPath('../auth/aws.json');

var sns = new AWS.SNS({params: {TopicArn: 'arn:aws:sns:us-east-1:568712587495:chore'}});

sns.publish({Message: 'Test'}, function(err, data) {
  if (err) console.log(err, err.stack); // an error occurred
  else     console.log(data);           // successful response
});
