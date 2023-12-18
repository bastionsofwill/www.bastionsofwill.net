---
title: GitLab 리포지토리로 AWS CodeGuru 사용하기
tags:
  - AWS
  - GitLab
  - devops
date: 2022-09-08 17:41:25
---

## Amazon CodeGuru
Amazon CodeGuru는 코드를 넣으면 코드를 분석하고 결과를 출력하는 서비스이다. 특히 AWS API를 사용하는 코드를 분석할 때 뛰어난 성능을 보여준다고 한다. CodeGuru 서비스는 CodeGuru Reviewer와 Profiler로 나뉘는데, Reviewer는 안정성(보안 취약점 식별, Best practice 제안), Profiler는 퍼포먼스에 초점을 둔 서비스로 볼 수 있다. 내가 관심있는 기능은 Reviewer이기 때문에, 이번 포스트에서는 Reviewer에 한정하여 작성한다.

CodeGuru로는 Java와 Python 코드를 분석할 수 있으며, AWS CodeCommit, Bitbucket, GitHub, GitHub Enterprise Server의 리포지토리는 Reviewer와 연동하여 사용이 가능하다.
문제는 우리 팀은 리모트 리포지토리로 GitLab을 사용하고 있어서 리포지토리와 직접 연동이 어렵다는 점이다. 하지만 해결책은 있기 마련이어서, GitLab에서 제공하는 Repository mirroring 기능을 활용하면 GitLab 리포지토리와 AWS CodeCommit 리포지토리를 연동할 수 있고, AWS 블로그에서 CodeGuru Reviewer CLI를 사용하여 CI/CD Pipeline을 설정하는 방법도 찾을 수 있었다.

## GitLab Repository Mirroring(AWS Codecommit)
AWS CodeCommit 리포지토리는 AWS 루트 계정에 종속된 자원이므로, 아래와 같이 IAM을 통한 권한 설정이 선행되어야 한다. 
1. IAM User에 `AWSCodeCommitPowerUser` 정책을 붙인다.
2. 해당 User의 `Security credentials`에 가서 `HTTPS Git credentials for AWS CodeCommit`에서 Git credential을 생성한다.

이후 CodeCommit 리포지토리를 생성하고 그 URL을 복사한다. 주의할 점은 CodeGuru는 2022년 9월 현재 Seoul 리전에서 서비스되지 않기 때문에 CodeGuru가 목적일 경우 다른 리전에 생성하여야 한다.

CodeCommit 리포지토리의 URL과 `CodeCommitPowerUser` 정책이 붙은 IAM User의 Git credential 2가지 정보가 있다면 비로소 GitLab에서 Reporitory mirroring 기능을 설정할 수 있다.

![](/images/gitlab_repo_mirror.png)

GitLab 리포지토리의 Setting > Repository > Mirroring repositories에서 URL을 입력하는데, 앞서 언급한 2개의 정보를 조합하여야 한다.
CodeCommmit 리포지토리 URL은 `https://git-codecommit.REGION_NAME.amazonaws.com/v1/repos/REPOSITORY_NAME` 형태인데, HTTP로 Git을 사용하기 위해 프로토콜 뒤에 Git Credential의 username을 추가하고 @를 추가해야 한다. 즉, 아래와 같은 형태로 URL을 입력한다
`https://GIT_CREDENTIAL_USERNAME@git-codecommit.REGION_NAME.amazonaws.com/v1/repos/REPOSITORY_NAME`
이후 아래 필드에 Password를 입력하고 저장하면 GitLab 리포지토리와 CodeCommit 리포지토리 간 Mirroring 관계가 성립된다.

## CodeGuru Reviewer CLI
고민했지만 AWS 블로그의 자세한 설명 이상으로 좋은 설명을 쓸 자신은 없어서 링크로 대신하기로 했다.

https://aws.amazon.com/blogs/devops/automating-detection-of-security-vulnerabilities-and-bugs-in-ci-cd-pipelines-using-amazon-codeguru-reviewer-cli/

Jenkins 인스턴스에 CodeGuru Reviewer CLI(AWS CLI *아님*)를 설치하고 권한을 설정하는 것이 주요 내용으로, CLI를 통해 지정한 위치에 output 파일이 생성되어 분석 결과를 확인하거나 결과값에 따라 파이프라인 분기를 설정하는 방식이다.
다만 CLI를 사용할경우 CodeGuru Console에서는 관련 내용을 확인할 수 없다는 단점이 있다. 

### 출처
https://docs.aws.amazon.com/codeguru/latest/reviewer-ug/welcome.html
https://docs.aws.amazon.com/codeguru/latest/profiler-ug/what-is-codeguru-profiler.html
https://docs.gitlab.com/ee/user/project/repository/mirror/
https://docs.aws.amazon.com/codecommit/latest/userguide/setting-up-gc.html?icmpid=docs_acc_console_connect
https://aws.amazon.com/blogs/devops/automating-detection-of-security-vulnerabilities-and-bugs-in-ci-cd-pipelines-using-amazon-codeguru-reviewer-cli/