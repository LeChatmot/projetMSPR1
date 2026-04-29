pipeline {
    agent any
    stages {
        stage('Test') {
            steps {
                echo 'Hello from Jenkins & Sonnar'
            }
        }
    }
    stage('SCM') {
        checkout scm
    }
    stage('SonarQube Analysis') {
        def scannerHome = tool 'SonarScanner';
        withSonarQubeEnv() {
          sh "${scannerHome}/bin/sonar-scanner"
    }
  }
}
