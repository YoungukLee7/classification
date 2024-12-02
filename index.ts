// Node.js의 fs 모듈 사용

/**
 * require -> 레거시 Javascript 불러오기 방식 --> commonjs 방식이라고 함
 * import -> 최신 javascript 불러오기 방식   --> ESM 방식이라함. 이크마 스크립트 모듈
 * import 가 더 가독성이 좋다~
 */

// type Test = {
//     name: number
// }

// type Sex = 'Man' | 'Women' | 'homeStudy'

// interface TTest extends Test {
//     name: number
// }

// const human: Sex = 'Man'

// interface에서 사용한 extends를 type에서도 아래처럼 사용 가능
// type NesTest = Test & TTest

// 자바스크립트에서 사용하는 방법
// const { AsyncLocalStorage } = require('async_hooks')
// const { count } = require('console')
// const { it } = require('node:test')
// const fs = require('fs')
import { AsyncLocalStorage } from 'async_hooks' // 특정 비동기 작업 내에서 데이터를 안전하게 저장하고 관리할 수 있는 유틸리티
import { count } from 'console' // Node.js의 console 객체에 포함된 메서드로, 콘솔에 호출된 카운트를 추적하고 출력하는 유틸리티
import { it } from 'node:test' // node:test 모듈의 함수로, 테스트 작성에 사용됩니다. 각 테스트 케이스를 정의하는 데 사용되며, 테스트 프레임워크에서 실행
import fs from 'fs'
import { Event } from './types'

// 파일 존재 확인
if (!fs.existsSync('getNft.json')) {
    console.error('File not found: getNft.json')
    process.exit(1)
}

// JSON 파일 읽기
const rawData = fs.readFileSync('getNft.json', 'utf-8')
// const filePath = path.resolve(__dirname, 'getNft.json');
// const rawData = fs.readFileSync(filePath, 'utf-8');

// JSON 형식의 문자열 데이터를 파싱하여 객체로 변환
// const data = JSON.parse(rawData)
const data: Record<string, Event> = JSON.parse(rawData)

// (데이터 값만 배열로 가져오기)
// Object.values()의 반환 타입을 any[] 또는 **unknown[]**로 추론
// const events = Object.values(data)
// Object.values()의 반환 타입을 Event[]로 선언
const events: Event[] = Object.values(data)

// 1. 날짜순정렬
// events.sort((a, b) => {
//     const timeA = a.created_at ? new Date(a.created_at).getTime() : 0
//     const timeB = b.created_at ? new Date(b.created_at).getTime() : 0

//     return timeA - timeB
// })

// 확인
// console.log(events.slice(55, 60))
// console.log(events.slice(1, 5))

// filter 예시
let event = events.filter(item => item.id === '7633')
// console.log(event)

// 필요한 데이터만 가져오기
const filterEvent = event.map(item => ({
    id: item.id,
    name: item.name,
    date: item.date,
    type: {
        id: item.type.id,
        name: item.type.name,
    },
    resource: {
        id: item.resource.id,
        name: item.resource.name,
        location: item.resource.location,
        created_at: item.resource.created_at,
    },
}))

// console.log(filterEvent)

const filteredEvent = event.map(item => {
    const { resource, type, visitor, ...rest } = item // `resource, type, visitor` 필드 제거
    return rest // 나머지 필드만 반환
})

// console.log(filteredEvent)

// 방문자 수 계산
/*
    acc의 초기값은 {}로 시작합니다. 
    그래서 TypeScript는 acc의 값을 {}로 추론하며,
    빈 객체('{}')는 기본적으로 키/값을 추가하는 것이 불가능합니다.
*/
// events.reduce((acc, curr) => {
//     const visitor = curr.visitor_id
//     if (!acc[visitor]) {
//         acc[visitor] = { count: 0 }
//     }
//     acc[visitor].count++
//     return acc
// }, {})

// 방법 1
// const visitorCount = events.reduce((acc: Record<string, { count: number }>, curr) => {
//     const visitor = curr.visitor_id
//     if (!acc[visitor]) {
//         acc[visitor] = { count: 0 }
//     }
//     acc[visitor].count++
//     return acc
// }, {})

