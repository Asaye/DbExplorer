'use strict';
var loginModule = angular.module("dbExpApp", ["ngCookies", "ngRoute", "ngSanitize", "ui.bootstrap", "ui.router",
                                    "dbExpApp.explorer", "dbExpApp.login", "dbExpApp.operations"]);

loginModule.constant('base_address', "http://localhost:8080/");
loginModule.config(['$stateProvider', function ($stateProvider) {
    $stateProvider
       .state('customizedLogin', {
            url:"/customized/dbexp",
            views: {
                'customizedLogin': {
                    templateUrl: "./customized.dbexp"
                }
            }
       }) 
       .state('colButtonGroup', {
            url:"/colButtonGroup",
            params: { table : null },
       });
}]);
/******************************************* Login.jsp *****************************************/
loginModule.directive('draggableWindow', function() {
  return {
    restrict: 'EA',
    link: function(scope, element) { 
            element.draggable();
        }
    }
});

loginModule.directive('resizableWindow', function() {
  return {
    restrict: 'EA',
    link: function(scope, element) { 
            $(element).resizable({
                handles : "e,w,n,s,ne,se,nw,sw",
            });
        }
    }
});

loginModule.directive('menu', ['$compile', function($compile) {
  return {
    restrict: 'EA',
    link: function(scope, element, attrs) {
            var name = element.attr("list").split(","),
                list = scope[name[0]][name[1]], id = name[2],
                ul = angular.element('<ul class = "hidden"><ul>'), 
                li = angular.element('<li>'),
                span = angular.element('<span>'), caret = angular.element('<span>'),
                inner_ul, inner_li, inner_span; 
            if (name[4]) {
                var index = scope.$eval(name[4]);
                span.text(scope[name[0]][id][index]);
            } else {
                span.text(scope[name[0]][id]);
            } 
            ul.addClass('menu');
            if (element.hasClass("menu-up")) {
                caret.addClass('fa fa-caret-up fa-lg');
            } else {
                caret.addClass('fa fa-caret-down fa-lg');
            }
            if (name[3] && name[3].length > 0) {
                scope.$on(name[3], function() {
                    span.text(scope[name[0]][id]);
                });
            }
            angular.forEach(list, function(item) {
                if (typeof item !== 'object') {
                    li = angular.element("<li>");                
                    li.addClass('menu-item').text(item);
                    if (element.hasClass("menu-up")) {
                        li.addClass('dir-up');
                    }                    
                    ul.append(li);
                } else {
                    inner_ul = angular.element('<ul>');
                    inner_span = angular.element('<span>');
                    inner_ul.addClass('submenu hidden');
                    inner_span.addClass('fa fa-caret-right fa-lg');                                
                    angular.forEach(item, function(subitem) {
                        inner_li = angular.element('<li>');                    
                        inner_li.addClass('submenu-item').text(subitem);
                        inner_ul.append(inner_li);
                    });         
                    li.attr("submenu","").append(inner_ul).append(inner_span);               
                } 
            });        
            $compile(ul)(scope);            
            element.addClass('menu-container').css("cursor", "pointer")
                   .append(span).append(caret).append(ul);

            element.on('click', function(e) {
                var ele;
                scope.$apply(function() {
                    var target = angular.element(e.target),
                        handleEvent = target.find(".submenu").length === 0 || 
                                      e.target.tagName === 'SPAN' || 
                                      e.target.tagName === 'DIV';
                    if (handleEvent) {
                        angular.forEach(element.find(".menu-item"), function(item) {
                            ele = angular.element(item);
                            if (name[4]) {
                                var index = scope.$eval(name[4]); 
                                if (ele.text() === scope[name[0]][id][index]) {
                                    ele.addClass('hidden');
                                } else {
                                   ele.removeClass('hidden');
                                }
                            } else {
                                if (ele.text() === scope[name[0]][id]) {
                                    ele.addClass('hidden');
                                } else {
                                   ele.removeClass('hidden');
                                }
                            }
                            
                        });
                        if (e.target.tagName === "LI") {
                            if (name[4]) {
                                var index = scope.$eval(name[4]); 
                                scope[name[0]][id][index] = e.target.innerText;
                                element.children().eq(0).text(scope[name[0]][id][index]);
                            } else {
                                scope[name[0]][id] = e.target.innerText;
                                element.children().eq(0).text(scope[name[0]][id]);
                            }
                            element.find(".submenu-item").removeClass('tick');
                            var target = angular.element(e.target);
                            if (target.hasClass("submenu-item")) {                        
                                target.addClass('tick');
                            }
                        }
                        element.find(".menu").toggleClass("hidden");
                    }
                });
            });
            element.on('mouseleave', function(e) {
                scope.$apply(function() {                    
                    element.find(".menu").addClass("hidden");
                });
            });
        }
    }
}]);

