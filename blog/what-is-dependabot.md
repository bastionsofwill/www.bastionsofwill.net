---
title: Dependabot은 무엇일까?
tags:
  - github
  - devops
date: 2021-11-19 18:03:25
---

## 내 main 브랜치에 무슨 짓이야
Github 리포지토리에 Dependabot이라는 봇이 main 브랜치를 내가 생성한 적이 없는 브랜치와 머지하는 PR을 작성하였다. 
![](/images/dpdb_pr.png)
PR을 확인해보니 package-lock.json, package.json, yarn.lock 3개의 파일이 변경된 것을 확인할 수 있었는데, PR의 제목처럼 hexo-renderer-marked라는 패키지의 버전을 업데이트하면서 생긴 변경임을 확인할 수 있었다.

## Dependabot이란?
Dependabot은 Bump[1][1]라는 프로젝트로부터 출발한, 프로젝트의 의존성을 최신으로 유지하는 툴이다. 핵심 기능을 담당하는 Dependabot Core는 Ruby Gem들의 집합으로 Ruby, Python, JavaScript 등 넓은 범위의 언어를 지원하며, 리포지토리에 존재하는 코드의 의존성을 확인하여 업데이트 후 빌드하여 PR을 생성하는 기능을 수행한다.
![](/images/dpdb_pr.png)[2][2]
`.github/dependabot.yml` 파일을 통해 업데이트 스케줄, 최대 open된 PR의 개수 등을 추가로 설정할 수 있다.


### 출처
[1]: https://github.com/gocardless/bump
[2]: https://github.com/dependabot/dependabot-core
- https://www.nearform.com/blog/automatic-dependency-bump/
- https://github.com/dependabot/dependabot-core