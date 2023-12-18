---
title: The Secret Life of Programs - 04. Computer Anatomy
tags:
  - book
  - the-secret-life-of-programs
date: 2021-08-01 13:17:04
---

## CPU
- Arithmatic Logic Unit: 연산자와 피연산자를 입력받아 결과값과 결과 코드를 리턴
- Shifter: 조합 논리(Combinational Logic)만으로는 구현할 수 없는 Shift 연산을 수행
- Excecution Unit
  - 메모리에서 명령과 피연산자를 가져와서 ALU에 전달하고 리턴값을 메모리에 저장
  - 메모리에서 실행해야하는 명령의 위치를 기억하기 위해 메모리 위치를 참조하는 PC(Program Counter)를 사용

## 명령어 집합
- 명령어(instruction)를 네 필드(opcode, 두 개의 operand, result)로 나누어 표시한다면 아래 2가지 문제점으로 인하여 명령어를 처리하기 어렵다.
    1. operand와 result 필드에 들어가는 주소 값으로 쓸 수 있는 비트가 부족
    2. 한 번에 여러 메모리 주소에 접근해야 함
- 따라서 opcode와 주소로만 구성된 single-address 명령어를 사용하며, 이를 위해 누산기(accumulator)라는 레지스터를 사용한다.
- 그럼에도 모든 메모리 주소 영역을 명령어에 담을 수 없으므로 3종류의 주소 지정 모드(즉시, 직접, 간접)를 통해 참조할 수 있는 주소의 영역을 확장한다.
- 따라서 명령어의 구성은 아래 이미지와 같이 나타낼 수 있다.
![](/images/instruction_set.png)

## 메모리 + 입/출력 + CPU + 명령어
- 컴퓨터는 메모리에서 명령어를 가져오는 상태(fetch)와 명령을 실행하는 상태(execute)를 반복
- 즉, 컴퓨터의 처리 방식은 프로그램 카운터 값을 메모리의 주소 버스에 먹이고, 메모리의 값(수행해야 하는 명령어)을 다시 명령어 레지스터에 먹여 명령어를 저장하는 절차의 반복