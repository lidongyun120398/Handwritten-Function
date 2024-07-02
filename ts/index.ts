import {expectType} from 'tsd'

interface Test{
    name: string;
    age: number;
}

declare let test: Test;

// expectType<Test>(test)

const arr6: [string, number?, boolean?] = ['linbudu']
type TupleLength = typeof arr6.length; // 1|2|3

//具名元组
const arr7: [name: string, age: number, male: boolean] = ['linbudu', 599, true];

interface IDescription {
  name: string;
  age: number;
  male?: boolean;
}

const obj1: IDescription = {
  name: 'linbudu',
  age: 599,
  male: true,
};
obj1.name = 'lidongyun';
console.log(typeof obj1.male)

declare const uniqueSymbolFoo: unique symbol;

// const uniqueSymbolBaz: typeof uniqueSymbolFoo = Symbol(0)




console.log('Hello TypeScript')