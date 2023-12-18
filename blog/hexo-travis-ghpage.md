---
title: 'Hexo 튜토리얼: Travis CI를 사용한 Github Pages 블로그 운영'
tags:
  - Hexo
  - Travis CI
  - GitHub Pages
date: 2021-11-17 16:17:58
---

## Hexo란?
Hexo는 GitHub Pages를 사용한 블로깅에 자주 사용되는 Jekyll과 비슷한 블로깅 프레임워크이다. Ruby Gem 형태로 사용되어 Ruby 개발환경을 세팅해야 하는 Jekyll에 비해 내 환경에 이미 설치되어있던 Node.js와 Git 두 요구사항에 의존하는 점이 마음에 들어서 사용하게 되었다.

Hexo는 지정 폴더의 리소스를 관리하여 블로그 애셋을 생성/배포하는 방식으로 작동한다. 
`hexo init <folder>` 명령어로 블로깅에 사용할 폴더를 초기화하면 아래와 같은 형태의 구조를 갖추게 된다.
```
.
├── _config.yml
├── package.json
├── scaffolds
├── source
|   ├── _drafts
|   └── _posts
└── themes
```
draft 폴더에 마크다운 파일을 생성하고 `hexo publish` 명령어로 이를 post로 옮겨서 게시글 작성을 관리할 수 있으며, scaffolds를 통해 사전에 정의해둔 포맷으로 게시글을 생성할 수 있다. 각 게시글 상단에 Front-matter라는 YAML 또는 JSON 형식의 메타데이터를 입력하여 해당 게시글의 제목, 태그 등의 정보를 지정할 수 있다. 
게시글 작성을 마치고 _post 폴더로 옮긴 다음에는 .md 형식의 파일을 HTML, CSS, JS로 구성된 정적 페이지로의 변환하는 과정이 필요하다. 이를 수행하는 명령어가 `hexo generate`로, 로컬 환경에서 이를 실행한 후 호스팅하는 방식으로 사용할 수도 있겠지만, hexo는 다양한 방식의 보다 편리한 배포 및 관리를 지원한다.

## GitHub Pages와 Travis CI를 사용한 블로그 퍼블리싱
hexo는 git, heroku 등 다양한 환경에 맞는 배포 툴을 지원하지만, GitHub Pages를 사용하는 Hexo의 공식 튜토리얼에서는 Travis CI라는 CI 툴을 사용하여 배포를 진행한다.  
Travis CI에 GitHub Pages 리포지토리(**_username_.github.io**) 권한을 부여한 후, `.travis.yml` 파일을 리포지토리에 추가하여 `main` 브랜치에서 `gh-pages` 브랜치로의 배포를 자동화할 수 있다. `.travis.yml` 파일에는 `hexo generate` 명령어를 사용하여 정적 파일을 생성하는 스크립트가 설정되어 있다. 이후 리포지토리 설정에서 `gh-pages` 브랜치 내용을 GitHub Pages 사이트 소스로 설정하면, **_username_.github.io**로 사용자의 블로그를 호스팅할 수 있다.

### 출처
https://hexo.io/ko/docs/setup
https://hexo.io/ko/docs/github-pages
