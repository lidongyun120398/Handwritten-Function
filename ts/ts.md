### 字面量类型

字面量类型来解决如果status定义为string类型或者code定义为number类型精度不够的问题

TypeScript 中，这叫做字面量类型（Literal Types），它代表着比原始类型更精确的类型，同时也是原始类型的子类型;字面量类型主要包括字符串字面量类型、数字字面量类型、布尔字面量类型和对象字面量类型，
```typescript
interface Res {
  code: 10000 | 10001 | 50000;
  status: "success" | "failure";
  data: any;
}
```

通常和联合类型（即这里的 |）一起使用，表达一组字面量类型
```typescript
interface Tmp {
  bool: true | false;
  num: 1 | 2 | 3;
  str: 'li' | 'dong' | 'yun';
}
```

### 联合类型
联合类型代表了一组类型的可用集合，只要最终赋值的类型属于联合类型成员之一，就可以认为符合这个联合类型
```typescript
interface Tmp {
  mixed: true | string | 599 | {} | (() => {}) | (1 | 2)
}
```
+ 注意:
    1. 对于联合类型中的函数类型，需要使用括号()包裹起来
    2. 函数类型并不存在字面量类型，因此这里的(() => {})就是一个合法函数
    3. 可以在联合类型中进一步嵌套联合类型，但是最总都会被展平到第一级中

多个对象联合来实现手动互斥
```typescript
interface Tmp {
  user:
  |{
    vip:true,
    expires:string
  }
  |{
    vip:false,
    promotion:string
  }
}
```
+ 在这里的第一个管道符(|)是为了格式的一致性和美观添加的，去掉后该类型仍然合法

### 枚举
```typescript
enum PageUrl {
  Home_Page_Url = 'url1',
  Setting_Page_Url = 'url2',
  Share_Page_Url = 'url3',
}

const homePage = PageUrl.Home_Page_Url;
```
+ 如果你没有声明枚举的值，它会默认使用数字枚举，并且从 0 开始，以 1 递增
```typescript
enum Items{
  Foo,
  Bar,
  Baz
}
```
在这个例子中,Items.Foo,Items.Bar,Items.Baz的值依次是 0，1，2

+ 并且如果你只为某一个成员指定了枚举值，那么之前未赋值成员仍然会使用从 0 递增的方式，之后的成员则会开始从枚举值递增
```typescript
enum Items{
  Foo,//0
  Bar = 600,//600
  Baz //601
}
```
枚举和对象的重要差异在于:
  + 对象是单向映射的，我们只能从键映射到键值。而枚举是双向映射的，即你可以从枚举成员映射到枚举值，也可以从枚举值映射到枚举成员;
  + 仅有值为**数字**的枚举成员才能够进行这样的双向枚举，**字符串**枚举成员仍然只会进行单次映射
```typescript
const key1 = Items.Foo;//0
const key2 = Item[0];//Foo
```

#### 常量枚举
```typescript
const enum Items {
  Foo,
  Bar,
  Baz
}

const fooValue = Items.Foo; // 0
```
对于常量枚举，你只能**通过枚举成员访问枚举值**（而不能通过值访问成员）。同时，在编译产物中并不会存在一个额外的辅助对象（如上面的 Items 对象），对枚举成员的访问会被**直接内联替换为枚举的值**

### 函数
函数的类型就是描述了**函数入参类型**与**函数返回值类型**
+ 函数声明方式定义
```typescript
function foo(name:string):number{
  return name.length
}
```
+ 函数表达式方式定义
```typescript
//函数表达式
const foo = function(name:string):number{
  return name.length
}

//同时函数表达式的也可以写成这样,但是这样可读性太差了，不推荐
const foo:(name:string) => number = function(name){
  return name.length
}
```

同时也可以使用类型别名或者interface的方式来定义
```typescript
type Foo = (name:string) => number

const foo:Foo = function(name){
  return name.length
}

interface FuncFooStruct {
  (name: string): number
}
```

#### 可选参数
与数组一样，可选参数使用？来表示
```typescript
function foo(name:string,age?:number){}

//给age一个默认值
function foo(name:string,age?:number = 18){}

//在这种情况下，就不再需要？，因为不传也有默认值所以可以写成以下的形式
//并且这里如果是原始类型也可以不写类型，因为会根据默认值推导
function foo(name:string,age:number = 18){}
```
+ 可选参数必须位于必选参数的后面，函数的参数是**按顺序**进行匹配的，所以可选参数必须位于必选参数的后面

#### rest参数
rest参数实际上就是一个数组
```typescript
function foo(name: string, ...rest: any[]){}
```
也可以使用元组来标注
```typescript
function foo(name: string, ...rest: [number,string])

foo('ldy',18,'male')
```

#### 函数签名重载
```typescript
function foo(tmp: number,flag: boolean) : number | string {
  if(flag){
    return String(tmp)
  }
  return tmp
}
```
上面的函数会根据flag的值来判断是返回number类型还是string类型，但是在当前类型的定义中，完全看不到这点，我们只知道返回了一个number|string的联合类型，所以这里需要使用到**函数签名重载**
```typescript
function foo(tmp: number, flag: true) : string;
function foo(tmp: number, flag?: false) : number;
function foo(tmp: number, flag?: boolean) : number | string {
  if(flag){
    return String(tmp)
  }
  return tmp
}

const rest1 = foo(599);
const rest2 = foo(599, true);
const rest3 = foo(599, false);
```
这里的三个 __function foo__ 有不同的意义
+ __function func(foo: number, bar: true)__: string，重载签名一，传入 bar 的值为 true 时，函数返回值为 string 类型。

+ __function func(foo: number, bar?: false)__: number，重载签名二，不传入 bar，或传入 bar 的值为 false 时，函数返回值为 number 类型。

+ __function func(foo: number, bar?: boolean)__: string | number，函数的实现签名，会包含重载签名的所有可能情况。

这里有一个需要注意的地方，拥有多个重载声明的函数在被调用时，是按照重载的声明顺序往下查找的。因此在第一个重载声明中，为了与逻辑中保持一致，即在 bar 为 true 时返回 string 类型，这里我们需要将第一个重载声明的 bar 声明为必选的字面量类型。

#### 异步函数、Generator函数等类型定名
```typescript
//异步
async function asyncFunc(): Promise<void> {}
//Generator函数
function* genFunc(): Iterable<void> {}
//异步Generator函数
async function* asyncGenFunc(): AsyncIterable<void> {}
```

### Class

#### 类与类成员的类型签名
Class的主要构造只有**构造函数**、**属性**、**方法**和**访问符**

属性的类型标注类似于变量，而构造函数、方法、存取器的类型编标注类似于函数
```typescript
class Foo{
  prop:string

  constructor(inputProp: string) {
    this.prop = inputProp
  }


  print(addon: string): void {
    console.log(`${this.prop} and ${addon}`)
  }

  get propA(): string {
    return `${this.prop} + A`
  }

//set方法不允许对返回值标注
  set propA(value: string){
    this.prop = `${value} + A`
  }
}
```

#### 修饰符
+ public: 默认修饰符，可以省略,此类成员在类、类的实例、子类中都能被访问
+ private: 私有属性，不能在声明它的类的外部访问,此类成员仅能在类的内部被访问
+ protected: 受保护的属性，不能在声明它的类的外部访问，但是可以在子类中访问,此类成员仅能在类与子类中被访问，你可以将类和类的实例当成两种概念，即一旦实例化完毕（出厂零件），那就和类（工厂）没关系了，即不允许再访问受保护的成员。
+ readonly: 只读属性，不能被修改
```typescript
class Foo{
  private prop: string

  constructor(inputProp: string) {
    this.prop = inputProp
  }

  protected print(addon: string): void {
    console.log(`${this.prop} and ${addon}`)
  }

  public get propA(): string {
    return `${this.prop} + A`
  }

  public set propA(value: string){
    this.prop = `${value} + A`
  }
}
```

为了简单一点，我们还可以直接**在构造函数中对参数应用访问性修饰符**
```typescript
class Foo{
  constructor(private arg1: string, private arg2: string){}
}

const foo = new Foo('ldy','male')
```

#### 静态成员
通过static来定义一个静态成员
```typescript
class Foo{
  static prop: string = 'ldy'
}
```
不同于实例成员，在类的内部静态成员无法通过 this 来访问，需要通过 **Foo.prop** 这种形式进行访问。

*静态成员直接被挂载在函数体上，而实例成员挂载在原型上，这就是二者的最重要差异：静态成员不会被实例继承，它始终只属于当前定义的这个类（以及其子类）。而原型对象上的实例成员则会沿着原型链进行传递，也就是能够被继承*


#### 继承
```typescript
class Parent {
  print(){
    console.log('parent')
  }
}

class Children extends Parent{
  print(){
    super.print()
    console.log('children')
  }
}

const children = new Children()
children.print()
```
与正常的js中继承方法一致,通过super可以调用父类方法

同时在子类中想要确保覆盖父类中的方法，提供了** override **关键字
```typescript
class Parent {
  printA(){
    console.log('parent')
  }
}

class Children extends Parent{
  override print(){}
}
```
+ 这里的这种写法是会报错的，因为在基类中没有print这个方法，但是在派生类中打算覆盖
+ 通过这一关键字我们就能确保首先这个方法在基类中存在，同时标识这个方法在派生类中被覆盖了
  
#### 抽象类
抽象类是专门用来被继承的类，它不能被实例化。
```typescript
abstract class Parent{
  abstract absProp: string
  abstract absMethod(name: string): void
}
//要把属性方法全都实现
class Foo implements Parent{
  absProp: string = 'ldy'

  absMethod(name: string){
    console.log(name)
  }
}
```
+ 在 TypeScript 中无法声明静态的抽象成员
  
抽象类的本质就是为了描述类的结构，同时interface不仅可以声明函数结构，也可以声明类的结构
```typescript
interface Parent{
  absProp: string
  absMethod(name: string): void
}

class Foo implements Parent{
  absProp: string = 'ldy'

  absMethod(name: string){
    console.log(name)
  }
}
```
在这里抽象类和接口的作用是一样的，都是描述这个类的结构

#### any
```typescript
fucntion foo(message:any,...options:any[]){}
```
在上面的代码中，使用了any类型表示可以接受任意类型的值
除了显示标记一个变量或者参数的类型为any，某些情况下也会被隐式的推导为any，如
```typescript
let foo;

function func(foo,bar){}
```
同时any类型几乎无所不能，它可以在**声明之后再次接收任意类型的值**，也可以**赋值给其他任意类型的变量**
```typescript
let anyVar: any = 'ldy'

anyVar = 123
anyVar = true
anyVar = () => {}

const var1: string = anyVar
const var2: number = anyVar
const var3: boolean = anyVar
const var4: () => void = anyVar
```
这样写的话就可以认为类型推导和检查时完全禁用的，所以在正常开发中不推荐使用any
+ 如果是类型不兼容报错导致你使用 any，考虑用类型断言替代，我们下面就会开始介绍类型断言的作用
+ 如果是类型太复杂导致你不想全部声明而使用 any，考虑将这一处的类型去断言为你需要的最简类型。如你需要调用 foo.bar.baz()，就可以先将 foo 断言为一个具有 bar 方法的类型
+ 如果你是想表达一个未知类型，更合理的方式是使用 unknown

#### unknown
unknown代表一个暂时未知，但是之后会赋值的类型

unknown类型的变量可以再次被赋值为其他类型，但是只能赋值给any和unknown类型的变量
```typescript
let unknownVar: unknown = 'ldy'

unknownVar = 123
unknownVar = true
unknownVar = () => {}

const var1: string = unknownVar //error
// const var2: number = unknownVar //error
const var3: boolean = unknownVar //error
const var4: () => void = unknownVar //error

const var5: any = unknownVar
const var6: unknown = unknownVar
```
+ unknown类型是类型安全的，不能直接赋值给其他类型，需要使用类型断言

#### never
表示一个从不会出现的类型
```typescript
type UnionWithNever = string | number | void | never 
```
这时UnionWithNever的类型为string | number | void，never类型被无视了，但是void仍然存在;void作为类型表示一个空类型，相当于typescript中的null一样，代表**这里有类型但是是个空类型**,而never类型表示**什么都没有**，严格来说，never类型不携带任何的类型信息，因此会在联合类型中直接移除

我们通常不会显示的声明一个never类型，它主要被类型检查所使用，但在某些情况下使用never是符合逻辑的
```typescript
function throwError(message: string): never{
  throw new Error(message)
}
```

同时在类型流分析中，一旦一个返回值类型为never的函数被调用，那么下方的代码都会被是为无效的代码
```typescript
function foo(input: number){
  if(input > 0){
    throwError()
    //下方Dead Code
    const name = 'ldy'
  }
}
```

由于Ts强大的类型分析能力，每经过一个if语句处理，所定义的类型分支就会减少一个，而在最后的else代码块中，他的类型只剩下never，这时我们可以使用never来处理后续如果新增类型没有对判断的分支进行处理时抛出异常
```typescript
if(typeof commonType === "string"){
  commonType.charAt(1)
}else if(typeof commonType === "number"){
  commonType.toFixed(2)
}else if{
  commonType === true
}else{
  const neverType: never = commonType
  throw new Error("Unreachable")
}
``` 

### 类型断言
类型断言能够显式告知类型检查程序当前这个变量的类型，可以进行类型分析地修正、类型。它其实就是一个将变量的已有类型更改为新指定类型的操作，它的基本语法是 `as NewType`

类型断言的正确使用方式是，在 TypeScript 类型分析不正确或不符合预期时，将其断言为此处的正确类型：
```typescript
interface IFoo{
  name:string
}

declare const obj: {
  foo: IFoo
}

const {
  foo = {} as IFoo
} = obj
```

