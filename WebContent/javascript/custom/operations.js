'use strict';
angular.module("dbExpApp.operations", [])
.controller('OperationsController', ['$scope', '$stateParams', function ($scope, $stateParams) {

$scope.Ops = class {

	constructor() {
		this._button_group = true;
		$scope.Ops.display = false;
	}
	get buttons() {
		return this._button_group;
	}
	set buttons(val) {
		this._button_group = val;
	}
	get inputs() {
		return this._inputs;
	}
	set inputs(val) {
		this._inputs = val;
	}
	get params() {
		return this._params;
	}
	get menu() {
		return !$scope.db.inputs && !$scope.tab.inputs 
		        && !$scope.col.inputs;
	}
	cancel() {
		this.init();
	}
};        
$scope.ColOps = class extends $scope.Ops {
	
	constructor() {
		super();
    	this._params = [["Add", "fa-plus", "col.disabled_add"], 
    		           ["Select", "fa-filter", "col.disabled"], 
                       ["Drop", "fa-trash", "col.disabled"], 
                       ["Count", "fa-sliders", "col.disabled"],
                       ["Average","fa-bar-chart", "col.disabled"],
                       ["Sum", "fa-area-chart", "col.disabled"], 
                       ["Max", "fa-bar-chart", "col.disabled"], 
                       ["Min", "fa-bar-chart fa-rotate-180", "col.disabled"], 
                       ["Swap","fa-exchange", "col.disabled"]];
	}
	init() {		
		this._inputs = false;
		this._colName = undefined;
		this._type = undefined;
    	this._criteria = undefined;
    	this._orderBy = undefined;
    	this._groupBy = undefined;
    	this._callback = undefined;
	}
	get colName() {
		return this._colName;
	}
	set colName(val) {
		this._colName = val;
	}
	get type() {
		return this._type;
	}
	set type(val) {
		this._type = val;
	}
	get criteria() {
		return this._criteria;
	}
	set criteria(val) {
		this._criteria = val;
	}
	get orderBy() {
		return this._orderBy;
	}
	set orderBy(val) {
		this._orderBy = val;
	}
	get groupBy() {
		return this._groupBy;
	}
	set groupBy(val) {
		this._groupBy = val;
	}
	get disabled() {
		var table = $stateParams.table;
		return table ? table.get.selected.length === 0 : true;
	}
	get disabled_add() {
		var table = $stateParams.table;
		return table === undefined || table === null;
	}
	get callback() {
		return this._callback;
	}
	set callback(val) {
		val = val.split(" ")[0].toLowerCase();
		this._callback = val;
		$scope.tab.inputs = false;
		$scope.db.inputs = false;
		this._inputs = (val === 'add' ||  val === 'select' || val === 'count' ||
		                val === 'average' || val === 'sum') ? true : false;
		if (!this._inputs) {
			var table = $stateParams.table, ops, selected, columns, table;
			if (!table) {
				return;
			}
			ops = table.get.ops;
			var data = {
				table: table.get.title, columns: table.get.columns, 
				       selected: table.get.selected, 
			}
			ops[val](angular.copy(data));
			this.init();
		}
	}
	submit () {
		var table = $stateParams.table, ops;
		if (!table) {
			return;
		}
		var data = {
			table: table.get.title, columns: table.get.columns, selected: table.get.selected,
			colName: this._colName, type: this._type, criteria: this._criteria,
			orderBy: this._orderBy, groupBy: this._groupBy,
		};
		ops = table.get.ops;
		ops[this._callback](angular.copy(data));
        this.init();
    };
}
$scope.TabOps = class  extends $scope.Ops {
	
	constructor() {
		super();
    	this._params = [["Create", "fa-table"],
    		           ["Open", "fa-folder-open"],
    		           ["Close", "fa-close"], 
    		           ["Delete", "fa-trash"],
    		           ["Inner Join", "fa-magnet fa-rotate-180"],
                       ["Full Join", "fa-magnet"], 
                       ["Left Join", "fa-angle-double-right"],
                       ["Right Join", "fa-angle-double-left"],
                       ["Copy", "fa-copy"]];
	}
	init() {		
		this._inputs = false;
    	this._src = undefined;
        this._dest = undefined;
        this._on = undefined;
        this._where = undefined;
        this._callback = undefined;
	}
	get criteria_on() {
		return this._on;
	}
	set criteria_on(val) {
		this._on = val;
	}
	get where() {
		return this._where;
	}
	set where(val) {
		this._where = val;
	}
	get src() {
		return this._src;
	}
	set src(val) {
		this._src = val;
	}
	get dest() {
		return this._dest;
	}
	set dest(val) {
		this._dest = val;
	}
	get display() {
		return this._display;
	}
	get callback() {
		return this._callback;
	}
	set callback(val) {
		val = val.split(" ")[0].toLowerCase();
		this._callback = val;
		$scope.col.inputs = false;
		$scope.db.inputs = false;
		this._inputs = (val === 'inner' ||  val === 'full' || val === 'left' ||
		                val === 'right' || val === 'copy') ? true : false;
		if (!this._inputs) {
			$scope.tableOp[val]();
			this.init();
		}
	}
	isJoin() {
		var cb = this._callback;
		return (cb === 'inner' ||  cb === 'full' || cb === 'left' ||
		                cb === 'right') ? " join " : "";
	}
	submit () {
		var data = {
			src: this._src, dest: this._dest, 
			on: this._on, where: this._where,
		};
		$scope.tableOp[this._callback](angular.copy(data));
        this.init();
    };
}
$scope.DbOps = class extends $scope.Ops {

	constructor() {
		super();
		this._params = [["New", "fa-file"], ["Switch", "fa-exchange"]];
	}
	init() {
		this._inputs = false;
		this._name = undefined;
		this._callback = undefined;
	}
	get name() {
		return this._name;
	}
	set name(val) {
		this._name = val;
	}
	get callback() {
		return this._callback;
	}
	set callback(val) {
		$scope.tab.inputs = false;
		$scope.col.inputs = false;
		this._inputs = val ? true : false;
		this._callback = val.toLowerCase();
	}
	submit () {
		this._inputs = false;
		var callback = this._callback, name = this._name;
		callback = (callback === 'new') ? 'create' : callback;
		$scope.databaseOp[callback](name);
		this._name = "";
    };
}

$scope.col = new $scope.ColOps();
$scope.tab = new $scope.TabOps();
$scope.db = new $scope.DbOps();
$scope.ops = new $scope.Ops();
}]);