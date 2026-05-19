pipeline {
    agent any
    stages {
        stage('Test') {
            steps {
                echo 'Hello from Jenkins & Sonnar'
            }
        }
        stage('SCM') {
            steps{
                checkout scm
            }
        }
        stage('SonarQube Analysis') {
            steps{
                step{
                    def scannerHome = tool 'SonarScanner';
                }
                step{
                    withSonarQubeEnv() {
                        sh "${scannerHome}/bin/sonar-scanner"
                    }
                }
            }
        }
        stage('Quality Gate') {
            steps {
                timeout(time: 5, unit: 'MINUTES') {
                    waitForQualityGate abortPipeline: true
                }
            }
        }
    }
}
