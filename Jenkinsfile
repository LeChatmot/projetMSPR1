pipeline {
    agent any

    tools {
        sonarScanner 'SonarScanner' // Name from Global Tool Config
    }

    stages {
        stage('Checkout') {
            steps {
                git 'https://github.com/LeChatmot/projetMSPR1.git'
            }
        }

        stage('SonarQube Analysis') {
            steps {
                withSonarQubeEnv('SonarQube') {
                    sh 'sonar-scanner'
                }
            }
        }
    }
}
