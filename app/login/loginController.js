// Controller for the login page
angular.module( 'devops' )
    .controller( 'loginController', [ '$scope', '$http', function ( $scope, $http ) {
        $scope.list = [];
        $scope.username = '';
        $scope.submit = function () {
            if ( $scope.username ) {
                console.log( "submitting " + $scope.username + $scope.password );
                $http( {
                    url: 'http://localhost:9000/login',
                    method: 'POST',
                    params: {
                        username: $scope.username + '@federated.fds',
                        password: $scope.password,
                    }
                } );
            }
        };
   } ] );
