This is a nodejs /mongodb API project done in Nov 2022 that can be used to start a API project.
It has basic authentication and some basic boiler plate to access mongodb.
As an example, it has ONE endpoint that does a currency conversion calling some API in the internet. 


To run and test this project 

1. Make sure you have node and npm and you are connect to internet 
2. node v14.15.1 or UP   npm  8.18.0 or UP
3. npm install
4. npm start

5. API will be working at http://localhost:3000/api/v1/exchanges/convert?from=EUR&to=USD&amount=1  

    it will fail T THIS due to security reasons
    {"status":"fail","error":{"statusCode":401,"status":"fail","isOperational":true},"message":"You are not logged in! Please log in to get access.","stack":"Error: You are not logged in! Please log in to get access.

6. node quick_end2end_test.js    //test shows how to create user and use token


IF TEST GOES WELL YOU WILL SEE SOMETHING LIKE THIS.....

CALLING URL: http://localhost:3000/api/v1/exchanges/convert?from=EUR&to=USD&amount=1 WITH TOKEN
RESPONSE FROM SERVER IS CORRECT 200. USER NOT LOGGED IN
{
  status: 'success',
  data: {
    amount: '1.053117832031918',
    currency: 'USD',
    ratesTimestamp: '2022-12-04T20:27:43.000Z',
    ratesAge: 17684
  }
}
   


