#### 字面量类型

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

#### 联合类型
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

#### 枚举
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

#### 函数
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
const str = "linbudu";

const obj = { name: "linbudu" };

const nullVar = null;
const undefinedVar = undefined;

const func = (input: string) => {
  return input.length > 10;
}

type Str = typeof str; // "linbudu"
type Obj = typeof obj; // { name: string; }
type Null = typeof nullVar; // null
type Undefined = typeof undefined; // undefined
type Func = typeof func; // (input: string) => boolean

const func = (input: string) => {
  return input.length > 10;
}

const func2: typeof func = (name: string) => {
  return name === 'linbudu'
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
    (input).replace("linbudu", "linbudu599")
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

let name: any = 'linbudu';

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
let name: any = 'linbudu';

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
type Result1 = Conditional<'linbudu', string, 'passed!', 'rejected!'>;

// "rejected!"
type Result2 = Conditional<'linbudu', boolean, 'passed!', 'rejected!'>;
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

const author = "linbudu"; // 使用 const 声明，被推导为 "linbudu"

let authorAge = 18; // 使用 let 声明，被推导为 number

handle(author); // 填充为字面量类型 "linbudu"
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
arr.push('linbudu');
// 类型“string”的参数不能赋给类型“number”的参数。
arr.includes('linbudu');

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