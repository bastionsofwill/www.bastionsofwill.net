---
title: Local Port Forwarding
tags:
  - network
  - ssh
date: 2022-06-28 21:23:49
---

## SSH Port Forwarding과 그 종류
- SSH Tunneling이라고도 부름
- 특정 포트를 다른 *연결에 forwarding*하는 행위 
- 프록시와 유사한 역할을 수행
- Local, Remote, Dynamic 포트 포워딩이 있음

## Local Port Forwarding
Local port forwarding은 말 그대로 localhost(SSH 클라이언트)의 특정 포트를 다른 연결로 forward한다.

```bash
ssh -L <local port>:<target server>:<target port> <username>@<remote server>
```
- \<local port\>: SSH 터널링의 시작점으로 사용될 SSH 클라이언트가 동작하는 호스트의 포트
- \<target server\>: 최종 목적지 서버
- \<target port\>: \<target server\>의 포트
- \<remote server\>: SSH 터널링을 통해 도달하는, Gateway(Bastion) 역할을 하는 서버(SSH 서버)

즉, 클라이언트 환경에서 위와 같은 프로세스가 실행되면, `localhost:<local port>`로 전달되는 요청은 `username@<remote server>`에서 `<target server>:<target port>`에 보내지는 요청으로 처리된다.

```bash
ssh -L 123:localhost:456 root@1.2.3.4
```
![](/images/lfp_local.png)
이미지 출처: https://unix.stackexchange.com/questions/115897/whats-ssh-port-forwarding-and-whats-the-difference-between-ssh-local-and-remot

위 예시는 target server를 localhost, 즉 자기 자신(gateway server, SSH server, 1.2.3.4)으로 지정한 경우이다. 이 때는 접근이 허용된 어느 호스트(자기 자신을 포함하여)에서든 프로세스를 실행한 클라이언트의 123번 포트(아래 이미지의 `your host:123`)로 요청을 보내면, 해당 요청은 ssh 터널을 통해 root@1.2.3.4 --> 127.0.0.1:456 연결로 forward된다.

```bash
ssh -L 123:<farawayhost>:456 root@1.2.3.4
```
![](/images/lfp_faraway.png)
이미지 출처: https://unix.stackexchange.com/questions/115897/whats-ssh-port-forwarding-and-whats-the-difference-between-ssh-local-and-remot

반면 위와 같이 target server를 다른 farawayhost로 지정하여 포트 포워딩을 실행할 경우, 클라이언트의 123번 포트로 보내진 요청은 ssh 터널을 통해 1.2.3.4 --> farawayhost:456으로 forward된다.

즉, Local Port Forwarding은 아래와 같은 기능을 수행한다.

>\<some_host\> --> \<client_host\>:\<client_port\>
를 아래 연결로 forward한다.
\<remote_host\> --> \<target_host\>:\<target_port\>

## Local Port Forwarding의 이점
Local port forwarding을 통해, 불특정 다수(\<some_host\>)의 \<target_host\>:\<target_port\>로의 접근 제어를 \<client_host\>:\<client_port\>로의 접근 제어를 통해 관리할 수 있다. 
즉 \<target_host\>:\<target_port\>는 \<remote_host\>(Bation Host의 역할을 수행)로부터의 접근만 허용하면 된다는 점에서 \<target_host\>를 보다 안전하게 관리할 수 있고, 보안/시스템적 제약 사항을 우회하는 데에도 자주 쓰인다.
컨테이너 기반 환경에서는 특히 이러한 Local Port Forwarding을 요긴하게 사용할 수 있다.

### 출처
https://linux.systemv.pe.kr/ssh-%ED%8F%AC%ED%8A%B8-%ED%8F%AC%EC%9B%8C%EB%94%A9/
https://blog.naver.com/PostView.naver?blogId=alice_k106&logNo=221364560794
https://www.hanbit.co.kr/network/category/category_view.html?cms_code=CMS5064906327
https://unix.stackexchange.com/questions/115897/whats-ssh-port-forwarding-and-whats-the-difference-between-ssh-local-and-remot
https://www.ssh.com/acadeclient/ssh/tunneling/example