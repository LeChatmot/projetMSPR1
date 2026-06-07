pipeline {
    agent any

    stages {
        stage('SonarQube Analysis') {
            steps {
                build job: 'JenkinsJobs/SonarQube/JenkinsFile',
                    parameters: [string(name: 'BRANCH_NAME', value: env.BRANCH_NAME)]
            }
        }

        stage('Run Unit Tests') {
            steps {
                build job: 'JenkinsJobs/Tests/JenkinsFile',
                    parameters: [string(name: 'BRANCH_NAME', value: env.BRANCH_NAME)]
            }
        }

        stage('Deploy to Staging') {
            when {
                branch 'main'
            }
            steps {
                build job: 'JenkinsJobs/Deploy/JenkinsFile',
                    parameters: [string(name: 'BRANCH_NAME', value: 'main')]
            }
        }
    }
}
