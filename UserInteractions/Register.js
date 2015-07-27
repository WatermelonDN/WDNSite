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

            $scope.IsAuthenticated = function () {
                return $('#UserId').val() != '';
            };

            $scope.loginCount = [];
            $scope.checkLogin = function () {
                var login = new Security.Login();
                login.userName = $('#UserName').val();
                login.password = $('#Password').val();
                var found = false;
                for (var i in $scope.loginCount) {
                    if ($scope.loginCount[i].userName == login.userName && $scope.loginCount[i].count >= 3) {
                        found = true;
                        break;
                    }
                }
                if (found) {
                    $('#LoginValidation').fadeIn();
                    $('#LoginValidation').text('Account locked out.');
                }
                else {
                    $http.post('http://localhost:3000/Security/checkUser/', login)
                    .success(function (user) {
                        if (user == null) {
                            var found = false;
                            for (var i in $scope.loginCount) {
                                if ($scope.loginCount[i].userName == login.userName) {
                                    $scope.loginCount[i].count++;
                                    found = true;
                                    break;
                                }
                            }
                            if (!found) {
                                $scope.loginCount.push({ userName: login.userName, count: 1 });
                            }
                            $('#LoginValidation').fadeIn();
                            $('#LoginValidation').text('Invalid username or password.');
                        }
                        else {
                            $('#LoginValidation').fadeOut();
                            $scope.login(user.userID);
                        }
                    });
                }
            };

            $scope.login = function (userID) {
                $http.get('http://localhost:3000/Security/user/' + userID)
                .success(function (user) {
                    $('#registration').hide();
                    $('#RegisterWindow').modal('hide');
                    $('#home').fadeIn();
                    $('#UserId').val(userID);
                    $('#UserType').val(user.type);
                    $('#my-account').text(user.userName);
                    if (user.type == 'Employer') {
                        $('#btnNewProject').show();
                    }
                    else {
                        $('.btn-interested').each(function (i) {
                            var data = $(this).attr('data-interested');
                            var found = false;
                            if (data.indexOf(',') > -1) {
                                var inteested = data.split(',');
                                for (var i in interested) {
                                    if (parseInt(interested[i]) == userID) {
                                        found = true;
                                        break;
                                    }
                                }
                            }
                            else if (data != '') {
                                if (parseInt(data) == userID) {
                                    found = true;
                                }
                            }
                            if (!found) {
                                $('.btn-interested').fadeIn();
                            }
                        });
                    }
                });                
            };

            $scope.register = function () {
                $('#RegisterWindow').modal('hide');
                $('#NewUserName').val('');
                $('#NewPassword').val('');
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
                $('#NewUserName').removeClass('validation-error');
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
                    $('#NewUserName').removeClass('validation-error');

                }
                else {
                    $('#ValidateUserName').fadeIn();
                    $('#NewUserName').addClass('validation-error');
                }
            }
            $scope.validateUserName = function (callback) {
                $.ajax({
                    url: 'http://localhost:3000/Security/' + $('#NewUserName').val() + '/userExists',
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
                    user.userName = $('#NewUserName').val();
                    user.type = type;
                    user.email = $('#Email').val();
                    user.firstName = $('#FirstName').val();
                    user.lastName = $('#LastName').val();
                    user.dob = $('#Month').val() + '/' + $('#Day').val() + '/' + $('#Year').val();
                    user.location = $('#Location').val();
                    user.password = $('#NewPassword').val();

                    $http.post('http://localhost:3000/Security/InsertUser', user)
                        .success(function (result) {
                        $scope.login(result.userID);
                    });
                }
            };
            $('#NewUserName').on('change', function () {
                $scope.validateUserName($scope.isUserNameValid);
            });
            $scope.valid = function () {
                if ($('#NewUserName').val() == '' || $('#NewUserName').hasClass('validation-error')) return false;
                return true;
            };

        }])
        .directive('myAccount', function () {
            return {
                template: 'Login',
                link: function ($scope, element) {
                    element.click(function () {
                        if (!$scope.IsAuthenticated()) {
                            $('#UserName').val('');
                            $('#Password').val('');
                            $('#LoginValidation').hide();
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




