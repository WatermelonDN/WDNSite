(function () {
    app.controller('Register', ['$scope', '$http',
        function ($scope, $http) {
            $scope.greeting = 'Hola!';
            $scope.IsAuthenticated = false;

            $scope.login = function () {
                $('#registration').hide();
                $('#home').fadeIn();
            };

            $scope.register = function () {
                $('#RegisterWindow').modal('hide');
                $('#UserName').val('');
                $('#Type').val('');
                $('#Email').val('');
                $('#Company').val('');
                $('#FirstName').val('');
                $('#LastName').val('');
                $('#Month').val('');
                $('#Day').val('');
                $('#Year').val('');
                $('#Location').val('');

                $('#home').fadeOut();
                $('.registration-employer, .registration-dev, #ValidateUserName').hide();
                $('#UserName').removeClass('validation-error');
                $('#registration').fadeIn();
                $('#userTypeSelector').fadeIn();
            };
            $scope.gohome = function () {
                $('#home').fadeIn();
                $('#registration').fadeOut();
            };
            $scope.developerRegistration = function () {
                $('.registration-dev').fadeIn();
            };

            $scope.isUserNameValid = function (valid) {
                if (valid) {
                    $('#ValidateUserName').fadeOut();
                    $('#UserName').removeClass('validation-error');

                }
                else {
                    $('#ValidateUserName').fadeIn();
                    $('#UserName').addClass('validation-error');
                }
            }
            $scope.validateUserName = function (callback) {
                $.ajax({
                    url: 'http://localhost:3000/SecurityFacade/' + $('#UserName').val() + '/userExists',
                    success: function (data) {
                        callback(!data.result);
                    }
                });
            }
            $scope.completeRegistration = function () {
                var type = $('#Type').val();
                var company = null;
                if (type == 'Employer') {
                    company = $('#Company').val();
                }
                $http.post('http://localhost:3000/SecurityFacade/InsertUser',
                    {
                        userName: $('#UserName').val(),
                        type: type,
                        email: $('#Email').val(),
                        company: company,
                        firstName: $('#FirstName').val(),
                        lastName: $('#LastName').val(),
                        dob: $('#Month').val() + '/' + $('#Day').val() + '/' + $('#Year').val(),
                        location: $('#Location').val()
                    }
                ).success(function(){
                    $scope.login();
                });
            };
            $('#UserName').on('change', function () {
                $scope.validateUserName($scope.isUserNameValid);
            });

        }])
        .directive('myAccount', function () {
            return {
                template: 'Login',
                link: function ($scope, element) {
                    element.click(function () {
                        if (!$scope.IsAuthenticated) {
                            $('#RegisterWindow').modal();
                            $('#RegisterWindow').modal('show');
                        }
                    });
                }
            };
        })
        .directive('selectUserType', function () {
            return {
                link: function ($scope, element, attrs) {
                    var id = attrs.id;
                    element.click(function () {
                        $('#userTypeSelector').fadeOut();
                        $('#Type').val(id);
                        $('#' + id).removeAttr('checked');
                        if (id == 'Employer') {
                            $('.registration-employer').fadeIn();
                        }
                        else {
                            $('.registration-dev').fadeIn();
                        }
                    });
                }
            };
        });
}());




