# AJAX & jQuery Tutorial

### Description:
This is a client-server To-Do App - SPA (Single Page Application) made using AJAX functionality and jQuery. Forked from [nax3t/ajax-jquery-tutorial](https://github.com/nax3t/ajax-jquery-tutorial) and refactored to SPA.

### Information
**Details:** Users can add, edit, and delete todos, all on one page. Initial request to root route `app.get('/', function(req,res){...});` is a simple HTTP request, while all other requests (GET, POST, PUT, DELETE) are AJAX requests (XHR). The code is refactored and separated into two mini-apps - client (containing view `index.html` and `ajax.js` file for sending requests) and server (containing `app.js` file for handling requests). The app is started by first starting the server, and then the client.

**Tools and technologies used:** Node.js, Express.js, MongoDB, jQuery, AJAX.



# Original README:
# Setup Instructions

- Paste the following into your terminal - `git clone git@github.com:nax3t/ajax-jquery-tutorial.git`
    - If that gives you an error then you need to [setup SSH](https://help.github.com/articles/adding-a-new-ssh-key-to-your-github-account/) or use the HTTPS link instead: `git clone https://github.com/nax3t/ajax-jquery-tutorial.git` *(this requires use of your github credentials, the password will be hidden while typing)*
- Now `cd` into `ajax-jquery-tutorial` and run `npm install`
- Start your mongo daemon `mongod` in a separate terminal tab
- Install `nodemon` globally (if you don't already have it installed) with `npm i -g nodemon`
- Run your application in its own terminal tab with `nodemon`
- Navigate to `localhost:3000` in your browser

*Note: If you're working from c9 then see below:
- Change the following lines at the bottom of app.js:

```JS
app.listen(process.env.PORT, process.env.IP, function(){
    console.log("The server has started!");
});
```

- Now run your server with `node app.js` or `nodemon` and view the app from the Preview tab in your workspace
