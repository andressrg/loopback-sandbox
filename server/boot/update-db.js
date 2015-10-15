
module.exports = function(app) {
  const mysqlDs = app.dataSources.mysqlDs;


  if (mysqlDs.connected) {
    autoupdate();
  } else {
    mysqlDs.once('connected', function() {
      autoupdate();
    });
  }


  function autoupdate() {
    mysqlDs.autoupdate(function(err) {
      if (err) {
        console.log('Error in autoupdate', err);
        throw err;
      }
    });
  }

};
