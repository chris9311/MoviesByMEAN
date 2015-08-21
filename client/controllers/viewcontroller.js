var indexController = angular.module('indexController',[]);
indexController.controller('indexController',function ($rootScope,$scope,$http){
    $http.get('/category/categories')
        .success(function(json){
            $scope.categories = json.categories;
            $rootScope.title = json.title;
        });
});

var topbar = angular.module('topbar',[]);
topbar.controller('topbarController', function ($rootScope,$scope,$http) {
    $http.get('/category/list')
        .success(function(json){
           $scope.categories = json.categories;
        });

    //$scope.categories = category_service.categories;
});

var moviedetal = angular.module('movie_detal',[]);
moviedetal.controller('movie_detalController', function ($rootScope,$scope,$http,$routeParams) {

    var movieid = $routeParams.movieid;
    $http.get('/movie/detal/'+movieid)
        .success(function(json){
            $scope.movie = json.movie;
            $rootScope.title = json.title;
            $http.get('/comment/comments?movieid='+$scope.movie._id)
                .success(function(json){
                    $scope.comments=json.comments;
                });
        })
});

var movielist = angular.module('movie_list',[]);
movielist.controller('movie_listController',function($rootScope,$scope,$http,$routeParams){


    var page = $routeParams.page;
    $scope.$on('pageSize',function(event,data){
        $rootScope.pagesize = data;
        //console.log("root:"+$rootScope.pagesize);
        var pagesize = $rootScope.pagesize;
        $http.get('/movie/list/'+pagesize+'/'+page)
            .success(function (json) {
                $scope.movies = json.movies;
                $rootScope.title = json.title;
                $scope.$broadcast('movielist',json);
            });
    });

    $scope.delete = function(movieid){
        console.log(movieid);
        $http.get('/movie/delete?id='+movieid)
            .success(function (json) {
                if(!json.success){
                    return console.log(json.err);
                }
                else{
                    var pagesize = $rootScope.pagesize;
                    $http.get('/movie/list/'+pagesize+'/'+page)
                        .success(function (json) {
                            $scope.movies = json.movies;
                            $rootScope.title = json.title;
                            $scope.$broadcast('movielist',json);
                        });
                }
            })
    }
});

var newmovie = angular.module('new_movie',['ngFileUpload']);
newmovie.controller('new_movieController',function($rootScope,$scope,$http,$routeParams,Upload){

    $rootScope.title = "添加电影页";

    $scope.movie = {};

    $scope.isupload = false;

    $http.get('/category/list')
        .success(function(json){
            $scope.categories = json.categories;
        });

    if($routeParams.movieid)
    {
        $http.get('/movie/update/'+$routeParams.movieid)
            .success(function (json) {
                $scope.movie = json.movie;
                $rootScope.title = json.title;
            })
    }

    $scope.submit = function () {

        console.log($scope.posterfile);

        if($scope.isupload){
            $scope.upload($scope.posterfile, function (file) {
                $scope.movie.poster = file.poster;
                savemovie();
            });
            //next();
        }
        else{
            savemovie();
        }

        console.log("finish");

        function savemovie(){

            console.log("init2");
            //console.log($scope);
            //console.log($scope.movie);
            //console.log($http);

            $http({
                method : 'POST',
                url : '/movie/save',
                data : $.param($scope.movie),
                headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
            })
                .success(function(json){
                    if(!json.success){
                        return console.log(json.err);
                    }
                    window.location="#/movie/detal/"+json.movieid;
                });
        }
    };

    $scope.isUpload = function(){

        $scope.isupload = !$scope.isupload;

    };

    $scope.upload = function (file,cb) {
        Upload.upload({
            'url' : '/upload/poster',
            'file' : file
        }).progress(function(evt){
            var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
            $scope.progressPercentage = progressPercentage;
            console.log('progress: ' + progressPercentage + '% ' + evt.config.file.name);
        }).success(function (data, status) {
            console.log("postername:"+data.poster);
            //console.log(data);
            //console.log('file ' + config.file.name + 'uploaded. Response: ' + data);
            cb(data);
        }).error(function (data, status) {
            console.log('error status: ' + status);
        });
    };

    $scope.getmovie = function(){
        $scope.movie.language = "英语";
        $.ajax({
            url:'https://api.douban.com/v2/movie/subject/'+$scope.movie_id,
            cache:true,
            type:'get',
            dataType:'jsonp',
            crossDomain:true,
            jsonp:'callback',
            success : function(json){
                $scope.movie.title = json.title;
                $scope.movie.doctor = json.directors[0].name;
                $scope.movie.year = json.year;
                $scope.movie.country = json.countries[0];
                //$scope.movie.language = json.directors[0].name;
                $scope.movie.poster = json.images.large;
                $scope.movie.summary = json.summary;
                console.log($scope.movie);
                $http.get('#/');
            }
        });
    };



});

