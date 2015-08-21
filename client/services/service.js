var Service = angular.module('service',[]);
Service.factory('user_service',['$rootScope','$http',
    function($rootScope,$http){
        return {
            //user : window.user,
            checkUser :function(){
              $http.get('/user/check')
                  .success(function(msg){
                     if(msg) {
                         $rootScope.user = msg.user;
                         //window.user = msg.user;
                         return ;
                     }
                      //window.user = null;
                      return ;
                  });
          }
        };
}]);

Service.factory('category_service', ['$http',function ($http) {

    var categories;



    console.log("b"+categories);

    return {
        init : function(){
            $http.get('/category/list')
                .success(function(json){
                    categories = json.categories;
                    console.log("a"+json.categories);
                });
        },
        categories : categories
    } ;
}]);