#### 双重断言
在使用类型断言时，如果断言的类型差距过大，仍然是会报错的，这时它会提醒你先断言到unknown类型再去断言到预期类型
```typescript
const foo: unknown = 'ldy'

(string as {handler: () => {}}).handler()//这里会报错

(string as unknown as {handler: () => {}}).handler()//这里就不会报错
// 使用尖括号断言
(<{ handler: () => {} }>(<unknown>str)).handler();
```

### 非空断言
非空断言其实是类型断言的简化，它使用 ! 语法，即 obj!.func()!.prop 的形式标记前面的一个声明一定是非空的（实际上就是剔除了 null 和 undefined 类型）
```typescript
declare const foo: {
  func?: () => ({
    prop?: number | null
  })
}
```
在这个例子中，func和prop都是可选的，那么在调用的时候，可能会涉及到不存在等情况，而你又想不管不顾的调用那么就可以使用`obj!.func()!.prop`这种形式来断言obj和func都是非空的

### 断言的其他用处
```typescript
interface IStruct{
  foo: string;
  bar: {
    barPropA: string;
    barPropB: number;
    barMethod: () => void;
    baz: {
      handler: () => Promise<void>;
    }
  }
}
```
这时基于该结构实现一个对象,会出现类型报错，因为我们需要实现整个接口结构
```typescript
const obj: IStruct = {}
```
此时可以使用类型断言，保留类型提示的前提下不那么完整的实现这个结构
```typescript
const obj = <IStruct>{
  bar:{
    baz: {}
  }
}
```

#### 类型别名
类型别名的作用主要是对一组类型或一个特定类型结构进行封装，以便于在其它地方进行复用
```typescript
type A = string;
type B = 200 | 400 | 500 | 502;
type C = string | (() => unknown);

type ObjType = {
  name: string;
  age: number;
}
```
在声明时也可以传入泛型，一旦接受了泛型，我们就可以称他为工具类型
```typescript
type Foctory<T> = T | number | string; 

//通常会再次声明一个新的类型别名来传入泛型生成新的类型
type FoctoryWithBool = Foctory<boolean>

const foo: FoctoryWithBool = true 
```
使用工具类型接收一个类型并返回一个包括null的联合类型，这样在使用时就可以确保你处理了可能为空值的属性读取与方法调用
```typescript
type MaybeNull<T> = T | null;

function process(input: MaybeNull<{ handler: () => {} }>){
  input?.handler()
}
```
对于工具类型来说，它的主要意义是**基于传入的泛型进行各种类型操作**，得到一个新的类型

#### 交叉类型
与联合类型 __( | )__ 不同的是交叉类型 __( & )__ 需要将两边的类型都实现才可以
```typescript
interface nameStruct {
  name: string
}

interface ageStruct {
  age: number
}

type ProfileStruct = nameStruct & ageStruct

const profile: ProfileStruct = {
  name: 'ldy',
  age: 18
}
```
如果交叉的是原始类型的话
```typescript
type A = number & string // never
```
会得到一个never，因为同时满足number和string的类型完全不存在( never )

当交叉类型和联合类型同时出现时
```typescript
type UnionIntersection1 = (1 | 2 | 3) & (1 | 2); // 1 | 2
type UnionIntersection2 = (string | number | symbol) & string // string
```
这种时候只需要取两边的**交集**就可以了

### 索引类型
索引类型指的不是某一个特定的类型工具，它其实包含三个部分：**索引签名类型**、**索引类型查询**与**索引类型访问**,**它们都通过索引的形式来进行类型操作**，但索引签名类型是**声明**，后两者则是**读取**

#### 索引签名类型
```typescript
type ObjType = {
  [key: string]: string
}
```
在实现*ObjType*时，key必须是string类型，value必须是string类型
```typescript
const obj: ObjType = {
  name: 'ldy'
}
  
```
但由于 JavaScript 中，对于 obj[prop] 形式的访问会将数字索引访问转换为字符串索引访问，也就是说， obj[599] 和 obj['599'] 的效果是一致的。因此，在字符串索引签名类型中我们仍然可以声明数字类型的键。类似的，symbol 类型也是如此
```typescript
const foo: ObjType = {
  '599': 'ldy',
  [Symbol('ddd')]: 'ldy',
  599: 'ldy'
}
```
同时索引签名类型也可以和具体的键值类型并存，但这时这些具体的键值类型也要符合索引签名类型的声明
```typescript
interface AllStringTypes{
  propA: number;//这里的propA会报错，因为number类型不符合boolean
  [key:string]: boolean;
}
```
但是可以改写成以下形式
```typescript
interface AllStringTypes{
  propA: number;
  propB: boolean;
  [key:string]: boolean | number;
}
```

#### 索引类型查询
索引类型查询也就是keyof操作符。严谨的说它可以将对象中的所有键转换为对应字面量类型再组合成联合类型（数字类型的键名会保持数字类型字面量）
```typescript
interface Foo{
  ldy: 1,
  599: 2
}
type FooKeys = keyof Foo; // 'ldy' | 599
 
//在vscode中悬浮鼠标只能看到keyof Foo，可以这样做
type FooKeys = keyof Foo & {};

```
还可以通过keyof any来生产一个**string | number | symbol**的联合类型
由此我们可以知道， **keyof 的产物必定是一个联合类型**

#### 索引类型访问
```typescript
interface Foo{
 [key: string] :number
}

interface Foo{
  propA: number
  propB: boolean
}

type PropType = NumberRecord[string]
type PropAType = NumberRecord['propA']
type PropBType = NumberRecord['propB']
```
在typeScript中我们可以通过string这个类型来访问到NumberRecord，与js中对象属性的访问方式类似

在这里也可以结合keyof关键字使用
```typescript
interface Foo{
  propA: number;
  propB: boolran;
  propC: string;
}

type PropType = Foo[keyof Foo] // number | boolean | string
```

#### 索引映射
```typescript
type Readonly<T> = {
  [P in keyof T]: string;
}
```
在这个示例中我们通过映射类型(in关键字)，将这个联合类型的每一个成员映射出来，并将其键值类型设置为 string，就是下面这个样子
```typescript
interface Foo {
  prop1: string;
  prop2: number;
  prop3: boolean;
  prop4: () => void;
}

type StringifiedFoo = Stringify<Foo>;

// 等价于
interface StringifiedFoo {
  prop1: string;
  prop2: string;
  prop3: string;
  prop4: string;
}
```

#### 类型查询操作符
在js中的typeof操作符可以检查类型，会返回string，number，object，undefined等，除此之外在TypeScript中typeof会返回一个TypeScript类型
```typescript
const str = "ldy";

const obj = { name: "ldy" };

const nullVar = null;
const undefinedVar = undefined;

const func = (input: string) => {
  return input.length > 10;
}

type Str = typeof str; // "ldy"
type Obj = typeof obj; // { name: string; }
type Null = typeof nullVar; // null
type Undefined = typeof undefined; // undefined
type Func = typeof func; // (input: string) => boolean

const func = (input: string) => {
  return input.length > 10;
}

const func2: typeof func = (name: string) => {
  return name === 'ldy'
}
```
绝大部分情况下，typeof 返回的类型就是当你把鼠标悬浮在变量名上时出现的推导后的类型，并且是**最窄的推导程度（即到字面量类型的级别）**

#### 类型守卫
TypeScript 中提供了非常强大的类型推导能力，它会随着你的代码逻辑不断尝试收窄类型，这一能力称之为**类型的控制流分析**（也可以简单理解为类型推导）。

在类型控制流分析下，每流过一个 if 分支，后续联合类型的分支就少了一个，因为这个类型已经在这个分支处理过了，不会进入下一个分支
```typescript
declare const strOrNumOrBool: string | number | boolean;

if (typeof strOrNumOrBool === "string") {
  // 一定是字符串！
  strOrNumOrBool.charAt(1);
} else if (typeof strOrNumOrBool === "number") {
  // 一定是数字！
  strOrNumOrBool.toFixed();
} else if (typeof strOrNumOrBool === "boolean") {
  // 一定是布尔值！
  strOrNumOrBool === true;
} else {
  // 要是走到这里就说明有问题！
  const _exhaustiveCheck: never = strOrNumOrBool;
  throw new Error(`Unknown input type: ${_exhaustiveCheck}`);
}
```
但是会出现一种情况，就是if条件中的表达式被抽取出来了，那么这种推导就会失效
所以这时加入了**is关键字**，即 is 关键字 + 预期类型
```typescript
function isString(input: unknown): input is string {
  return typeof input === "string";
}

function foo(input: string | number) {
  if (isString(input)) {
    // 正确了
    (input).replace("ldy", "ldy599")
  }
  if (typeof input === 'number') { }
  // ...
}
```
当isString执行时内部返回`true`的时候那么input就被推导为string类型，这时string会**被这个类型守卫调用方后续的类型控制流分析收集到**
```typescript
export type Falsy = false | "" | 0 | null | undefined;

export const isFalsy = (val: unknown): val is Falsy => !val;

// 不包括不常用的 symbol 和 bigint
export type Primitive = string | number | boolean | undefined;

export const isPrimitive = (val: unknown): val is Primitive => ['string', 'number', 'boolean' , 'undefined'].includes(typeof val);
```

#### in
在js中，in可以通过key in object的形式来判断key是否在object或其原型链上，在TypeScript中也可以用来保护类型
```typescript
interface Foo {
  foo: string;
  fooOnly: boolean;
  shared: number;
}

interface Bar {
  bar: string;
  barOnly: boolean;
  shared: number;
}

function handle(input: Foo | Bar) {
  if ('foo' in input) {
    input.fooOnly;
  } else {
    input.barOnly;
  }
}
```
因为在Foo和Bar中存在 foo / bar 和 fooOnly / barOnly这种独个类型独有的属性，因此可以作为**可辨识属性**，Foo 与 Bar 又因为存在这样具有区分能力的辨识属性，可以称为**可辨识联合类型**，而在其中的shared就不能用来分辨Foo和Bar，因为他**同时存在**两个类型中，且**一模一样**

这个可辨识属性可以是结构层面的，比如 __结构A中的prop是数组而B中的prop是对象__ ，又或者 __A存在prop而B不存在__ ，甚至可以是 __共同属性的字面量类型差异__ 
```typescript
interface Foo {
  kind: 'foo';
  diffType: string;
  fooOnly: boolean;
  shared: number;
}

interface Bar {
  kind: 'bar';
  diffType: number;
  barOnly: boolean;
  shared: number;
}

function handle1(input: Foo | Bar) {
  if (input.kind === 'foo') {
    input.fooOnly;
  } else {
    input.barOnly;
  }
}
```
#### instanceof
JavaScript 中还存在一个功能类似于 typeof 与 in 的操作符：instanceof，它判断的是原型级别的关系，如 `foo instanceof Base` 会沿着 foo 的原型链查找 `Base.prototype` 是否存在其上。当然，在 ES6 已经无处不在的今天，我们也可以简单地认为这是判断 foo 是否是 Base 类的实例。同样的，instanceof 也可以用来进行类型保护
```typescript
class FooBase {}

class BarBase {}

class Foo extends FooBase {
  fooOnly() {}
}
class Bar extends BarBase {
  barOnly() {}
}

function handle(input: Foo | Bar) {
  if (input instanceof FooBase) {
    input.fooOnly();
  } else {
    input.barOnly();
  }
}
```

#### 类型断言守卫
```typescript
import assert from 'assert';

let name: any = 'ldy';

assert(typeof name === 'number');

// number 类型
name.toFixed();
```
上面这段代码在运行时会抛出一个错误，因为 assert 接收到的表达式执行结果为 false。这其实也类似类型守卫的场景：如果断言**不成立**，比如在这里意味着值的类型不为 number，那么在断言下方的代码就执行不到（相当于 Dead Code）。如果断言通过了，不管你最开始是什么类型，断言后的代码中就**一定是符合断言的类型**，比如在这里就是 number。

为此，TypeScript 3.7 版本专门引入了 asserts 关键字来进行断言场景下的类型守卫，比如前面 assert 方法的签名可以是这样的
```typescript
function assert(condition: any, msg?: string): asserts condition {
  if (!condition) {
    throw new Error(msg);
  }
}
```
这里condition相当于是判断条件，`asserts condition`：这告诉 TypeScript 编译器，如果 assert 函数没有抛出错误，那么 `condition` 一定为真

同时类型断言守卫也可以配合**is关键字**来提供进一步的类型守卫的能力
```typescript
let name: any = 'ldy';

function assertIsNumber(val: any): asserts val is number {
  if (typeof val !== 'number') {
    throw new Error('Not a number!');
  }
}

assertIsNumber(name);

// number 类型！
name.toFixed();
```

### 接口和类型别名的合并
在交叉类型一节中，你可能会注意到，接口和类型别名都能直接使用交叉类型。但除此以外，接口还能够使用继承进行合并，在继承时子接口可以声明同名属性，但并不能覆盖掉父接口中的此属性。**子接口中的属性类型需要能够兼容（extends）父接口中的属性类型**：
```typescript
interface Struct1 {
  primitiveProp: string;
  objectProp: {
    name: string;
  };
  unionProp: string | number;
}

// 接口“Struct2”错误扩展接口“Struct1”。
interface Struct2 extends Struct1 {
  // “primitiveProp”的类型不兼容。不能将类型“number”分配给类型“string”。
  primitiveProp: number;
  // 属性“objectProp”的类型不兼容。
  objectProp: {
    age: number;
  };
  // 属性“unionProp”的类型不兼容。
  // 不能将类型“boolean”分配给类型“string | number”。
  unionProp: boolean;
}
```
类似的，如果你直接声明多个同名接口，虽然接口会进行合并，但这些同名属性的类型仍然需要兼容

接口和类型别名之间合并规则：**接口继承类型别名，和类型别名使用交叉类型合并接口**
```typescript
type Base = {
  name: string;
};

interface IDerived extends Base {
  // 报错！就像继承接口一样需要类型兼容
  name: number;
  age: number;
}

interface IBase {
  name: string;
}

// 合并后的 name 同样是 never 类型
type Derived = IBase & {
  name: number;
};
```

