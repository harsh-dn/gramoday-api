# gramoday-api
An app to constantly check the price of crops in a market.

## System Requirements
Node Js, MongoDB command line, nodemon for continous server update

## Instructions to set up the project locally

Clone the repo `git clone https://github.com/harsh-dn/gramoday-api.git`

`cd` into the main folder directory

Install all the dependencies using `npm install`

run `node app.js` to start the server

visit `http://localhost:3000/` to view the application locally

**Congratulations!** You have successfully set up the project, test and see it live working

## Application Working
### 1) POST route
Fill the required fields which follow the standard request template provided

On submission, you should see a success message and report Id in JSON format

For the first time report of a particular crop in a particular market, you should see the scucces message of addition of new report to the database

On subsequent report submission about the same crop in same market, number of users reporting the same will also be added to the `userID` array. Also, the price will keep on updating as the recent mean of the prices and should see a message that the prices have been updated

### 2) GET route
Fill the Id of the report whose detail you want to search in the database in the form provided

Since the marketID and commodityID are bounded, you can even search the same report with these data too on the same page

On submission of the form, you should see the complete, recent and updated details of the report in JSON format with prices updated as the mean 

### 3) Fetch all the reports in the database
Visit `http://localhost:3000/reports` to see at once all the reports available in the database

### 4) Fetch single report using Id only
Visit `http://localhost:3000/reports/:reportID` to see the particular report with this Id available in the database. For e.g `http://localhost:3000/reports/607eebb2978879031041a3b9`
