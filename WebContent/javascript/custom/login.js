'use strict';
angular.module("dbExpApp.login", [])
.controller('LogInFormController', ['$scope', '$window','server','dbCookies','base_address',
    function ($scope, $window, server, dbCookies, base_address) {  
        
    $scope.User = class {

        static init() {

            var preferences = dbCookies.get("DbUserPreferences");
            if (!preferences) {
                preferences = {
                    "framework": "JDBC",
                    "useSpring": false,
                    "dbName": "mydb",
                    "hostAddress": "localhost",
                    "portNumber": 3306,
                    "databaseUrl": "jdbc:mysql://localhost:3306/mydb",
                    "pool": "Join",
                    "maxTotal": "15",
                    "maxIdle": "5",            
                    "maxWait": "5",
                    "save": false,
                };
            } 
            $scope.user = new $scope.User(preferences);
        }
        
        constructor(preferences) {    
            this._user = { name: "", 
                           password: "", 
                           dbVendor: dbCookies.get("DbVendor") || "MySQL", 
                           rememberMe: false 
                         };
            this._preferences = preferences;       
            this._settings = false;          
            this._status = { pending: false,
                             error: false, 
                             success: false,
                             message: "" 
                           };
            this.dbVendor = this._user.dbVendor;
        } 

        get vendors() {
            return ['MySQL', 'Oracle', ['8i', '9', '9i', '10g', '11g', '12g'], 'PostgreSQL'];
        } 
        get dbVendor() {
            return this._user.dbVendor;
        }
        get url() {
            return this._preferences.databaseUrl;
        }
        get get() {
            return {                        
                'rememberMe': this._user.rememberMe,
                'settings': this._settings,
                'framework': this._preferences.framework,
                'hostAddress': this._preferences.hostAddress,
                'dbName': this._preferences.dbName,
                'portNumber': this._preferences.portNumber,
                'maxTotal': this._preferences.maxTotal,
                'maxIdle': this._preferences.maxIdle,
                'maxWait': this._preferences.maxWait,
                'spring': this._preferences.useSpring,
                'pool': this._preferences.pool,
                'save': this._preferences.save,
                'status': this._status,                
                'hibernate': this._preferences.framework === 'Hibernate',
                'jdbc': this._preferences.framework === 'JDBC',
                'new': this._preferences.pool === 'New',
                'private': this._preferences.pool === 'Private',
                'join': this._preferences.pool === 'Join',
                'validPort': this.isPortValid(),
                'validUrl': this.isUrlValid(),
            };
        };      
        set settings(settings) {
            this._settings = !this._settings;
        }
        set dbVendor(vendor) {
            if (vendor === 'MySQL') {
                this._user.dbVendor = vendor;
                this._preferences.dbName = "mydb";
                this._preferences.portNumber = 3306;
            }else if (vendor === 'PostgreSQL') {
                this._user.dbVendor = vendor;
                this._preferences.dbName = "postgres";
                this._preferences.portNumber = 5432;
            } else {
                this._user.dbVendor = vendor.indexOf('Oracle') === -1 ? 
                                      ('Oracle ' + vendor): vendor;
                this._preferences.dbName = "xe";
                this._preferences.portNumber = 1521;
            }
            this.getUrl();
        }
        set url(url) {
            this._preferences.databaseUrl = url;
        } 
        setData(g, key, value) {
            if (g === "user") {
                this._user[key] = value ? value : !this._user[key];
            } else {
                this._preferences[key] = value ? value : !this._preferences[key];
                this.getUrl();
            }
        }            
        cancel() {
            this._settings = false;
        }
        getValue() {
            this._status.error = false;
        }
        save() {
            if (this._preferences.save) {
                dbCookies.save("DbUserPreferences", this._preferences);
                dbCookies.save("DbVendor", this._user.dbVendor);
            } else {
                dbCookies.delete("DbUserPreferences");
            }
            this._settings = false;
        } 
        login (userData) { 
            if (!userData) {
                var userData = { user: this._user, preferences: this._preferences };
            }
            localStorage.userData = JSON.stringify(userData);
            this._status.pending = true;
            var that = this;  
            server.postRequest(base_address + "DbExplorer/connect.dbexp", userData)
            .then(function(response) {
                that._status.pending = false;
                that._status.success = true; 
                if(that._user.rememberMe){
                    dbCookies.save("DbUser",userData);
                }
                $window.location.href = base_address + "DbExplorer/explorer.dbexp";
            }, function(response) {
                that._status.pending = false;
                that._status.error = true;
                that._status.message = response;
            });    
        }
        getUrl() {            
            var db = this._user.dbVendor;
            var p = this._preferences;
            var prefix = (db === 'MySQL') ? 'jdbc:mysql://': 
                         ((db === 'PostgreSQL') ? 'jdbc:postgresql://': 'jdbc:oracle:thin:@');            
            p.databaseUrl = prefix + p.hostAddress + ':' + p.portNumber + "/" + p.dbName;
        }
        isPortValid() {
            var exp = /^[1-5]?(\d){1,4}$|^6[0-4](\d){3}$|^65[0-4](\d){2}$|^655[0-2](\d){1}$|^6553[0-5]$/;
            return exp.test(this._preferences.portNumber);
        }
        isUrlValid() {
            var exp = new RegExp("^jdbc:(mysql://|postgresql://|oracle:thin:@)(\\w)+:" + 
                                 "(([1-5]?(\\d){1,4})|(6[0-4](\\d){3})|(65[0-4](\\d){2})|(655[0-2](\\d){1})" +
                                 "|(6553[0-5])){1}/(\\w)+$", "i");
            return exp.test(this._preferences.databaseUrl);
        }  
    };
    $scope.User.init();
}]);