// 방법 2
// type VisitorCount = {
//     [key: string]: { count: number }
// }
// const visitorCount = events.reduce<VisitorCount>((acc, curr) => {
//     const visitor = curr.visitor_id
//     if (!acc[visitor]) {
//         acc[visitor] = { count: 0 }
//     }
//     acc[visitor].count++
//     return acc
// }, {})

// console.log(visitorCount)
// console.log(Object.values(visitorCount).map(item => item.count))
// console.log(...Object.values(visitorCount).map(item => item.count))

// // 가장 많은 방문자
// // 최댓값 계산
// const maxCount = Math.max(
//     ...Object.values(visitorCount).map(item => item.count)
// Object인  const maxCount = Math.max(44, 47, 14, 34, 37, 36);
// )
// console.log(maxCount + '명')

// // 최댓값에 해당하는 항목 필터링
// const result = Object.entries(visitorCount) // 줄바꿈
//     .filter(([key, value]) => value.count === maxCount)

// console.log(result)

// 3. 날짜별 그룹화 (acc: 누적값, curr: 현재값)

// const groupByDate = events.reduce((acc: Record<string, Event[]>, curr) => {
//     const date = curr.date
//     if (!acc[date]) {
//         acc[date] = []
//     }
//     acc[date].push(curr)
//     return acc
// }, {})

// type DateType = {
//     [key: string]: Event[]
// }

// const groupByDate = events.reduce<DateType>((acc, curr) => {
//     const date = curr.date
//     if (!acc[date]) {
//         acc[date] = []
//     }
//     acc[date].push(curr)
//     return acc
// }, {})

// console.log(groupByDate)

// 제너릭 사용 예시
// type Super = <T>(a: T[]) => T
// const superPrint: Super = a => a[2]

// const a = superPrint([1, 2, 3, 4, 5])
// const b = superPrint([1, 2, true, false, 'hello'])

// console.log(a)
// console.log(b)

// 제너릭 사용 예시
// class Stack<T> {
//     private items: T[] = []

//     push(item: T) {
//         this.items.push(item)
//     }

//     pop(): T | undefined {
//         // return this.items.reverse().pop()
//         return this.items.pop()
//     }
// }
// const stack = new Stack<number>() // T는 number
// stack.push(10)
// stack.push(20)

// const num1 = [10, 20]
// console.log(num1.pop()) // 20 : 마지막에 제거된 값을 줌

// const num2 = [10, 20]
// num2.pop() // 마지막 값 제거
// console.log(num2) // [ 10 ] : 마지막 값을 제거하고 남은 배열을 줌

// const groupByDateWithCount = events.reduce((acc, curr) => {
//   const date = curr.date;
//   if (!acc[date]) {
//     acc[date] = { count: 0 }; // count 초기화
//   }
//   acc[date].count++; // 개수 증가
//   return acc;
// }, {});

/*
acc의 타입을 지정하는 2가지 방법이 있는데 첫번 째 방법을 많이 사용한다.

type dateCount = {
    [key: string]: { count: number }
}

or

acc: Record<string, {count: number}>
*/
// type dateCount = {
//     [key: string]: { count: number }
// }

// const groupByDateWithCount = events.reduce<dateCount>((acc, curr) => {
//     const date = curr.date
//     if (!acc[date]) {
//         acc[date] = { count: 0 } // count 초기화
//     }
//     acc[date].count++ // 개수 증가
//     return acc
// }, {})

// console.log(groupByDateWithCount)

// 4. 날짜 + 시간별 그룹화 (acc: 누적값, curr: 현재값)

//  먼저 날짜 순서로 정렬시킴
// events.sort((a, b) => {
//     const timea = new Date(a.created_at).getTime()
//     const timeb = new Date(b.created_at).getTime()
//     return timea - timeb
// })

// 5. 날짜 + 시간별 그룹화

// type DateAndTime = {
//     [key: string]: { count: number }
// }

// const groupByDateAndTime = events.reduce<DateAndTime>((acc, curr) => {
//     const dateAndTime = curr.created_at.slice(0, 16)
//     if (!acc[dateAndTime]) {
//         // acc[dateAndTime] = [];
//         acc[dateAndTime] = { count: 0 } // count 초기화
//     }
//     //   acc[dateAndTime].push(curr);
//     acc[dateAndTime].count++
//     return acc
// }, {})

