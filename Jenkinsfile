pipeline {
    agent any

    environment {
        GITHUB_TOKEN = credentials('GITHUB_TOKEN')
    }

    stages {
        stage('SonarQube Analysis') {
            steps {
                dir('JenkinsJobs/SonarQube') {
                    build job: 'SonarQube',
                        parameters: [string(name: 'BRANCH_NAME', value: env.BRANCH_NAME)],
                        wait: true
                }
            }
        }

        stage('Run Unit Tests') {
            steps {
                dir('JenkinsJobs/Tests') {
                    build job: 'Tests',
                        parameters: [string(name: 'BRANCH_NAME', value: env.BRANCH_NAME)],
                        wait: true
                }
            }
        }

        stage('Deploy to Staging') {
            when {
                branch 'main'
            }
            steps {
                dir('JenkinsJobs/Deploy') {
                    build job: 'Deploy',
                        parameters: [string(name: 'BRANCH_NAME', value: 'main')],
                        wait: true
                }
            }
        }
    }

    post {
        success {
            script {
                if (env.CHANGE_ID) {
                    sh """
                        curl -X POST \\
                            -H "Authorization: token \${GITHUB_TOKEN}" \\
                            -H "Accept: application/vnd.github.v3+json" \\
                            https://api.github.com/repos/LeChatmot/projetMSPR1/issues/\${env.CHANGE_ID}/comments \\
                            -d '{"body": "✅ **Pipeline SUCCESS** : SonarQube, Tests et Déploiement passés ! [Voir les logs](\${env.BUILD_URL})"}'
                    """
                }
            }
        }
        failure {
            script {
                if (env.CHANGE_ID) {
                    sh """
                        curl -X POST \\
                            -H "Authorization: token \${GITHUB_TOKEN}" \\
                            -H "Accept: application/vnd.github.v3+json" \\
                            https://api.github.com/repos/LeChatmot/projetMSPR1/issues/\${env.CHANGE_ID}/comments \\
                            -d '{"body": "❌ **Pipeline FAILED** : Vérifiez les logs. [Voir les logs](\${env.BUILD_URL})"}'
                    """
                }
            }
        }
    }
}