loginModule.directive('submenu', [function(){
  return {
    restrict: 'EA',
    link: function(scope, element, attrs) {  
            element.on('mouseover', function(e) {
                scope.$apply(function() {
                    element.children().removeClass("hidden");
                });
            });
            element.on('mouseleave', function(e) {
                scope.$apply(function() {
                    element.children().eq(0).addClass("hidden");
                });
            });
        }
    }
}]);

loginModule.directive('login', [function() {
  return {
    restrict: 'EA',
    link: function(scope, element) {
            var name = element.attr("name");
            if (element[0].tagName === "INPUT") {
                element.val(scope.user.get[name]);
            }                       
            element.on('focus', function(e) {
                scope.$apply(function() {
                    scope.user.getValue();
                });
            });
            element.on('blur', function(e) {
                scope.$apply(function() {
                    var group = element.attr("g"),
                        name = element.attr("name");
                    scope.user.setData(group, name, e.target.value);
                });
            });
            element.on('click', function(e) {
                scope.$apply(function() {
                    var group = element.attr("g"),
                        name = element.attr("name"),
                        value = element.attr("value");                  
                    scope.user.setData(group, name, value || e.target.value);
                });
            });
        }
    }
}]);

/*************************************************** settings.jsp ********************************************/
loginModule.directive('arrowUpDown', [function() {
  var arrows = [];  
  return {
    restrict: 'EA',
    link: function(scope, element) {
            arrows.push(element);
            element.ready(function() {
                element.parent().on('click', function(e) {
                    scope.$apply(function() {
                        angular.forEach(arrows, function(item) {
                            if (item !== element) {
                               item.addClass('glyphicon-menu-down')
                                  .removeClass('glyphicon-menu-up');
                            }
                        });                        
                        element.toggleClass('glyphicon-menu-down')
                               .toggleClass('glyphicon-menu-up');
                    });
                });
            });
        }
    }
}]);

loginModule.directive('number', [function() {
    var regex = /^([1-9]+(\d)*)$/;
    return {
        restrict: 'A',
        scope: {valid: '='},
        link: function(scope, element, attrs) {
                var inputs = element.find("input"),
                    message = element.find(".hidden");
                scope.valid = true;
                inputs.on('blur', function(e) {
                    scope.valid = true;
                    angular.forEach(inputs, function(item) {
                        scope.valid = scope.valid && regex.test(angular.element(item).val());
                    });
                    if (!regex.test(e.target.value)) {
                        angular.element(e.target).addClass("invalid");
                    } else {
                        angular.element(e.target).removeClass("invalid");
                    }
                });
            }
        }
}]);

/*************************************************** DbExplorer.jsp ********************************************/
loginModule.directive('allWindows', ['$compile', function($compile) {
  return {
    restrict: 'EA',
    link: function(scope, element) {
        scope.display = false;
        element.bind('contextmenu', function(e) {
            scope.$apply(function() {
                if (e.target !== e.currentTarget) {
                    return;
                }
                e.preventDefault();
                scope.top = e.clientY;
                scope.left = e.clientX;
                scope.display = true;
            });
        });
    }
  }
}]);