// 먼저 날짜 순서로 정렬을 시켰기 떄문에 자동 정렬이 됨
// console.log(groupByDateAndTime)

// 타입을 만들 때 대문자 사용 (필수)
// type AccTime = {
//     [key: string]: { count: number }
//     // [key: string]: Event[]
// }

// const chainDate = events
//     .sort((a, b) => {
//         const timeA = new Date(a.created_at).getTime()
//         const timeB = new Date(b.created_at).getTime()
//         return timeA - timeB
//     })
//     .reduce<AccTime>((acc, curr) => {
//         const date = curr.created_at.slice(0, 14)
//         if (!acc[date]) {
//             acc[date] = { count: 0 }
//             // acc[date] = []
//         }
//         acc[date].count++
//         // acc[date].push(curr)
//         return acc
//     }, {})

// console.log(chainDate)

// 6. dataType 별로 표기

//  먼저 날짜 순서로 정렬시킴
// type AccTime = {
//     [key: string]: { count: number }
// }

// const chainDate = events
//     .sort((a, b) => {
//         const timea = new Date(a.created_at).getTime()
//         const timeb = new Date(b.created_at).getTime()
//         return timea - timeb
//     })
//     .reduce<AccTime>((acc, curr) => {
//         const typeName = curr.type.name
//         if (!acc[typeName]) {
//             acc[typeName] = { count: 0 }
//             // acc[typeName] = []
//         }
//         acc[typeName].count++
//         // acc[typeName].push(curr)
//         return acc
//     }, {})

// console.log(chainDate)

// reduce는 type 결과를 객체로 생성하기 때문에 sort를 사용하지 못한다.
// sort는 배열에만 사용할 수 있다.

// 객체를 배열로 변환
// const sortedTypes = Object.entries(type)
//     .map(([key, value]) => ({
//         typeName: key,
//         resources: value,
//     }))
//     .sort((a, b) => {
//         // 각 그룹에서 가장 최근 리소스의 생성 시간을 기준으로 정렬
//         const timeA = new Date(a.resources[0].resource.created_at)
//         const timeB = new Date(b.resources[0].resource.created_at)
//         return timeA - timeB
//     })

// console.log(sortedTypes);
// console.log(sortedTypes.slice(0, 2)); // 상위 2개의 항목만 출력
// console.log(JSON.stringify(sortedTypes.resources, null, 2));

// 방문자 그룹 나누기
// type AccVisitor = {
//     [key: string]: { count: number }
// }

// const groupedByVisitor = events.reduce<AccVisitor>((acc, curr) => {
//     const group = curr.visitor_id // 방문자 유형 기준으로 그룹화 (기본값: unknown)
//     if (!acc[group]) {
//         // acc[group] = []
//         acc[group] = { count: 0 }
//     }
//     // acc[group].push(curr)
//     acc[group].count++
//     return acc
// }, {})

// console.log(Object.entries(groupedByVisitor))
// console.log(Object.keys(groupedByVisitor))
// console.log(Object.values(groupedByVisitor))

//////////////////////////////////////////////////////////// 연습 ////////////////////////////////////////////////////////////

// var items = [
//     { name: "Edward", value: 21 },
//     { name: "Sharpe", value: 37 },
//     { name: "And", value: 45 },
//     { name: "The", value: -12 },
//     { name: "Magnetic", value: 13 },
//     { name: "Zeros", value: 37 },
//   ];

// value 기준으로 정렬
// items.sort((a, b) => {
//   if (a.value > b.value) {
//     return 1;
//   }
//   if (a.value < b.value) {
//     return -1;
//   }
//   return 0;
// });

// name 기준으로 정렬
// items.sort((a, b) => {
//   var nameA = a.name.toUpperCase();
//   var nameB = b.name.toUpperCase();
//   if (nameA < nameB) {
//     return -1;
//   }
//   if (nameA > nameB) {
//     return 1;
//   }

//   return 0;
// });

