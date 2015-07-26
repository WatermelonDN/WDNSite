(function () {
    app.controller('Register', ['$scope', '$http',
        function ($scope, $http) {
            (function () {
                $('#Month').on('change', function () {
                    $(this).blur();
                    $('#Day').focus();
                });
                $('#Day').on('change', function () {
                    $(this).blur();
                    $('#Year').focus();
                });
            }());

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

                $('#content-container>div').hide();
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
                    url: 'http://localhost:3000/Security/' + $('#UserName').val() + '/userExists',
                    success: function (data) {
                        callback(!data.result);
                    }
                });
            }
            $scope.completeRegistration = function () {
                if ($scope.valid()) {
                    var type = $('#Type').val();
                    var user = null;
                    if (type == 'Employer') {
                        user = new SiteModel.Employer();
                        user.company = $('#Company').val();
                    }
                    else {
                        user = new SiteModel.Developer();
                    }
                    user.userName = $('#UserName').val();
                    user.type = type;
                    user.email = $('#Email').val();
                    user.firstName = $('#FirstName').val();
                    user.lastName = $('#LastName').val();
                    user.dob = $('#Month').val() + '/' + $('#Day').val() + '/' + $('#Year').val();
                    user.location = $('#Location').val();

                    $http.post('http://localhost:3000/Security/InsertUser',
                        user
                    ).success(function () {
                        $scope.login();
                    });
                }
            };
            $('#UserName').on('change', function () {
                $scope.validateUserName($scope.isUserNameValid);
            });
            $scope.valid = function () {
                if ($('#UserName').val() == '' || $('#UserName').hasClass('validation-error')) return false;
                return true;
            };

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




