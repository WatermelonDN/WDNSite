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

        $scope.getAllProjects = function () {
            $('#ProjectList>tr.tr-content').remove();
            $http.get('http://localhost:3000/Project/all')
            .success(function (projects) {
                for (var i in projects) {
                    var categories = '';
                    for (var x in projects[i].category) {
                        categories += '&nbsp;&nbsp;&nbsp;&nbsp;<i class="fa fa-tag"></i>&nbsp;' + projects[i].category[x];
                    }
                    var interested = '';
                    for (var x in projects[i].developersInterested) {
                        interested += (x > 0 ? ',' : '') + projects[i].developersInterested[x];
                    }
                    $('<tr class="tr-content"><td>' + projects[i].projectName + '</td><td>' + projects[i].projectDescription + '</td><td>' + categories + '</td><td><button class="btn btn-primary btn-interested" data-interested="' + interested + '" data-id="' + projects[i].projectID + '" style="display:none;"><i class="fa fa-thumbs-o-up"></i> Interested?</button><span style="display:none;"><i class="fa fa-thumbs-up"></i> Interested</span></td></tr>').appendTo($('#ProjectList>tbody'));
                }
                $('.btn-interested').on('click', function () {
                    $scope.showInterest($(this));
                });
            });
        };

        $scope.showInterest = function (button) {
            var project = new SiteModel.Project();
            project.developersInterested = button.attr('data-interested').split(',');
            project.projectID = button.attr('data-id');
            $http.post('http://localhost:3000/Project/' + parseInt(button.attr('data-id')) + '/Interested', [$('#UserId').val()])
            .success(function (data) {
                button.fadeOut(function () {
                    button.parent().find('span').fadeIn();
                });
            });
        };

        $scope.getAllProjects();

        $scope.completeNewProject = function () {
            var project = new SiteModel.Project();
            project.employerID = parseInt($('#UserId').val());
            project.projectName = $('#ProjectName').val();
            project.projectDescription = $('#ProjectDescription').val();
            project.category = $('#Category').val();
            $http.post('http://localhost:3000/Project/insert', project)
            .success(function () {
                $('#ProjectWindow').modal('hide');
                $scope.getAllProjects();
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
       })
}());