// const numbers = [1, 2, 3, 4, 5];

// 1번
// numbers.forEach((item) => console.log(item));

// 2번
// const changeNum = numbers.map((item) => item * 2);
// console.log(changeNum);

// 3번
// const plusNum = numbers.reduce((acc, curr) => acc + curr);
// console.log(plusNum);

// 4번
// const max = numbers.reduce((acc, curr) => {
//   return acc > curr ? acc : curr;
// }, 0);
// console.log(max);

// const words = ["apple", "banana", "kiwi", "cherry", "mango"];

// 5번
// const fiveWord = words.filter((item) => item.length >= 5);
// console.log(fiveWord);

// const numbers = [3, 8, 12, 5, 20];

// 6번
// const foundNumber = numbers.find((item) => {
//   return item > 10;
// });
// console.log(foundNumber);

// 7번
// const numbers = [2, 4, 6, 8, 10];
// const allEven = numbers.every((item) => item % 2 === 0);
// const hasOdd = numbers.some((item) => item % 2 !== 0);
// console.log(allEven);
// console.log(hasOdd);

// 8번
// const nestedArray = [1, [2, [3, [4, 5]]]];
// const flat1 = nestedArray.flat(); // flat 메서드로 1단계 평탄화
// const flat2 = nestedArray.flat(2); // flat 메서드로 2단계 평탄화
// const flat3 = nestedArray.flat(3); // flat 메서드로 3단계 평탄화
// const flatInfinity = nestedArray.flat(Infinity); // flat 메서드로 3단계 평탄화
// console.log(flat1);
// console.log(flat2);
// console.log(flat3);
// console.log(flatInfinity);

// const students = [
//   { name: "Alice", score: 85 },
//   { name: "Bob", score: 92 },
//   { name: "Charlie", score: 88 },
// ];

// 9번
// const averageScore =
//   students.reduce((acc, student) => {
//     return acc + student.score;
//   }, 0) / students.length;
// console.log(averageScore); // 88.33

// 10번
// 주어진 문자열 배열을 알파벳 순으로 정렬하세요.
// const words = ["banana", "apple", "cherry", "date"];
// const sortedWords = words.sort(); // 기본 알파벳 순
// console.log(sortedWords); // ["apple", "banana", "cherry", "date"]

// 11번
// 점수가 포함된 객체 배열을 점수 기준으로 내림차순 정렬하세요.
// const scores = [
//   { name: "Alice", score: 85 },
//   { name: "Bob", score: 92 },
//   { name: "Charlie", score: 88 },
// ];
// const sortedScores = scores.sort((a, b) => {
//   const ScoreA = a.score;
//   const ScoreB = b.score;
//   return ScoreB - ScoreA;
// });
// console.log(sortedScores);

// 11번
// 사용자의 쇼핑 리스트에서 "구매 완료" 상태의 품목들만 선택한 후, 이름 목록을 추출하세요.
// const shoppingList = [
//   { item: "Milk", purchased: true },
//   { item: "Bread", purchased: false },
//   { item: "Eggs", purchased: true },
// ];
// const purchasedItems = shoppingList
//   .filter((item) => {
//     return item.purchased;
//   })
//   .map((item) => {
//     return item.item;
//   });
// console.log(purchasedItems);

// 12번
// 문제: 주어진 숫자 배열에서 중복된 숫자를 제거하고, 오름차순으로 정렬된 배열을 반환하세요.
// Set이나 filter 등 배열 메서드를 활용하여 중복을 제거하세요.
// 최종 배열은 오름차순으로 정렬하세요.
// const numbers = [3, 1, 4, 3, 2, 1, 5, 4];

// console.log(new Set(numbers).size);
// console.log(new Set(numbers));
// console.log(...new Set(numbers));
// console.log([...new Set(numbers)]);

// const uniqueSortedNumbers = [...new Set(numbers)].sort((a, b) => a - b);
// console.log(uniqueSortedNumbers);

// 13번
// 문제: 주어진 학생 객체 배열에서, 각 학생의 name 속성만을 뽑아서 새 배열을 만들어 반환하세요.
// const students = [
//   { name: "Alice", score: 85 },
//   { name: "Bob", score: 92 },
//   { name: "Charlie", score: 88 },
// ];

