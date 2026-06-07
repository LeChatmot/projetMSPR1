pipeline {
    agent any

    environment {
        GITHUB_TOKEN = credentials('GITHUB_TOKEN')
    }

    stages {
         stage('SonarQube Analysis') {
            steps {
                dir('JenkinsJobs/SonarQube') {
                    script {
                        load 'JenkinsFile'
                    }
                }
            }
        }

        stage('Run Unit Tests') {
            steps {
                dir('JenkinsJobs/Tests') {
                    script {
                        load 'JenkinsFile'
                    }
                }
            }
        }

        stage('Deploy to Staging') {
            when {
                branch 'main'
            }
            steps {
                dir('JenkinsJobs/Deploy') {
                    script {
                        load 'JenkinsFile'
                    }
                }
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
