---
title: Terraform Language 기초
tags:
  - infrastructure
  - Terraform
date: 2022-04-20 13:43:00
---

Terraform은 오픈소스 IaaC툴이며, 이를 위해 자체 Configuration 언어인 Terraform Language를 사용한다. 

## Terraform Language Elements
``` python
resource "aws_vpc" "main" {
  cidr_block = var.base_cidr_block
}

<BLOCK TYPE> "<BLOCK LABEL>" "<BLOCK LABEL>" {
  # Block body
  <IDENTIFIER> = <EXPRESSION> # Argument
}
```
- Blocks: 컨테이너의 역할을 수행하며, 리소스 등 특정 개체의 설정을 나타낸다.
  - block type: 모든 블록은 타입을 갖는다.
  - labels: 타입에 따라 라벨의 갯수가 정해진다.
  - body: 다른 Argument와 블록이 중첩될 수 있다.
- Arguments: name에 value를 할당하며, block 안에 존재한다.
- Expressions: 참조/조합되거나 그 자체로 어떤 값이 된다.

## Modules
- Module이란 여러 개의 구성 파일(`.tf` 또는 `.tf.json`)이 한 디렉토리에 모인 것을 말한다.
- 모듈은 같은(top) 레벨의 파일들만으로 구성되며, 하위 디렉토리는 별개의 모듈로 취급되어 구성에 자동으로 포함되지 않는다.
- Terraform은 항상 하나의 root module 컨텍스트에서 실행되며, Terraform 구성(configuration)은 root 모듈과 그 child 모듈(root모듈이 호출한 모듈과 그 child)들의 트리 형태이다.
- `module` 블록을 통해 child 모듈을 호출할 수 있으며, 아래와 같은 argument를 갖는다.
  - `source`: child module의 configuration file path 또는 다운로드 주소
  - `version`: child module 버전
  - input variables
  - meta-arguments: child 모듈을 호출하는 방식을 지정해줄 수 있다.

## Resources
- Terraform Language에서 가장 중요한 요소
- 각 Resource 블록은 타입과 로컬 네임, 2개의 라벨을 가지며, 타입과 리소스의 조합은 각 resource의 id로 작용하므로 같은 모듈에서 unique해야 한다.
- 로컬 네임은 같은 모듈 스코프에서 해당 리소스를 참조하는데 사용된다.

### Meta-arguments
- `depends_on`: 의존성 명시
- `count`: 특정 갯수의 인스턴스를 생성(for_each와 동시 사용 불가)
- `for_each`: map 또는 string set으로 다수의 인스턴스를 생성(count와 동시 사용 불가)
- `provider`: non-default provider configuration 지정
- `lifecycle`: 리소스의 생성/소멸 관련 조건 지정
- `provisioner`: resource 생성 후 별도 행동 

### Resource Behavior
- Resource 블록을 통해 새로운 객체가 생성될 경우, 해당 객체의 id가 Terraform state에 저장되어 관리된다.
- 이미 state에 존재하는 Resource 블록이 있을 경우, configuration과 객체를 비교하여 필요시 객체를 configuration에 맞게 update한다.

## Data Sources
- `data`블록은 'data source'와 'local name' 2개의 라벨을 가지며, 특정 data source로부터 데이터를 읽어 와서 local name 아래에 결과를 export한다.
- `variable` 블록과 마찬가지로 참조에 의한 값을 할당한다는 공통점이 있지만, variable 블록은 Terraform configuration 안에서 정의되는 반면 data 블록은 클라우드 인프라, 애플리케이션 등 외부에서 발생하는 데이터를 참조한다는 차이점이 있다.

## Providers
- Providers Terraform에서 클라우드/SaaS/기타 API 제공자와 상호작용하기 위해 사용하는 플러그인이다.
- Provider는 resource 및 data source의 집합을 추가해 준다.

## Variables and Outputs
- `variable` 블록은 input variable을 정의하는 데 쓰인다.
  - `default`: 디폴트 값
  - `type`: value의 타입(string, number, bool + collections 등의 복합 타입)
  - `description`
  - `validation`: `condition` argument를 통해 변수가 가질 수 있는 값의 조건을 지정할 수 있으며, `error_message`로 invalid할 경우 에러 메시지를 지정할 수 있다.
  - `sensitive`: boolean. Terraform UI output에서 마스킹 여부를 결정
  - `nullable`
- `output` 블록은 모듈 외부로 값을 export할 때 사용된다.
  - `value`
  - `description`
  - `sensitive`
  - `depends_on`: 의존 관계를 명시적(explicit)으로 표현할 때 쓰인다.

### 출처
https://www.terraform.io/language