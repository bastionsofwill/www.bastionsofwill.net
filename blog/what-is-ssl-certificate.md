---
title: SSL/TLS와 인증서의 이해
tags:
  - network
date: 2021-08-06 16:28:37
---

## SSL/TLS란?
- SSL(Secure Socket Layer)은 암호 기반의 인터넷 보안 프로토콜
- 여러 번의 보완이 있었으며, 넷스케이프와 무관한 IETF가 이를 관리하면서 TLS(Transport Layer Security)로 이름이 변경
- HTTP가 이를 사용하여 HTTPS(HTTP over TLS)를 제공하며, SNMP, FTP 등 다른 프로토콜에서도 SSL/TLS를 사용
- 현재 SSL은 업데이트가 중단되어 많은 보안 취약점이 있고, 대다수의 웹 브라우저는 SSL을 지원하지 않는다.
- 따라서 대부분의 경우 엄밀하게 말하자면 TLS라 표기하는 것이 맞지만, SSL이 TLS를 지칭하는 용어로 자주 혼용된다.

## SSL/TLS의 기능
- Encryption: 웹 상에서 전송되는 데이터를 암호화하여, 전송 중인 데이터를 탈취하여도 의미없게 만든다.
- Authentication: Handshake라는 두 기기 간 인증 절차를 거침으로서 서로가 서로임을 보장해준다.
- Integrity: 디지털 서명을 통해 데이터 무결성, 즉 데이터가 변조되지 않았음을 검증한다.

## SSL certificate(TLS certificate)란?
- 웹사이트의 서버 또는 앱 서버에 저장되어 웹사이트를 인증해주는 일종의 신분증이다.
- 인증서에는 아래와 같은 정보가 포함되어 있다.
    - 도메인 네임
    - 발급받은 주체(개인, 단체, 기기)
    - 발급 주체(CA)
    - CA의 디지털 서명
    - 적용받는 서브도메인들
    - 발급 날짜
    - 만료 날짜
    - 퍼블릭 키
- 인증서에는 웹사이트의 퍼블릭 키가 포함되어 사용자 디바이스는 이를 통해 웹사이트와 안전한 연결을 할 수 있도록 한다.
- 웹사이트는 별도 관리하는 프라이빗 키로 사용자가 전달한 퍼블릭 키로 암호화된 데이터를 복호화한다.
- CA(Certificate Authorities)는 SSL 인증서를 발급해주는 기관이다.

## SSL certificate validation level
- Domain Validation
    - 가장 낮은 수준의 검증
    - 비용 저렴
    - 해당 도메인의 control 여부만 증명: 이는 보통 DNS 레코드나 이메일을 통해 검증 
- Organization Validation
    - CA가 직접 인증서를 발급받는 주체와 접촉하여 검증
    - 인증서에는 해당 단체의 이름과 주소 등을 포함
- Extended Validation
    - SSL 인증서 발급 전, 해당 환경과 단체에 관한 폭넓은 검증
    - 단체가 정말 존재하며 법적 문제 없이 등록되어있느지 등을 조사
    - 시간과 비용 필요

## 안전한 상태란?
- 클라이언트가 신뢰할 수 있는 상태의 인증서
- 안전한 설정
    - 안전한 프로토콜 제공(Protocol support)
    - 안전한 암호(Secure Cipher Suites) 설정

## 클라이언트가 신뢰할 수 있는 인증서
1. 서비스 도메인에 적합한 인증서 유형의 확인
    - FQDN(Fully Qualified Domain Name: Subdomain부터 TLD까지 포함하는 완전한 도메인 이름)에 대한 개별 인증서
    - SAN(Subject Alternative Name) 인증서: 여러 FQDN에 대한 신뢰를 한번에 제공
    - Wildcard 인증서
        - '*'을 접두사로 사용하여 서브도메인 전체에 대한 신뢰 제공
        - 첫 번째 레벨 서브 도메인에 대해서만 커버 가능: 두 번째 이하 레벨은 신뢰하지 않음

