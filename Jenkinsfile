pipeline {
    agent any

    stages {
        stage('SonarQube Analysis') {
            steps {
                build job: 'HealthIA-Multibranch/JenkinsJobs/SonarQube/Jenkinsfile',
                    parameters: [string(name: 'BRANCH_NAME', value: env.BRANCH_NAME)]
            }
        }

        stage('Run Unit Tests') {
            steps {
                build job: 'HealthIA-Multibranch/JenkinsJobs/Tests/Jenkinsfile',
                    parameters: [string(name: 'BRANCH_NAME', value: env.BRANCH_NAME)]
            }
        }

        stage('Deploy to Staging') {
            when {
                branch 'main'
            }
            steps {
                build job: 'HealthIA-Multibranch/JenkinsJobs/SonarQube/Jenkinsfile',
                    parameters: [string(name: 'BRANCH_NAME', value: 'main')]
            }
        }
    }
}