### 泛型
#### 类型别名中的泛型
```typescript
type Factory<T> = T | number | string;
//转成字符串
type Stringify<T> = {
  [K in keyof T]: string;
};
//复制一份新的类型
type Clone<T> = {
  [K in keyof T]: T[K];
};
//部分参数可省略
type Partial<T> = {
    [P in keyof T]?: T[P];
};

type IsEqual<T> = T extends true ? 1 : 2; //当输入的泛型为true或类型转换后为true则IsEqual为1，否则为2
```

#### 泛型约束与默认值
像函数可以声明一个参数的默认值一样，泛型同样有着默认值的设定
```typescript
type Factory<T = boolean> = T | number | string

const foo: Factory = false;
```
泛型还能做到一样函数参数做不到的事：**泛型约束**
```typescript
type ResStatus<ResCode extends number> = ResCode extends 10000 | 10001 | 10002
  ? 'success'
  : 'failure';


type Res1 = ResStatus<10000>; // "success"
type Res2 = ResStatus<20000>; // "failure"

type Res3 = ResStatus<'10000'>; // 类型“string”不满足约束“number”。
```

#### 多泛型关联
```typescript
type Conditional<Type, Condition, TruthyResult, FalsyResult> =
  Type extends Condition ? TruthyResult : FalsyResult;

//  "passed!"
type Result1 = Conditional<'ldy', string, 'passed!', 'rejected!'>;

// "rejected!"
type Result2 = Conditional<'ldy', boolean, 'passed!', 'rejected!'>;
```
这个例子表明，**多泛型参数其实就像接受更多参数的函数，其内部的运行逻辑（类型操作）会更加抽象，表现在参数（泛型参数）需要进行的逻辑运算（类型操作）会更加复杂**。

#### 对象中的泛型
```typescript
interface IRes<TData = unknown> {
  code: number;
  error?: string;
  data: TData;
}

interface IUserProfileRes {
  name: string;
  homepage: string;
  avatar: string;
}

function fetchUserProfile(): Promise<IRes<IUserProfileRes>> {}

type StatusSucceed = boolean;
function handleOperation(): Promise<IRes<StatusSucceed>> {}
```

#### 函数中的泛型
```typescript
function handle<T>(input: T): T {}
```
我们为函数声明了一个泛型参数 T，并将参数的类型与返回值类型指向这个泛型参数。这样，在这个函数接收到参数时，**T 会自动地被填充为这个参数的类型**。这也就意味着你不再需要预先确定参数的可能类型了，而**在返回值与参数类型关联的情况下，也可以通过泛型参数来进行运算**。

在基于参数类型进行填充泛型时，其类型信息会被推断到尽可能精确的程度，如这里会**推导到字面量类型而不是基础类型**。这是因为在直接传入一个值时，这个值是不会再被修改的，因此可以推导到最精确的程度。而如果你使用一个变量作为参数，那么只会使用这个变量标注的类型（在没有标注时，会使用推导出的类型）。
```typescript
function handle<T>(input: T): T {}

const author = "ldy"; // 使用 const 声明，被推导为 "ldy"

let authorAge = 18; // 使用 let 声明，被推导为 number

handle(author); // 填充为字面量类型 "ldy"
handle(authorAge); // 填充为基础类型 number
```
也可以在这个基础上对泛型做约束
```typescript
function handle<T extends string | number>(input: T): T {}
```

箭头函数的泛型
```typescript
const handle = <T extends any>(input: T): T => input;
```

#### Class中的泛型
 Class 中的泛型和函数中的泛型非常类似，只不过函数中泛型参数的消费方是参数和返回值类型，Class 中的泛型消费方则是属性、方法、乃至装饰器等。同时 Class 内的方法还可以再声明自己独有的泛型参数。我们直接来看完整的示例
```typescript
class Queue<TElementType> {
  private _list: TElementType[];

  constructor(initial: TElementType[]) {
    this._list = initial;
  }

  // 入队一个队列泛型子类型的元素
  enqueue<TType extends TElementType>(ele: TType): TElementType[] {
    this._list.push(ele);
    return this._list;
  }

  // 入队一个任意类型元素（无需为队列泛型子类型）
  enqueueWithUnknownType<TType>(element: TType): (TElementType | TType)[] {
    return [...this._list, element];
  }

  // 出队
  dequeue(): TElementType[] {
    this._list.shift();
    return this._list;
  }
}
```
其中，enqueue 方法的入参类型 TType 被约束为队列类型的子类型，而 enqueueWithUnknownType 方法中的 TType 类型参数则不会受此约束，它会在其被调用时再对应地填充，同时也会在返回值类型中被使用

#### 内置方法中的泛型
TypeScript 中为非常多的内置对象都预留了泛型坑位，如 Promise 中
```typescript
function p() {
  return new Promise<boolean>((resolve, reject) => {
    resolve(true);
  });
}
```
还有数组Array<T>中
```typescript
const arr: Array<number> = [1, 2, 3];

// 类型“string”的参数不能赋给类型“number”的参数。
arr.push('ldy');
// 类型“string”的参数不能赋给类型“number”的参数。
arr.includes('ldy');

// number | undefined
arr.find(() => false);

// 第一种 reduce
arr.reduce((prev, curr, idx, arr) => {
  return prev;
}, 1);

// 第二种 reduce
// 报错：不能将 number 类型的值赋值给 never 类型
arr.reduce((prev, curr, idx, arr) => {
  return [...prev, curr]
}, []);
```
reduce 方法是相对特殊的一个，它的类型声明存在几种不同的重载：

+ 当你不传入初始值时，泛型参数会从数组的元素类型中进行填充。
+ 当你传入初始值时，如果初始值的类型与数组元素类型一致，则使用数组的元素类型进行填充。即这里第一个 reduce 调用。
+ 当你传入一个数组类型的初始值，比如这里的第二个 reduce 调用，reduce 的泛型参数会默认从这个初始值推导出的类型进行填充，如这里是 never[]。

其中第三种情况也就意味着信息不足，无法推导出正确的类型，我们可以手动传入泛型参数来解决：
```typescript
arr.reduce<number[]>((prev, curr, idx, arr) => {
  return prev;
}, []);
```

### 结构化类型系统
```typescript
class Cat{
  eat(){}
}

class Dog{
  eat(){}
}

function feedCat(cat: Cat){}

feedCat(new Dog());
```
在这里`feedCat`需要是一只猫，但是传入Dog也不会报错,这是因为TypeScript的特性: **结构化类型系统**。
而当我们在Cat中加上一个独特的方法
```typescript
class Cat{
  eat(){},
  meow(){}
}

class Dog{
  eat(){}
}

function feedCat(cat: Cat){}

feedCat(new Dog());//报错
```
这时就会报错，我们只能用`Cat`来调用

在我们最初的例子里，Cat 与 Dog 类型上的方法是一致的，所以它们虽然是两个名字不同的类型，但仍然被视为结构一致，这就是结构化类型系统的特性。

你可能听过结构类型的别称**鸭子类型（Duck Typing**，这个名字来源于**鸭子测试（Duck Test）**。其核心理念是，**如果你看到一只鸟走起来像鸭子，游泳像鸭子，叫得也像鸭子，那么这只鸟就是鸭子**

也就说，鸭子类型中两个类型的关系是通过对象中的属性方法来判断的。

而且如果我们是给`Dog`上增加方法
```typescript
class Cat{
  eat(){}
}

class Dog{
  eat(){}
  bark(){}
}

function feedCat(cat: Cat){}

feedCat(new Dog());
```
这时也不会报错，因为`Dog`中存在`Cat`中的方法，所以`Dog`也可以被当作`Cat`来使用。

面向对象编程中的里氏替换原则也提到了鸭子测试：**如果它看起来像鸭子，叫起来也像鸭子，但是却需要电池才能工作，那么你的抽象很可能出错了**。

更进一步，在比较对象类型的属性时，同样会采用结构化类型系统进行判断。而对结构中的函数类型（即方法）进行比较时，同样存在类型的兼容性比较：
```typescript
class Cat {
  eat(): boolean {
    return true
  }
}

class Dog {
  eat(): number {
    return 599;
  }
}

function feedCat(cat: Cat) { }

// 报错！
feedCat(new Dog())
```

严格来说，鸭子类型系统和结构化类型系统并不完全一致，结构化类型系统意味着**基于完全的类型结构来判断类型兼容性**，而鸭子类型则只基于**运行时访问的部分**来决定。也就是说，如果我们调用了走、游泳、叫这三个方法，那么传入的类型只需要存在这几个方法即可（而不需要类型结构完全一致）。但由于 TypeScript 本身并不是在运行时进行类型检查（也做不到），同时官方文档中同样认为这两个概念是一致的（One of TypeScript’s core principles is that type checking focuses on the shape that values have. This is sometimes called “duck typing” or “structural typing”.）。因此在这里，我们可以直接认为鸭子类型与结构化类型是同一概念。

### 标称类型系统
标称类型系统（Nominal Typing System）要求，两个可兼容的类型，**其名称必须是完全一致的**
```typescript
type USD = number;
type CNY = number;

const CNYCount: CNY = 200;
const USDCount: USD = 200;

function addCNY(source: CNY, input: CNY) {
  return source + input;
}

addCNY(CNYCount, USDCount)
```
在结构化类型系统中，USD 与 CNY （分别代表美元单位与人民币单位）被认为是两个完全一致的类型，因此在 addCNY 函数中可以传入 USD 类型的变量。这就很离谱了，人民币与美元这两个单位实际的意义并不一致，怎么能进行相加？

在标称类型系统中，CNY 与 USD 被认为是两个完全不同的类型，因此能够避免这一情况发生。在《编程与类型系统》一书中提到，类型的重要意义之一是**限制了数据的可用操作与实际意义**，这一点在标称类型系统中的体现要更加明显。比如，上面我们可以通过类型的结构，来让结构化类型系统认为两个类型具有父子类型关系，而对于标称类型系统，父子类型关系只能通过显式的继承来实现，称为标称子类型（Nominal Subtyping）
```typescript
class Cat { }
// 实现一只短毛猫！
class ShorthairCat extends Cat { }
```

### 类型系统层级
类型层级实际上指的是，**TypeScript 中所有类型的兼容关系，从最上面一层的 any 类型，到最底层的 never 类型**。

#### 判断类型兼容的方式
1. 条件类型判断
```typescript
type Result = 'ldy' extends string ? 1 : 2;
```

2. 赋值判断
```typescript
declare let source: string;

declare let anyType: any;
declare let neverType: never;

anyType = source;

// 不能将类型“string”分配给类型“never”。
neverType = source;
```

对于变量 a = 变量 b，如果成立，意味着 `<变量 b 的类型> extends <变量 a 的类型> `成立，即 **b 类型是 a 类型的子类型**，在这里即是`string extends never `，这明显是不成立的

#### 类型层级链
首先，我们从原始类型、对象类型（后文统称为基础类型）和它们对应的字面量类型开始
```typescript
type Result1 = "ldy" extends string ? 1 : 2; // 1
type Result2 = 1 extends number ? 1 : 2; // 1
type Result3 = true extends boolean ? 1 : 2; // 1
type Result4 = { name: string } extends object ? 1 : 2; // 1
type Result5 = { name: 'ldy' } extends object ? 1 : 2; // 1
type Result6 = [] extends object ? 1 : 2; // 1
```

很明显，一个基础类型和它们对应的字面量类型必定存在父子类型关系。严格来说，object 出现在这里并不恰当，因为它实际上代表着**所有非原始类型的类型，即数组、对象与函数类型**，所以这里 Result6 成立的原因即是[]这个字面量类型也可以被认为是 object 的字面量类型。我们将结论简记为，**字面量类型 < 对应的原始类型**。

__*结论：字面量类型 < 包含此字面量类型的联合类型（同一基础类型） < 对应的原始类型*__

**在结构化类型系统的比较下，String 会被认为是 {} 的子类型**
这里从 `string < {} < object` 看起来构建了一个类型链，但实际上 `string extends object` 并不成立
```typescript
type Tmp = string extends object ? 1 : 2; // 2
```

当然不，这里的 `{} extends `和` extends {} `实际上是两种完全不同的比较方式。`{} extends object` 和` {} extends Object `意味着， `{}` 是 object 和 Object 的字面量类型，是从**类型信息的层面**出发的，即**字面量类型在基础类型之上提供了更详细的类型信息**。`object extends {}` 和 `Object extends {}` 则是从**结构化类型系统的比较**出发的，即` {}` 作为一个一无所有的空对象，几乎可以被视作是所有类型的基类，万物的起源。如果混淆了这两种类型比较的方式，就可能会得到 `string extends object` 这样的错误结论。

而 `object extends Object` 和 `Object extends object` 这两者的情况就要特殊一些，它们是因为“系统设定”的问题，Object 包含了所有除 Top Type 以外的类型（基础类型、函数类型等），object 包含了所有非原始类型的类型，即数组、对象与函数类型，这就导致了你中有我、我中有你的神奇现象。

__*结论：原始类型 < 原始类型对应的装箱类型 < Object 类型*__

#### Top Type: any和unknown
any 与 unknown 是系统中设定为 Top Type 的两个类型，它们无视一切因果律，是类型世界的规则产物

Object也是 any 与 unknown 类型的子类型

```typescript
type Result22 = Object extends any ? 1 : 2; // 1
type Result23 = Object extends unknown ? 1 : 2; // 1

type Result24 = any extends Object ? 1 : 2; // 1 | 2
type Result25 = unknown extends Object ? 1 : 2; // 2

type Result26 = any extends 'ldy' ? 1 : 2; // 1 | 2
type Result27 = any extends string ? 1 : 2; // 1 | 2
type Result28 = any extends {} ? 1 : 2; // 1 | 2
type Result29 = any extends never ? 1 : 2; // 1 | 2
```

