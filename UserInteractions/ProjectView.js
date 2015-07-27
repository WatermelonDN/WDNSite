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
            project.employerID = $('#UserId').val();
            project.projectName = $('#ProjectName').val();
            project.projectDescription = $('#ProjectDescription').val();
            project.category = $('#Category').val();
            $http.post('http://localhost:3000/Project/insert', project)
            .success(function () {
                $('#ProjectWindow').modal('hide');
                $('#content-container>div').hide();
                $('#home').fadeIn();
            });
        }
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




