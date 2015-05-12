'use strict';

angular.module('hopsWorksApp')
  .controller('HomeCtrl', ['ProjectService', 'ModalService', 'growl', 'ActivityService',
    function (ProjectService, ModalService, growl, ActivityService) {

      var self = this;
      self.projects = [];

      // Load all projects
      var loadProjects = function () {
        ProjectService.query().$promise.then(
          function (success) {
            self.projects = success;

            self.pageSizeProjects = 10;
            self.totalPagesProjects = Math.ceil(self.projects.length / self.pageSizeProjects);
            self.totalItemsProjects = self.projects.length;
            self.currentPageProjects = 1;

          }, function (error) {
            console.log('Error: ' + error);
          }
        );
      }

      loadProjects();

      // Create a new project
      self.newProject = function () {
        ModalService.createProject('lg').then(
          function () {
            loadProjects();
          }, function () {
            growl.info("Closed project without saving.", {title: 'Info', ttl: 5000});
          });
      };


      self.histories = [];
      var histories = [];

      ActivityService.getByUser().then(
        function (success) {
          histories = success;
          var today = new Date();
          var day = today.getDate();
          var yesterday = new Date(new Date().setDate(day - 1));
          var lastWeek = new Date(new Date().setDate(day - 7));
          var older = new Date(new Date().setDate(day - 14));

          var firstToday = true;
          var firstYesterday = true;
          var firstThisWeek = true;
          var firstLastWeek = true;
          var firstOlder = true;

          today.setHours(0, 0, 0, 0);
          yesterday.setHours(0, 0, 0, 0);
          lastWeek.setHours(0, 0, 0, 0);
          older.setHours(0, 0, 0, 0);

          var i = 0;

          histories.data.slice().forEach(function (history) {
            var historyDate = new Date(history.timestamp);
            historyDate.setHours(0, 0, 0, 0);

            if (+historyDate === +today) {
              if (firstToday) {
                firstToday = false;
                history.flag = 'today';
              } else if (i % 10 == 0) {
                history.flag = 'today';
              } else {
                history.flag = '';
              }
            } else if (+historyDate === +yesterday) {
              if (firstYesterday) {
                firstYesterday = false;
                history.flag = 'yesterday';
              } else if (i % 10 == 0) {
                history.flag = 'yesterday';
              } else {
                history.flag = '';
              }
            } else if (+historyDate > +lastWeek) {
              if (firstThisWeek) {
                firstThisWeek = false;
                history.flag = 'thisweek';
              } else if (i % 10 == 0) {
                history.flag = 'thisweek';
              } else {
                history.flag = '';
              }
            } else if (+historyDate <= +lastWeek && +historyDate >= +older) {
              if (firstLastWeek) {
                firstLastWeek = false;
                history.flag = 'lastweek';
              } else if (i % 10 == 0) {
                history.flag = 'lastweek';
              } else {
                history.flag = '';
              }
            } else {
              if (firstOlder) {
                firstOlder = false;
                history.flag = 'older';
              } else if (i % 10 == 0) {
                history.flag = 'older';
              } else {
                history.flag = '';
              }
            }

            self.histories.push(history);
            i++;

          });
          self.pageSize = 10;
          self.totalPages = Math.floor(self.histories.length / self.pageSize);
          self.totalItems = self.histories.length;
        }, function (error) {
        }
      );

      self.currentPage = 1;


    }]);
