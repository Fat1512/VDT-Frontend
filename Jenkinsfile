pipeline {
    agent {
        kubernetes {
            yaml """
                apiVersion: v1
                kind: Pod
                spec:
                  # Container 1
                  containers:
                  - name: jnlp
                    image: jenkins/inbound-agent:jdk17
                    args: ['\$(JENKINS_SECRET)', '\$(JENKINS_NAME)']
                    workingDir: /home/jenkins/agent
                    volumeMounts:
                    - name: workspace-volume
                      mountPath: /home/jenkins/agent

                  # Container 2
                  # THAY ĐỔI: Sử dụng image 'debug' của Kaniko. Image này chứa shell và lệnh 'sleep'.
                  - name: kaniko
                    image: gcr.io/kaniko-project/executor:debug
                    imagePullPolicy: Always
                    command: [sleep]
                    args: [9999999]
                    resources:
                    requests:
                      ephemeral-storage: "2Gi"
                    limits:
                      ephemeral-storage: "3Gi"
                    volumeMounts:
                    - name: workspace-volume
                      mountPath: /home/jenkins/agent
                    - name: docker-config
                      mountPath: /kaniko/.docker/
                  volumes:
                  # Volume để chia sẻ workspace giữa tất cả các container
                  - name: workspace-volume
                    emptyDir: {}
                  # Volume từ Secret để Kaniko xác thực với Docker Hub
                  - name: docker-config
                    secret:
                      secretName: dockerhub-credentials
                      items:
                        - key: .dockerconfigjson
                          path: config.json
                """
                
        }
    }

    // THAY ĐỔI 2: Cập nhật biến môi trường
    // DOCKERHUB_CREDENTIALS_ID không còn cần thiết cho việc build
    environment {
        DOCKER_IMAGE_NAME = 'fat1512/vdt-frontend'
        GIT_BRANCH = 'main'
        GIT_CONFIG_REPO_CREDENTIALS_ID = 'github-cred'
        GIT_CONFIG_REPO_URL = 'https://github.com/Fat1512/VDT-Frontend'
    }

    stages {
        stage('Checkout') {
            steps {
                script {
                    echo "Checking out..."
                     git url: GIT_CONFIG_REPO_URL, 
                        branch: GIT_BRANCH, 
                        credentialsId: GIT_CONFIG_REPO_CREDENTIALS_ID
                    echo "Checked out."
                }
            }
        }
        // THAY ĐỔI 5: Giai đoạn quan trọng nhất - Build và Push với KANIKO
        stage('Build & Push Docker Image (with Kaniko)') {
            steps {
                // THAY ĐỔI: Chạy `script` ở ngoài `container` để lấy git commit trước
                script {
                    // Bước 1: Lấy git commit hash trong container mặc định 'jnlp' (nơi có git)
                    def gitCommit = sh(script: 'git rev-parse HEAD', returnStdout: true).trim().substring(0, 8)
                    def dockerImageTag = "${DOCKER_IMAGE_NAME}:${gitCommit}"

                    // Bước 2: Đi vào container 'kaniko' để thực hiện build
                    container('kaniko') {
                        echo "Đang build và push image với Kaniko: ${dockerImageTag}"
                        sh """
                        /kaniko/executor --context `pwd` \\
                                         --dockerfile `pwd`/Dockerfile \\
                                         --destination ${dockerImageTag}
                        """
                        echo "Build và push với Kaniko thành công."
                    }
                }
            }
        }
        stage('Update K8s Manifest Repo') {
            steps {
                // Chạy trong container mặc định là 'jnlp'
                script {
                    def gitCommit = sh(script: 'git rev-parse HEAD', returnStdout: true).trim().substring(0, 8)
                    def dockerImageTag = "${DOCKER_IMAGE_NAME}:${gitCommit}"

                    echo "Update K8s Frontend Manifest..."
                    
                    sshagent(credentials: ['repo-access-credentials']) {
                        sh 'mkdir -p ~/.ssh && ssh-keyscan github.com >> ~/.ssh/known_hosts'
                        sh "git clone -b main git@github.com:Fat1512/VDT-Frontend-Config.git"
        
                        dir('VDT-Frontend-Config') {
                            echo "Đang cập nhật image tag trong app/deployment.yaml thành ${dockerImageTag}"
        
                            // Optional if you're using Helm chart structure
                            sh "sed -i 's|image: .*|image: ${dockerImageTag}|g' charts/templates/deployment.yaml"
        
                            sh "git config user.email 'letanphat15122004@gmail.com'"
                            sh "git config user.name 'Fat1512'"
        
                            sh "git add -A"
                            sh "git commit -m 'ci: update ${gitCommit}'"
                            sh "git push origin main"
                        }
                    }
                    echo "Cập nhật kho chứa cấu hình K8s thành công."
                }
            }
        }
    }
    
    post {
        always {
            cleanWs()
        }
    }
}