loginModule.directive('resizable', ['overlap', function(overlap) {
  return {
    restrict: 'EA',
    link: function(scope, element) { 
          
        var getClass = function(forward) {            
            var list = $(".list"), tabs = $(".tabs");
            if (list.length > 0 || tabs.length > 0 || overlap.check(tabs, list)) {
                return null;
            }
            return (forward && element.hasClass("tabs")) ? ".tabs" : ".list";
        };              
        
        element.resizable({
            handles : "e,w,ne,se,nw,sw",
            alsoResizeReverse: getClass(),
            start: function() {
                var options = $(this).resizable("instance").options;
                options["alsoResizeReverse"] = getClass();
            }
        }); 
            
        $.ui.plugin.add("resizable", "alsoResizeReverse", {
            start: function() {
                var that = $(this).resizable("instance"), o = that.options;
                $(o.alsoResizeReverse).each( function() {
                    var el = $(this);
                    el.data( "ui-resizable-alsoresizereverse", {
                        width: parseFloat(el.width()), height: parseFloat(el.height()),
                        left: parseFloat(el.css( "left")), top: parseFloat(el.css( "top" ))
                    });
                });
            },

            resize: function(event, ui) {
                var that = $(this).resizable( "instance" ),
                    o = that.options, os = that.originalSize,
                    op = that.originalPosition,
                    delta = {
                        height: (os.height - that.size.height) || 0,
                        width: (os.width - that.size.width) || 0,
                        top: (op.top - that.position.top) || 0,
                        left: (op.left - that.position.left) || 0
                    };
                    $(o.alsoResizeReverse).each( function() {
                        var el = $(this), start = $(this).data("ui-resizable-alsoresizereverse"),
                            style = {},
                            css = el.parents(ui.originalElement[0]).length ?
                                    ["width", "height"] :
                                    ["width", "height", "top", "left"];

                        $.each(css, function( i, prop) {
                            var sum = (start[prop] || 0) + (delta[prop] || 0);
                            if (sum && sum >= 0) {
                                style[prop] = sum || null;
                            }
                        });
                        el.css(style);
                    });
            },
            stop: function() {
                $(this).removeData("ui-resizable-alsoresizereverse");
            }
        });        
    }
  }  
}]);
loginModule.directive('draggable', function() {
  return {
    restrict: 'EA',
    link: function(scope, element) {   
        var getClass = function(forward) {
            return (forward && element.hasClass("tabs")) ? ".tabs" : ".list";  
        };
        element.draggable({
            start : function(event, ui) {               
                $(getClass()).css('z-index', '1');
                $(getClass(true)).css('z-index', '2');
            },
            snap: ".list-view",
            snapTolerance: 20,           
        });
    }
  }  
});

loginModule.factory('overlap', function() {
  return {
    'check': function(e1, e2) {
        var r1 = e1[0].getBoundingClientRect(),
            r2 = e2[0].getBoundingClientRect();
        return (r1.x > r2.x && r1.left < r2.right) || 
               (r1.x < r2.x && r1.right > r2.left) ||
               (r1.y > r2.y && r1.top < r2.bottom) || 
               (r1.y < r2.y && r1.bottom > r2.top);
    },
  }
});

