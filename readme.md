# KGrid Smoke Test
This is a Build Verification Test, it is a non-exhaustive set of tests that aim at ensuring that the most 
important functions work. The Postman tests check the integartion and demo/test enviroments with simple health checks.

## Usage
This repo is called at the end of the [activator](https://github.com/kgrid/kgrid-activator) and 
[library](https://github.com/kgrid/kgrid-library) builds via CircleCi scripts. The repo is also trigger in circleci via cron 
schedule everyday at 9am.

In CircleCi this build job will notify Slack core change when the build tests fail.

Running the tests
```
npm test
```
