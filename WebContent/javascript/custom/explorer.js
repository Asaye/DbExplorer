'use strict';

angular.module("dbExpApp.explorer", [])
.controller('ExpController', ['$scope', '$state', '$stateParams', '$window', '$q', '$interval', '$timeout',
            'server', 'dbCookies', 'typeCast', 'base_address',
    function ($scope, $state, $stateParams, $window, $q, $interval, $timeout, server, dbCookies,
              typeCast, base_address) {
      
    $scope.Explorer = class {
        static logout() {
            dbCookies.delete("DbUser");
            server.disconnect();
            $window.location.href = base_address + "DbExplorer/logout.dbexp"; 
        }       
        constructor () {
            this._display = true;
        }
        get display() {
            return this._display;
        }
        open() {
            this._display = true;
        }
        close() {
            this._display = false;
        }    
    };

    $scope.Board = class extends $scope.Explorer {
        constructor() {
            super();
            this._buttons = {db: true, tab: true, col: true};
        }
        get buttons() {
            return this._buttons;
        }
        set buttons(val) {
            this._buttons = val;
        }
        get title() {
            return "Account";
        }
        get options() {
            return ["Settings", "Windows", "Logout"];
        }
        get restore() {
            var list = $scope.list.display, board = this.display;
            return !list || !board;
        }
        set title(val) {
            if (val === 'Settings') {

            } else if (val === 'Windows') {
                this.open();
                $scope.tables.open();
                $scope.list.open();
                this._buttons = {db: true, tab: true, col: true};
            } else if (val === 'Logout') {
                 $scope.Explorer.logout();   
            }
        }
        resize() {
            $scope.$broadcast("windowResized");
        }
        maximize() {
            var list = $scope.list.display, board = this.display;
            if (list) {
                $scope.list.close();
            } else if (!list || !board) {
                this.title = 'Windows';
                $scope.$broadcast("windowResized");
            }
        }
    };
    
    $scope.List = class extends $scope.Explorer {
        constructor() {
            super();
        }
    };
    $scope.Tables = class extends $scope.Explorer {
        constructor() {
            super();
        }
    };
    $scope.NewTable = class {
        constructor(status) {
            this._display = true;
            this._name = "";
            this._id = "";
            this._columns = [""];
            this._types = ["Text"];
            this._status = status;
            this._invalid = {name: false, cols: false, any: false};
        }
        get display() {
           return this._display;
        }
        set display(val) {
            this._display = val;
        }
        get options() {
            return ["Boolean", "Date", "Float", "Integer", "Text"];
        }
        get name() {
            return this._name;
        }
        set name(name) {
            this._name = name;
        }
        get id() {
            return this._id;
        }
        set id(id) {
            this._id = id;
        }
        get columns() {
            return this._columns;
        }
        get types() {
            return this._types;
        } 
        get invalid() {            
            return this._invalid;
        }       
        insert(index) {
            this._columns.splice(index, 0, "");
            this._types.splice(index, 0, "Text");
            $scope.$broadcast("pageSizeChange", {index: '-1', scrollDown: true});
        }        
        add() {
            this._columns.push("");
            this._types.push("Text");
            $scope.$broadcast("pageSizeChange", {index: '-1', scrollDown: true});
        }
        delete(index) { 
            if (this._columns.length === 1) {
                return;
            }
            this._columns.splice(index, 1);
            this._types.splice(index, 1);  
            $scope.$broadcast("pageSizeChange", {index: '-1', scrollDown: true});
        }         
        submit() {
            this._invalid.name = !this._name;
            this._invalid.cols = (this._columns.indexOf("") !== -1);
            this._invalid.any = this._invalid.name || this._invalid.cols;
            if (!this.invalid.any) {
                var success = "Table '" + this._name + "' is created successfully.",
                    that = this, def = $q.defer(), i = 0, sql = "CREATE TABLE " + 
                           this._name + " ( ";
                this._status.message[0] = success;
                for (var col of this._columns) {
                    sql = sql + " " + col + " " + this._types[i++];
                    if (i < this._columns.length) {
                        sql = sql + " , ";
                    }
                }
                if (this._id && this._columns.indexOf(this._id.trim()) !== -1) {
                    sql = sql + ", PRIMARY KEY (" + this._id + ")";
                }
                sql = sql + ");";
                var data = {action:'update', deferred: def, status: this._status,
                    url: base_address + 'DbExplorer/modify.dbexp', 
                    data : {type: 'update', sql: sql, name: this._name}};
                new $scope.Server(data);
                def.promise.then(function(response) {
                    that._display = false;
                    $scope.TableNames.init();
                });
            } 
        }      
    };

    $scope.Operations = class {
        constructor() {
            this._criteria = "";
            this._display = false;
            this._isArray = false;
            this._result = undefined;
            this._status = undefined;
            this._url = base_address + 'DbExplorer/modify.dbexp';
        }
        get message() {
            return this._status ? (this._status.pending ? " connecting to database ... " : 
                   (this._status.success ? this._status.message[0] : 
                    this._status.message[1])) : ""; 
        }
        get status() {
            return this._status;
        }
        set status(val) {
            this._status = val;
        }
        get result() {
            return this._result;
        }
        get display() {
            return this._display;
        }
        get isArray() {
            return this._isArray;
        }
        set criteria(val) {
            this._criteria = val;
        }
        hide() {
            this._display = false;
        }
    };
    
    $scope.TableOp = class extends $scope.Operations { 
        constructor(name) {
            super();
            this._name = name;
            this._hovered = [];
            this._selected = [];
            this._opened = [];
            this._newtable = undefined;
            this._alert = null;
        }
        get newtable() {
            return this._newtable;
        }    
        get alert() {   
            return this._alert;
        }
        get hovered() {
            return this._hovered;
        }  
        get selected() {
            return this._selected;
        } 
        get opened() {
            if (this._opened.length === 0) {
                $stateParams.table = null;
            }
            return this._opened;
        }  
        get options() {
            return this._newtable ? this._newtable.options : [];
        }
        get types() {
            return this._newtable ? this._newtable.types : [];
        }
        getSql(name) {
            var data = {};

            data["name"] = name;
            data["sql"] = "Select * from " + name;
            data["sql_id"] = "SELECT a.attname, format_type(a.atttypid, a.atttypmod) " + 
                       "AS data_type FROM   pg_index i " +
                       "JOIN pg_attribute a ON a.attrelid = i.indrelid " +
                       "AND a.attnum = ANY(i.indkey) " +
                       "WHERE  i.indrelid = '" + name + "'::regclass " +
                       "AND i.indisprimary;";

            return angular.copy(data);
        }
        create() {
            this._status = new $scope.Status(["", ""]);
            this._newtable = new $scope.NewTable(this._status);
        }
        open(name) {
            var sql = [];
            if (name) {
                sql.push(this.getSql(name));
            } else {
                var names = angular.copy(this._selected);
                for (var name of names) {
                    sql.push(this.getSql(name));
                }
            }   
            var that = this, def = $q.defer(), url = base_address + 'DbExplorer/getTableData.dbexp',
                data = {action:'add', deferred: def, url: url, data : { sql: sql },
                        destination: { object: $scope.table.data, types:{}, id: "", 
                                       title: "", columns: [], content: [] } };
            new $scope.Server(data);
            def.promise.then(function(response) {
                angular.forEach(response.result, function(item) {
                    that._opened.push(item.title);
                    that._selected.delete(item.title);
                });
                that._hovered = [];
            });
        }
        close(name) {
            if (name) {
                this._opened.delete(name);
                var that = this, index, 
                    table = $scope.table.data.filter(function(item) {
                        return item.get.title === name;
                    });
                index = $scope.table.data.indexOf(table[0]);
                $scope.table.data.delete(table[0]);
                $scope.Table.active = Math.max(0, index - 1);
                return;
            } 
            var that = this, deferred = $q.defer(), 
                alertMsg = "Are you sure you want to close all tables? ";
            this._alert = new $scope.Alert('danger', alertMsg, deferred);
            deferred.promise.then(function() {
                $scope.table.data = [];
                that._opened = [];
                that._hovered = [];
            }); 
        }
        delete(name) {
            var that = this, names = name ? name : this._selected, success,
                isString = (typeof names === 'string'), deferred = $q.defer(),
                all_names =  isString ? names : names.join(),
                text = (isString || names.length === 1) ? "Table" : "Tables",  
                alertMsg = "Are you sure you want to delete " + text.toLowerCase() +
                            " '" + all_names + "' ? ";
            this._alert = new $scope.Alert('danger', alertMsg, deferred);
            deferred.promise.then(function() {
                if (typeof names === 'string') {
                    that.deleteTable(names);
                } else {
                    for (var name of names) {
                        that.deleteTable(name)
                    }
                }
            });
        }
        deleteTable(name) {
            var that = this, def = $q.defer(), sql = "DROP TABLE " + name + " ;", 
                success = "Table '" + name + "' is deleted successfully.";
            this.send(def, sql, name, success);

            def.promise.then(function(response) {
                $scope.TableNames.init();
                that._hovered = [];
                that._selected = [];
            });
        }
        copy(data) {
            var src, dest, on, where, text, selected, cols, alertMsg,sql, success,
                that = this, deferred = $q.defer(), def, table = $stateParams.table;
            src = data.src ? data.src : (this._hovered[1] ? this._hovered[1] 
                                      : (table ? table.get.title: ""));
            dest = data.dest ? data.dest : this._hovered[0];
            on = data && data.on ? " ON " + data.on : " ";
            where = data && data.where ? " WHERE " + data.where : " ";
            selected = table ? table.get.selected : [];
            cols = selected.length > 0 ? selected.join() : "*";
            alertMsg = "Are you sure you want to copy contents of '" + 
                           src +  "." + cols + "' to '" + dest + "'? ";
            this._alert = new $scope.Alert('danger', alertMsg, deferred);
            deferred.promise.then(function() {
                sql = "INSERT INTO " + dest + " SELECT " + cols + " FROM " + 
                      src + on + where + ";", def = $q.defer(),
                success = "Contents of '" + src + "'' are successfully copied to '" + 
                          dest + "'.";
                that.send(def, sql, dest, success);
                that._hovered = [];
            }); 
        }
        inner(data) {
            this.join("Inner join", data);
        }
        full(data) {
            this.join("Full join", data);
        }
        left(data) {
            this.join("Left join", data);
        }
        right(data) {
            this.join("Right join", data);
        }
        join(type, data) {
            var params = $stateParams, table = params.table, def = $q.defer(),
                src, dest, on, where, success, selected, sql, cols, that = this;
            src = data.src ? data.src : this._hovered[1];
            dest = data.dest ? data.dest : this._hovered[0];
            on = data ? data.on : false;
            where = data ? data.where : false;
            selected = table ? table.get.selected : []; 
            cols =  selected.length > 0 ? selected.join() : "*";
            sql = "SELECT " + cols + " FROM " + src + " " + type + " " + dest;
            success = type + "s of '" + src + "' and '" + dest;
            if (on) {
                sql = sql  + " ON " + on + " ";
                success =  success + " on " + on;
            } 
            if (where) {
                sql = sql + " WHERE " + where;
                success =  success + " where " + where;
            }  
            sql = sql + ";";
            success = success + " are selected successfully.";
            this._isArray = true;
            this._display = false;
            this.send(def, sql, dest, success, 'query');
            def.promise.then(function(response) {
                var result = response.result;
                that._display = true;
                that._result = [];
                var cols = result.columns, keys = Object.keys(cols)
                for (var key of keys) {
                    cols[key].unshift(key);
                    that._result.push(cols[key]);
                }
                that._hovered = [];
            });
        }
        send(def, sql, name, success, type) {
            this._status = new $scope.Status([success, ""]);
            var data = {action: type || 'update', deferred: def, 
                        status: this._status, url: this._url, 
                        data : {type: type || 'update', sql: sql, name: name}};
            new $scope.Server(data);
        } 
    };

    $scope.TableNames = class {
        static init() {
            $timeout(function() {
                $scope.table.names = [];
                $scope.tableOp.status = new $scope.Status(["Ready.", ""]);
                var url = base_address + "DbExplorer/exploreTables.dbexp",
                data = {action:'names', method: 'GET', url: url, 
                        status: $scope.tableOp.status,
                        destination: { object: $scope.table.names } 
                       };
                new $scope.Server(data);
            }, 500);
        }
        constructor(name) {
            this._name = name;
            this._selected = null;
            this._isHovered = false;
            this._popup = { display: false };
            this._ops = $scope.tableOp;
        }
        get name() {
            return this._name;
        }
        get hovered() {
            if (!this._ops) {
                return false;
            }
            return this._ops.hovered.indexOf(this._name) !== -1;
        }
        get popup() {
            return this._popup.display;
        }
        set popup(val) {
            this._popup.display = val;
        }
        select(e) {
            if (!e) {
                return;
            }
            e.stopPropagation();
            if (e && e.originalEvent.shiftKey && this._ops.hovered.length < 2) {
                this._ops.hovered.check(this._name);
                this._isHovered = this._ops.hovered.indexOf(this._name) !== -1;
            } else if (e && !e.originalEvent.shiftKey) {
                this._ops.hovered.delete(this._name);
                this._isHovered = false;
            }
            this._ops.selected.check(this._name);
        }
        isOpen() {
            return this._ops.opened.indexOf(this._name) !== -1;
        }
        isSelected() {
            return this._ops.selected.indexOf(this._name) !== -1;
        }
    };
    $scope.ColumnOp = class extends $scope.Operations {        
        constructor(table) {
            super();
            this._table = table;
            this._column = "";
            this._colName = "";
            this._type = "";
            this._nrows = "";
            this._orderBy = "";
            this._groupBy = "";
            this._message = "";
            this._data = {type: "query", sql: "", table: this._table};            
            this._alert = undefined;
        }
        
        get table() {
            return this._table;
        }       
        get alert() {
            return this._alert;
        }
        get result() {
            return this._result;
        }
        set column(val) {
            this._column = val;
        }
        set orderBy(val) {
            this._orderBy = val;
        }
        set groupBy(val) {
            this._groupBy = val;
        }
        insert(sql) {
            var success = "One row is inserted into '" + this._table + "' successfully.";
            this.row(sql, success);
        }
        delete(sql) {
            var success = "One row is deleted from '" + this._table + "' successfully.";
            this.row(sql, success);
        }
        update(sql) {
            var success = "One row in '" + this._table + "' is updated successfully.";
            this.row(sql, success);
        }
        row(sql, msg) {
            this._data.sql = sql;
            this._data.type = "update";
            this._status = new $scope.Status([msg, ""]);
            this.send({table:this._table, status: this._status}); 
        }
        swap(data) {
            if (!data) {
                return;
            }
            var col1 = data.selected[0], col2 = data.selected[1], table = data.table,
                success = "Columns '" + table + "." + col1 + "' and '" + table + "." + 
                           col2 + "' are swapped successfully."; 
            this._data.sql = "UPDATE " + table + " AS A SET " + col1 + " = B." + 
                             col2 + " , " + col2 + " = B." + col1 + " from " + table +
                             " AS B WHERE A." + col2 + " = B." + col2 + ";" ;
            this._data.type = "update";
            this._status = new $scope.Status([success, ""]);
            this.send({table:this._table, status: this._status}); 
        }
        add(data) {
            if (!data) {
                return;
            }
            var col= data.colName, table = data.table,
                success = "Column '" + table + "." + col + "' is added successfully.";
            this._data.sql = "ALTER TABLE " + table + " ADD COLUMN " + col + 
                             " " + data.type + " ;";
            this._data.type = "update";            
            this._status = new $scope.Status([success, ""]);
            this.send({table:this._table, status: this._status});
        }
        drop(data) {
            if (!data) {
                return;
            }
            var columns = data.selected, table = data.table, success,
                deferred = $q.defer(), that = this,
                alertMsg = "Are you sure you want to delete '" + table + "." + columns.join() + "' ? ";
            this._alert = new $scope.Alert('danger', alertMsg, deferred);
            deferred.promise.then(function(){
                that._data.type = "update";
                var counter = 0;
                for (var col of columns) {
                    $timeout(function() {
                        success = "Column '" + table + "." + col + "' is deleted successfully.";
                        that._status = new $scope.Status([success, ""]);
                        that._data.sql = "ALTER TABLE " + table + " DROP COLUMN " + columns[counter++] + " ;";
                        that.send({table:table, status: that._status});
                    }, 100);
                }
            });
        }        
        select(data) {            
            var cols = data.selected.join(), table = data.table,
                text = data.selected.length > 1 ? ["Columns", "are"] : ["Column", "is"],
                sql = "SELECT " + cols + " FROM " + table + " ",
                success = text[0] + " '" + table + "." + cols + "' " + text[1] + 
                          " selected successfully.";
            this._isArray = true;
            this._status = new $scope.Status([success, ""]);
            this.addOptions(sql, data);
            this.send({status: this._status});
        }
        count(data) {
            var shifted = data.selected.shift(), table = data.table,
                sql = "SELECT COUNT (" + shifted + ") " + data.selected.join() + 
                      " FROM " + data.table + " ",
                success = " The number of data in column '" + table + "." + shifted +
                          "' is determined successfully."; 
            this._isArray = false; 
            this._status = new $scope.Status([success, ""]);
            this._message = "The number of data in column '" + table + "." + shifted + "'";
            this.addOptions(sql, data);
            this.send({message: this._message, status: this._status});
        } 
        average(data) { 
            var shifted = data.selected.shift(), table = data.table,
                sql = "SELECT AVG (" + shifted + ") " + data.selected.join() + 
                      " FROM " + data.table + " ",
                success = " The average of data in column '" + table + "." + shifted + 
                          "' is determined successfully.";
            this._isArray = false; 
            this._status = new $scope.Status([success, ""]);
            this._message = "The average of data in column '" + table + "." + shifted + "'";
            this.addOptions(sql, data);
            this.send({message: this._message, status: this._status});
        } 
        sum(data) {         
            var shifted = data.selected.shift(), table = data.table,
                sql = "SELECT SUM (" + shifted + ") " + data.selected.join() + 
                      " FROM " + data.table + " ",
                success = " The sum of data in column '" + table + "." + shifted +
                          "' is determined successfully.";
            this._isArray = false;
            this._status = new $scope.Status([success, ""]);
            this._message = "The sum of  data in column '" + table + "." + shifted + "'";
            this.addOptions(sql, data);
            this.send({message: this._message, status: this._status});
        } 
        max(data) {         
            var shifted = data.selected.shift(), table = data.table,
                sql = "SELECT MAX (" + shifted + ") " + data.selected.join() + 
                      " FROM " + data.table + " ",
                success = " The maximum value in column '" + table + "." + shifted +
                          "' is determined successfully.";
            this._isArray = false;
            this._status = new $scope.Status([success, ""]);
            this._message = "The maximum value in column '" + table + "." + shifted + "'";
            this.addOptions(sql, data);
            this.send({message: this._message, status: this._status});
        } 
        min(data) {         
            var shifted = data.selected.shift(), table = data.table,
                sql = "SELECT MIN (" + shifted + ") " + data.selected.join() + 
                      " FROM " + data.table + " ",
                success = " The minimum value in column '" + table + "." + shifted + 
                          "' is determined successfully.";
            this._isArray = false;
            this._status = new $scope.Status([success, ""]); 
            this._message = "The minimum value in column '" + table + "." + shifted + "'";
            this.addOptions(sql, data);
            this.send({message: this._message, status: this._status});
        }
        send(options) { 
            if (this._data.type === 'update') {
                var table = $stateParams.table;
            } else {
                var deferred = $q.defer(), that = this;
                deferred.promise.then(function(response) {
                    var result = response.result;
                    that._display = (that._data.type === 'query');           
                    if (!that._isArray) {
                       var value = Object.values(result.columns)[0];
                       that._result = that._message + value;
                    } else {
                        that._result = [];
                        var cols = result.columns, keys = Object.keys(cols)
                        for (var key of keys) {
                            cols[key].unshift(key);
                            that._result.push(cols[key]);
                        }
                    }
                    that._data.type = "query";
                });
            }
            new $scope.Server({ data: this._data, type: 'query', action: 'query',
                                status: this._status, url: this._url, 
                                deferred: deferred, table: table });
            
            $stateParams.table.setData("_selected", []);
        }
        addOptions(sql, data) {
            if (data.criteria && data.criteria.length > 0) {
                sql = sql + " WHERE " + data.criteria + " ";
                this._message = this._message + " where '" + data.criteria + "'";
            }
            if (data.groupBy && data.groupBy.length > 0) {
                sql = sql + " GROUP BY " + data.groupBy + " ";
                this._message = this._message + " grouped by '" + data.groupBy + "'";
            } 
            if (data.orderBy && data.orderBy.length > 0) {
                sql = sql + " ORDER BY " + data.orderBy + " ";
                this._message = this._message + " ordered by '" + data.orderBy + "'";
            } 
            this._data.sql = sql + ";";
            this._message = this._message + " is: ";
        } 
    };

    $scope.Alert = class {
        constructor(type, msg, deferred) {
            this._type = type || "";
            this._message = msg || "";
            this._display = arguments.length === 0 ? false : true;
            this._response = "";
            if (this._type === 'danger') {
                this._deferred = deferred;
                this.danger();
            }
        }
        get message() {
            return this._message;
        }
        get display() {
            return this._display;
        }
        get type() {
            return this._type;
        }
        set message(msg) {
            this._message = msg;
        }
        set display(val) {
            this._display = val;
        }
        set type(type) {
            this._type = type;
        }
        set deferred(deferred) {
            this._deferred = deferred;
        }
        set response(val) {
            this._response = val;
        }
        hide() {
            this._display = false;
        }
        danger() {
            this._display = true;
            var that = this,
                timer = $interval(function() {
                    if (that._response === 'Yes') {
                        that._deferred.resolve();
                        that._display = false;
                        $interval.cancel(timer);
                    } else if (!that._display || that._response === 'No') {
                        that._deferred.reject();
                        that._display = false;
                        $interval.cancel(timer);
                    } 
                }, 1000);
        }

    };
    
    $scope.Server = class {
        constructor(data) {
            this._tables = data.tables;
            this._action = data.action || 'query';
            this._url = data.url;
            this._data = data.data;
            this._table = data.table;
            this._status = data.status;
            this._deferred = data.deferred;
            this._destination = data.destination;
            this._method = data.method;
            this._result = null;
            this._display = false;
            this.server();
        } 
        server() {
            if (this._status) {
                this._status.pending = true;
            }
            var that = this, 
                 promise = this._method ? server.getRequest(this._url): 
                                          server.postRequest(this._url, this._data);
            promise.then(function(response) {
                that[that._action](response);
                that.success();
            }, function(response) {
                if (that._deferred) {
                    that._deferred.reject({result: response});
                }
                that.error(response);
            });
        }
        names(response) {
            var names = response.split("</>"), that = this;
            angular.forEach(names, function(item, i) {
                if(item.length !== 0) {
                    that._destination.object.push(new $scope.TableNames(item));
                }
            });
        }
        add(response) {
            if (this._deferred) {
                this._deferred.resolve({result: response});
            }
            var object = this._destination["object"], 
                data, that = this, result;
            angular.forEach(response, function(item) {
                result = that.extract(item);
                data = that.data(result);
                object.push(new $scope.Table(data));
            });
        }
        update(response) {
            if (this._deferred) {
                this._deferred.resolve({result: response});
            }
            if (this._destination) {
                var params = Object.keys(this._destination),
                object = this._destination["object"],
                data = this.data(this.extract(response));
                for (var param of params) {
                    object.setData("_" + param, data[param]);
                }
            }
        }    
        query(response) {
            if (this._deferred) {
                this._deferred.resolve({result: this.extract(response)});
            }
            if (this._data.type === 'update') {
                this._data.type = 'query';
                this._data.sql = "Select * from " + this._table.get.title;
                this._destination = { object: this._table, columns: [], 
                                      types: {}, content: [] };
                this._action = 'update';
                this.server();
            } 
        }
        extract(response) {
            var data = response, result = {}, keys = Object.keys(data),
                title = keys;
            data = keys.indexOf("types") !== -1 ? data : data[keys];
            keys = Object.keys(data);
            for (var key of keys) {
                result[key] = data[key];
            }
            return result;
        }
        content(columns, types) {
            var content = [], row = [], text, cols = Object.keys(columns),
                len = columns[cols[0]].length;
            for (var j = 0; j < len; j++) {                        
                for (var col of cols) {  
                    text = typeCast.getValue(columns[col][j], types[col]);                         
                    row.push(text);
                }
                content.push(new $scope.Row(row));
                row = [];
            }
            return content;
        }
        data(result) {
            var params = Object.keys(this._destination), data = {},
                keys = Object.keys(result);
            params.delete("object");
            for (var param of params) {
                if (param !== 'content' && param !== 'columns') {
                    data[param] = result[param];
                    keys.delete(param);
                }
            }
            if (params.indexOf('content') !== -1) {
                data['content'] = this.content(result.columns, data.types);
            }
            if (params.indexOf('columns') !== -1) {
                data['columns'] = Object.keys(result.columns);
            }
            return data;
        }
        success() {
            if (this._status) {
                this._status.success = true;
                this._status.error = false;
                this._status.pending = false;
            }
        }
        error(msg) {
            if (this._status) {
                this._status.success = false;
                this._status.error = true;
                this._status.pending = false;
                this._status.message[1] = msg ? msg["ERROR:"] : "";
            }
        }
    };

    $scope.Status = class {
        constructor(message) {
            this._success = false;
            this._error = false;
            this._pending = false;
            this._message = message;
        }
        get success() {
            return this._success;
        }
        set success(val) {
            this._success = val;
        }
        get error() {
            return this._error;
        }
        set error(val) {
            this._error = val;
        }
        get pending() {
            return this._pending;
        }
        set pending(val) {
            this._pending = val;
        }
        get message() {
            return this._message;
        }
        set message(val) {
            this._message = val;
        }
    };
        
    
    $scope.DatabaseOp = class extends $scope.Board {

        constructor() {
            super();
            this._alert = null;
        }      
        get alert() {
            return this._alert;
        }
        create(name) {
            var  that = this, success, sql, url, deferred = $q.defer(), alertMsg;
            sql = "CREATE DATABASE " + name + ";";
            url = base_address + 'DbExplorer/modify.dbexp';
            new $scope.Server({ data: { type: 'update', sql: sql, name: name }, 
                                type: 'query', url: url, deferred: deferred, action: 'update'
                              });
            deferred.promise.then(function() {
                alertMsg = "Database '" + name + "' is created successfully.";
                that._alert = new $scope.Alert('success', alertMsg);    
            }, function() {
                alertMsg = "Database '" + name + "' could not be created.";
                that._alert = new $scope.Alert('warning', alertMsg);
            });
        }
        switch(name) {
            if (!name) {
                return;
            }
            var that = this, userData, preferences, dbUrl, 
                dbName, index, context, data;
            userData = JSON.parse(localStorage.userData);
            data = angular.copy(userData);
            preferences = data.preferences;
            dbUrl = preferences.databaseUrl;
            dbName = preferences.dbName;
            index = dbUrl.lastIndexOf(dbName);
            context = dbUrl.substring(0, index);
            dbUrl = context + name;
            preferences.dbName = name;
            preferences.databaseUrl = dbUrl;
            server.postRequest(base_address + "DbExplorer/connect.dbexp", data)
            .then(function() {
                localStorage.userData = JSON.stringify(data);
                $window.location.href = base_address + "DbExplorer/explorer.dbexp";
            }, function(error) {
                that._alert = new $scope.Alert('warning', error);
            });
        }
    };
    
    $scope.Column = class {
        
        constructor(text) {
            this._text = text;
            this._editted = null;
        }
        get text () {
            return this._text;
        }
        set text(val) {
            this._text = val;
        }
        get editted () {
            return this._editted;
        }
        set editted(val) {
            this._editted = val;
        }     
    };
    $scope.Row = class {
        constructor(row, isNew) {
            if (isNew) {
                this._isNew = true;
            }
            this._row = [];
            for (var col of row) {
                this._row.push(new $scope.Column(col));
            }
            this._selected = false;
        }
        get isNew() {
            return this._isNew;
        }
        get cols() {
            return this._row;
        }
        get selected() {
            return this._selected;
        }
        set selected(val) {
            this._selected = !this._selected;
        } 
        set isNew(val) {
            this._isNew = val;
        }       
        set cols(val) {
            this._row = val;
        }
        setColumn(index, val) {
            this._row[index] = val;
        }      
    };
          
    $scope.Table = class extends $scope.Explorer {
        static init() {           
           $scope.Table.n_rows = dbCookies.get("RowsPerPage") || 10;
           $scope.Table.active = $scope.table.data.length;  
        }             
        constructor (data) {
           super(); 
           $scope.Table.init();
           this._data = data;
           this._title = data.title;
           this._content = data.content;
           this._columns = data.columns;
           this._types = data.types;
           this._id = data.id;
           this._selected = [];
           this._ops = new $scope.ColumnOp(this._title);
           this._pages = { active: 0, begin: 0, max: 1};
           var len = this._content.length;     
           this._pages.max = Math.ceil(len/$scope.Table.n_rows) - 1; 
           this._new_table = null;
        };
        close () {
           var index = $scope.table.data.indexOf(this);
           $scope.table.data.splice(index, 1);
           $scope.Table.active = Math.max(0, index - 1);
           $scope.tableOp.opened.delete(this._title);
        }      
        get get() {
            return {
                'index': $scope.table.data.indexOf(this),
                'title': this._title,
                'columns': this._columns,
                'types': this._types,
                'id': this._id,
                'content': this._content,
                'selected': this._selected,
                'ops': this._ops,
                'pages': this._pages,
                'editting': this._editting,
                'scroll': this._scroll_factor,
                'status':this._status,
                'active': $scope.Table.active,
                'n_rows': $scope.Table.n_rows || 10,
                'n_rows_op': [5, 10, 25, 50, 100, 500, 1000],
            };
        };
        get nRows() {
            return [5, 10, 25, 50, 100, 500, 1000];
        } 
        get n_rows() {
            return $scope.Table.n_rows;
        }
        get active() {
            return this._pages.active;
        }
        setData(name, val) {
            this[name] = val;
        }
        calMaxPage() {
            var len = this._content.length, 
            maxPage = Math.ceil(len/$scope.Table.n_rows) - 1;
            if (this._pages.max !== maxPage) {
                this._pages.max = maxPage;
            }
            if (this._pages.active > maxPage) {
                this.page = maxPage;
            }
        }
        set maxPage (num) {            
            this._pages.max = num;
        } 
        set page (num) {
            var  n = num >= 0  ? (num <= this._pages.max ? num : this._pages.max) : 0;
            this._pages.active = n;
            this._pages.begin = n*$scope.Table.n_rows;
            $scope.$broadcast("pageSizeChange", {index: this.get.index});
        }
        set n_rows(val) {
           $scope.Table.n_rows = val;
           this.calMaxPage();
           $scope.$broadcast("windowResized");
           dbCookies.save("RowsPerPage", val);
        };
        changeState(index) {
            if (index !== undefined) {
                 $scope.Table.active = index;
            }
            var that = this;
            $timeout(function() {
                 $state.go("colButtonGroup", {table: that, options: {}});
            }, 100);
        }
        select(col) {
            this._selected.check(col);
        } 
        rowNo(row) {
            return this._content.indexOf(row) + 1;
        }
        isSelected(index) {
            var col = this._columns[index];
            return this._selected.indexOf(col) !== -1;
        }
        isActive(index) {
            return $scope.Table.active === index;
        }
        isPageShown(index) {
            return (Math.abs(this._pages.active - index) <= 2);
        }
        isFirstPage() {
            return this._pages.active === 0;
        }
        isMaxPage() {
            return this._pages.active === this._pages.max;
        }
        isEmpty() {
            return this._content.length === 0;
        }
        isPageContd() {
            return this._pages.active < this._pages.max - 3;
        }
        prevPage() {
            this.page = this._pages.active - 1;
        }
        nextPage() {
            this.page = this._pages.active + 1;
        }
        lastPage() {
            this.page = this._pages.max;
        }
        sort(col_name, ascending) {
            if (!col_name) {
                this._content.reverse();
            } else {
                var index = this._columns.indexOf(col_name);
                if (ascending) {
                    this._content.sort(function(a, b) {
                        if(typeof a.cols[index].text != 'string') {
                            return a.cols[index].text > b.cols[index].text ? 1 : -1;
                        } else {
                            return (a.cols[index].text).toLowerCase() > 
                                   (b.cols[index].text).toLowerCase() ? 1 : -1;
                        }
                    });
                } else {
                    this._content.sort(function(a, b) {
                        if(typeof a.cols[index].text != 'string') {
                            return a.cols[index].text < b.cols[index].text ? 1 : -1;
                        } else {
                            return (a.cols[index].text).toLowerCase() < 
                                   (b.cols[index].text).toLowerCase() ? 1 : -1;
                        }
                    });
                }
            }
        }
        addCast(data, delim, addCol) {
            var casted = "", keys = Object.keys(data), types = this._types, 
            len = keys.length;
            if (addCol) {
                angular.forEach(keys, function(item, index) {
                    casted = casted + "CAST ('" + data[item] +
                                    "' AS "+ types[item] + " ) ";
                    if (delim && len > 1  && index < len - 1) {
                        casted = (index < len - 2) ? (casted + ",") : (casted + " " + delim);
                    }
                });
            } else {
                angular.forEach(keys, function(item, index) {
                    casted = casted +  item +  " = " + "CAST ('" + data[item] +
                                    "' AS "+ types[item] + " ) ";
                    if (delim && len > 1  && index < len - 1) {
                        casted = (index < len - 2) ? (casted + ",") : (casted + " " + delim);
                    }
                });
            }
            return casted;
        }
        getSql(action, mod, unmod) {
            var suffix = "", sql;
            if (unmod) {               
                suffix = mod ? " SET " + this.addCast(mod, " , ") : "";
                suffix = suffix + "WHERE "+ this.addCast(unmod, " AND ") + ";";
            } else {
                suffix = "( " + Object.keys(mod).join() + " ) "  + " VALUES (" +
                           this.addCast(mod, ",", true) + ");";
            }
            sql = action + " " + this._title + "  " + suffix;
            return sql;
        }
        insert(row) {
            var mod = this.getMod(row),
                sql = this.getSql('INSERT into ', mod); 
            this._ops.insert(sql);
        }
        update(row) {
            var mod = this.getMod(row), unmod = this.getUnmod(row),
                sql = this.getSql('UPDATE ', mod, unmod);
            this._ops.update(sql);
        }
        getMod(row) {
            var mod = {}, columns = this._columns;
            angular.forEach(row.cols, function(col, i) {
                if (col.editted) {
                    mod[columns[i]] = col.editted;
                }
            });
            return mod;
        }
        getUnmod(row) {
            var i = 0, unmod = {}, columns = this._columns;
            for (var col of row.cols) {
                if (this._columns[i] === this._id) {
                    unmod = {};
                    unmod[this._id] = col.text
                    return unmod;
                } else {    
                    unmod[columns[i++]] = col.text;
                }
            }
            return unmod;
        }
        delete(row) {
            if (row.isNew) {
                this._content.delete(row);
                $scope.$broadcast("windowResized", {index: this.get.index});
                row.cols = null;
                row = null;
                return;
            }
            var sql = this.getSql('DELETE from', undefined, this.getUnmod(row));  
            this._ops.delete(sql);
        } 
        newRow(row) {
            var new_row = [];
            for (var cols of this._columns) {
                new_row.push("null");
            }
            this._content.splice(row, 0, new $scope.Row(new_row, true));
            this.calMaxPage();  
            $scope.$broadcast("windowResized", {'index' : this.get.index});          
        }
        addRow(row) {            
            var len = this._content.length; 
            this.newRow(len);
        }        
        isId(index) {
            return Object.keys(this._types)[index] === this._id;
        }
        colType(index) {
            var key = Object.keys(this._types)[index];
            return this._types[key];
        } 
        cast(row, column) {
            var uncasted = this._content[row][column + 2], col_name = this._columns[column],
                type = this._types[col_name], casted = typeCast.getValue(uncasted, type);
            this._content[row][column + 2] = casted;
        }
    };

    Array.prototype.delete = function(element) {
        var index = this.indexOf(element);
        if (index !== -1) {
            this.splice(index, 1);
        }
        return this;
    };
    Array.prototype.check = function(element) {
        var index = this.indexOf(element);
        if (index === -1) {
            this.push(element);
        } else {
            this.splice(index, 1);
        }
        return this;
    };

    $scope.table = {
        data: [],
        names: []
    };
    
    $scope.exp = new $scope.Explorer();

    $scope.board = new $scope.Board();
    $scope.list = new $scope.List();
    $scope.tables = new $scope.Tables();
    
    $scope.columnOp = new $scope.ColumnOp();
    $scope.tableOp = new $scope.TableOp();
    $scope.databaseOp = new $scope.DatabaseOp();

    $scope.TableNames.init();
    $state.go("colButtonGroup");

}]);