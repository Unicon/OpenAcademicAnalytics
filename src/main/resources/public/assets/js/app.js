/*******************************************************************************
 * Copyright (c) 2015 Unicon (R) Licensed under the
 * Educational Community License, Version 2.0 (the "License"); you may
 * not use this file except in compliance with the License. You may
 * obtain a copy of the License at
 *
 * http://www.osedu.org/licenses/ECL-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an "AS IS"
 * BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express
 * or implied. See the License for the specific language governing
 * permissions and limitations under the License.
 *******************************************************************************/
'use strict';

angular
.module('LAP', ['ui.bootstrap', 'ui.router', 'ngCookies', 'ngSanitize', 'pascalprecht.translate', 'ui-notification']);

angular
.module('LAP')
  .constant('LOCALES', {
    'locales': {
      'cy_GB': 'Welsh',
      'en_US': 'English (US)',
      'en_GB': 'English (UK)'
    },
    'preferredLocale': 'en_US'
  })
.config(function(NotificationProvider) {
	NotificationProvider.setOptions({
	    delay: 10000,
	    startTop: 20,
	    startRight: 10,
	    verticalSpacing: 20,
	    horizontalSpacing: 20,
	    positionX: 'left',
	    positionY: 'bottom'
	});
 })
.config(function($translateProvider, $translatePartialLoaderProvider, LOCALES) {
    $translateProvider.useLoader('$translatePartialLoader', {
        urlTemplate: '/assets/translations/{lang}/{part}.json'
      });

    $translateProvider.preferredLanguage(LOCALES.preferredLocale);
    $translateProvider.useLocalStorage();
    $translateProvider.useSanitizeValueStrategy('sanitize');
    $translatePartialLoaderProvider.addPart('overview');
})
.config(function ($httpProvider, requestNotificationProvider) {
    $httpProvider.interceptors.push(function ($q) {
        return {
            request: function (config) {
               requestNotificationProvider.fireRequestStarted();
               return config;
            },
            response: function (response) {
              requestNotificationProvider.fireRequestEnded();
              return response;
            },
            
            responseError: function (rejection) {
              requestNotificationProvider.fireRequestEnded();              
              return $q.reject(rejection);
            }
        }
    });
})
.provider('requestNotification', function () {
    // This is where we keep subscribed listeners
    var onRequestStartedListeners = [];
    var onRequestEndedListeners = [];

    // This is a utility to easily increment the request count
    var count = 0;
    var requestCounter = {
        increment: function () {
            count++;
        },
        decrement: function () {
            if (count > 0) count--;
        },
        getCount: function () {
            return count;
        }
    };
    // Subscribe to be notified when request starts
    this.subscribeOnRequestStarted = function (listener) {
        onRequestStartedListeners.push(listener);
    };

    // Tell the provider, that the request has started.
    this.fireRequestStarted = function (request) {
        // Increment the request count
        requestCounter.increment();
        //run each subscribed listener
        angular.forEach(onRequestStartedListeners, function (listener) {
            // call the listener with request argument
            listener(request);
        });
        return request;
    };

    // this is a complete analogy to the Request START
    this.subscribeOnRequestEnded = function (listener) {
        onRequestEndedListeners.push(listener);
    };

    this.fireRequestEnded = function () {
        requestCounter.decrement();
        var passedArgs = arguments;
        angular.forEach(onRequestEndedListeners, function (listener) {
            listener.apply(this, passedArgs);
        });
        return arguments[0];
    };

    this.getRequestCount = requestCounter.getCount;

    //This will be returned as a service
    this.$get = function () {
        var that = this;
        // just pass all the 
        return {
            subscribeOnRequestStarted: that.subscribeOnRequestStarted,
            subscribeOnRequestEnded: that.subscribeOnRequestEnded,
            fireRequestEnded: that.fireRequestEnded,
            fireRequestStarted: that.fireRequestStarted,
            getRequestCount: that.getRequestCount
        };
    };
})
.config(['$httpProvider',function($httpProvider) {
	if (!$httpProvider.defaults.headers.get) {
		$httpProvider.defaults.headers.get = {};
	}
	$httpProvider.defaults.headers.get['Cache-Control'] = 'no-cache';
	$httpProvider.defaults.headers.get['Pragma'] = 'no-cache';
	$httpProvider.defaults.headers.common["X-Requested-With"] = 'XMLHttpRequest';
}])
.config(function($stateProvider, $urlRouterProvider, $locationProvider) {

	// For unmatched routes
	$urlRouterProvider.otherwise('/');
	
	// Application routes
	$stateProvider
	    .state('login', {
	        url: '/login',
	        templateUrl: '/assets/templates/login.html',
	        params: { loggedOutMessage : null},
	        resolve:{
	    	  isMultiTenant : function (FeatureFlagService) {
	    		return FeatureFlagService.isFeatureActive('multitenant');
	    	  }	
	     	},
	        controller: 'LoginCtrl'
	    })
	    .state('index', {
	        url: '/',
	        templateUrl: '/assets/templates/index.html',
		    resolve:{
	    	  runs : function ($stateParams, RunDataService) {
	    		return RunDataService.getRuns();
	    	  }	
	     	},
	        controller: 'IndexCtrl'
	    })
	    .state('index.pipelines', {
	        url: 'admin/pipelines',
	        templateUrl: '/assets/templates/pipelines.html',
		    resolve:{
	    		pipelines : function ($stateParams, PipelineDataService) {
	    			return PipelineDataService.getPipelines();
	    		}	
	     	},
	     	controller: 'PipelinesController'	    
	     })
	    .state('index.settings', {
	        url: 'admin/settings',
	        templateUrl: '/assets/templates/settings.html',
		    resolve:{
	    		sspConfig : function ($stateParams, SettingsService) {
	    			return SettingsService.getSSPConfig();
	    		}	
	     	},
	     	controller: 'SettingsController'	    
	    });	    
	$locationProvider.html5Mode(true);
});