在上面的代码中我们可以发现，部分`any extends`的代码会返回`1 | 2`。因为“系统设定”的原因。any 代表了任何可能的类型，当我们使用` any extends `时，它包含了“**让条件成立的一部分**”，以及“**让条件不成立的一部分**”。而从实现上说，在 TypeScript 内部代码的条件类型处理中，如果接受判断的是 any，那么会直接**返回条件类型结果组成的联合类型**。

__*结论： Object < any / unknown*__

__*结论： never < 字面量类型*__

结合上面的结构化类型系统与类型系统设定，我们还可以构造出一条类型层级链
```typescript
type VerboseTypeChain = never extends 'ldy'
  ? 'ldy' extends 'ldy' | 'dyl'
  ? 'ldy' | 'dyl' extends string
  ? string extends {}
  ? string extends String
  ? String extends {}
  ? {} extends object
  ? object extends {}
  ? {} extends Object
  ? Object extends {}
  ? object extends Object
  ? Object extends object
  ? Object extends any
  ? Object extends unknown
  ? any extends unknown
  ? unknown extends any
  ? 8
  : 7
  : 6
  : 5
  : 4
  : 3
  : 2
  : 1
  : 0
  : -1
  : -2
  : -3
  : -4
  : -5
  : -6
  : -7
  : -8 //8
```  

+ 类型从高到底的顺序是:
  + Top Type: any unknown
  + 顶级原型: Object
  + 装箱类型: String Number Boolean
  + 基础类型(拆箱类型):string number boolean
  + 字面量类型
  + Bottom Type: never


### 条件类型
#### 条件类型基础
类似于js中的三元表达式一样，基本语法如下:
```typescript
TypeA extends TypeB ? Result1 : Result2
```

条件类型应用，对基础类型提取
```typescript
function universalAdd<T extends number | bigint | string>(
	x: T,
	y: T
): LiteralToPrimitive<T> {
	return x + (y as any);
}

export type LiteralToPrimitive<T> = T extends number
	? number
	: T extends bigint
	? bigint
	: T extends string
	? string
	: never;

universalAdd("ldy", "599"); // string
universalAdd(599, 1); // number
universalAdd(10n, 10n); // bigint
```

函数类型的比较
```typescript
type Func = (...args: any[]) => any;

type FunctionConditionType<T extends Func> = T extends (
  ...args: any[]
) => string
  ? 'A string return func!'
  : 'A non-string return func!';

//  "A string return func!"
type StringResult = FunctionConditionType<() => string>;
// 'A non-string return func!';
type NonStringResult1 = FunctionConditionType<() => boolean>;
// 'A non-string return func!';
type NonStringResult2 = FunctionConditionType<() => number>;
```
在这里第一个extends的作用是对传入的泛型`T`约束，相当于**参数校验**，而第二个extends的作用是对参数进行条件判断，相当于实际内部逻辑

#### infer关键字
TypeScript 中支持通过 infer 关键字来**在条件类型中提取类型的某一部分信息**
拿上面的例子举例
```typescript
type FunctionReturnType<T extends Func> = T extends (
  ...args: any[]
) => infer R
  ? R
  : never;
```
`infer R`的作用是提取函数的返回值类型，R就表示待推断的类型，`infer` 只能在条件类型中使用，因为我们实际上仍然需要类型结构是一致的  

当然并不局限于函数类型结构，还可以是数组
```typescript
type Swap<T extends any[]> = T extends [infer A, infer B] ? [B, A] : T;

type SwapResult1 = Swap<[1, 2]>; // 符合元组结构，首尾元素替换[2, 1]
type SwapResult2 = Swap<[1, 2, 3]>; // 不符合结构，没有发生替换，仍是 [1, 2, 3]
```

我们也可以用rest来处理任意长度的情况
```typescript
// 提取首尾两个
type ExtractStartAndEnd<T extends any[]> = T extends [
  infer Start,
  ...any[],
  infer End
]
  ? [Start, End]
  : T;

// 调换首尾两个
type SwapStartAndEnd<T extends any[]> = T extends [
  infer Start,
  ...infer Left,
  infer End
]
  ? [End, ...Left, Start]
  : T;

// 调换开头两个
type SwapFirstTwo<T extends any[]> = T extends [
  infer Start1,
  infer Start2,
  ...infer Left
]
  ? [Start2, Start1, ...Left]
  : T;
```

infer结构也可以是接口
```typescript
// 提取对象的属性类型
type PropType<T, K extends keyof T> = T extends { [Key in K]: infer R }
  ? R
  : never;

type PropTypeResult1 = PropType<{ name: string }, 'name'>; // string
type PropTypeResult2 = PropType<{ name: string; age: number }, 'name' | 'age'>; // string | number

// 反转键名与键值
type ReverseKeyValue<T extends Record<string, unknown>> = T extends Record<infer K, infer V> ? Record<V & string, K> : never

type ReverseKeyValueResult1 = ReverseKeyValue<{ "key": "value" }>; // { "value": "key" }
```
在`ReverseKeyValue`中，我们最后使用了`V & string`,这是因为，泛型参数 V 的来源是从键值类型推导出来的，TypeScript 中这样对键值类型进行 infer 推导，将导致类型信息丢失，而不满足索引签名类型只允许 `string | number | symbol`的要求。我们使用 `V & string` 这一形式，就确保了最终符合条件的类型参数 V 一定会满足 `string | never` 这个类型，因此可以被视为合法的索引签名类型

infer结构也可以是Promise结构
```typescript
type PromiseValue<T> = T extends Promise<infer V> ? V : T;

type PromiseValueResult1 = PromiseValue<Promise<number>>; // number
type PromiseValueResult2 = PromiseValue<number>; // number，但并没有发生提取
```
#### 分布式条件类型
通过几个例子来解释
```typescript
type Condition<T> = T extends 1 | 2 | 3 ? T : never;

// 1 | 2 | 3
type Res1 = Condition<1 | 2 | 3 | 4 | 5>;

// never
type Res2 = 1 | 2 | 3 | 4 | 5 extends 1 | 2 | 3 ? 1 | 2 | 3 | 4 | 5 : never;
```
Res1和Res2的值不同，而他们的唯一差别在于**是否通过泛型传入**
```typescript
type Naked<T> = T extends boolean ? "Y" : "N";
type Wrapped<T> = [T] extends [boolean] ? "Y" : "N";

// "N" | "Y"
type Res3 = Naked<number | boolean>;

// "N"
type Res4 = Wrapped<number | boolean>;
```
Res3和Res4的值不同，他们的唯一差别是**泛型参数是否被数组包裹**

把上面的线索理一下，其实我们就大致得到了条件类型分布式起作用的条件。首先，你的类型参数需要是一个联合类型 。其次，类型参数需要通过泛型参数的方式传入，而不能直接进行条件类型判断（如 Res2 中）。最后，条件类型中的泛型参数不能被包裹。  

而条件类型分布式特性会产生的效果也很明显了，即将这个联合类型拆开来，每个分支分别进行一次条件类型判断，再将最后的结果合并起来（如 Naked 中）。如果再严谨一些，其实我们就得到了官方的解释：  

**对于属于裸类型参数的检查类型，条件类型会在实例化时期自动分发到联合类型上。（Conditional types in which the checked type is a naked type parameter are called distributive conditional types. Distributive conditional types are automatically distributed over union types during instantiation.）**

这里的自动分发，我们可以这么理解：
```typescript
type Naked<T> = T extends boolean ? "Y" : "N";

// (number extends boolean ? "Y" : "N") | (boolean extends boolean ? "Y" : "N")
// "N" | "Y"
type Res3 = Naked<number | boolean>;
```

而这里的裸类型参数，其实指的就是泛型参数是否完全裸露，我们上面使用数组包裹泛型参数只是其中一种方式，比如还可以这么做：
```typescript
export type NoDistribute<T> = T & {};

type Wrapped<T> = NoDistribute<T> extends boolean ? "Y" : "N";

type Res1 = Wrapped<number | boolean>; // "N"
type Res2 = Wrapped<true | false>; // "Y"
type Res3 = Wrapped<true | false | 599>; // "N"
```  

需要注意的是，我们并不是只会通过裸露泛型参数，来确保分布式特性能够发生。在某些情况下，我们也会需要包裹泛型参数来禁用掉分布式特性。最常见的场景也许还是联合类型的判断，即我们不希望进行联合类型成员的分布判断，而是希望直接判断这两个联合类型的兼容性判断，就像在最初的 Res2 中那样：
```typescript
type CompareUnion<T, U> = [T] extends [U] ? true : false;

type CompareRes1 = CompareUnion<1 | 2, 1 | 2 | 3>; // true
type CompareRes2 = CompareUnion<1 | 2, 1>; // false
``` 
通过将参数与条件都包裹起来的方式，我们对联合类型的比较就变成了数组成员类型的比较，在此时就会严格遵守类型层级一文中联合类型的类型判断了（子集为其子类型）。  

```
条件类型分布式起作用的条件:
  类型参数需要是一个联合类型 。
  类型参数需要通过泛型参数的方式传入，而不能直接进行条件类型判断）。
  条件类型中的泛型参数不能被包裹
```
 

另外一种情况则是，当我们想判断一个类型是否为 never 时，也可以通过类似的手段：
```typescript
type IsNever<T> = [T] extends [never] ? true : false;

type IsNeverRes1 = IsNever<never>; // true
type IsNeverRes2 = IsNever<"ldy">; // false
```
这里的原因其实并不是因为分布式条件类型。我们此前在类型层级中了解过，当条件类型的判断参数为 any，会直接返回条件类型两个结果的联合类型。而在这里其实类似，当通过泛型传入的参数为 never，则会直接返回 never。

需要注意的是这里的 never 与 any 的情况并不完全相同，any 在直接**作为判断参数时、作为泛型参数时**都会产生这一效果：
```typescript
// 直接使用，返回联合类型
type Tmp1 = any extends string ? 1 : 2;  // 1 | 2

type Tmp2<T> = T extends string ? 1 : 2;
// 通过泛型参数传入，同样返回联合类型
type Tmp2Res = Tmp2<any>; // 1 | 2

// 如果判断条件是 any，那么仍然会进行判断
type Special1 = any extends any ? 1 : 2; // 1
type Special2<T> = T extends any ? 1 : 2;
type Special2Res = Special2<any>; // 1
```
而 never 仅在作为泛型参数时才会产生:
```typescript
// 直接使用，仍然会进行判断
type Tmp3 = never extends string ? 1 : 2; // 1

type Tmp4<T> = T extends string ? 1 : 2;
// 通过泛型参数传入，会跳过判断
type Tmp4Res = Tmp4<never>; // never

// 如果判断条件是 never，还是仅在作为泛型参数时才跳过判断
type Special3 = never extends never ? 1 : 2; // 1
type Special4<T> = T extends never ? 1 : 2;
type Special4Res = Special4<never>; // never
```
通过使用分布式条件类型，我们能轻易地进行集合之间的运算，比如交集:
```typescript
type Intersection<A, B> = A extends B ? A : never;

type IntersectionRes = Intersection<1 | 2 | 3, 2 | 3 | 4>; // 2 | 3

//还可以取到对象共有属性
type C = Intersection<keyof A,keyof B>
```
#### IsAny、IsUnknown
```typescript
type IsAny<T> = 0 extends 1 & T ? true : false;

type IsUnknown<T> = unknown extends T
  ? IsAny<T> extends true
    ? false
    : true
  : false;
```

### 内置工具类型
#### 工具类型的分类
内置的工具类型按照类型操作的不同，其实也可以大致划分为这么几类：
- 对属性的修饰，包括对象属性和数组元素的可选/必选、只读/可写。我们将这一类统称为**属性修饰工具类型**。
- 对既有类型的裁剪、拼接、转换等，比如使用对一个对象类型裁剪得到一个新的对象类型，将联合类型结构转换到交叉类型结构。我们将这一类统称为**结构工具类型**。
- 对集合（即联合类型）的处理，即交集、并集、差集、补集。我们将这一类统称为**集合工具类型**。
- 基于 infer 的模式匹配，即对一个既有类型特定位置类型的提取，比如提取函数类型签名中的返回值类型。我们将其统称为**模式匹配工具类型**。
- 模板字符串专属的工具类型，比如神奇地将一个对象类型中的所有属性名转换为大驼峰的形式。这一类当然就统称为**模板字符串工具类型**了。

#### 属性修饰工具类型
在内置工具类型中，访问性修饰工具类型包括以下三位：
```typescript
//构造一个将 Type 的所有属性设置为可选的类型。此实用程序将返回一个表示给定类型的所有子集的类型。
type Partial<T> = {
    [P in keyof T]?: T[P];
};

//构造一个由设置为 required 的 Type 的所有属性组成的类型。与Partial相反
type Required<T> = {
    [P in keyof T]-?: T[P];
};

//构造一个将 Type 的所有属性设置为 readonly 的类型，这意味着构造类型的属性不能重新分配
type Readonly<T> = {
    readonly [P in keyof T]: T[P];
};
```
需要注意的是，可选标记不等于修改此属性类型为 `原类型 | undefined`，当类型为可选时在实现接口时可以不实现该属性，但是如果是`原类型 | undefined`的结构如果不实现该属性会报错

同时，TypeScript中没有实现去掉readonly的内置工具类型，我们实现一下Mutable
```typescript
type Mutable<T> = {
  -readonly [P in keyof T]: T[P]
}
```

+ 思考：
  1. 现在的属性修饰是浅层的，如果我想将嵌套在里面的对象类型也进行修饰，需要怎么改进？
