---
title: 쉘 스크립트 기초
tags:
  - unix
  - shell
date: 2022-06-09 17:53:10
---


## 이게 대체 뭔 소리야
```bash
#!/bin/bash
set -eo pipefail
ID=$(dd if=/dev/random bs=8 count=1 2>/dev/null | od -An -tx1 | tr -d ' \t\n')
```
AWS Lambda를 공부하던 중에 샘플 코드에 위와 같은 내용이 있었다.
이를 이해하는 데 제법 오랜 시간이 걸렸으나 그 과정에서 알게 된 것이 많다.

하향식으로 접근하면, 위 코드(쉘 스크립트)는 3개 행으로 구성되어 있으며, 아래와 같은 내용으로 구성된다.
- 1행: shebang
- 2행: `set` 명령어와 그 옵션
- 3행: `$`, `|`, `dd`, `dev/random`, `2>/dev/null`, `od`, `tr`

특히 3행은 외계어나 다름없어 보인다. 이를 하나씩 뜯어서 살펴보자.

## Shebang
`#`과 `!`의 조합으로 시작되기 때문에 이러한 이름이 붙었다. 
따라서 '셔뱅'이라고 읽으며, *sha-bang*, *hash-bang*이라고도 한다. 프로그램으로서 실행되는 스크립트임을 알리기 위해 스크립트 시작점에 작성하는 문자열이며, 나머지 부분은 인터프리터 지시자로 해석된다.
```bash
#! /bin/bash
```
특정 경로에 존재하는 어떤 스크립트의 첫 행이 위와 같다면, Unix-like OS는 그 스크립트를 프로그램으로 인식하며, 지정한 인터프리터, 즉 `/bin/bash`를 실행하면서 해당 스크립트가 위치한 경로가 그 인수로 전달된다.

## set -eo pipefail
`set`은 로컬 환경변수의 조회 및 쉘 환경 설정 기능을 수행한다. 환경변수를 조회한다는 점에서 `env`명령어와 유사하지만, `env`명령어는 글로벌 환경변수의 조회만 가능하다는 점에서 그 차이가 있다.
- `-e`옵션: 오류 발생 시 프로세스 중단
- `-o pipefail`옵션: pipe 오류 코드 승계
즉, `set -eo pipefail` 명령을 실행하면, 이후 실행되는 pipe로 연결된 스크립트 중 하나만 non-zero exit code를 반환하여도 프로세스가 중단된다. 

## |
파이프 명령어로, 파이프 왼쪽에 위치한 (출력)값을 오른쪽에 위치한 명령어의 입력으로 전달한다.
```bash
ls -al | grep "yml"
```
예를 들어, 위 스크립트는 `|` 왼쪽의 `ls -al`의 출력을 오른쪽 `grep "yml"`의 입력으로 전달한다. 
따라서, `ls-al`의 출력값은 cli로 출력되지 않고 `grep "yml"`의 입력로 전달되며, 결과적으로 현재 디렉토리에 존재하는 파일과 디렉토리의 리스트(`ls -al`의 출력) *중에서* `yml`이라는 문자열을 포함하는 행만 출력된다.

## $와 명령어 치환(Command Substitution)
쉘 스크립트에서 `$`는 변수를 가리키기 위해 사용된다. 예를 들어, `$VAR`또는 `${VAR}`과 같이 VAR라는 변수의 값에 접근할 수 있다.
```bash
$(cat file.txt)
```
하지만 위의 예시에서 `$`는 변수의 값에 접근하기 위해 사용된 것이 아니라, 명령어 치환을 위해 사용되었다. `$(command)`형태의 스크립트는 자기 자신을 subshell 환경에서 `command` 명령어를 실행한 표준 출력으로 대체한다.
(다만 예시는 `$(< file)`와 동치이며, `<`를 사용하는 것이 더 빠르다.)

## dd
dd 명령어는 stdin을 stdout으로 복사하는 역할을 한다.
- `bs=n`: input, output 블록 사이즈를 n byte로 설정한다.(디폴트: 512바이트)
- `count=n`: n개의 블록만 처리한다.
- `if=file` stdin 대신 file로부터 input을 받는다.
즉, /dev/random이라는 파일로부터 8바이트의 블록 1개를 읽어와서 출력하는 것으로 해석할 수 있다.
그런데 /dev/random은 뭘까...?

## /dev/random, /dev/null
리눅스 파일 시스템에서는 모든 대상을 파일 또는 디렉토리로 추상화하여 관리한다. 디바이스에 입력/출력을 실행하는 것은 해당 디바이스를 추상화한 파일에 쓰기/읽기를 수행하는 것과 같다.
/dev 디렉토리는 스페셜 파일 또는 디바이스 파일이 위치한 디렉토리이다. 대부분의 디바이스의 종류는 아래와 같이 크게 2가지로 나뉜다.
- 블록 디바이스
  - 블록/섹터 등의 단위로 데이터를 전송하는 디바이스
  - 주로 데이터를 저장하는 역할을 수행
  - 리눅스 파일 모드에서 b로 표시
  - 하드디스크, CD/DVD 등 
