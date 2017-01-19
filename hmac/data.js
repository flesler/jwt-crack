const crypto = require('crypto');

exports.payload = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiIiLCJpYXQiOm51bGwsImV4cCI6bnVsbCwiYXVkIjoiIiwic3ViIjoiYXJpZWwifQ';
exports.secret = 'abcdef';
exports.hmac = crypto.createHmac('sha256', exports.secret).update(exports.payload).digest('base64');
