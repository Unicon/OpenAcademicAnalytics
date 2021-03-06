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
package org.apereo.lap.services.notification;

import java.io.IOException;
import java.util.List;

import javax.annotation.PostConstruct;
import javax.annotation.PreDestroy;

import org.apereo.lap.services.configuration.ConfigurationService;
import org.apereo.lap.services.notification.handlers.NotificationHandler;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

/**
 * Handles all notifications from the app
 * 
 * @author Aaron Zeckoski (azeckoski @ unicon.net) (azeckoski @ vt.edu)
 */
@Component
public class NotificationService {

    private static final Logger logger = LoggerFactory.getLogger(NotificationService.class);

    public static enum NotificationLevel {
        /**
         * Informational notification (non-critical)
         */
        INFO,
        /**
         * Critical notification
         */
        CRITICAL
    }

    @Autowired ConfigurationService config;

    @Autowired
    List<NotificationHandler> notificationHandlers;

    @PostConstruct
    public void init() throws IOException {
        logger.info("INIT");
    }

    @PreDestroy
    public void destroy() {
        logger.info("DESTROY");
    }

    public void sendNotification(String message, NotificationLevel level) {
        if (level == null) {
            level = NotificationLevel.INFO;
        }
        for (NotificationHandler notificationHandler : notificationHandlers) {
            notificationHandler.sendNotification(level, message);
        }
    }

}
