pipeline {
    agent any
    stages {
        stage('Test') {
            steps {
                echo 'Hello from Jenkins & Sonnar'
            }
        }
        stage('SonarQube Analysis') {
                steps {
                    withSonarQubeEnv('SonarQube') {
                        sh "${tool 'SonarQube Scanner'}/bin/sonar-scanner \
                            -Dsonar.projectKey=mon-projet \
                            -Dsonar.sources=."
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