// const name = students.map((item) => item.name);
// console.log(name);

// 14번
// 문제: 숫자 배열에서 짝수이면서 10보다 큰 숫자만을 필터링하여 반환하세요.
// const numbers = [12, 7, 15, 10, 20, 3, 9, 30];
// const filteredNumbers = numbers.filter((num) => num % 2 === 0 && num > 10);
// console.log(filteredNumbers);

// 15번
// 문제: 두 개의 배열을 합쳐서 중복 없이 하나의 배열로 반환하세요.
// const array1 = [1, 2, 3, 4];
// const array2 = [3, 4, 5, 6];
// const array = [...array1, ...array2];
// console.log([...new Set(array)]);

// 16번
// 문제: 문자열 배열에서 길이가 5보다 큰 문자열을 별도의 배열로 분리하고, 길이가 5 이하인 문자열은 다른 배열로 분리하세요.
// const words = ["apple", "banana", "kiwi", "cherry", "mango", "fig"];
// let long = [];
// let short = [];
// words.forEach((item) => {
//   if (item.length > 5) {
//     long.push(item);
//   } else {
//     short.push(item);
//   }
// });
// console.log(long);
// console.log(short);

// const longWords = words.filter((word) => word.length > 5);
// const shortWords = words.filter((word) => word.length <= 5);
// console.log(longWords);
// console.log(shortWords);

// 17번
// 문제: 주어진 객체 배열에서 score 값이 90 이상인 학생들의 score를 5점 올리고, 그 학생들의 이름만 반환하세요.
// const students = [
//   { name: "Alice", score: 85 },
//   { name: "Bob", score: 92 },
//   { name: "Charlie", score: 88 },
// ];
// const updatedStudents = students
//   .filter((student) => student.score >= 90)
//   .map((student) => {
//     student.score += 5;
//     return student.name;
//   });
// console.log(updatedStudents);

// 18번
// 문제: 중첩된 객체 배열에서 order.total 값을 모두 더하여 총합을 구하세요.
// const orders = [
//   { order: { id: 1, total: 25 } },
//   { order: { id: 2, total: 50 } },
//   { order: { id: 3, total: 30 } },
// ];

// const sum = orders.reduce((acc, curr) => acc + curr.order.total, 0);
// console.log(sum);

// 19번
// 문제: 주어진 객체 배열에서 각 객체의 price에 10% 세금을 추가한 새로운 배열을 생성하세요.
// const products = [
//   { name: "Product A", price: 100 },
//   { name: "Product B", price: 150 },
//   { name: "Product C", price: 200 },
// ];

// const ten = products.map((item) => +(item.price * 1.1).toFixed(2));
// console.log(ten);

// const updatedProducts = products.map((product) => ({
//   ...product,
//   price: +(product.price * 1.1).toFixed(2),
// }));
// console.log(updatedProducts);

// 20번
// 문제: 두 개의 배열에서 공통되는 요소들만 뽑아 새로운 배열로 반환하세요.
// const array1 = [1, 2, 3, 4, 5];
// const array2 = [4, 5, 6, 7, 8];

// const array = array1.filter((item) => array2.includes(item));

// console.log(array);

// 21번
// 문제: 주어진 숫자 배열에서 10보다 큰 첫 번째 숫자를 찾고, 그 숫자가 20보다 큰지 여부를 반환하세요.
// const numbers = [2, 4, 8, 12, 5, 20];

// const ten = numbers.find((num) => num > 10);
// const check = ten ? ten > 20 : false;
// console.log(ten);
// console.log(check);

// 22번
// const subject = [
//     { name: 'James', subject: 'Math', score: 90 },
//     { name: 'Doom', subject: 'Korean', score: 75 },
//     { name: 'Petter', subject: 'Eng', score: 88 },
//     { name: 'Tayler', subject: 'Math', score: 65 },
// ]

// const score = subject.reduce((acc, curr) => acc + curr.score, 0)
// console.log(`총 점수: ${score}점`)

// const num = subject
// console.log(`수학을 고른 학생의 이름은 ${num} 입니다.`)
