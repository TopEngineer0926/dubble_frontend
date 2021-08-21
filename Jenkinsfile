#!groovy

// add the spring boot deployment helper library
@Library('pipeline-libraries') _

pipeline {

    environment {
        // Project specific informations
        projectname = 'dubble-cms'

        // The basepath to docker. If not set its using /var/local/. Do not add / at end
        docker_path = '/var/local/dubble/cms'

        // The slack channel to publish the result to
        slackChannel = 'dubble'

        ///// The server variables
        // attention: this servers must be in the ansible hosts file on jenkins in order to work
        server_dev = 'docker-dev'
        server_test = ''
        server_stage = 'docker-stage'
        server_prod = 'dubble-prod'

    }

    agent {
        label 'web'
    }
    options {
        // Disable concurrent builds
        disableConcurrentBuilds()
        // Maximum build time 1 hour
        timeout(time: 1, unit: 'HOURS')
        // Only keep the most recent builds
        buildDiscarder(logRotator(numToKeepStr: '3', artifactNumToKeepStr: '3'))
        // Stop the build early in case of compile or test failures
        skipStagesAfterUnstable()
    }
    stages {

        stage('Setup & Checkout') {
            steps {
                cleanWs()
                // checkout branch
                checkout scm
            }
        }

        /**
         * Checkout the proper branch.
         */
        stage('Clean & Prepare') {
            steps {
                sh 'npm install'
            }
        }

        stage('Unit test') {
            steps {

                // Compile and run the unit tests for the app and its dependencies
                //sh 'npm run test'
				sh 'echo Unit Test not implemented yet'

            }
        }

        stage('Dev Server') {
            when {
                branch 'develop'
            }
            steps {
				// deploy angular build to dev
                deployAngularToDocker(server_dev, 'dev', 'dev', docker_path)
            }
            post {
//                success {
//                    sendDeployInfoToSlack(slackChannel, 'dev', true, '', swagger_docu_url);
//                }
                failure {
                    sendDeployInfoToSlack(slackChannel, 'dev', false, '@dominik Plz fix the problem.');
                }
            }
        }

//        stage('Test Server') {
//            when {
//                branch 'release/*'
//            }
//            steps {
//                sh 'echo Test Deploy: Currently not neccessary'
//            }
//        }

        stage('Stage Server') {
            when {
                branch 'release/*'
            }
            steps {
                deployAngularToDocker(server_stage, 'stage', 'stage', docker_path)
            }
            post {
				success {
					tagRelease('stage', true)
//                  sendDeployInfoToSlack(slackChannel, 'stage', true);
				}
//				failure {
//					sendDeployInfoToSlack(slackChannel, 'stage', false);
//				}
			}
        }

        stage('Prod Server') {
            when {
                branch 'master'
            }
            steps {
                deployAngularToDocker(server_prod, 'prod', 'prod', docker_path)
            }
            post {
				success {
					tagRelease('prod', true)
					//sendDeployInfoToSlack(slackChannel, 'stage', true);
				}
//				failure
//				{
//					sendDeployInfoToSlack(slackChannel, 'stage', false);
//				}
			}
        }

    }

    post {
        always {
            echo 'Pipeline done...'
        }
        success {
            cleanWs()
        }
    }

}
