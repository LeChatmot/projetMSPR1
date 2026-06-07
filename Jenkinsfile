pipeline {
    agent any

    environment {
        GITHUB_TOKEN = credentials('GITHUB_TOKEN')
        SONAR_TOKEN = credentials('sonarqube-token')
        SONAR_HOST_URL = 'http://192.168.1.81:9000'
        SONAR_PROJECT_KEY = 'Mspr'
        PYTHON_VENV = 'venv'
        NODE_VERSION = '18'
        DOCKER_COMPOSE_VERSION = '2.23.0'
    }

    stages {

        // ========== SONARQUBE ==========
        stage('Analyse SonarQube') {
            steps {
                script {
                    withSonarQubeEnv('SonarQube') {
                        sh """
                            sonar-scanner \
                            -Dsonar.projectKey=${env.SONAR_PROJECT_KEY} \
                            -Dsonar.sources=. \
                            -Dsonar.host.url=${env.SONAR_HOST_URL} \
                            -Dsonar.token=${env.SONAR_TOKEN} \
                            -Dsonar.exclusions=**/node_modules/**,**/__pycache__/**,**/*.sql,**/migrations/**,**/coverage/**,**/dist/**,test-report.xml
                        """
                    }
                }
            }
        }

        stage('Quality Gate') {
            steps {
                script {
                    sleep(10)
                    def response = sh(script: """
                        curl -s "${SONAR_HOST_URL}/api/qualitygates/project_status?projectKey=${SONAR_PROJECT_KEY}"
                    """, returnStdout: true).trim()

                    echo "Réponse Quality Gate: ${response}"

                    if (response.contains('"status":"ERROR"')) {
                        error("Quality Gate échoué !")
                    } else {
                        echo "✅ Quality Gate OK"
                    }
                }
            }
        }

        stage('Unit Tests') {
            parallel {
                stage('Backend') {
                    stages {
                        stage('Setup Python environnement') {
                            steps {
                                sh '''
                                   python3 -m venv venv
                                   . venv/bin/activate
                                   pip install --upgrade pip
                                   pip install -r HealthIABack/requirements.txt
                                   pip install pytest pytest-cov
                               '''
                            }
                        }

                        stage('Run Python Tests') {
                            steps {
                                sh '''
                                   . venv/bin/activate
                                   cd HealthIABack
                                   pytest --cov=./ --cov-report=xml:coverage.xml -v
                               '''
                            }
                        }
                    }
                }

                stage('Frontend') {
                    stages {
                        stage('Setup Node environnement') {
                            steps {
                                sh """
                                   export NVM_DIR="\$HOME/.nvm"
                                   [ -s "\$NVM_DIR/nvm.sh" ] || curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.5/install.sh | bash
                                   . "\$NVM_DIR/nvm.sh"
                                   nvm install ${NODE_VERSION}
                                   nvm use ${NODE_VERSION}
                                   cd Frontend
                                   npm install
                               """
                            }
                        }

                        stage('Run Node Tests') {
                            steps {
                                sh """
                                    export NVM_DIR="\$HOME/.nvm"
                                    . "\$NVM_DIR/nvm.sh"
                                    nvm use ${NODE_VERSION}
                                    cd Frontend
                                    npx vitest run
                                """
                            }
                        }
                    }
                }
            }
        }

        // ========== RAPPORTS ==========
        stage('Aggregate Test Results') {
            steps {
                script {
                    publishHTML(target: [
                        allowMissing: false,
                        alwaysLinkToLastBuild: false,
                        keepAll: true,
                        reportDir: 'Frontend/coverage/lcov-report',
                        reportFiles: 'index.html',
                        reportName: 'Frontend Coverage'
                    ])
                    publishHTML(target: [
                        allowMissing: false,
                        alwaysLinkToLastBuild: false,
                        keepAll: true,
                        reportDir: 'HealthIABack/htmlcov',
                        reportFiles: 'index.html',
                        reportName: 'Backend Coverage'
                    ])
                }
            }
        }

        // ========== DEPLOIEMENT ==========
        stage('Build Docker Images') {
            when {
                branch 'main'
            }
            steps {
                script {
                    sh """
                        docker-compose -f docker-compose.yml build --no-cache
                    """
                }
            }
        }

        stage('Deploy to Server') {
            when {
                branch 'main'
            }
            steps {
                script {
                    sh """
                        scp docker-compose.yml user@your-server:/path/to/project/
                        ssh user@your-server "cd /path/to/project && docker-compose pull && docker-compose up -d --remove-orphans"
                    """
                }
            }
        }

        stage('Health Check') {
            when {
                branch 'main'
            }
            steps {
                script {
                    sh """
                        sleep 30
                        curl -f http://localhost:8000/health || exit 1
                        curl -f http://localhost:3000 || exit 1
                    """
                }
            }
        }
    }

    post {
        always {
            sh "rm -rf ${PYTHON_VENV}"
        }
        success {
            script {
                def message = """
                        ✅ **Pipeline SUCCESS**

                        - ✅ SonarQube : OK
                        - ✅ Quality Gate : OK
                        - ✅ Tests Python : OK
                        - ✅ Tests Node : OK
                        - ✅ Déploiement : OK

                        [Voir les logs](${env.BUILD_URL})
                """.stripIndent()
                sendGithubNotification('success', message)
            }
        }
        failure {
            script {
                def message = """
                        ❌ **Pipeline FAILED**

                        Vérifiez les logs pour plus de détails.

                        [Voir les logs](${env.BUILD_URL})
                """.stripIndent()
                sendGithubNotification('failure', message)
            }
        }
    }
}

// ========== FONCTION NOTIFICATION GITHUB ==========
def sendGithubNotification(String status, String message) {
    if (env.CHANGE_ID) {
        withCredentials([string(credentialsId: 'GITHUB_TOKEN', variable: 'GITHUB_TOKEN')]) {
            def repo = 'LeChatmot/projetMSPR1'
            def prNumber = env.CHANGE_ID
            def escapedMessage = message.replace('\n', '\\n').replace('"', '\\"')
            sh """
                curl -X POST \\
                    -H "Authorization: token \${GITHUB_TOKEN}" \\
                    -H "Accept: application/vnd.github.v3+json" \\
                    https://api.github.com/repos/${repo}/issues/${prNumber}/comments \\
                    -d '{"body": "${escapedMessage}"}'
            """
        }
    }
}
