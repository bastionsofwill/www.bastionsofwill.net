---
title: Travis CI 에러 조치
tags:
  - Travis CI
  - devops
  - weekend
date: 2022-06-12 21:27:57
---

## \#74 errored
오랜만에 블로그에 포스트를 작성하고 블로그를 둘러보니, 이전에 작성한 불필요한 포스트가 보였다. 이를 로컬 디렉토리에서 삭제한 후, 블로그에 반영하기 위해 리포지토리 main 브랜치에 push하였다. 
리포지토리는 Travis CI를 통해 빌드/배포 자동화가 설정되어 있으므로, 여느 때와 같이 빌드/배포 작업이 진행될거라 기대했지만, 빌드가 실패했다는 메일을 받게 되었다.
![](/images/travis-error.jpg) 
지난 11월에 블로그 프레임워크를 Hexo로 바꾸면서, Hexo 튜토리얼 문서를 보고 그대로 따라한 뒤(https://bastionsofwill.github.io/2021/11/17/hexo-travis-ghpage) 처음 겪는 빌드 실패여서 당혹스러웠으나, 몇 시간 전에 성공한 것이 실패한 이유는 당연히 안 해본 짓(포스트 삭제)을 했기 때문일 것으로 추정하고 해결을 미뤘다. 
하지만 빌드 실패 결과를 살펴본 결과, 문제는 다른 곳에 있음을 알 수 있었다.

## Job Log
```bash
Worker information
(생략)
Build system information
(생략)
$ git clone --depth=50 --branch=main https://github.com/bastionsofwill/bastionsofwill.github.io.git bastionsofwill/bastionsofwill.github.io

Setting environment variables from repository settings
$ export GH_TOKEN=[secure]

$ nvm install 16

Setting up build cache
$ export CASHER_DIR=${TRAVIS_HOME}/.casher
$ Installing caching utilities
attempting to download cache archive
fetching main/cache--linux-xenial-e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855--node-16.tgz
found cache
$ node --version
v16.15.1
$ npm --version
8.11.0
$ nvm --version
0.39.1
$ yarn --version
1.22.18

$ yarn --frozen-lockfile
hexo generate
(생략)
The command "hexo generate" exited with 0.

store build cache
changes detected (content changed, file is created, or file is deleted):\n/home/travis/.npm/_logs/2022-06-09T17_42_37_173Z-debug-0.log\n
changes detected, packing new archive
uploading main/cache--linux-xenial-e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855--node-16.tgz
cache uploaded

$ rvm $(travis_internal_ruby) --fuzzy do ruby -S gem install dpl
Installing deploy dependencies
ERROR:  Error installing dpl-pages:
	The last version of multipart-post (>= 1.2, < 3) to support your Ruby & RubyGems was 2.2.0. Try installing it with `gem install multipart-post -v 2.2.0` and then running the current command again
	multipart-post requires Ruby version >= 2.6.0. The current ruby version is 2.4.5.335.
Successfully installed public_suffix-3.0.3
Successfully installed addressable-2.8.0
/home/travis/.rvm/rubies/ruby-2.4.5/lib/ruby/site_ruby/2.4.0/rubygems/core_ext/kernel_require.rb:54:in `require': cannot load such file -- dpl/provider/pages (LoadError)
	from /home/travis/.rvm/rubies/ruby-2.4.5/lib/ruby/site_ruby/2.4.0/rubygems/core_ext/kernel_require.rb:54:in `require'
	from /home/travis/.rvm/gems/ruby-2.4.5/gems/dpl-1.10.16/lib/dpl/provider.rb:93:in `rescue in block in new'
	from /home/travis/.rvm/gems/ruby-2.4.5/gems/dpl-1.10.16/lib/dpl/provider.rb:68:in `block in new'
	from /home/travis/.rvm/gems/ruby-2.4.5/gems/dpl-1.10.16/lib/dpl/cli.rb:41:in `fold'
	from /home/travis/.rvm/gems/ruby-2.4.5/gems/dpl-1.10.16/lib/dpl/provider.rb:67:in `new'
	from /home/travis/.rvm/gems/ruby-2.4.5/gems/dpl-1.10.16/lib/dpl/cli.rb:31:in `run'
	from /home/travis/.rvm/gems/ruby-2.4.5/gems/dpl-1.10.16/lib/dpl/cli.rb:7:in `run'
	from /home/travis/.rvm/gems/ruby-2.4.5/gems/dpl-1.10.16/bin/dpl:5:in `<top (required)>'
	from /home/travis/.rvm/gems/ruby-2.4.5/bin/dpl:23:in `load'
	from /home/travis/.rvm/gems/ruby-2.4.5/bin/dpl:23:in `<main>'
failed to deploy
```
에러가 난 부분을 보면, deploy dependencies를 설치하다가 `dpl-pages`에서 에러가 발생했고, `multipart-post`가 Ruby 2.6.0을 요구하는데 현재 버전이 2.4.5.335인 것이 문제로 보인다.

## errored?
먼저 Travis CI가 동작하는 과정에 대한 간략한 이해가 필요하다. 
Travis CI가 수행할 작업을 정의하는 구조는 phase -> job -> stage -> build로, 하나의 *job*은 아래와 같은 *phase*로 구성된다.
1. `before_install`
2. `install`: dependency의 설치
3. `before_script`
4. `script`: build script 실행
5. `before_cache`(OPTIONAL)
6. `after_success/failure`
7. `before_deploy`(OPTIONAL)
8. `deploy`(OPTIONAL)
9. `after_deploy`(OPTIONAL)
10. `after_script`

*stage*는 이러한 job들이 병렬로(in parellel) 실행되는 그룹을 말하며, *build*는 이러한 stage들이 순차적으로 실행되는 그룹을 말한다.

하나 이상의 job이 실패할 경우 그 job이 속한 빌드는 비정상(break)이 되며, 비정상 빌드는 아래 세 가지 키워드 중 하나로 표시된다.
- *errored*: `before_install`, `install`, `before_script`, `before_deploy` phase가 정상적으로 종료되지 않을 경우(non-zero exit code) 발생
- *failed*: `script` phase가 정상적으로 종료되지 않을 경우 발생
- *canceled*: 사용자에 의한 취소
`after_success/failure`, `after_deploy`, `after_script`의 exit code는 빌드 결과에 영향을 미치지 않지만, 타임아웃이 발생했을 경우 빌드 결과는 *failed*로 표시된다.

즉, 위의 job log를 살펴본 결과, `hexo generate`라는 1줄짜리 스크립트가 실행되는 `script` phase까지는 무사히 실행되었으나, `before_deploy` phase에서 deploy dependency를 설치하다가 오류가 나서 build가 errored로 표시된 것임을 확인할 수 있었다.

## dpl-pages와 multipart-post
에러가 난 지점에 대한 감은 잡을 수 있었다. 하지만 여전히 문제에 대한 지식은 많이 모자란 상황이다.
```bash
Installing deploy dependencies
ERROR:  Error installing dpl-pages:
	The last version of multipart-post (>= 1.2, < 3) to support your Ruby & RubyGems was 2.2.0. Try installing it with `gem install multipart-post -v 2.2.0` and then running the current command again
	multipart-post requires Ruby version >= 2.6.0. The current ruby version is 2.4.5.335.
```
에러 로그를 다시 살펴보면, `dpl-pages`를 설치하다가 에러가 발생하였고,  `multipart-post`가 요구하는 ruby 버전이 2.6.0 이상인 것이 문제임을 알 수 있었다. 

첫번째로 든 의문은, '`dpl-pages`, `multipart-post`는 또 뭔데?'였다. '배포 작업을 수행하기 위해 필요한 무언가' 정도로만 추정이 되는 상황이었으므로, Travis CI가 배포하는 방식에 대한 지식이 필요했다.

이전에 생각없이 hexo tutorial을 복붙하면서, 나는 인지하지 못한 채 Travis CI의 GitHub Pages Deployment 기능을 사용하고 있었다. 
```yml
deploy:
  provider: pages
  skip-cleanup: true
  github-token: $GH_TOKEN
  keep-history: true
  on:
    branch: main
  local-dir: public
```
위의 yml 파일이 관련 설정으로, `provider: pages`를 비롯한 설정을 통해 `hexo generate`의 결과물인 public 디렉토리 하위 파일들을 타겟 브랜치(지정하지 않았으므로 기본값인 `gh-pages` 브랜치)에 push하는 기능이다.

해당 기능에 대한 Travis CI 문서 확인 결과, dpl이라는 루비 코드를 사용하는 것을 알 수 있었다. 하지만 여기서 결국 `dpl-pages`, `multipart-post`에 대한 내용은 결국 찾지 못했는데, ruby에 대한 지식이 없는 상황에서 dpl의 문서에는 관련 내용이 없기 때문이다. 하지만 dpl은 rubygem으로 publish/관리되고 있다는 내용이 있었으므로, dpl, dpl-pages, multipart-post라는 gem에 대한 기본적인 정보는 찾을 수 있었다.

## 갈림길
```bash
Installing deploy dependencies
ERROR:  Error installing dpl-pages:
	The last version of multipart-post (>= 1.2, < 3) to support your Ruby & RubyGems was 2.2.0. Try installing it with `gem install multipart-post -v 2.2.0` and then running the current command again
	multipart-post requires Ruby version >= 2.6.0. The current ruby version is 2.4.5.335.
```
위의 메시지를 자세히 보면, 배경이 어떻든 결국 `multipart-post`라는 gem이 ruby *2.6.0* 이상을 요구하는 반면, 환경에 설치된 ruby는 *2.4.5.335* 버전인 것이 문제임을 알 수 있다.

따라서 이를 해결하기 위해서는 아래 두 가지 해결책을 떠올릴 수 있다.
1. ruby 버전을 *2.6.0* 이상으로 올린다.
2. `multipart-post`의 버전을 *2.2.0*으로 내린다.(에러 메시지에서 권장한 방법)

두 방법 모두 Travis CI가 동작하는 환경에 대한 조작이 필요하므로, `.travis.yml` 파일을 건드려야 한다. 쉽게 끝날 수도 있겠지만 아닐 가능성이 더 커서 꺼려지는데, 어느 쪽이 더 쉽고 문제가 적을지를 생각했다.

#### 1안: ruby 버전 업그레이드
2안 같은 버전 다운그레이드는 결국 문제를 나중에 터지도록 미루는 것이라는 생각이 들었다. 또 몇 시간 전까지도 잘 동작하다가 에러가 발생한 상황이어서, ruby 2.6.0은 비교적 최근에 릴리즈된 버전일 것이라 예상했고, 새로운 버전을 쓰면 좋을 것이라는 생각이 들었다. 
하지만 확인 결과, ruby 2.6.0의 릴리즈 일자는 2018년 말이고 2.6.10도 이미 지원 종료(EOL)되었다. 이를 알게 되니 '아직도 몇년 전 버전의 루비를 사용하는 것을 보니 역시 고수들도 dependency는 함부로 건드리기 어렵구나' 라는 생각에 갑자기 버전 업그레이드가 부담스러워졌다. 
애초에 에러 메시지에서도 `multiport-post`의 버전을 낮출 것을 권장하였으니, 2안에 대해 알아보는 것이 좋을 것 같다.

#### 2안: multipart-post 버전 다운그레이드
몇 시간 전만 해도 되던 걸 안 되게 만든 주범으로 추정되는 `multipart-post`는 직접적으로 확인할 수는 없었지만 에러 메시지를 통해 추정하면, 몇 시간 새 2.2.0 이후 버전이 적용되면서 Travis CI의 가상환경에서 사용되던 ruby 버전과 충돌을 일으킨 것으로 추정된다. 
확인을 위해 rubygems.org에서 `multipart-post`를 찾아본 결과, 2022년 6월 9일에 릴리즈된 2.2.2 버전은 ruby 2.6.0 이상을 요구하였다. 하지만, 그 다음날에 릴리즈된 2.2.3 버전은 ruby 2.3.0 이상으로 요구 조건이 완화되었다. 즉, `multipart-post` 2.2.3 버전을 사용하면 현재 버전인 2.4.335도 문제없이 사용이 가능한 것이다.

## 고마워요, ioquatix!
따라서, `multipart-post`를 관리하는 고수님들의 빠른 조치(https://github.com/socketry/multipart-post/pull/95) 덕에, 나는 아무 것도 하지 않아도 저절로 문제가 해결되는 기쁨을 누렸다. 실제로 아무 조치 없이 빌드를 재실행한 결과, 빌드에 성공하였다. 
내가 Travis CI가 사용하는 ruby의 버전을 지정하는 방법을 배워야 하는 사태가 발생하기 전에 Travis CI팀이 default ruby 버전을 계속 업그레이드 해주길 바라면서, 또 이 포스트의 속편을 바로 작성해야 하는 일이 없기를 바라면서 성공한 빌드 로그로 포스트를 마친다.

```bash
Installing deploy dependencies
Logged in as @bastionsofwill (bastionsofwill)

Preparing deploy

Deploying application
cd /tmp/d20220612-6975-s1zerh/work
commit fc19656296bd70de2ed24bdb2bf1c36bea7e3b67
Author: Deployment Bot (from Travis CI) <deploy@travis-ci.org>
Date:   Sun Jun 12 12:07:27 2022 +0000
    Deploy bastionsofwill/bastionsofwill.github.io to github.com/bastionsofwill/bastionsofwill.github.io.git:gh-pages
 2021/07/14/web-domain-architecting/index.html   | 251 ------------------------
 2021/07/22/email-tracking/index.html            |  13 +-
 2021/08/01/tslop-04/index.html                  |   8 +-
 2021/08/01/tslop-05/index.html                  |   8 +-
 2021/08/06/what-is-ssl-certificate/index.html   |   8 +-
 2021/10/05/video-through-web-0/index.html       |   8 +-
 2021/11/17/hexo-travis-ghpage/index.html        |   8 +-
 2021/11/19/what-is-dependabot/index.html        |   8 +-
 2021/12/13/log4j2-vulnerability/index.html      |   8 +-
 2022/01/12/encoding-and-video-codecs/index.html |   8 +-
 ...
 48 files changed, 129 insertions(+), 925 deletions(-)
cd -
Done. Your build exited with 0.
```

### 출처
https://hexo.io/ko/docs/github-pages
https://docs.travis-ci.com/user/for-beginners
https://docs.travis-ci.com/user/deployment
https://docs.travis-ci.com/user/deployment/pages/
https://github.com/travis-ci/dpl
https://rubygems.org/gems/dpl-pages
https://rubygems.org/gems/multipart-post
https://www.ruby-lang.org/ko/downloads/