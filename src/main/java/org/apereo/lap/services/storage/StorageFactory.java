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
/**
 * 
 */
package org.apereo.lap.services.storage;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

/**
 * @author ggilbert
 *
 */
@Component
public class StorageFactory {
  @Value("${lap.persistentStorage:H2}")
  private String persistentStorage;
  
  @Autowired private Map<String, PersistentStorage<ModelOutput>> persistentStorageOptions;
  @Autowired private Map<String, ModelRunPersistentStorage> modelRunPersistentStorageOptions;
  @Autowired private Map<String, SSPConfigPersistentStorage> sspConfigPersistentStorageOptions;
  
  public PersistentStorage<ModelOutput> getPersistentStorage() {
    return persistentStorageOptions.get(persistentStorage);
  }
  
  public ModelRunPersistentStorage getModelRunPersistentStorage() {
    
    String key = persistentStorage + "-ModelRunPersistentStorage";
    
    return modelRunPersistentStorageOptions.get(key);
  }
  
  public SSPConfigPersistentStorage getSSPConfigPersistentStorage() {
    
    String key = persistentStorage + "-SSPConfigPersistentStorage";
    
    return sspConfigPersistentStorageOptions.get(key);
  }

}