/*************************************************** board.jsp *********************************************/
loginModule.directive('buttonGroup', ['$compile','$stateParams', '$state', 'button', 
     function($compile, $stateParams, $state, button) {
    return {
        restrict: 'EA',
        link: function(scope, element) {   
            var name = element.attr("name"),
                params = scope[name]["params"], b;
            angular.forEach(params, function(item) {
                b = button.ops(item, name);
                element.append(b);
                $compile(b)(scope);
            });
            element.children().on('click', function(e) {
                scope.$apply(function() {

                    var button = angular.element(e.target), callback = button.attr("title"),
                        name = button.attr("name");

                    if (!callback) {
                        callback = button.parent().attr("title");
                        name = button.parent().attr("name");
                    } 
                    scope[name]["callback"] = callback;
                });
            });

        }
    }  
}]);
loginModule.directive('paramsButtons', ['$compile', 'button', 
     function($compile, button) {
    return {
        restrict: 'EA',
        link: function(scope, element) {   
            var name = element.attr("name"),
                btn = button.params(name);
            element.prepend(btn[1]);
            element.prepend(btn[0]);
            $compile(btn[0])(scope);
            $compile(btn[1])(scope);
        }
    }
}]);
loginModule.factory('button', function() {
  return {
    'ops': function(params, name) {
        var button = angular.element("<button type = 'button' class = 'btn-brd-sm'></button>"),
            span = angular.element("<span class = 'fa fa-lg'></span>"),
            title = params[0], className = params[1], disabled = params[2];
            span.addClass(className);
            button.append(span);
            button.attr("ng-disabled", disabled);
            button.attr("ng-class", "{'z-1': !" + disabled + "}");
            button.attr("title", title);
            button.attr("name", name);
        
        return button;
    },
    'params': function(name) {
        var submit = angular.element("<button type = 'button'> Submit </button>"),
            cancel = angular.element("<button type = 'button'> Cancel </button>");

        submit.addClass('btn btn-primary btn-sm btn-board');
        cancel.addClass('btn btn-primary btn-sm btn-board');
            
        submit.attr("ng-click", name + ".submit()");
        cancel.attr("ng-click", name + ".cancel()");

        return [submit, cancel];
    },
  }
});
/*************************************************** Tables.jsp ********************************************/
loginModule.directive('hasScrollbar',['scrollbar', '$window', '$compile', '$timeout', '$interval',
                        function(scrollbar, $window, $compile, $timeout, $interval){
  return {
        restrict: 'EA',
        link: function(scope, element) {
            var replace = function() {
                var timer = $interval(function() {
                    element.prev().children().remove();
                    element.prev().remove();
                    var vertical = scrollbar.getVertical(element);
                    vertical.scroller.attr("factor", vertical.factor);
                    $compile(vertical.scrollBar)(scope);
                    if (element.height() > 0) {
                        $interval.cancel(timer);
                    }
                }, 100);
            };
            element.ready(function() {
                scope.$apply(function() {
                   $timeout(function() { 
                       var vertical = scrollbar.getVertical(element),
                           index = scope.$index;
                       vertical.scroller.attr("factor", vertical.factor);
                       vertical.scrollBar.attr("table", index);
                       $compile(vertical.scrollBar)(scope);
                   }, 100);
                });
            });
            scope.$on('pageSizeChange', function(event, data) {
                if (element.attr("table") == data.index) {
                    $timeout(function() {
                        if (data.scrollDown) {
                            var resized = scrollbar.resizeBottom(element, true);
                        } else {
                            var resized = scrollbar.resizeBottom(element);
                        }
                        var scroller = element.prev().children();
                        scroller.attr("factor", resized.factor);
                   
                    }, 100);
                }
            }); 
            scope.$on('windowResized', function(event, data) {
                if (data) {
                    if (element.attr("table") === data.index) {
                        replace();
                    }
                } else {
                    replace();
                }
            }); 
        }
    }
}]);

loginModule.directive('dbScrollBar', ['scrollbar', function(scrollbar){
  return {
    restrict: 'EA',
    link: function(scope, element, attrs) {
            element.on('click', function(e) {
                scope.$apply(function() {
                    var y = e.originalEvent.layerY,
                        factor = scope.table.get.scroll;                    
                    scrollbar.moveTo(element, y, factor);
                });
            });
        }
    }
}]);