- 캐릭터 디바이스
  - byte 단위로 데이터를 전송하는 디바이스
  - 리눅스 파일 모드에서 c로 표시
  - 키보드, 마우스 등

하지만 물리적 디바이스와 연결되지 않는 디바이스 파일도 있는데, 이를 pseudo-device라고 한다. 커널 레벨에서 동작하는 기능들을 제공하는데, /dev 디렉토리에 있는 대표적인 pseudo-device들은 아래와 같다.
- `/dev/null`: 모든 입력을 버리는 블랙홀과 같다. 출력(읽기)을 하면 *EOF*를 반환한다.
- `/dev/zero`: 마찬가지로 모든 입력을 무시하며, 출력 시 *null* 문자의 stream을 반환한다.
- `/dev/full`: 입력 시도시 *ENOSPC*(disk full) 에러를 반환하며, 출력 시 *null* 문자의 stream을 반환한다.
- `/dev/random`: 입력한 데이터는 엔트로피 풀에 추가되며, 출력 시 커널의 암호학적 유사난수 생성기(CSPRNG)에서 생성된 데이터를 출력한다. 

## 2>
컴퓨터 프로그램은 실행 환경과 통신하기 위한 `stdin`, `stdout`, `stderr`라는 3개의 데이터 스트림을 가지며, 각각 0, 1, 2라는 정수 file descriptor 값을 갖는다. 즉, 2>는 표준 에러의 출력을 지정하는 스크립트이다.

## od
Octal Dump의 약어로, 특정 입력을 사용자가 지정한 포맷으로 출력한다.
- `-A`: 입력의 주소값을 출력하는 방식을 지정한다. `d`, `o`, `x`, `n` 네 옵션이 있으며, 각각 decimal, octal, hexadecimal, no address이다.
- `-t`: 출력 포맷을 지정한다.
  - a: ascii
  - c: default char set
  - d/o/u/x: signed decimal/octal/unsigned decimal/hexadecimal. 아래 size 지정자와 같이 쓰일 수 있다.
    - C: char, 1 byte
    - S: short, 2 byte
    - I: Int, 4 byte
    - L: Long, 8 byte
    - 1/2/4/8: 10진수로 나타낸 바이트 수.

## tr
translate. 입력값을 가공하여 출력한다.
- `-C`/`-c`: 입력값 중 특정 charater set을 *제외한* 나머지를 지정한 값으로 바꾼 값을 출력한다.
- `-d`: 입력값 중 특정 charater set을 지우고 출력한다.

## 그래서 이게 뭔 소리라고?
```bash
#!/bin/bash
```
이 스크립트는 bash로 실행되는 프로그램이다. /bin/bash를 실행한다.
```bash
set -eo pipefail
```
pipe 중 하나라도 fail(exit code가 0이 아님)이면 프로세스를 중단하라.

```bash
ID=$(dd if=/dev/random bs=8 count=1 2>/dev/null | od -An -tx1 | tr -d ' \t\n')
```
ID라는 변수에 세개의 쉘 스크립트를 아래와 같이 조합하여 할당한다.
1\) 8 byte 크기의 랜덤한 값을 
2\) 1 byte 단위로 16진수 형태로 변환한 뒤
3\) 공백, 탭, 개행문자를 제거한 값

### 출처
https://github.com/awsdocs/aws-lambda-developer-guide/tree/main/sample-apps/blank-nodejs/1-create-bucket.sh
https://ko.wikipedia.org/wiki/%EC%85%94%EB%B1%85
https://zetawiki.com/wiki/%EB%A6%AC%EB%88%85%EC%8A%A4_set
https://zetawiki.com/wiki/%EB%A6%AC%EB%88%85%EC%8A%A4_set_-e
https://zetawiki.com/wiki/%EB%A6%AC%EB%88%85%EC%8A%A4_set_-euxo_pipefail
https://zetawiki.com/wiki/%EB%A6%AC%EB%88%85%EC%8A%A4_env,\_set_%EC%B0%A8%EC%9D%B4%EC%A0%90
https://www.gnu.org/software/bash/manual/html_node/Command-Substitution.html
https://tldp.org/LDP/Linux-Filesystem-Hierarchy/html/dev.html
https://en.wikipedia.org/wiki/Device_file
https://ko.wikipedia.org/wiki//dev/random
https://en.wikipedia.org/wiki/Standard_streams