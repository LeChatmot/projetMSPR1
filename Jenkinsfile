pipeline {
    agent any

    stages {
        stage('SonarQube Analysis') {
            steps {
                build job: './JenkinsJobs/SonarQube/Jenkinsfile',
                    parameters: [string(name: 'BRANCH_NAME', value: env.BRANCH_NAME)]
            }
        }

        stage('Run Unit Tests') {
            steps {
                build job: './JenkinsJobs/Tests/Jenkinsfile',
                    parameters: [string(name: 'BRANCH_NAME', value: env.BRANCH_NAME)]
            }
        }

        stage('Deploy to Staging') {
            when {
                branch 'main'
            }
            steps {
                build job: './JenkinsJobs/SonarQube/Jenkinsfile',
                    parameters: [string(name: 'BRANCH_NAME', value: 'main')]
            }
        }
    }
}