loginModule.directive('scroller', [function() {
  return {
    restrict: 'EA',
    link: function(scope, element) {
            var content = null, factor, init_table, init_scroller, offset = 0; 
            $(element).draggable ({
                containment : element.parent(),
                start: function(event, ui) {                 
                    content = element.parent().next(); 
                    init_table = content.offset().top;
                    init_scroller = ui.offset.top;
                    content.offset({top: 0});
                    factor = parseFloat($(this).attr("factor"));
                },
                drag: function(event, ui) {
                    offset = (init_scroller- ui.offset.top)*factor + init_table;
                    content.offset({top: offset});
                    ui.position.left = 0;
                }
            });
        }
    }
}]);

loginModule.factory('scrollbar',['$timeout', function($timeout) {
    return {  
        'getParams': function(element) {
            if (element.prev().length > 0) {
                var scrollBar = element.prev(),
                scroller = scrollBar.children(),
                rect = scroller[0].getBoundingClientRect(),
                top_scroller = scroller.offset().top,
                height = rect.bottom - rect.top;
            } 
            var h_view = element.parent().height(),
                h_scroll = element[0].scrollHeight,
                h_scroller = (h_view/h_scroll)*h_view,
                top = element.parent().offset().top,
                factor = (h_scroll - h_view)/(h_view - h_scroller);
                return {
                    'factor': factor,                    
                    'view': h_view,
                    'scroll': h_scroll,
                    'h_new': h_scroller,
                    'h_old': height > 0 ? height : h_scroller,
                    'scroller': scroller,
                    'scrollBar': scrollBar,
                    'top': top,
                    'init': top_scroller > 0 ? top_scroller : top,
                }
        }, 
        'getVertical': function(element) {
            var params = this.getParams(element),
                scrollBar = angular.element("<div></div>"),
                scroller = angular.element("<div></div>");
            scrollBar.addClass('scrollbar');
            scroller.addClass('scroller');
            scrollBar.css("height", params.view + "px");
            scroller.css("height", params.h_new + "px");
            scrollBar.attr("db-scroll-bar","");
            scroller.attr("scroller","");            
            scrollBar.prepend(scroller);
            element.before(scrollBar);
            element.css("top", 0);
            if (params.factor <= 1) {
                scrollBar.addClass("hidden");
            }
            return {
                'scrollBar': scrollBar,
                'scroller': scroller,
                'factor': params.factor
            };
        },
        'resizeBottom': function(element, scrollDown) {

            var params = this.getParams(element),
                scrollBar = params.scrollBar, 
                scroller = params.scroller, top_ele, top_par,
                h_init = scroller.offset().top - (params.h_new - params.h_old);
            if (params.view > 0 && params.factor > 0 && params.factor <= 1) {  
                element.offset({top: params.top});
                scrollBar.addClass("hidden");
            } else if (params.view > 0) {
                if (scrollDown) {
                    h_init = params.view - params.h_new,
                    offset =  params.top - h_init*params.factor;
                    h_init = h_init + params.top;
                    if (scrollBar[0].getBoundingClientRect().height === 0) {
                        $timeout(function() {
                            h_init = params.view - params.h_new,
                            offset =  params.top - h_init*params.factor;
                            h_init = h_init + params.top;
                            scroller.offset({top: h_init});
                            element.offset({top: offset});
                        }, 100);
                    }
                } else {
                    var h = params.init - (params.h_new - params.h_old),
                    offset =  params.top + (params.top - h)*params.factor;
                }
                scroller.offset({top: h_init});
                element.offset({top: offset});
                scrollBar.css("height", params.view + "px");
                scroller.css("height", params.h_new + "px");
                scrollBar.removeClass("hidden");    
            } 
            top_ele = element.offset();
            top_par = element.parent().offset();
            if (top_ele > top_par) {
                element.offset({top: top_par});
                scroller.offset({top: 0});
            }  
            return { 'factor': params.factor};          
        },
        'moveTo': function(element, y, factor) {
            var params = this.getParams(element.next()), h = params.h_new/2,
                scroller = params.scroller, 
                top = (y - h) < 0 ? params.top : 
                      ((y + h) > params.view ? params.top + params.view - 2*h : params.top + y - h),
                offset = params.top + params.factor*(params.top - top);
            scroller.offset({top: top});            
            element.next().offset({top: offset});
        }
    };
}]);

