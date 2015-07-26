(function () {
    var modalBound = false;
    app.controller('ProjectView', ['$scope', '$http', function ($scope, $http) {

        $scope.newProject = function () {
            $('#btnNewProject').fadeOut();
            if (!modalBound) {
                $('#ProjectWindow').on('hidden.bs.modal', function () {
                    $('#btnNewProject').fadeIn();
                }).modal('show');
                modalBound = true;
                $('#Category').select2({
                    tags: true
                });
            }
            else {
                $('#ProjectWindow').modal('show');
            }
            $('#ProjectName').val('');
            $('#ProjectDescription').val('');
            $('#Category').val('').trigger('change');
        }

        $scope.completeNewProject = function () {
            var project = new SiteModel.Project();
            $http.get('http://localhost:3000/Project/newId')
            .success(function (result) {
                console.log(result.newId);
                project.projectID = result.newId;
                project.projectName = $('#ProjectName').val();
                project.projectDescription = $('#ProjectDescription').val();
                project.category = $('#Category').val();
                $http.post('http://localhost:3000/Project/insert', project)
                .success(function () {
                    $('#ProjectWindow').modal('hide');
                    $('#content-container>div').hide();
                    $('#home').fadeIn();
                });
            });
            //project.projectID = 0;
            //project.employerID = 0;
            //project.projectName = '';
            //project.projectDescription = '';
            //project.teamID = 0;
            //project.category = '';
            //project.status = '';
            //project.price = 0.00;
            //project.developersInterested = [];
            //if ($scope.valid()) {
            //    var type = $('#Type').val();
            //    var company = null;
            //    var user = null;
            //    if (type == 'Employer') {
            //        user = new SiteModel.Employer();
            //        user.company = $('#Company').val();
            //    }
            //    else {
            //        user = new SiteModel.Developer();
            //    }
            //    user.userName = $('#UserName').val();
            //    user.type = $('#Type').val();
            //    user.email = $('#Email').val();
            //    user.firstName = $('#FirstName').val();
            //    user.lastName = $('#LastName').val();
            //    user.dob = $('#Month').val() + '/' + $('#Day').val() + '/' + $('#Year').val();
            //    user.location = $('#Location').val();

            //    $http.post('http://localhost:3000/Security/InsertUser',
            //        user
            //    ).success(function () {
            //        $scope.login();
            //    });
            //}
        };

    }])
       .directive('newProject', function () {
           return {
               link: function ($scope, element) {
                   element.click(function () {
                       $scope.newProject();
                   });
               }
           };
       });
}());