```typescript
type DeepParital<T> = {
  [P in keyof T]? : T[P] extends object 
    ? DeepParital<T[P]> 
    : T[P]
}
```
其实这样功能就已经实现了，但是我在ts文件中，他的代码提示是这样的
```typescript
type B = {
    name?: string | undefined;
    age?: number | undefined;
    otherInfo?: DeepPartial<{
        school: string;
        classInfo: {
            classmate: [xiaowang: {
                name: string;
            }];
        };
    }> | undefined;
}
```
这里的深层次没有被展示出来，一开始我以为是自己写的有问题，问了gpt一样的答案，于是问了问各位大佬
**TS只有在用到的时候才会做计算**，这是这个问题的主要原因，于是添加了`T extends any`,深层递归时候校验一下就相当于使用了
```typescript
type DeepPartial<T extends object> = T extends any ? {
  [P in keyof T]?: T[P] extends object 
    ? DeepPartial<T[P]> 
    : T[P]
} : never

type DeepRequired<T extends object> = T extends any ? 
  {
    [P in keyof T]-? : T[P] extends object ? DeepRequired<T[P]> : T[P]
  } 
  : never

type DeepReadonly<T extends object> = {
  readonly [K in keyof T]: T[K] extends object ? DeepReadonly<T[K]> : T[K];
};

type DeepMutable<T extends object> = {
  -readonly [K in keyof T]: T[K] extends object ? DeepMutable<T[K]> : T[K];
};
```

  2. 现在的属性修饰是全量的，如果我只想修饰部分属性呢？这里的部分属性，可能是基于传入已知的键名来确定（比如属性a、b），也可能是基于属性类型来确定(比如所有函数类型的值)？

#### 结构工具类型
这一部分的工具类型主要使用**条件类型**以及**映射类型**、**索引类型**。

结构工具类型其实又可以分为两类，**结构声明**和**结构处理**。
```typescript
//构造一个对象类型，其属性键为 Keys，其属性值为 Type。此实用程序可用于将一种类型的属性映射到另一种类型。
type Record<K extends keyof any, T> = {
    [P in K]: T;
};
```
其中，`Record<string, unknown>` 和 `Record<string, any>` 是日常使用较多的形式，通常我们使用这两者来代替 object 。

在一些工具类库源码中其实还存在类似的结构声明工具类型，如：
```typescript
type Dictionary<T> = {
  [index: string]: T;
};

type NumericDictionary<T> = {
  [index: number]: T;
};
```
而对于结构处理工具类型，在 TypeScript 中主要是 Pick、Omit 两位选手：
```typescript
//通过从 Type 中选取一组属性 Keys（字符串字面或字符串字面的并集）来构造一个类型。
type Pick<T, K extends keyof T> = {
    [P in K]: T[P];
};

//通过从 Type 中选择所有属性然后删除 Keys（字符串字面或字符串字面的并集）来构造一个类型。
type Omit<T, K extends keyof any> = Pick<T, Exclude<keyof T, K>>;
```

+ 思考
  3. Pick 和 Omit 是基于键名的，如果我们需要基于键值类型呢？比如仅对函数类型的属性？
  4. 除了将一个对象结构拆分为多个子结构外，对这些子结构的互斥处理也是结构工具类型需要解决的问题之一。互斥处理指的是，假设你的对象存在三个属性 A、B、C ，其中 A 与 C 互斥，即 A 存在时不允许 C 存在。而 A 与 B 绑定，即 A 存在时 B 也必须存在，A 不存在时 B 也不允许存在。此时应该如何实现？
#### 集合工具类型
内置工具类型中提供了交集与差集的实现：
```typescript
// 通过从 Type 中提取所有可分配给 Union 的联合成员来构造一个类型。
type Extract<T, U> = T extends U ? T : never;

//通过从 UnionType 中排除所有可分配给 ExcludedMembers 的联合成员来构造一个类型。
type Exclude<T, U> = T extends U ? never : T;
```
这里的具体实现其实就是条件类型的分布式特性，即当 T、U 都是联合类型（视为一个集合）时，T 的成员会依次被拿出来进行 `extends U ? T1 : T2` 的计算，然后将最终的结果再合并成联合类型。

为了便于理解，我们将差集展开:
```typescript
type SetA = 1 | 2 | 3 | 5;

type SetB = 0 | 1 | 2 | 4;

type AExcludeB = Exclude<SetA, SetB>; // 3 | 5
type BExcludeA = Exclude<SetB, SetA>; // 0 | 4

type _AExcludeB =
  | (1 extends 0 | 1 | 2 | 4 ? never : 1) // never
  | (2 extends 0 | 1 | 2 | 4 ? never : 2) // never
  | (3 extends 0 | 1 | 2 | 4 ? never : 3) // 3
  | (5 extends 0 | 1 | 2 | 4 ? never : 5); // 5

type _BExcludeA =
  | (0 extends 1 | 2 | 3 | 5 ? never : 0) // 0
  | (1 extends 1 | 2 | 3 | 5 ? never : 1) // never
  | (2 extends 1 | 2 | 3 | 5 ? never : 2) // never
  | (4 extends 1 | 2 | 3 | 5 ? never : 4); // 4
```

除了差集和交集，我们也可以很容易实现并集与补集，为了更好地建立印象，这里我们使用集合相关的命名：
```typescript
// 并集
export type Concurrence<A, B> = A | B;

// 交集
export type Intersection<A, B> = A extends B ? A : never;

// 差集
export type Difference<A, B> = A extends B ? never : A;

// 补集
export type Complement<A, B extends A> = Difference<A, B>;

```

内置工具类型中还有一个场景比较明确的集合工具类型：
```typescript
// 通过从 Type 中排除 null 和 undefined 来构造一个类型。
type NonNullable<T> = T extends null | undefined ? never : T;

type _NonNullable<T> = Difference<T, null | undefined>
```
它的本质就是集合 T 相对于 null | undefined 的差集，因此我们可以用之前的差集来进行实现。

+ 思考
  5. 目前为止我们的集合类型都停留在一维的层面，即联合类型之间的集合运算。如果现在我们要处理对象类型结构的集合运算呢？
  6. 在处理对象类型结构运算时，可能存在不同的需求，比如合并时，我们可能希望保留原属性或替换原属性，可能希望替换原属性的同时并不追加新的属性进来（即仅使用新的对象类型中的属性值覆盖原本对象类型中的同名属性值），此时要如何灵活地处理这些情况？
#### 模式匹配工具类型
这一部分的工具类型主要使用**条件类型**与 **infer 关键字**。

首先是对函数类型签名的模式匹配：
```typescript
type FunctionType = (...args: any) => any;

//从函数类型 Type 的参数中使用的类型构造元组类型。
type Parameters<T extends FunctionType> = T extends (...args: infer P) => any ? P : never;

//构造一个由函数 Type 的返回类型组成的类型。
type ReturnType<T extends FunctionType> = T extends (...args: any) => infer R ? R : any;

```

我们还可以更进一步，比如只匹配第一个参数类型：
```typescript
type FirstParameter<T extends FunctionType> = T extends (
  arg: infer P, 
  ...args: any[]
) => any 
  ? P 
  : never;

type FuncFoo = (arg: number) => void;
type FuncBar = (...args: string[]) => void;

type FooFirstParameter = FirstParameter<FuncFoo>; // number

type BarFirstParameter = FirstParameter<FuncBar>; // string
```

除了对函数类型进行模式匹配，内置工具类型中还有一组对 Class 进行模式匹配的工具类型：
```typescript
type ClassType = abstract new (...args: any) => any;

//从构造函数类型的类型构造元组或数组类型。它生成一个包含所有参数类型的元组类型（如果 Type 不是函数，则生成类型 never）。
type ConstructorParameters<T extends ClassType> = T extends abstract new (
  ...args: infer P
) => any
  ? P
  : never;

//构造一个由 Type 中的构造函数的实例类型组成的类型。
type InstanceType<T extends ClassType> = T extends abstract new (
  ...args: any
) => infer R
  ? R
  : any;
```

+ 思考
  7. infer 和条件类型的搭配看起来会有奇效，比如在哪些场景？比如随着条件类型的嵌套每个分支会提取不同位置的 infer ？
  8. infer 在某些特殊位置下应该如何处理？比如上面我们写了第一个参数类型，不妨试着来写写最后一个参数类型

#### infer的约束
在某些时候，我们可能对 infer 提取的类型值有些要求，比如我只想要数组第一个为字符串的成员，如果第一个成员不是字符串，那我就不要了。
```typescript
type FirstArrayItemType<T extends any[]> = T extends [infer P, ...any[]]
  ? P extends string
    ? P
    : never
  : never;
```
看起来好像能满足需求，但程序员总是精益求精的。泛型可以声明约束，只允许传入特定的类型，那 infer 中能否也添加约束，只提取特定的类型？

TypeScript 4.7 就支持了 infer 约束功能来实现**对特定类型地提取**，比如上面的例子可以改写为这样：
```typescript
type FirstArrayItemType<T extends any[]> = T extends [infer P extends string, ...any[]]
  ? P
  : never;

```

### void 返回值类型下的特殊情况
上下文类型同样会推导并约束函数的返回值类型，但存在这么个特殊的情况，当内置函数类型的返回值类型为 void 时
```typescript
type CustomHandler = (name: string, age: number) => void;

const handler1: CustomHandler = (name, age) => true;
const handler2: CustomHandler = (name, age) => 'ldy';
const handler3: CustomHandler = (name, age) => null;
const handler4: CustomHandler = (name, age) => undefined;
```
这也是一条世界底层的规则，**上下文类型对于 void 返回值类型的函数，并不会真的要求它啥都不能返回**。然而，虽然这些函数实现可以返回任意类型的值，但**对于调用结果的类型，仍然是 void**：
```typescript
const result1 = handler1('ldy', 599); // void
```

看起来这是一种很奇怪的、错误的行为，但实际上，我们日常开发中的很多代码都需要这一“不正确的”行为才不会报错，比如以下这个例子：
```typescript
const arr: number[] = [];
const list: number[] = [1, 2, 3];

list.forEach((item) => arr.push(item));
```
这是我们常用的简写方式，然而，push 方法的返回值是一个 number 类型（push 后数组的长度），而 forEach 的上下文类型声明中要求返回值是 void 类型。如果此时 void 类型真的不允许任何返回值，那这里我们就需要多套一个代码块才能确保类型符合了。

但这真的是有必要的吗？对于一个 void 类型的函数，我们真的会去消费它的返回值吗？既然不会，那么它想返回什么，全凭它乐意就好了。我们还可以用另一种方式来描述这个概念：你可以**将返回值非 void 类型的函数（`() => list.push()`）作为返回值类型为 void 类型（`arr.forEach`）的函数类型参数**。

### 协变和逆变
协变:协变指的是类型可以按预期的方式进行替换，即可以将一个更具体的类型替换为一个更通用的类型。这通常适用于返回值类型。
```typescript
class Animal {
  name: string;
}

class Dog extends Animal {
  breed: string;
}

function getAnimal(): Animal {
  return new Dog(); // OK, Dog 是 Animal 的子类型
}
```

逆变:逆变指的是类型可以按与预期相反的方式进行替换，即可以将一个更通用的类型替换为一个更具体的类型。这通常适用于函数参数类型。
```typescript
type AnimalHandler = (animal: Animal) => void;
type DogHandler = (dog: Dog) => void;

let handleDog: DogHandler = (dog: Dog) => {
  console.log(dog.breed);
};

let handleAnimal: AnimalHandler = (animal: Animal) => {
  console.log(animal.name);
};

// handleDog = handleAnimal 是安全的
handleDog = handleAnimal; // OK, AnimalHandler 可以处理 Dog 类型参数
```

```
在 TypeScript 中，函数参数是逆变的，而返回值是协变的。这意味着：

如果你有一个函数类型 `f`，并且它的参数类型是 `A`，返回值类型是 `B`，那么你可以用一个参数类型为 `A` 的子类型 `A'` 的函数来替换 `f`。
你也可以用一个返回值类型为 `B` 的超类型 `B'` 的函数来替换 `f`。
```

从类型安全的角度更好理解，Corgi < Dog < Animal，函数的返回值类型应该收敛到能确保它最安全的类型（最精确的类型），即Corgi，才能保证函数正常工作（只有Corgi有`.cute()`方法）。而为了保证函数传入的参数最安全，函数的参数类型应该发散到能确保它最安全的类型（最少都要有相同的基类才行）,即Animal。

### 内置工具类型进阶
#### 思考1补充：
```typescript
//第一种方法 
type DeepNonNullable<T extends object> = {
  [K in keyof T]: T[K] extends object
    ? DeepNonNullable<T[K]>
    : NonNullable<T[K]>;
};

//第二种方法
type DeepNonNullable<T> = T extends object ? 
  {
    [P in keyof T] : DeepNonNullable<T[P]>
  } 
  : T extends null | undefined 
  ? never 
  : T
```

就像 Partial 与 Required 的关系一样，DeepNonNullable 也有自己的另一半：DeepNullable：
```typescript
export type Nullable<T> = T | null;

export type DeepNullable<T extends object> = {
  [K in keyof T]: T[K] extends object ? DeepNullable<T[K]> : Nullable<T[K]>;
};
```

#### 思考2：
如果我们要让一个对象的三个已知属性为可选的，那只要把这个对象拆成 A、B 两个对象结构，分别由三个属性和其他属性组成。然后让对象 A 的属性全部变为可选的，和另外一个对象 B 组合起来，不就行了吗？  

拆开来描述一下这句话，看看这里都用到了哪些知识：
+ 拆分对象结构，那不就是内置工具类型一节中讲到的**结构工具类型**，即 Pick 与 Omit？
+ 三个属性的对象全部变为可选，那不就是属性修饰？岂不是可以直接用上面刚学到的**递归属性修饰**？
+ 组合两个对象类型，也就意味着得到一个同时符合这两个对象类型的新结构，那不就是**交叉类型**？
```typescript
type MarkPropsAsOptional<
  T extends object,
  K extends keyof T = keyof T
> = Partial<Pick<T,K>> & Omit<T,K>
```
这里放入类型去验证的时候会出现跟思考1中类似的情况，我们来写一个工具类型让他能够实现平铺
```typescript
type Flatten<T> = {
  [KeyType in keyof T]: T[KeyType] extends object
    ? Flatten<T[KeyType]>
    : T[KeyType];
} & {};
```
其他方法的实现
```typescript
export type MarkPropsAsRequired<
  T extends object,
  K extends keyof T = keyof T