loginModule.directive('tableOrder', [function(){
  return {
    restrict: 'EA',
    link: function(scope, element) {
            var ascending = true;
            element.addClass("caret caret-order table-cell");
            element.on('click', function(e) {
                scope.$apply(function() {
                    ascending = !ascending;
                    scope.table.sort(scope.col, ascending);
                    element.toggleClass("caret-down");
                    element.toggleClass("caret-up");
                });
            });
        }
    }
}]);

loginModule.directive('contentEditable',['$compile', 'editting', function($compile, editting) {
    return {
        restrict : 'EA',
        link: function(scope, element) {
            
            var getDirective = function() {
                var type = scope.table.colType(scope.$index);
                return type.indexOf('date') === -1 ? 
                       "editting-text" : "editting-date";
            };   

            if (scope.row.isNew) {  
                element.attr(getDirective(), "");
                editting.getSave(element, "insert");
                element.removeAttr("content-editable");
                $compile(element)(scope);
            }
            element.on('dblclick', function(e) {
                scope.$apply(function() {
                    if (!scope.table.isId(scope.$index)) {
                        element.attr(getDirective(), "");
                        editting.getSave(element, "update");
                        element.removeAttr("content-editable");
                        $compile(element)(scope);
                    }
                });
            });  
        }
    };
}]);

loginModule.directive('edittingText',['$compile', 'editting', function($compile, editting) {
    return {
        restrict : 'EA',
        replace: true, 
        template: "<input ng-model = 'col.editted' class = 'form-control input-editting'/>",
        link: function(scope, element) {             
            scope.col.editted = scope.col.text;  
            element.parent().addClass("table-cell");          
            element.on('keyup', function(e) {
                scope.$apply(function() {
                    if (e.key === 'Escape') {
                        scope.col.editted = null;
                        editting.checkAndRemove(scope.row, element);
                        $compile(editting.getSpan(element))(scope);
                    } 
                });
            });
        }
    };
}]);

loginModule.directive('edittingDate',['$compile','editting', function($compile, editting) {
    return {
        restrict : 'EA',
        replace: true, 
        template: "<input type = 'date' class = 'form-control input-editting'></input>",
        link: function(scope, element) { 
            element.parent().addClass("table-cell");                           
            element.on('keyup', function(e) {
                scope.$apply(function() {
                    if (e.key === 'Escape') {
                        scope.col.editted = null;
                        editting.checkAndRemove(scope.row, element);
                        $compile(editting.getSpan(element))(scope);             
                    } 
                });
            });
            element.on('change', function(e) {
                scope.$apply(function() {
                    scope.col.editted = e.target.value;
                });
            }); 
        }
    };
}]);

loginModule.factory('editting', function() {
    return {
        'getSave': function(element, mod) {
            var span = element.parent().parent().find("span[row-insert]");            
            span.removeClass("glyphicon-log-in")
                .addClass("glyphicon-floppy-save").attr("modify", mod);
            span.parent().css({"background-color":"#feb236", "border-color":"#ff7b25"})
                         .attr("title", "Save"); 
        },
        'removeSave': function(element) {
            element.removeClass("glyphicon-floppy-save").addClass("glyphicon-log-in");
            element.parent().css({"background-color":"#286090", "border-color":"#122b40"})
                            .attr("title", "Insert"); 
        },
        'checkAndRemove': function(row, element) {
            var editted = row.cols.filter(function(item) {
                return item.editted !== null;
            });
            if (editted.length === 0) {
                this.removeSave(element.parent().parent().find("span[row-insert]"));
            }
        },
        'getSpan': function(tElement) {
            var ele = "<span content-editable ng-bind = 'col.text'></span>",
                span = angular.element(ele);
            tElement.removeClass("form-control input-editting");
            tElement.removeAttr("ng-model");
            tElement.replaceWith(span);
            return span;
        },         
    }
});

