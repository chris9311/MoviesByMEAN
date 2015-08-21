var app = angular.module('routerApp',['ngRoute','indexController',
    'movie_detal','movie_list','new_movie','user_list','user_signin','service','user_signup',
    'comment','new_category','topbar','category_movie','search_movie']);

app.run(function($window,$rootScope,$location,user_service) {
    //$rootScope.$state = $state;
    //$rootScope.$stateParams = $stateParams;
    $rootScope.$on('$routeChangeStart', function(event) {
        user_service.checkUser();
    });

});

app.controller('rootApp',function($scope,$rootScope){
    //$rootScope.pagesize = 4;
});


app.config(['$routeProvider','$httpProvider',function($routeProvider,$httpProvider,$rootScope){

    //delete $httpProvider.defaults.headers.common['X-Requested-With'];
    //$httpProvider.defaults.headers.common['Authorization'] = 'code_bunny';
    //$httpProvider.defaults.withCredentials = true;

    $routeProvider
        .when('/index',{
            templateUrl : 'client/views/pages/index.html'
        })
        .when('/movie/detal/:movieid',{
            templateUrl : 'client/views/pages/moviedetal.html'
        })
        .when('/movie/list/:page',{
            templateUrl : 'client/views/pages/movielist.html'
        })
        .when('/movie/new',{
            templateUrl : 'client/views/pages/newmovie.html'
        })
        .when('/movie/update/:movieid',{
            templateUrl : 'client/views/pages/newmovie.html'
        })
        .when('/user/list',{
            templateUrl : 'client/views/pages/userlist.html'
        })
        .when('/category/new',{
            templateUrl : 'client/views/pages/newcategory.html'
        })
        .when('/category/movies/:categoryid/:page',{
            templateUrl : 'client/views/pages/categorymovie.html'
        })
        .when('/movie/result/:keyword/:page',{
            templateUrl : 'client/views/pages/searchmovies.html'
        })
        //.otherwise({
        //    redirectTo: '/index'
        //});
}]);

 //创建指令
app.directive('pagination',function(){
    var li= '<nav class="text-center"> ' +
        '<ul class="pagination"> ' +
        '<li> ' +
        '<a href="" aria-label="Previous" ng-click="firstpage()"> ' +
        '<span aria-hidden="true">&laquo;</span> ' +
        '</a> ' +
        '</li> ' +
        '<li ng-repeat="num in totalPages" ng-class=\'{true: "active", false: "inactive"}[currentPage==num]\'> ' +
        '<a  href={{url}}/{{num}} >' +
        '{{num}} ' +
        '</a> ' +
        '</li> ' +
        '<li> ' +
        '<a href="" aria-label="Next" ng-click="lastpage()"> ' +
        '<span aria-hidden="true">&raquo;</span> ' +
        '</a> ' +
        '</li> ' +
        '</ul> ' +
        '</nav>';

    return {
        restrict : 'E',

        replace : true,
        template : li,
        link : function(scope,element,attrs) {
            scope.$emit('pageSize',attrs.pagesize);

            scope.$on(attrs.itemslist,function(even,data){

                scope.pages = data.totalPages;
                scope.totalPages = [];

                for (var i = 0; i < scope.pages; i++) {
                    scope.totalPages.push(i + 1);
                }

                scope.categoryid = data.categoryid;
                scope.currentPage = data.currentPage;
                scope.url = attrs.url;
                if(attrs.urlAtt1){
                    scope.url =  scope.url +"/"+ data[attrs.urlAtt1];
                }
                if(attrs.urlAtt2){
                    scope.url =  scope.url +"/"+ data[attrs.urlAtt2] ;
                }
            });

            scope.firstpage = function(){
                window.location = scope.url +"/" + 1;
            };

            scope.lastpage = function(){
                window.location = scope.url +"/" + scope.pages;
            };

        }
    };
});