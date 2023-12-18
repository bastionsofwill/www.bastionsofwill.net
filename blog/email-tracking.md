---
title: 이메일 개봉/링크 클릭 추적하기
tags:
  - email
date: 2021-07-22 19:03:20
---

## Open Tracking
Open tracking은 이메일 수신자가 해당 이메일을 개봉하였는지를 알려준다. 이를 위해 메일침프는 이메일 HTML 하단에 Open tracker(또는 Web beacon)이라는, 캠페인별로 유니크한 작은 투명 그래픽을 임베드한다. 이후 수신자가 해당 메일을 열게 되면, 그 투명 그래픽을 메일침프 서버에서 다운받게 되면서 메일 개봉 처리가 된다. Out-of-office같은 자동화 답장은 그래픽을 다운받지 않기 때문에 미개봉으로 처리된다.
Web beacon을 사용한 추적은 Open tracking을 위한 표준이며, 구독자의 참여 정도를 알 수 있게 해주지만 몇 가지 제약 사항이 따른다. 숨겨진 그래픽 이미지를 기반으로 작동하기 때문에 수신자가 이메일을 열람하는 환경에 따라서 작동하지 않을 수 있는데, 예를 들어 이메일 클라이언트가 해당 이미지를 표기하지 않는 경우에는 작동하지 않는다.

## Click Tracking
수신자가 메일에 포함된 URL을 클릭하게 되면, 해당 URL은 Mailchimp의 서버를 경유하여 로그에 기록된 후 목표 주소에 리다이렉트된다. 

## What is Link Branding?
이메일 링크 브랜딩은 open tracking에 쓰이는 비콘 click tracking이 달린 링크가 SendGrid가 아니라 서비스 사용자의 도메인을 향하게 해준다. 스팸 필터와 수신 서버는 이메일에 포함된 링크를 검사하여 이메일의 신뢰도를 평가하는데, 이 때 해당 링크가 연결된 루트 도메인의 평판(reputation)을 사용하게 된다. 링크 라벨링을 통해 클릭 트래킹 링크가 사용자가 컨트롤할 수 없는 도메인을 경유하지 않도록 함으로써 이메일 전달성의 향상을 기대할 수 있다.

### 출처
SendGrid Documentation
- https://docs.sendgrid.com/ui/account-and-settings/how-to-set-up-link-branding#cdn

Mailchimp Documentation
- https://mailchimp.com/help/about-open-tracking/
- https://mailchimp.com/help/enable-and-view-click-tracking/