loginModule.directive('rowInsert', ['$interval', 'editting', function($interval, editting) {
  return {
    restrict: 'EA',
    link: function(scope, element) {
            if (scope.row.cols.length > 0) {
                element.addClass("glyphicon-log-in");
            } else {
                editting.getSave(element);  
            }            
            element.parent().on('click', function(e) {
                var row = scope.$index, action = element.attr("modify");
                scope.$apply(function() {                      
                    if (element.hasClass("glyphicon-log-in")) {
                        scope.table.newRow(row);
                    } else {                     
                        scope.table[action](scope.row);
                    }                                    
                });
            });
        }
    }
}]);

loginModule.filter('range', function() {
    return function(input, total) {
        total = parseInt(total);
        for (var i = 0; i <= total; i++) {
            input.push(i);
        }
        return input;
    };
});

/********************************************* result.jsp ********************************************/
loginModule.directive('widthAdjust', [function() {
  return {
    restrict: 'EA',
    link: function(scope, element) {    
            element.ready(function() {
                scope.$apply(function() {
                    var table = element.find("table"),
                        w = (table.length > 0) ? (table.width() + 100) : "200px";
                    element.parent().width(w);
                    element.width(w);
                    element.css("visibility", "visible");
                });
            });
        }
    }
}]);

loginModule.directive('activeTable', ['$compile', function($compile) {
  return {
    restrict: 'EA',
    link: function(scope, element, attrs, ctrl) {
        element.bind('contextmenu', function(e) {
            scope.$apply(function() {
                e.preventDefault();
                scope.table.popup = true;
                var html = angular.element(
                    '<div ng-if = "table.popup" ng-mouseleave = "table.popup = false" class = "tabsPopup">\
                        <ul class = "nav">\
                            <div class = "popup">\
                                 <li table-popup ng-show = "!table.isOpen()" class = "popuptext">\
                                     Open\
                                 </li>\
                            </div>\
                            <div class = "popup">\
                                 <li table-popup ng-show = "table.isOpen()" class = "popuptext">\
                                     Close\
                                 </li>\
                            </div>\
                            <div class = "popup">\
                                 <li table-popup ng-show = "!table.isOpen()" class = "popuptext">\
                                     Delete\
                                 </li>\
                            </div>\
                        </ul>\
                    </div>');
                $compile(html)(scope);
                element.prepend(html);
                element.addClass('focused');
            });
         });
        }
    }
}]);
loginModule.directive('tablePopup', [function() {
  return {
    restrict: 'EA',
    link: function(scope, element) {
        element.on('click', function(e) {
            scope.$apply(function() {
                e.stopPropagation();
                var table = scope.table,
                    text = e.target.innerText.toLowerCase(),
                    name = table.name;
                scope.tableOp[text](name);
                table.popup = false;
            });
         });
        }
    }
}]);
/*************************************************** Factories *****************************************/
loginModule.factory('server', ['$q', '$http', '$location', 'base_address',
    function ($q, $http, $location, base_address) {
        return {
            'getRequest':function (url) {          
                var deferred = $q.defer();
                $http.get(url).success(function(data){
                    deferred.resolve(data);
                }).error(function(reason){
                    deferred.reject(reason);
                });
                return deferred.promise;
            },
            'postRequest': function (url, data) {                    
                var deferred = $q.defer();
                $http.post(url, data).success(function(data) {
                    deferred.resolve(data);
                }).error(function(reason){
                    deferred.reject(reason);
                });
                return deferred.promise;
            },
            'disconnect':function() {                    
                var url = base_address + "DbExplorer/disconnect.dbexp";
                $http.get(url);
                localStorage.removeItem("userData");
            }
        }              
    }
]);

