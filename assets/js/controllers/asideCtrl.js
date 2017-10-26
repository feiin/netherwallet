(function () {
    function initPage ($scope, $http) {
         
        $http.get("menu.json")
        .then(function (result) {
            $scope.menus = result.data;
        },function (){
            alert("获取菜单信息失败！");
        });
    }

    function asideCtrl ($scope, $http) {
        $scope.menus = [];
        initPage($scope, $http);
    }

    angular
        .module('app')
        .controller('asideCtrl', asideCtrl);
}());