> = Flatten<Omit<T, K> & Required<Pick<T, K>>>;

export type MarkPropsAsReadonly<
  T extends object,
  K extends keyof T = keyof T
> = Flatten<Omit<T, K> & Readonly<Pick<T, K>>>;

export type MarkPropsAsMutable<
  T extends object,
  K extends keyof T = keyof T
> = Flatten<Omit<T, K> & Mutable<Pick<T, K>>>;

export type MarkPropsAsNullable<
  T extends object,
  K extends keyof T = keyof T
> = Flatten<Omit<T, K> & DeepNullable<Pick<T, K>>>;

export type MarkPropsAsNonNullable<
  T extends object,
  K extends keyof T = keyof T
> = Flatten<Omit<T, K> & DeepNonNullable<Pick<T, K>>>;
```

#### 思考3：基于键值的Pick和Omit
实现方式其实还是类似部分属性修饰中那样，将对象拆分为两个部分，处理完毕再组装。只不过，现在我们无法预先确定要拆分的属性了，而是需要**基于期望的类型去拿到所有此类型的属性名**，如想 Pick 出所有函数类型的值，那就要先拿到所有的函数类型属性名。先来一个 FunctionKeys 工具类型：
```typescript
type FuncStruct = (...args: any[]) => any;

type FunctionKeys<T extends object> = {
  [K in keyof T]: T[K] extends FuncStruct ? K : never;
}[keyof T];
```

`{}[keyof T]` 这个写法我们是第一次见，但我们可以拆开来看，先看看前面的 `{ [K in keyof T]: T[K] extends FuncStruct ? K : never; }` 部分，为何在条件类型成立时它返回了键名 K，而非索引类型查询 `T[K]` ？
```typescript
type Tmp<T extends object> = {
  [K in keyof T]: T[K] extends FuncStruct ? K : never;
};

type Res = Tmp<{
  foo: () => void;
  bar: () => number;
  baz: number;
}>;

type ResEqual = {
  foo: 'foo';
  bar: 'bar';
  baz: never;
};
```
在 Res（等价于 ResEqual）中，我们获得了一个属性名-属性名字面量类型的结构，对于非函数类型的属性，其值为 never。然后，我们加上 `[keyof T]` 这一索引类型查询 + keyof 操作符的组合：
```typescript
type WhatWillWeGet = Res[keyof Res]; // "foo" | "bar"
```
我们神奇地获得了所有函数类型的属性名！这又是如何实现的呢？其实就是我们此前学习过的，当索引类型查询中使用了一个联合类型时，它会使用类似分布式条件类型的方式，将这个联合类型的成员依次进行访问，然后再最终组合起来，上面的例子可以这么简化：
```typescript
type WhatWillWeGetEqual1 = Res["foo" | "bar" | "baz"];
type WhatWillWeGetEqual2 = Res["foo"] | Res["bar"] | Res["baz"];
type WhatWillWeGetEqual3 = "foo" | "bar" | never;
```
通过这一方式，我们就能够获取到符合预期类型的属性名了。如果希望抽象“基于键值类型查找属性”名这么个逻辑，我们就需要对 FunctionKeys 的逻辑进行封装，即**将预期类型也作为泛型参数**，由外部传入
```typescript
type ExpectedPropKeys<T extends object, ValueType> = {
  [Key in keyof T]-?: T[Key] extends ValueType ? Key : never;
}[keyof T];

type FunctionKeys<T extends object> = ExpectedPropKeys<T, FuncStruct>;
```
注意，为了避免可选属性对条件类型语句造成干扰，这里我们使用 `-?` 移除了所有可选标记。
那么把这些用Pick包装一下
```typescript
//会通过键值提取到对应的键名
export type PickByValueType<T extends object, ValueType> = Pick<
  T,
  ExpectedPropKeys<T, ValueType>
>;

type A = PickByValueType<{ foo: string; bar: number }, number>

type A = {
  bar:number
}
```
OmitByValueType 也是类似的，我们只需要一个和 ExpectedPropKeys 作用相反的工具类型即可，比如来个 FilteredPropKeys，只需要调换条件类型语句结果的两端即可
```typescript
type FilteredPropKeys<T extends object, ValueType> = {
  [Key in keyof T]-?: T[Key] extends ValueType ? never : Key;
}[keyof T];

export type OmitByValueType<T extends object, ValueType> = Pick<
  T,
  FilteredPropKeys<T, ValueType>
>;
type A = OmitByValueType<{ foo: string; bar: number }, number>

type A = {
  foo:string
}
```
那么这里既然ExpectedPropKeys 和 FilteredPropKeys大部分结构相似，我们可不可以封装一下
```typescript
type Conditional<Value, Condition, Resolved, Rejected> = Value extends Condition
  ? Resolved
  : Rejected;

export type ValueTypeFilter<
  T extends object,
  ValueType,
  Positive extends boolean
> = {
  [Key in keyof T]-?: T[Key] extends ValueType
    ? Conditional<Positive, true, Key, never>
    : Conditional<Positive, true, never, Key>;
}[keyof T];

export type PickByValueType<T extends object, ValueType> = Pick<
  T,
  ValueTypeFilter<T, ValueType, true>
>;

export type OmitByValueType<T extends object, ValueType> = Pick<
  T,
  ValueTypeFilter<T, ValueType, false>
>;
```
但是这里会出现一些情况，当我们在传入`1 | 2`和`1 | 2 | 3`的时候，因为分布式的关系也会被判为相等,此时我们可以选择在比较的两方加上`[]`来解决分布式的问题，但是这种情况都化为数组以后仍然是会被判为正确，那我们还需要反向的比较一下来解决这个问题，需要确保比较两端完全一致，所以我们StrictConditional最终写成这样
```typescript
type StrictConditional<A, B, Resolved, Rejected, Fallback = never> = [A] extends [B]
  ? [B] extends [A]
    ? Resolved
    : Rejected
  : Fallback;

export type StrictValueTypeFilter<
  T extends object,
  ValueType,
  Positive extends boolean = true
> = {
  [Key in keyof T]-?: StrictConditional<
    ValueType,
    T[Key],
    Conditional<Positive,true,Key,never>,
    Conditional<Positive,true,never,Key>,
    Conditional<Positive,true,never,Key>
  >;
}[keyof T];

export type StrictPickByValueType<T extends object, ValueType> = Pick<
  T,
  StrictValueTypeFilter<T, ValueType>
>;

export type StrictOmitByValueType<T extends object, ValueType> = Pick<
  T,
  StrictValueTypeFilter<T, ValueType, false>
>;
```

#### 思考4：子结构的互斥处理
为了表示不能同时拥有，实际上我们应该使用 never 类型来标记一个属性。这里我们直接看完整的实现：
```typescript
export type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

export type XOR<T, U> = (Without<T, U> & U) | (Without<U, T> & T);

interface VIP {
  vipExpires: number;
}

interface CommonUser {
  promotionUsed: boolean;
}

type XORUser = XOR<VIP, CommonUser>;
//展开
type XORUser = Flatten<XOR<VIP, CommonUser>>
```
我们还可以使用互斥类型实现绑定效果，即要么同时拥有 A、B 属性，要么一个属性都没有：
```typescript
type XORStruct = XOR<
  {},
  {
    foo: string;
    bar: number;
  }
>;
```

#### 思考5，6：
我们对应地实现对象属性名的版本：
```typescript
// 并集
export type Concurrence<A, B> = A | B;

// 交集
export type Intersection<A, B> = A extends B ? A : never;

// 差集
export type Difference<A, B> = A extends B ? never : A;

// 补集
export type Complement<A, B extends A> = Difference<A, B>;

// 使用更精确的对象类型描述结构
export type PlainObjectType = Record<string, any>;

// 属性名并集
export type ObjectKeysConcurrence<
  T extends PlainObjectType,
  U extends PlainObjectType
> = keyof T | keyof U;

// 属性名交集
export type ObjectKeysIntersection<
  T extends PlainObjectType,
  U extends PlainObjectType
> = Extract<keyof T, keyof U>;

// 属性名差集
export type ObjectKeysDifference<
  T extends PlainObjectType,
  U extends PlainObjectType
> = Exclude<keyof T, keyof U>;

// 属性名补集
export type ObjectKeysComplement<
  T extends U,
  U extends PlainObjectType
> = Complement<keyof T, keyof U>;
```
对于交集、补集、差集，我们可以直接使用属性名的集合来实现对象层面的版本：
```typescript
export type ObjectIntersection<
  T extends PlainObjectType,
  U extends PlainObjectType
> = Pick<T, ObjectKeysIntersection<T, U>>;

export type ObjectDifference<
  T extends PlainObjectType,
  U extends PlainObjectType
> = Pick<T, ObjectKeysDifference<T, U>>;

export type ObjectComplement<T extends U, U extends PlainObjectType> = Pick<
  T,
  ObjectKeysComplement<T, U>
>;
```
需要注意的是在 ObjectKeysComplement 与 ObjectComplement 中，T extends U 意味着 T 是 U 的子类型，但在属性组成的集合类型中却相反，**U 的属性联合类型是 T 的属性联合类型的子类型**，因为既然 T 是 U 的子类型，那很显然 T 所拥有的的属性会更多嘛。

并集的实现要处理的情况多一点，对于 T、U 两个对象，假设以 U 的同名属性类型优先，思路会是这样的：
+ T 比 U 多的部分：T 相对于 U 的差集，`ObjectDifference<T, U>`
+ U 比 T 多的部分：U 相对于 T 的差集，`ObjectDifference<U, T>`
+ T 与 U 的交集，由于 U 的优先级更高，在交集处理中将 U 作为原集合， T 作为后传入的集合，`ObjectIntersection<U, T>`
```typescript
type Merge<
  T extends PlainObjectType,
  U extends PlainObjectType
  // T 比 U 多的部分，加上 T 与 U 交集的部分(类型不同则以 U 优先级更高，再加上 U 比 T 多的部分即可
> = ObjectDifference<T, U> & ObjectIntersection<U, T> & ObjectDifference<U, T>;
```
如果要保证原对象优先级更高，那么只需要在交集处理中将 T 视为原集合，U 作为后传入的集合：
```typescript
type Assign<
  T extends PlainObjectType,
  U extends PlainObjectType
  // T 比 U 多的部分，加上 T 与 U 交集的部分(类型不同则以 T 优先级更高，再加上 U 比 T 多的部分即可
> = ObjectDifference<T, U> & ObjectIntersection<T, U> & ObjectDifference<U, T>;
```
除了简单粗暴地完全合并以外，我们还可以实现不完全的并集，即使用对象 U 的属性类型覆盖对象 T 中的同名属性类型，但不会将 U 独特的部分合并过来：
```typescript
type Override<
  T extends PlainObjectType,
  U extends PlainObjectType
  // T 比 U 多的部分，加上 T 与 U 交集的部分(类型不同则以 U 优先级更高（逆并集）)
> = ObjectDifference<T, U> & ObjectIntersection<U, T>;
```

#### 思考7，8：
```typescript
type FunctionType = (...args: any) => any;

//提取第一个参数类型
type FirstParameter<T extends FunctionType> = T extends (
  arg: infer P,
  ...args: any
) => any
  ? P
  : never;

//提取最后一个参数类型
type LastParameter<T extends FunctionType> = T extends (arg: infer P) => any
  ? P
  : T extends (...args: infer R) => any
  ? R extends [...any, infer Q]
    ? Q
    : never
  : never;
```
*Awaited*实现
```typescript
type Awaited<T> = T extends null | undefined
  ? T 
  : T extends object & { then(onfulfilled: infer F): any }
  ? F extends (value: infer V, ...args: any) => any 
    ? Awaited<V>
    : never
  : T;
```
首先你会发现，在这里 Awaited 并非通过 `Promise<infer V>` 来提取函数类型，而是通过 `Promise.then` 方法提取，首先提取到 then 方法中的函数类型，再通过这个函数类型的首个参数来提取出实际的值。

更严谨地来说，PromiseValue 和 Awaited 并不应该放在一起比较，前者就只想提取 `Promise<void>` 这样结构的内部类型，后者则像在类型的层面执行了 `await Promise.then()` 之后的返回值类型。同样的，这里也用到了 infer 伴随结构转化的例子。

### 模板字符串类型 
#### 模板字符串的基础使用
```typescript
type World = 'World';

// "Hello World"
type Greeting = `Hello ${World}`;
```
这里的 Greeting 就是一个模板字符串类型，它内部通过与 JavaScript 中模板字符串相同的语法（${}），使用了另一个类型别名 World，其最终的类型就是**将两个字符串类型值组装在一起返回**。

除了使用确定的类型别名以外，模板字符串类型当然也支持通过泛型参数传入。需要注意的是，并不是所有值都能被作为模板插槽,目前有效的类型只有 `string | number | boolean | null | undefined | bigint` 这几个：
```typescript
type Greet<T extends string | number | boolean | null | undefined | bigint> = `Hello ${T}`;

type Greet1 = Greet<"linbudu">; // "Hello linbudu"
type Greet2 = Greet<599>; // "Hello 599"
type Greet3 = Greet<true>; // "Hello true"
type Greet4 = Greet<null>; // "Hello null"
type Greet5 = Greet<undefined>; // "Hello undefined"
type Greet6 = Greet<0x1fffffffffffff>; // "Hello 9007199254740991"
```
另外也可以为该插槽传入一个类型而非类型别名:
```typescript
type Greeting = `Hello ${string}`;
```
在这种情况下，Greeting 类型并不会变成 `Hello string`，而是保持原样。这也意味着它并没有实际意义，此时就是一个无法改变的模板字符串类型，但所有 Hello 开头的字面量类型都会被视为 `Hello ${string}` 的子类型，如 `Hello ldy`、`Hello TypeScript` 。

模板字符串最大的特点就是**自动分发的特性**来实现简便而又严谨的声明：
```typescript
type Brand = 'iphone' | 'xiaomi' | 'honor';
type Memory = '16G' | '64G';
type ItemType = 'official' | 'second-hand';