var userlist = angular.module('user_list',[]);
userlist.controller('user_listController',function($rootScope,$scope,$http){


        $http.get('/user/list/')
            .success(function (json) {
                $scope.users = json.users;
                $rootScope.title = json.title;
            })


});

var usersignin = angular.module('user_signin',[]);
usersignin.controller('user_signinController',function($rootScope,$scope,$http){

    $scope.submit = function(){
        console.log($.param($scope.user));
        $http({
            method : 'POST',
            url : '/user/signin',
            data : $.param($scope.user),
            headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
        })
            .success(function(json){
                if(json.success == true){
                    $('#signinModal').modal('hide');
                    $rootScope.user = $scope.user;
                    window.location="#/";
                }else{
                    return console.log("error");
                }
            });
    }
});

var usersignup = angular.module('user_signup',[]);
usersignup.controller('user_signupController',function($rootScope,$scope,$http){

    $scope.submit = function(){
        console.log($.param($scope.user));
        $http({
            method : 'POST',
            url : '/user/signup',
            data : $.param($scope.user),
            headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
        })
            .success(function(json){
                if(json.success == true){
                    $('#signupModal').modal('hide');
                    $rootScope.user = $scope.user;
                    window.location="#/user/list";
                }else{
                    return console.log("error");
                }
            });
    }
});

var comment = angular.module('comment',[]);
comment.controller('commentController', function ($scope,$http) {

    //$http.get('/comment/comments?movieid='+$scope.movie._id)
    //    .success(function(json){
    //        $scope.comments=json.comments;
    //    });
    $scope.replyComment = function(tid,cid){
      $scope.comment.tid = tid;
      $scope.comment.cid = cid;
    };
    $scope.comment = function(tid,cid){
      $scope.comment.tid = null;
      $scope.comment.cid = null;
    };

    $scope.submit = function () {
        $scope.comment.movie=$scope.movie._id;
        $scope.comment.from=$scope.user._id;
        $http({
            method:'POST',
            url:'/comment/save',
            data: $.param($scope.comment),
            headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
        })
            .success(function(json){
                if(json.success == true){
                    console.log('success');
                    $('#commentModal').modal('hide');
                    $http.get('/comment/comments?movieid='+$scope.movie._id)
                        .success(function(json){
                            $scope.comments=json.comments;
                        });
                    $scope.comment.content = "";
                }else{
                    return console.log('error');
                }
            });
    };
});



var newcategory = angular.module('new_category',[]);
newcategory.controller('new_categoryController',function($rootScope,$scope,$http){

    $rootScope.title = '添加分类';
    $scope.submit = function(){
      $http({
          method : 'POST',
          url : 'category/save',
          data : $.param({category:$scope.category}),
          headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
      })
        .success(function(json){
            if(json.success != true){
                console.log('error');
            }else{
                console.log('success');
            }
        });
    };

});

var categoryMovie = angular.module('category_movie',[]);
categoryMovie.controller('category_movieController', function ($scope,$rootScope,$http,$routeParams) {

    var page = $routeParams.page;
    var categoryid = $routeParams.categoryid;
    var pagesize ;
    $scope.$on('pageSize',function(event,data){
        $rootScope.pagesize = data;
        //console.log("root:"+$rootScope.pagesize);
        pagesize = $rootScope.pagesize;
        //console.log("pagesize:"+pagesize);

        $http.get('category/movies/'+categoryid+'/'+ pagesize +'/'+page)
            .success(function (json) {
                if(json.success != true)
                    return console.log('error');
                console.log('success');
                $scope.movies = json.movies;
                $scope.categoryid = json.categoryid;
                $scope.currentPage = json.currentPage;

                //$scope.musicEmotion = json.movies;
                //$scope.$broadcast('musicEmotion');
                //console.log($scope.movies);

                $rootScope.title = json.title;

                //$scope.totalPages = json.totalPages;
                //var pages =[];
                //for(var i=1 ; i< json.totalPages+1;i++)
                //{
                //    pages.push(i);
                //}

                $scope.totalPages = json.totalPages;
                $scope.$broadcast('movies',json);
            });
    });
});

var searchMovie = angular.module('search_movie',[]);
searchMovie.controller('search_movieController',function($scope,$rootScope,$http,$routeParams){

    var keyword = $routeParams.keyword;
    var page = $routeParams.page;

    $scope.$on('pageSize',function(event,data) {

        $rootScope.pagesize = data;
        //console.log("root:"+$rootScope.pagesize);
        var pagesize = $rootScope.pagesize;

        $http.get('/movie/search/'+keyword+'/'+pagesize+'/'+page)
            .success(function(json){
                $scope.movies = json.movies;
                $rootScope.title = json.title;
                $scope.totalPages = json.totalPages;
                $scope.$broadcast('searchmovies',json);
                $scope.currentPage = json.currentPage;
            });
    });
});