---
title: scp와 rsync
tags:
  - linux
date: 2022-07-14 17:11:03
---

## scp
scp는 Secure Copy의 약어로, 원격 호스트에 파일을 전송하는 수단이다. SSH를 사용하기 때문에 통신 탈취 등으로부터 안전하다.

## rsync 
rsync는 Remote Sync의 약어로, 마찬가지로 원격 호스트에 파일을 전송하는 수단이다. 
하지만 두 파일 간 차이(difference)만을 전달하는 알고리즘을 사용하기 때문에, 대부분의 경우에 보다 효율적인 파일 전송이 가능하다.
또, SCP에 비해 훨씬 다양한 옵션을 제공하기 때문에 이를 활용하여 보다 다양한 작업을 수행할 수 있다.

하지만 rsync가 scp에 비해 반드시 우월하다고는 볼 수 없는데, rsync 자체는 암호화되지 않은 평문으로 데이터를 전송하기 때문에, 보안성을 위해서 SSH를 사용한 암호화를 사용(`--rsh=ssh` 옵션을 추가)하여야 한다. 반면 scp는 항상 SSH 기반 통신을 수행하기 때문에 단순하거나 가벼운 작업을 실행할 경우에는 scp를 사용하여 파일을 전송하는 것이 편리하다.

### 출처
https://stackoverflow.com/questions/20244585/how-does-scp-differ-fromrsync-
https://madplay.github.io/post/scprsync-