2. 신뢰할 수 있는 root CA의 선택
    - Certificate Transparency
        - Google의 Certificate Transparency(https://certificate.transparency.dev) 참여 여부
        - 향후 SCT(Signed Certificate Timestamp) 대응 계획
        - 특정 도메인에 대한 인증서 발급 현황에 대해 누구나 조회 가능(https://crt.sh)
    - CA/Browser Forum(https://cabforum.org)의 Base Requirement에 따른 운영 여부

3. 인증서 프라이빗 키를 안전하게 보관
    - 인증서를 발급받을 경우 보통 아래와 같은 파일들이 생성
    |Index|Purpose|Filename|
    |------|---|---|
    |1|CA로부터 서명 받은 인증서(X.509 형식)|cert.pem|
    |2|인증서의 개인키(Certificate’s private key)|privkey.pem|
    |3|중간 CA의 인증서|chain.pem|
    |4|Fullchain(1+3 combined)|fullchain.pem|
    - 2번 파일인 인증서의 개인키는 안전한 곳에서 최초 생성 후 접근 불가하도록 설정
    - 나머지 파일들은 클라이언트가 접속할 때 전달

4. 웹서버에서 적절한 중간 CA 인증서 설정: 클라이언트에서 Chain of Trust 확인
    - 위 테이블의 3, 4번 파일
    - 클라이언트가 인증서를 신뢰할 수 있는 근거를 전달하는 절차
    - 클라이언트는 접속할 서버에서 보낸 인증서 내용 확인 후 신뢰할 수 있는 CA의 서명을 확인
    - 클라이언트가 전달받은 leaf 인증서를 서명한 중간 CA 정보와, 중간 CA를 서명한 root CA가 이미 신뢰하는 root CA의 목록에 있는지 차례대로 확인(Chain of Trust)하여 검증
    - 따라서, 중간 CA 정보를 클라이언트에 전달하지 못하면 root CA에 대한 신뢰관계를 검증하지 못할 수도(대부분 클라이언트들은 신뢰하는 중간 CA 정보도 설정하기 때문에 문제가 없는 경우가 많음) 있기 때문에 중간 CA 정보를 설정하는 것이 좋음
    - root CA와 중간 CA를 굳이 분리하는 것은 신뢰구조 전체가 무너지는 것을 방지하기 위함이며, root CA는 중간 CA를 서명하기 위해서만 제한적으로 사용되고 실제 발급되는 leaf 인증서의 발급(서명)에는 중간 CA를 사용하는 구조가 보편적.
    ![](/images/Chain_Of_Trust.png)
    - CSR(Cross Signed Root): 클라이언트의 신뢰하는 root CA 목록에 해당 root CA가 포함되지 않을 수 있는데(클라이언트 환경이 오래되었거나, root CA가 비교적 최근에 작성되었을 경우), 이 경우 대부분의 클라이언트가 신뢰하는 root CA에게 별도로 서명을 받아두기도 하며 이를 CSR이라 한다.
    - SNI(Server Name Indication): 여러 도메인을 하나의 웹 서버로 서비스할 때, 접속하고자 하는 호스트네임을 요청하여 적절한 인증서를 받아 오기 위해 SNI를 지원하는 클라이언트 환경이 요구될 수 있다.

## 안전한 설정
1. 사용하는 OpenSSL 라이브러리의 지속적인 업데이트
    - 라이브러리 커플링: 웹서버 설치 시 OpenSSL 라이브러리를 정적으로 빌드하면 업데이트할 시 웹서버를 새로 빌드/배포해야 하므로, 시스템 라이브러리를 사용하여 웹서버와 분리할 것을 권장
2. 안전하지 않은 프로토콜의 배제
    - TLS는 지속적으로 보안 수준을 높여가고 있으므로 최신 버전 프로토콜만 사용하도록 하는 것이 바람직하나, 호환성을 고려하여 상황에 따라 결정
3. 안전한 cipher suite 설정
    - Cipher Suite: 안전한 연결 생성을 위한 4개의 암호화 알고리즘
        1. 키 교환(Key exchange/agreement)
        2. 접속 시 상대 확인(Authentication)
        3. 기밀성을 위한 블록 암호화(Block/stream cipher)
        4. 메시지 무결성을 위한 암호화(Message authentication)
    - cipher suite를 구성하는 알고리즘을 결정하는 데 있어 대규모 트래픽 처리 시 성능을 고려해야 할 때도 있으므로 테스트를 해보는 것이 좋음 

출처:
https://www.cloudflare.com/learning/ssl/what-is-ssl/
https://www.cloudflare.com/learning/ssl/what-is-an-ssl-certificate/
https://engineering.linecorp.com/ko/blog/best-practices-to-secure-your-ssl-tls/