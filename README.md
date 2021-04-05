# Geul.js

[![Hits](https://hits.seeyoufarm.com/api/count/incr/badge.svg?url=https%3A%2F%2Fgithub.com%2Fseungrolee%2Fgeul&count_bg=%23253EC2&title_bg=%233D3D3D&icon=&icon_color=%23E7E7E7&title=hits&edge_flat=true)](https://hits.seeyoufarm.com)
[![DOWNLOADS](https://img.shields.io/github/downloads/seungrolee/geul/total?color=0f7de4&style=flat-square)](https://github.com/seungrodotlee/geul/releases)
[![NPM](https://img.shields.io/npm/dt/geul?label=npm&style=flat-square)](https://www.npmjs.com/package/geul)
![LICENSE](https://img.shields.io/github/license/seungrodotlee/geul?style=flat-square)

<br>
<img src="logo.png">
<br>

> Geul은 한글에 초점을 둔 타이핑 애니메이션을 위한 라이브러리입니다. <br> 데모는 [여기서](https://seungrodotlee.github.io/geul/) 보실 수 있습니다!

## 다운로드

[v0.1.1 (베타버전:2021.01.18 배포)](https://github.com/seungrodotlee/geul/releases/download/v0.1.1/geul.js)

## 설치

### NPM

```
$ npm i geul
```

```js
import Geul from "geul"; //혹은 require("geul");
```

### 정적 웹페이지

정적 웹페이지에서 geul.js 파일을 직접 `<script>` 태그를 통해 삽입하여 사용하거나, CDN을 통해 파일을 다운받지 않고도 사용할 수도 있습니다.

```html
<script src="./geul.js" type="text/javascript">
```

```html
<script src="https://cdn.jsdelivr.net/gh/seungrodotlee/geul/dist/geul.js" type="text/javascript">
```

## 사용법

`Geul` 객체는 `window` 객체의 멤버로 정의되어 있어, 어디서든 바로 호출하여 사용할 수 있습니다.

```js
console.log("Geul" in window); //true
```

Geul.js를 이용하여 타이핑 효과를 사용하는 방법에는 크게 두 가지 방법이 있습니다.

### `Geul` 객체 직접 호출

```js
/* [예시 1]
 * 아래의 코드는 "안녕하세요"를 #target에 80ms의 속도로 타이핑합니다.
 */
let target = document.querySelector("#typing");
let geul = new Geul("안녕하세요", target, 80);
geul.run();
```

`Geul` 객체의 인스턴스는 아래와 같이 생성합니다.

```js
new Geul(내용, 타겟요소[, 속도]);
```

속도의 단위는 `ms(=1/1000초)`이며, 초기값은 `100`입니다. 이 말은, 만약 다른 설정도 하지 않고, 매개변수로 속도값을 따로 지정해주지 않으면 `100ms`의 속도로 타이핑이 된다는 뜻입니다.

```js
//아래 코드에서 a와 b는 완전히 동일한 타이핑 결과를 나타냅니다.
let a = new Geul("안녕하세요", target, 100);
let b = new Geul("안녕하세요", target);
```

### `HTMLElement`에 미리 정의된 메소드 사용

사용의 편리함을 위해 `HTMLElement`에 `Geul` 객체가 제공하는 메소드들을 미리 연결해두었습니다. 위의 예시 1과 아래의 코드는 완전히 동일한 결과를 나타냅니다.

```js
let target = document.querySelector("#typing");
target.geul("안녕하세요", undefined, 80);
```

`HTMLElement.geul` 메소드는 다음과 같이 호출합니다.

```js
element.geul(내용[, 딜레이, 속도]);
```

누군가는 매개변수의 순서에 불만이 있을수도 있습니다. 타이핑 효과에 딜레이를 걸지 않으면서, 속도를 변경하기 위해서는 위와 같이 중간에 `undefined`를 넣어주는, 조금은 못생긴 코드를 작성해야 하기 때문입니다.
<br><br>
그러나 개인적으로 생각하기에, 하나의 웹애플리케이션에서 타이핑 효과는 모두 같은 속도로 표현될 경우가 더 많을 것이라 생각 되었고, 속도조절은 별도의 메소드를 통해 할 수 있다는 점을 고려하여 매개변수의 순서를 정하였습니다. 속도조절에 관한 부분은 개별 메소드들을 소개하며 아래에서 다시 다루도록 하겠습니다.

## 타이핑 메소드

위의 예제들에 등장한 `run()` 그리고 `geul()` 메소드는 타겟요소에 내용을 **처음부터** 작성하는 메소드입니다. 즉, `run()` 혹은 `geul()` 메소드가 실행되면 타겟요소에 존재하던 `textContent`가 덮어씌워집니다. Geul은 현재 사용의 편리함을 위해 4가지의 타이핑 메소드를 제공합니다.

### 덮어쓰기: `HTMLElement.geul(내용[, 딜레이, 속도])` 혹은 `Geul.run([딜레이, 내용]);`

앞서 설명한대로, 지정한 딜레이(기본값은 0입니다) 이후 타겟요소에 내용을 처음부터 타이핑합니다.

```js
target.geul("안녕");
/* target의 textContent는 다음과 같이 변화합니다
 * ㅇ -> 아 -> 안 -> 안ㄴ -> 안녀 -> 안녕
 * /
```

### 이어쓰기: `HTMLElement.add(내용[, 딜레이, 속도])` 혹은 `Geul.add(내용[, 딜레이])`

타겟요소의 **기존 내용 뒤에** 새로운 내용을 타이핑합니다.

```js
console.log(target.textContent); //"안녕"
target.add("하세요");
/* target.textContent는 아래와 같이 변화합니다
 * 안녕 -> 안녕ㅎ -> 안녕하 -> 안녕핫 -> 안녕하세 -> 안녕하셍 -> 안녕하세요
 * /
```

### 시작점 지정하여 쓰기: `Geul.runFrom(시작점[, 딜레이])`

`runFrom` 메소드는 현재 설정된 내용을 타이핑하되, 시작점으로 지정한 내용부터 타이핑을 시작합니다. 시작점은 문자열 혹은 인덱스값입니다.

```js
let geul = new Geul("안녕하세요", target, 100);
geul.runFrom("안녕"); //다음과 같습니다: geul.runFrom(2);
/* target의 textContent는 아래와 같이 변화합니다
 * 안녕 -> 안녕ㅎ -> 안녕하 -> 안녕핫 -> 안녕하세 -> 안녕하셍 -> 안녕하세요
 * /
```

### 반전: `HTMLElement.reverse(종점[, 딜레이, 속도, 원내용])` 혹은 `Geul.reverse(종점[, 딜레이])`

원내용으로부터 종점으로 지정한 내용까지, 역방향으로 타이핑합니다. 종점은 문자열 혹은 인덱스값입니다.

```js
console.log(target.textContent); //안녕하세요
target.reverse("안녕"); //다음과 같습니다: target.reverse(2);
/* target의 textContent는 아래와 같이 변화합니다
 * 안녕하세요 -> 안녕하셍 -> 안녕하세 -> 안녕핫 -> 안녕하 -> 안녕ㅎ -> 안녕
 * /
```

## 속도 및 내용 제어 메소드

### 내용수정: `HTMLElement.setTypingValue(내용)` 혹은 `Geul.setValue(내용)`

타이핑할 내용을 갱신합니다.

```js
let geul = new Geul("안녕하세요", target, 100);
geul.setValue("하이");
geul.run();
/* target의 textContent는 아래와 같이 변화합니다
 * ㅎ -> 하 -> 항 -> 하이
 * /
```

### 속도초기값 변경: `Geul.setStaticSpeed(속도)`

앞서 속도의 초기값은 `100`이라고 설명했습니다. 이 값은 사실 `Geul._speed`의 값입니다. `Geul._speed`는 모든 `Geul 인스턴스`가 공유하는 `static` 멤버로, 새로운 `Geul 인스턴스`는 `speed` 값을 따로 전달받지 않는 경우 `speed`의 초기값을 `Geul._speed`의 현재값으로 초기화합니다. 만약, 속도의 초기값을 `100`이 아닌 다른 값으로 지정하고 싶다면, `Geul.setStaticSpeed` 메소드를 사용하면 됩니다. 이 메소드는 `Geul._speed`를 전달받은 값으로 수정하고, 현재까지 생성된 인스턴스들 중, `speed` 값이 수정 전의 `Geul._speed`와 같은, 즉, `speed`값이 따로 지정되지 않은 인스턴스들을 찾아, 해당 인스턴스들의 `speed`값 역시 전달받은 값으로 수정합니다.

```js
let a = new Geul("안녕", target1, 80);
let b = new Geul("하이", target2);

Geul.setStaticSpeed(200);

let c = new Geul("헬로우", target3);
let d = new Geul("굿모닝", target4, 150);

console.log(a.speed); //80
console.log(b.speed); //200
console.log(c.speed); //200
console.log(d.speed); //150
```

### 속도변경: `HTMLElement.setTypingSpeed(속도)` 혹은 `Geul.setSpeed(속도)`

특정 요소, 특정 인스턴스의 타이핑 속도를 수정합니다.

```js
let a = new Geul("안녕하세요", target);

console.log(a.speed); //100

a.setSpeed(80);

console.log(a.speed); //80
```

## 오류가 발생되는 상황들

몇몇 특정 상황에서, 잘못된 결과가 표현되는 것을 방지하기 위해 Geul은 오류를 발생시킬 수 있습니다.

### 요소가 타이핑을 진행중인데, 새로운 타이핑 메소드가 시도된 경우

이미 타이핑(`타이핑 1`)이 진행중일 때, 새로운 타이핑(`타이핑 2`)을 진행하는 경우 `타이핑 1`과 `타이핑 2`가 겹쳐 진행되면서 의도치 않은 결과를 나타낼 수 있습니다. 이를 방지하기 위해 Geul 인스턴스는 `this.running` 멤버를 통해 타이핑이 진행중인지를 표시하며, `this.running == true`일 때 새로운 타이핑 메소드가 시도되거나, `setValue` 메소드가 실행되면 오류를 발생시킵니다.

### 타겟요소에 HTMLElement가 아닌 잘못된 값이 전달된 경우

타겟요소가 HTMLElement가 아닌 잘못된 값인 경우, 타이핑을 제대로 실행할 수 없겠죠. 당연히 오류가 발생됩니다.

### `runFrom`, `reverse` 메소드에서 각각 시작점, 종점이 원문에 포함되지 않는 경우

> 여기서 포함된다는 것은 [Hangul](https://github.com/e-/Hangul.js/) 라이브러리에서 설명된 것과 같이, '두벌식 키보드를 기준으로 원문을 입력하기 위해 누르는 키들의 배열이 시작점 혹은 종점값을 입력할 때 누르는 키들의 배열을 포함하는 경우'를 의미합니다. <br><br> 예를 들어, `헬로우`라는 단어를 입력하기 위한 키들의 배열은 다음과 같습니다. <br> `['ㅎ', 'ㅔ', 'ㄹ', 'ㄹ', 'ㅗ', 'ㅇ', 'ㅜ']` <br> `헬롱`이라는 단어를 입력하기 위한 키들의 배열은 다음과 같습니다.<br> `['ㅎ', 'ㅔ', 'ㄹ', 'ㄹ', 'ㅗ', 'ㅇ']` <br> 따라서, `헬롱`이라는 문자열은 `헬로우`라는 문자열에 포함된다고 볼 수 있습니다.

시작점, 혹은 종점이 원문에 포함되지 않는 경우, `runFrom`나 `reverse` 메소드는 정상적으로 실행될 수 없습니다. 따라서 이와 같은 경우 `Geul`은 오류를 발생시킵니다.

## 사용한 라이브러리

Hangul (https://github.com/e-/Hangul.js/)
데모페이지는 제작중에 있는 프론트엔드 프레임워크인 [croquis](https://github.com/seungrolee/croquis)를 이용하여 작성하였습니다.
