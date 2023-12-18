---
title: AWS WAF란?
tags:
  - AWS
  - network
date: 2022-08-04 18:33:13
---

## Web Application Firewall
AWS에서 제공하는 서비스인 WAF는 Web Application Firewall의 약자이지만, WAF라는 용어는 AWS에서 새로 만든 것은 아니다.
따라서 WAF, 그 이전에 Firewall이 무엇인지 아주아주 간략하게나마 이해할 필요가 있다.

Firewall(이하 방화벽)은 일반 인터넷과 내부 네트워크를 분리하는 HW/SW의 조합으로, 패킷을 허용 또는 차단하는 방식으로 동작한다.
최초의 방화벽은 패킷의 정보(IP 주소, 포트 번호, ACK 비트 등)와 정해진 정책에 따라 패킷을 필터링하는 기능을 수행하였으나, 점차 다양한 방향으로 발전하였다.

이 중 애플리케이션이나 서비스에 적용되는 L7 트래픽을 제어하는 방화벽을 Appplication Firewall이라고 불린다.
따라서, WAF는 웹 애플리케이션에 적용되는 Application Firewall을 말한다.

## AWS WAF
AWS WAF는 규칙 기반(Rule-based)으로 특정 AWS resource의 인/아웃바운드 트래픽을 제어할 수 있는 서비스이다.

WAF로 제어 가능한 AWS resource는 아래와 같다.
- Amazon CloudFront distribution
- Amazon API Gateway REST API
- Application Load Balancer
- AWS AppSync GraphQL API responds to HTTP(S) web requests

## Web ACL, Rule, Rule Group
WAF는 일종의 규칙 목록인 Web ACL을 관리할 resource에 연결하는 방식으로 동작한다. 
Web ACL은 여러 개의 Rule을 가질 수 있으며, 사용자는 다양한 Statement를 조합하여 Rule이 원하는 대로 동작하도록 구성할 수 있다. 
또, 여러 개의 Rule을 Rule Group이라는 resource로 묶어서 관리할 수 있는데, Web ACL 역시 Rule들의 집합이라 볼 수 있으므로 Rule Group과 Web ACL의 관계는 처음 이해할 때 개인적으로 굉장히 헷갈리는 부분이었다. 

AWS resource에 연결된 Web ACL은 WAF 관점에서 해당 resource를 추상화한 인터페이스로 볼 수 있다.
즉, 어떤 Web ACL에 어떤 규칙을 추가하는 것은 곧 그 Web ACL이 연결된 AWS resource에 그 규칙을 적용하는 것과 같다.

반면, Rule Group은 함께 사용되면 편리한 Rule들을 한 번에 적용하기 위한 관리 단위로, Rule Group을 AWS resource에 적용하기 위해서는 Web ACL에 이를 'Rule Group을 참조하는 Rule' 형태로 추가하여 사용한다. 

다만 Web ACL과 AWS resource의 대응 관계는 1:N으로, 하나의 resource에는 하나의 Web ACL만 연결할 수 있지만, 하나의 Web ACL을 여러 resource에 연결하여 재사용하는 것은 가능하다.
(단, CloudFront Distribution에 연결된 Web ACL은 다른 종류의 resource들에 연결할 수 없다.)

## Web ACL Capacity Unit(WCU)
모든 Rule은 전부 그 복잡도에 따라 사용하는 컴퓨팅 파워의 양을 나타내는 척도를 갖는데, 이를 WCU라 한다.
각 Web ACL은 1500의 WCU 상한선(Support 요청을 통한 상향 조정은 가능)을 가지므로, 이를 고려하여 resource 관리 체계를 구성하여야 한다.

Rule Group을 최초 생성 시 변경 불가능한 WCU 상한선(Capacity)을 지정하여야 하는데, Rule Group이 갖는 Rule들의 WCU 총합(Used Capacity)은 (당연하게도) Capacity를 초과할 수 없다.

Web ACL에 Rule Group을 추가하게 되면 Rule Group의 Capacity(Used Capacity **아님**)가 Web ACL의 WCU 사용량을 잡아먹는다.
따라서 Rule Group의 Capacity를 필요 이상으로 크게 생성하면 WCU 상한선을 넘겨서 Rule Group을 다시 생성하여야 하므로, 적정 수준의 Capacity를 설정하는 것이 바람직하다.

### 출처
컴퓨터 네트워킹: 하향식 접근 - 제6판 (Kurose, Ross / Pearson / 2012)
https://en.wikipedia.org/wiki/Firewall_(computing)
https://docs.aws.amazon.com/waf/latest/developerguide/what-is-aws-waf.html