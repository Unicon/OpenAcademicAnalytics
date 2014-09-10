-- This schema create script runs on every application load
-- Script failures will cause the application to fail to start
-- MySQL compatible schema
CREATE TABLE IF NOT EXISTS RISK_CONFIDENCE (
  ID BIGINT PRIMARY KEY AUTO_INCREMENT NOT NULL,
  ALTERNATIVE_ID VARCHAR(100) NOT NULL,
  COURSE_ID VARCHAR(100) NOT NULL,
  MODEL_RISK_CONFIDENCE VARCHAR(100) NOT NULL,
  DATE_CREATED DATETIME DEFAULT NULL
);