type SKU = `${Brand}-${Memory}-${ItemType}`;
```
通过这种方式，我们不仅不需要再手动声明一大堆工具类型，同时也获得了逻辑层面的保障：它会忠实地将**所有插槽中的联合类型与剩余的字符串部分进行依次的排列组合**。通过泛型传入联合类型时也会有同样的分发过程:
```typescript
type SizeRecord<Size extends string> = `${Size}-Record`;

type Size = 'Small' | 'Middle' | 'Large';

// "Small-Record" | "Middle-Record" | "Huge-Record"
type UnionSizeRecord = SizeRecord<Size>;
```

#### 模板字符串类型的类型表现
实际上，由于模板字符串类型最终的产物还是字符串字面量类型，因此只要插槽位置的类型匹配，字符串字面量类型就可以被认为是模板字符串类型的子类型，比如我们上面的版本号：
```typescript
declare let v1: `${number}.${number}.${number}`;
declare let v2: '1.2.4';

v1 = v2;
```
如果反过来，`v2 = v1` 很显然是不成立的，因为 v1 还包含了 `100.0.0` 等等情况。同样的，模板字符串类型和模板字符串也拥有着紧密的关联：
```typescript
const greet = (to: string): `Hello ${string}` => {
  return `Hello ${to}`;
};
```

#### 结合索引类型与映射类型
基于 **keyof + 模板字符串类型**，我们可以基于已有的对象类型来实现精确到字面量的类型推导：
```typescript
interface Foo {
  name: string;
  age: number;
  job: Job;
}

type ChangeListener = {
  on: (change: `${keyof Foo}Changed`) => void;
};

declare let listener: ChangeListener;

// 提示并约束为 "nameChanged" | "ageChanged" | "jobChanged"
listener.on('');
```
为了与映射类型实现更好的协作，TS 在引入模板字符串类型时支持了一个叫做 **重映射（Remapping）** 的新语法，基于模板字符串类型与重映射，我们可以实现一个此前无法想象的新功能：**在映射键名时基于原键名做修改**。
```typescript
type CopyWithRename<T extends object> = {
  [K in keyof T as `modified_${string & K}`]: T[K];
};

interface Foo {
  name: string;
  age: number;
}

// {
//   modified_name: string;
//   modified_age: number;
// }
type CopiedFoo = CopyWithRename<Foo>;
```
这里我们其实就是通过 `as` 语法，将映射的键名作为变量，映射到一个新的字符串类型。需要注意的是，由于对象的合法键名类型包括了 symbol，而模板字符串类型插槽中并不支持 symbol 类型。因此我们使用 `string & K` 来确保了最终交由模板插槽的值，一定会是合法的 string 类型。

#### 专用工具类型
这些工具类型专用于字符串字面量类型，包括 **Uppercase、Lowercase、Capitalize 与 Uncapitalize**，看名字就能知道它们的作用：字符串大写、字符串小写、首字母大写与首字母小写
```typescript
type A = `${Uppercase<'ldy'>}`

type B = `${Lowercase<'LDY'>}`

type C = `${Capitalize<'ldy'>}`

type D = `${Uncapitalize<'LDY'>}`
```

#### 模板字符串类型与模式匹配
模板插槽不仅可以声明一个占位的坑，也可以声明一个要提取的部分，我们来看一个例子：
```typescript
type ReverseName<Str extends string> =
  Str extends `${infer First} ${infer Last}` ? `${Capitalize<Last>} ${First}` : Str;

type ReversedTomHardy = ReverseName<'Tom hardy'>; // "Hardy Tom"
```
注意，这里的空格也需要严格遵循，因为**它也是一个字面量类型的一部分**。对于符合这样约束的类型，我们使用**模板插槽 + infer** 关键字提取了其空格旁的两个部分（即名与姓）。然后在条件类型中，我们将 infer 提取出来的值，再次使用模板插槽注入到了新的字符串类型中。

如果传入的字符串字面量类型中有多个空格呢？这种情况下，模式匹配将只会匹配首个空格，即 `"A B C"` 会被匹配为 `"A"` 与 `"B C"` 这样的两个结构
```typescript
type ReversedRes1 = ReverseName<'Lll ddd yyy'>; // "Ddd yyy Lll"
``` 

#### 基于重映射的 PickByValueType
```typescript
type PickByValueType<T extends object, Type> = {
  [K in keyof T as T[K] extends Type ? K : never]: T[K]
}
```
同时OmitByValueType也可以重写
```typescript
type OmitByValueType<T extends object,Type> = {
  [K in keyof T as T[K] extends Type ? never : K]: T[K]
}
```

### 模板字符串工具类型进阶
#### Trim、Includes
首先来实现Include：**判断传入的字符串字面量类型中是否含有某个字符串**
```typescript
type Includes<
  Str extends string,
  Search extends string
> = Str extends `${infer Prefix}${Search}${infer Suffix}` ? true : false;
```
在 Include 类型中，我们在 Search 前后声明了两个 infer 插槽，但实际上并不消费 R1 与 R2，而只是判断字符串是否可以被划分为**要搜索的部分 + 其他部分**。

但是此时会存在一个问题
```typescript
type A = Includes<'',''> //false
```
这种情况不该是false的，所以我们要对这个情况做单独的处理
```typescript
type Include<Str extends string, Search extends string> = Str extends ''
  ? Search extends ''
    ? true
    : false
  : Includes<Str, Search>;
```  

实现完了Includes，接下来是Trim、TrimStart、TrimEnd：
```typescript
type TrimStart<Str extends string> = Str extends ` ${infer R}` ? TrimStart<R> : Str

type TrimEnd<Str extends string> = Str extends `${infer R} ` ? TrimEnd<R> : Str

type Trim<Str extends string> = TrimStart<TrimEnd<Str>>
```

关于StartWith和EndWith与Includes基本类似
```typescript
type StartWith<
  Str extends string,
  Search extends string,
> = Str extends '' 
    ? Search extends '' 
      ? true
      : Str extends `${Search}${infer _R}` ? true : false
    : Str extends `${Search}${infer _R}` ? true : false

type EndWith<
  Str extends string,
  Search extends string,
> = Str extends '' 
    ? Search extends '' 
      ? true
      : Str extends `${infer _R}${Search}` ? true : false
    : Str extends `${infer _R}${Search}` ? true : false
```

#### Replace、Split、Join
##### Replace
```typescript
type Replace<
  Str extends string,
  Search extends string,
  Replacement extends string
> = Str extends `${infer Prefix}${Search}${infer Suffix}`
    ? `${Prefix}${Replacement}${Suffix}`
    : Str

type ReplaceAll<
  Str extends string,
  Search extends string,
  Replacement extends string
> = Str extends `${infer Prefix}${Search}${infer Suffix}`
    ? ReplaceAll<`${Prefix}${Replacement}${Suffix}`,Search,Replacement>
    : Str
```
因为结构相似，也可以将他们俩放在一起通过选项控制是否全量替换
```typescript
export type Replace<
  Input extends string,
  Search extends string,
  Replacement extends string,
  ShouldReplaceAll extends boolean = false
> = Input extends `${infer Head}${Search}${infer Tail}`
  ? ShouldReplaceAll extends true
    ? Replace<
        `${Head}${Replacement}${Tail}`,
        Search,
        Replacement,
        ShouldReplaceAll
      >
    : `${Head}${Replacement}${Tail}`
  : Input;
```

##### Split:将字符串按分隔符拆分成一个数组
```typescript
type Split<
  Str extends string,
  Delimiter extends string 
> = Str extends `${infer Head}${Delimiter}${infer Tail}`
  ? [Head, ...Split<Tail, Delimiter>]
  : Str extends Delimiter
    ? []
    : [Str];
```
在实际情况中，我们的字符串可能包含了多种可能的分隔符，即这里的 Delimiter 可以是一个联合类型 `"_" | "-" | " "` 。在这种情况下，模板字符串中的模式匹配也能够生效，它会使用这里的多个分隔符依次进行判断，并在判断到其中一种就立刻成立：
```typescript
type Delimiters = '-' | '_' | ' ';

// ["l", "d", "y"]
type SplitRes4 = Split<'l_d_y', Delimiters>;
```
但需要注意的是，我们并不能在一个字符串中混用多种分隔符，在这种情况下由于联合类型在插槽中的排列组合特性，我们会得到一个诡异的结果.
```typescript
// ["l" | "l_d", "y"] | ["l" | "l_d", "d", "y"]
type SplitRes5 = Split<'l_d-y', Delimiters>;
```

另外，基于 Split 类型我们还可以获取字符串长度
```typescript
export type StrLength<T extends string> = Split<Trim<T>, ''>['length'];
```

##### Join:将一个数组中的所有字符串按照分隔符组装成一个字符串
```typescript
export type Join<
  List extends Array<string | number>,
  Delimiter extends string
> = List extends []
  ? '' 
  :List extends [string | number]
  ? `${List[0]}`
  : List extends [string | number, ...infer Rest]
  ? // @ts-expect-error
    `${List[0]}${Delimiter}${Join<Rest, Delimiter>}`
  : string;
```
这里的 Rest 类型无法被正确地推导，因此使用了 // @ts-expect-error 来忽略错误。

```
Join需要额外的去考虑两个边界情况:
1. 递归到最后首先如果不处理空数组会返回一个string,但是这个string我们本来是用来处理Join拼接不成字符串返回一个string类型的情况，所以需要额外判断空数组 
`List extends []`
2. 当处理完了空数组仍然会在拼接的字符串后面添加一个Delimiter,我们需要处理当递归的数组只剩一项时的情况
`List extends [string | number]`
```


#### CamelCase
首先来实现一下从其他方式转成CamelCase的格式
```typescript
import { expectType } from 'tsd'

type SnakeCase2CamelCase<S extends string> = S extends `${infer R}_${infer Rest}` ?  `${R}${SnakeCase2CamelCase<Capitalize<Rest>>}` : S

expectType<SnakeCase2CamelCase<'l_d_y'>>('lDY')

type KebabCase2CamelCase<S extends string> = S extends `${infer R}-${infer Rest}` ?  `${R}${KebabCase2CamelCase<Capitalize<Rest>>}` : S

expectType<KebabCase2CamelCase<'l-d-y'>>('lDY')
```
除了分隔符不一样，其他的都是一样的，所以我们再次封装
```typescript
type DelimiterCase2CamelCase<
  S extends string,
  Delimiter extends string
> = S extends `${infer R}${Delimiter}${infer Rest}` 
    ? `${R}${DelimiterCase2CamelCase<Capitalize<Rest>,Delimiter>}` 
    : S
```

最终版的CamelCase
```typescript
export type PlainObjectType = Record<string, any>;

export type WordSeparators = '-' | '_' | ' ';

export type Split<
  S extends string,
  Delimiter extends string
> = S extends `${infer Head}${Delimiter}${infer Tail}`
  ? [Head, ...Split<Tail, Delimiter>]
  : S extends Delimiter
  ? []
  : [S];

type CapitalizeStringArray<Words extends readonly any[], Prev> = Words extends [
  `${infer First}`,
  ...infer Rest
]
  ? First extends undefined
    ? ''
    : First extends ''
    ? CapitalizeStringArray<Rest, Prev>
    : `${Prev extends '' ? First : Capitalize<First>}${CapitalizeStringArray<
        Rest,
        First
      >}`
  : '';

type CamelCaseStringArray<Words extends readonly string[]> = Words extends [
  `${infer First}`,
  ...infer Rest
]
  ? Uncapitalize<`${First}${CapitalizeStringArray<Rest, First>}`>
  : never;

export type CamelCase<K extends string> = CamelCaseStringArray<
  Split<K extends Uppercase<K> ? Lowercase<K> : K, WordSeparators>
>;
```

### 工程层面的类型能力
#### 类型检查指令
`ts-ignore` 应该是使用最为广泛的一个类型指令了，它的作用就是直接禁用掉对下一行代码的类型检查:
```typescript
// @ts-ignore
const name: string = 599;
```
基本上所有的类型报错都可以通过这个指令来解决，但由于它本质是上 ignore 而不是 disable，也就意味着如果下一行代码并没有问题，那使用 ignore 反而就是一个错误了。因此 TypeScript 随后又引入了一个更严格版本的 ignore，即 `ts-expect-error`，它只有在**下一行代码真的存在错误时**才能被使用，否则它会给出一个错误：
```typescript
// @ts-expect-error
const name: string = 599;

// @ts-expect-error 错误使用此指令，报错
const age: number = 599;
```
在这里第二个 `expect-error` 指令会给出一个报错：**无意义的 expect-error 指令**。

那这两个功能相同的指令应该如何取舍？我的建议是**在所有地方都不要使用 ts-ignore**，直接把这个指令打入冷宫封存起来。原因在上面我们也说了，对于这类 ignore 指令，本来就应当确保**下一行真的存在错误时**才去使用。

 `ts-nocheck` ，你可以把它理解为一个作用于整个文件的 ignore 指令，使用了 ts-nocheck 指令的 TS 文件将不再接受类型检查：
 ```typescript
 // @ts-nocheck 以下代码均不会抛出错误
const name: string = 599;
const age: number = 'linbudu';
 ```

 但我们知道 JavaScript 是弱类型语言，表现之一即是变量可以被赋值为与初始值类型不一致的值：
 ```typescript
 let myAge = 18;
myAge = "90"; // 与初始值类型不同

/** @type {string} */
let myName;
myName = 599; // 与 JSDoc 标注类型不同
 ```
 我们的赋值操作在类型层面显然是不成立的，但我们是在 JavaScript 文件中，因此这里并不会有类型报错。如果希望在 JS 文件中也能享受到类型检查，此时 `ts-check` 指令就可以登场了：
 这里我们的 ts-check 指令为 JavaScript 文件也带来了类型检查，而我们同时还可以使用 ts-expect-error 指令来忽略掉单行的代码检查：
```typescript
// @ts-check
/** @type {string} */
// @ts-expect-error
const myName = 599; // OK

