/*
This is a quick health test to check the servrer is up and running and has some basic functionality working.
The tesr assumes a running server at SERVER_URL.
First it will try to get rates without being logged in and will fail due to security reasons.

*/
const { curly } = require('node-libcurl');
const querystring = require('querystring');
const SERVER_URL = 'http://localhost:3000';
const GET_CURRENCY_CONVERTION_URL = SERVER_URL + '/api/v1/exchanges/convert?from=EUR&to=USD&amount=1';
const POST_USER_URL = SERVER_URL + '/api/v1/users/signup';
let JWT_TOKEN;

async function run(){
console.log("QUICK END2END TEST STARTED");
try{
    // 1 TRY CALLING COMNVERTION API WITHOUT TOKEN SHOULD FAIL
    console.log('CALLING CONVERT API WITHOUT TOKEN SHOULD FAIL WITH 401');
    console.log('CALLING URL: ' + GET_CURRENCY_CONVERTION_URL + ' WITHOUT TOKEN' );
    let result  = await curly.get( GET_CURRENCY_CONVERTION_URL);
    if (result.statusCode == 401){
        console.log("RESPONSE FROM SERVER IS CORRECT 401. USER NOT LOGGED IN");
    } else {
        console.log('TEST FAILED. URL CAN BE ACCESSED WITHOUT TOKEN');
        process.exit();
    }

    // 2 ADD A NEW USER TO BE AUTHEMNTICATED
    console.log('WE SHOULD BE ABLE TO SINGUP A NEW USER');
    console.log('CALLING URL: ' + POST_USER_URL );
    const uniqueName = 'user' + (new Date()).getTime();

    result  = await curly.post(POST_USER_URL,
        {    postFields: JSON.stringify(
            {
                "name": uniqueName,
                "email" : uniqueName + "@gmail.com",
                "password":"pass1234",
                "passwordConfirm":"pass1234"  }),
            httpHeader: [
                'Content-Type: application/json',
                'Accept: application/json'
                ],

        } );
    if (result.statusCode == 201){
        JWT_TOKEN = result.data.token;
        console.log("RESPONSE FROM SERVER IS CORRECT (201) USER GOT SIGNED UP");
        console.log("USER CREATED: ");
        console.log(
            {"name": uniqueName,
            "email" : uniqueName + "@gmail.com",
            "password":"pass1234",
            "passwordConfirm":"pass1234",
            "JWT_TOKEN":JWT_TOKEN}
        );
    } else {
        console.log('USER CREATION STATUS CODE NOT 201, TEST FAILED');
        console.log(result);
        process.exit();
    }


     // 3  USE THE EXISTING TOKEN TO CALL RTHE# CONVERTION API
    console.log('CALLING CONVERT API WITH VALID TOKEN SHOULD RERURN  RESULT');
    console.log('CALLING URL: ' + GET_CURRENCY_CONVERTION_URL + ' WITH TOKEN' );
    result  = await curly.get( GET_CURRENCY_CONVERTION_URL , {
        httpHeader: [
            'Content-Type: application/json',
            'Accept: application/json',
            'Authorization: Bearer ' + JWT_TOKEN
          ]
        }
      );
    if (result.statusCode == 200){
        console.log("RESPONSE FROM SERVER IS CORRECT 200");
        console.log( result.data);
        console.log("========");
        console.log(" YES, ALL GOOD!");
        console.log("========");
    } else {
        console.log('TEST FAILED. URL CAN BE ACCESSED WITHOUT TOKEN');
        process.exit();
    }

} catch(e){
    console.log('TEST FAILED');
    console.log(e);
}

}

run();