loginModule.factory('dbCookies',['$cookies',function($cookies) {
    return {        
        'save': function(name,value) {
                var currentTime = new Date(), expiryDate,
                    year = currentTime.getFullYear()-0+1.0;
                    currentTime.setFullYear(year);
                    expiryDate = currentTime.toUTCString();                    
                    $cookies.putObject(name,value,{'expires':expiryDate});
                },
        'get':  function(name) {                    
                    return $cookies.getObject(name);
                },
        'append':  function(obj, name) {
                    var value = $cookies.getObject(name), currentTime, year, expiryDate; 
                    angular.extend(value, obj); 
                    currentTime = new Date();
                    year = currentTime.getFullYear() - 0 + 1.0;
                    currentTime.setFullYear(year);
                    expiryDate = currentTime.toUTCString();                    
                    $cookies.putObject(name,value,{'expires':expiryDate}); 
                },
        'delete':function(name) {  
                    $cookies.remove(name);
                }
        };
}]);

loginModule.factory('typeCast', function () {
        return{
            'getValue':function (value,type) { 
                if (type.indexOf('int') != -1) {
                    return parseInt(value);
                } else if (type.indexOf('bool') != -1) {
                    return value;
                } else if (type.indexOf('float') != -1) {
                    return parseFloat(value);
                }else if (type.indexOf('date') != -1) {
                    var date = new Date(value);
                    var iso = date.toISOString();
                    iso = iso.substr(0,iso.length-1);
                    iso = iso.split("T");
                    return iso[0] + " "+ iso[1];
                } else {
                    return value ? value.toString() : "";
                }
            },
        }              
    }
);

loginModule.factory('dataType', [function () {
        return{
            'getRegex':function (type, isKey) {    
                if (type.indexOf('int') != -1 && !isKey) {
                    return "^(\\d*)$|^(null)$";
                } else if (type.indexOf('int') != -1 && isKey) {
                    return "^\\d+$";
                } else if (type.indexOf('bool') != -1 && !isKey) {
                    return "^(true)$|^(false)$|^(null)$";
                } else if (type.indexOf('bool') != -1 && isKey) {
                    return "^(true)$|^(false)$";
                } else if (type.indexOf('float') != -1 && !isKey) {
                    return "^([\\d]*[/.]?[\\d]+)$|^([\\d]+[/.]?[\\d]*)$|^(null)$";
                } else if (type.indexOf('float') != -1 && isKey) {
                    return "^([\\d]*[/.]?[\\d]+)$|^([\\d]+[/.]?[\\d]*)$";
                } else if (type.indexOf('date') != -1 && !isKey) {
                    var year = "[12]([\\d]){3}";
                    var month = "((0[1-9])|(1[0-2]))";
                    var day = "((0[1-9])|([12][\\d])|(3[01]))";
                    var hour = "(([01][\\d])|2[0-3])";
                    var min = "([0-5][\\d])";
                    var sec = "([0-5][\\d])([/.][\\d]{0,3})?";
                    return "^("+year+"[/-]"+month+"[/-]"+day+"([\\s])+"+hour+":"+min+":"+sec+")$|^(null)$";
                } else if (type.indexOf('date') != -1 && isKey) {
                    var year = "[12]([\\d]){3}";
                    var month = "((0[1-9])|(1[0-2]))";
                    var day = "((0[1-9])|([12][\\d])|(3[01]))";
                    var hour = "(([01][\\d])|2[0-3])";
                    var min = "([0-5][\\d])";
                    var sec = "([0-5][\\d])([/.][\\d]{0,3})?";
                    return "^("+year+"[/-]"+month+"[/-]"+day+"([\\s])+"+hour+":"+min+":"+sec+")$";
                } else if (isKey) {
                    return "[^(^null$)]|^(n)$|^(nu)$|^(nul)$";
                } else {
                    return "^[^']*$";
                }
            }
        }              
    }
]);