let myAge = 18;
// @ts-expect-error
myAge = '200'; // OK
```

而 `ts-nocheck` 在 JS 文件中的作用和 TS 文件其实也一致，即禁用掉对当前文件的检查。如果我们希望开启对所有 JavaScript 文件的检查，只是忽略掉其中少数呢？此时我们在 TSConfig 中启用 `checkJs` 配置，来开启**对所有包含的 JS 文件的类型检查**，然后使用 `ts-nocheck` 来忽略掉其中少数的 JS 文件

#### 类型声明
在此前我们其实就已经接触到了类型声明，它实际上就是 declare 语法：
```typescript
declare var f1: () => void;

declare interface Foo {
  prop: string;
}

declare function foo(input: Foo): Foo;

declare class Foo {}
```
我们可以直接访问这些声明：
```typescript
declare let otherProp: Foo['prop'];
```
但不能为这些声明变量赋值：
```typescript
// × 不允许在环境上下文中使用初始值
declare let result = foo();

// √ Foo
declare let result: ReturnType<typeof foo>;
```
这些类型声明就像我们在 TypeScript 中的类型标注一样，会存放着特定的类型信息，同时由于它们并不具有实际逻辑，我们可以很方便地使用类型声明来进行类型兼容性的比较、工具类型的声明与测试等等。

除了手动书写这些声明文件，更常见的情况是你的 TypeScript 代码在编译后生成声明文件：
```typescript
// 源代码
const handler = (input: string): boolean => {
  return input.length > 5;
}

interface Foo {
  name: string;
  age: number;
}

const foo: Foo = {
  name: "ldy",
  age: 18
}

class FooCls {
  prop!: string;
}
```
这段代码在编译后会生成一个 `.js` 文件和一个 `.d.ts` 文件，而后者即是类型声明文件：
```typescript
// 生成的类型定义
declare const handler: (input: string) => boolean;

interface Foo {
    name: string;
    age: number;
}

declare const foo: Foo;

declare class FooCls {
    prop: string;
}
```
这样一来，如果别的文件或是别的项目导入了这段代码，它们就能够从这些类型声明获得对应部分的类型，这也是类型声明的核心作用：**将类型独立于 `.js` 文件进行存储**。别人在使用你的代码时，就能够获得这些额外的类型信息。同时，如果你在使用别人没有携带类型声明的 `.js` 文件，也可以通过类型声明进行类型补全，我们在后面还会了解更多。

类型声明的核心能力：**通过额外的类型声明文件，在核心代码文件以外去提供对类型的进一步补全**。类型声明文件，即 `.d.ts` 结尾的文件，它会自动地被 TS 加载到环境中，实现对应部分代码的类型补全。

声明文件中并不包含实际的代码逻辑，它做的事只有一件：**为 TypeScript 类型检查与推导提供额外的类型信息**，而使用的语法仍然是 TypeScript 的 declare 关键字

假设我们要导入一个无类型的npm包
```typescript
import foo from 'pkg';

const res = foo.handler();

declare module 'pkg' {
  const handler: () => boolean;
}
```
现在我们的 res 就具有了 boolean 类型！`declare module 'pkg'` 会为默认导入 foo 添加一个具有 handler 的类型，虽然这里的`pkg` 根本不存在。

##### DefinitelyTyped
简单来说，`@types/` 开头的这一类 npm 包均属于 DefinitelyTyped ，它是 TypeScript 维护的，专用于为社区存在的**无类型定义的 JavaScript 库**添加类型支持，常见的有 `@types/react` `@types/lodash` 等等。通过 DefinitelyTyped 来提供类型定义的包常见的有几种情况，如 Lodash 这样的库仍然有大量 JavaScript 项目使用，将类型定义内置在里面不一定是所有人都需要的，反而会影响包的体积。还有像 React 这种不是用纯 JavaScript / TypeScript 书写的库，需要自己来手写类型声明（React 是用 Flow 写的，这是一门同样为 JavaScript 添加类型的语言，或者说语法）。

举例来说，只要你安装了 `@types/react`，TypeScript 会自动将其加载到环境中（实际上所有 `@types/` 下的包都会自动被加载），并作为 react 模块内部 API 的声明。但这些类型定义并不一定都是通过 `declare module`，我们下面介绍的命名空间 namespace 其实也可以实现一样的能力。
```typescript
// @types/node
declare module 'fs' { 
    export function readFileSync(/** 省略 */): Buffer;
}

// @types/react
declare namespace React {
    function useState<S>(): [S, Dispatch<SetStateAction<S>>];
}
```

##### 扩展已有的类型定义
对全局变量的声明，还是以 window 为例，实际上我们如果 Ctrl + 点击代码中的 window，会发现它已经有类型声明了：
```typescript
declare var window: Window & typeof globalThis;

interface Window {
  // ...
}
```
这行代码来自于 `lib.dom.d.ts` 文件，它定义了对浏览器文档对象模型的类型声明，这就是 TypeScript 提供的内置类型，也是“出厂自带”的类型检查能力的依据。类似的，还有内置的 `lib.es2021.d.ts` 这种文件定义了对 ECMAScript 每个版本的类型声明新增或改动等等。

而如果我们就是想将它显式的添加到已有的 `Window` 接口中呢？在接口一节中我们其实已经了解到，如果你有多个同名接口，**那么这些接口实际上是会被合并的**，这一特性在类型声明中也是如此。因此，我们再声明一个 Window 接口即可：
```typescript
interface Window {
  userTracker: (...args: any[]) => Promise<void>;
}

window.userTracker("click!")
```
类似的，我们也可以扩展来自 @types/ 包的类型定义：
```typescript
declare module 'fs' {
  export function bump(): void;
}

import { bump } from 'fs';
```
总结一下这两个部分，TypeScript 通过 DefinitelyTyped ，也就是 `@types/` 系列的 npm 包来为无类型定义的 JavaScript npm 包提供类型支持，这些类型定义 的 npm 包内部其实就是数个 `.d.ts` 这样的声明文件。

而这些声明文件主要通过 declare / namespace 的语法进行类型的描述，我们可以通过项目内额外的声明文件，来实现为非代码文件的导入，或者是全局变量添加上类型声明。

#### 三斜线指令
三斜线指令就像是声明文件中的导入语句一样，它的作用就是**声明当前的文件依赖的其他类型声明**。而这里的“其他类型声明”包括了 TS 内置类型声明（`lib.d.ts`）、三方库的类型声明以及你自己提供的类型声明文件等。  

三斜线指令本质上就是一个自闭合的 XML 标签，其语法大致如下：
```typescript
/// <reference path="./other.d.ts" />
/// <reference types="node" />
/// <reference lib="dom" />
```
**需要注意的是，三斜线指令必须被放置在文件的顶部才能生效。**

这里的三条指令作用其实都是声明当前文件依赖的外部类型声明，只不过使用的方式不同：分别使用了 path、types、lib 这三个不同属性，我们来依次解析。

使用 path 的 reference 指令，其 path 属性的值为一个相对路径，指向你项目内的其他声明文件。而在编译时，TS 会沿着 path 指定的路径不断深入寻找，最深的那个没有其他依赖的声明文件会被最先加载。
```typescript
// @types/node 中的示例
/// <reference path="fs.d.ts" />
```
使用 types 的 reference 指令，其 types 的值是一个包名，也就是你想引入的 `@types/` 声明，如上面的例子中我们实际上是在声明当前文件对 `@types/node` 的依赖。而如果你的代码文件（`.ts`）中声明了对某一个包的类型导入，那么在编译产生的声明文件（`.d.ts`）中会自动包含引用它的指令。
```typescript
/// <reference types="node" />
```
使用 lib 的 reference 指令类似于 types，只不过这里 lib 导入的是 TypeScript 内置的类型声明，如下面的例子我们声明了对 `lib.dom.d.ts` 的依赖：
```typescirpt
// vite/client.d.ts
/// <reference lib="dom" />
```
而如果我们使用 `/// <reference lib="esnext.promise" />`，那么将依赖的就是 `lib.esnext.promise.d.ts` 文件。

这三种指令的目的都是引入当前文件所依赖的其他类型声明，只不过适用场景不同而已。

#### 命名空间
假设一个场景，我们的项目里需要接入多个平台的支付 SDK，最开始只有微信支付和支付宝：
```typescript
class WeChatPaySDK {}

class ALiPaySDK {}
```
然后又多了美团支付、虚拟货币支付（比如 Q 币）、信用卡支付等等：
```typescript
class WeChatPaySDK {}

class ALiPaySDK {}

class MeiTuanPaySDK {}

class CreditCardPaySDK {}

class QQCoinPaySDK {}
```
随着业务的不断发展，项目中可能需要引入越来越多的支付 SDK，甚至还有比特币和以太坊，此时将这些所有的支付都放在一个文件内未免过于杂乱了。这些支付方式其实大致可以分成两种：现实货币与虚拟货币。此时我们就可以使用命名空间来区分这两类 SDK：
```typescript
export namespace RealCurrency {
  export class WeChatPaySDK {}

  export class ALiPaySDK {}

  export class MeiTuanPaySDK {}

  export class CreditCardPaySDK {}
}

export namespace VirtualCurrency {
  export class QQCoinPaySDK {}

  export class BitCoinPaySDK {}

  export class ETHPaySDK {}
}
```
```
注意，这里的代码是在 .ts 文件中的，此时它是具有实际逻辑意义的，也不能和类型混作一谈。
```

而命名空间的使用类似于枚举：
```typescript
const weChatPaySDK = new RealCurrency.WeChatPaySDK();
```
唯一需要注意的是，命名空间内部实际上就像是一个独立的代码文件，因此其中的变量需要导出以后，才能通过 `RealCurrency.WeChatPaySDK` 这样的形式访问。

命名空间的内部还可以再嵌套命名空间，比如在虚拟货币中再新增区块链货币一类，此时嵌套的命名空间也需要被导出：
```typescript
export namespace VirtualCurrency {
  export class QQCoinPaySDK {}

  export namespace BlockChainCurrency {
    export class BitCoinPaySDK {}

    export class ETHPaySDK {}
  }
}

const ethPaySDK = new VirtualCurrency.BlockChainCurrency.ETHPaySDK();
```
类似于类型声明中的同名接口合并，命名空间也可以进行合并，但需要通过三斜线指令来声明导入。
```typescript
// animal.ts
namespace Animal {
  export namespace ProtectedAnimals {}
}

// dog.ts
/// <reference path="animal.ts" />
namespace Animal {
  export namespace Dog {
    export function bark() {}
  }
}

// corgi.ts
/// <reference path="dog.ts" />
namespace Animal {
  export namespace Dog {
    export namespace Corgi {
      export function corgiBark() {}
    }
  }
}
```
实际使用时需要导入全部的依赖文件：
```typescript
/// <reference path="animal.ts" />
/// <reference path="dog.ts" />
/// <reference path="corgi.ts" />

Animal.Dog.Corgi.corgiBark();
```
除了在 `.ts` 文件中使用以外，命名空间也可以在声明文件中使用，即 `declare namespace`：
```typescript
declare namespace Animal {
  export interface Dog {}

  export interface Cat {}
}

declare let dog: Animal.Dog;
declare let cat: Animal.Cat;
```
但如果你在 `@types/` 系列的包下，想要通过 namespace 进行模块的声明，还需要注意将其导出，然后才会加载到对应的模块下。以 `@types/react` 为例：
```typescript
export = React;
export as namespace React;
declare namespace React {
  // 省略了不必要的类型标注
  function useState<S>(initialState): [];
}
```
首先我们声明了一个命名空间 React，然后使用 `export = React` 将它导出了，这样我们就能够在从 react 中导入方法时，获得命名空间内部的类型声明，如 useState。

从这一个角度来看，`declare namespace` 其实就类似于普通的 `declare` 语法，只是内部的类型我们不再需要使用 `declare` 关键字（比如我们直接在 namespace 内部 `function useState(): []` 即可）。

而还有一行 `export as namespace React` ，它的作用是在启用了 `--allowUmdGlobalAccess` 配置的情况下，允许将这个模块作为全局变量使用（也就是不导入直接使用），这一特性同样也适用于通过 CDN 资源导入模块时的变量类型声明。

除了这两处 namespace 使用，React 中还利用 namespace 合并的特性，在全局的命名空间中注入了一些类型：
```typescript
declare global {
  namespace JSX {
    interface Element extends React.ReactElement<any, any> { }
  }
}
```
这也是为什么我们可以在全局使用 JSX.Element 作为类型标注。

除了类型声明中的导入——三斜线指令，以及类型声明中的模块——命名空间以外，TypeScript 还允许你将这些类型去导入到代码文件中。

#### 仅类型导入
在 TypeScript 中，当我们导入一个类型时其实并不需要额外的操作，和导入一个实际值是完全一样的：
```typescript
// foo.ts
export const Foo = () => {};

export type FooType = any;

// index.ts
import { Foo, FooType } from "./foo";
```
虽然类型导入和值导入存在于同一条导入语句中，在编译后的 JS 代码里还是只会有值导入存在，同时在编译的过程中，值与类型所在的内存空间也是分开的。

在这里我们只能通过名称来区分值和类型，但为每一个类型都加一个 Type 后缀也太奇怪了。实际上，我们可以更好地区分值导入和类型导入，只需要通过 `import type` 语法即可：
```typescript
import { Foo } from "./foo";
import type { FooType } from "./foo";
```
这样会造成导入语句数量激增，如果你想同时保持较少的导入语句数量又想区分值和类型导入，也可以使用同一导入语句内的方式（需要 4.6 版本以后才支持）：
```typescript
import { Foo, type FooType } from "./foo";
```