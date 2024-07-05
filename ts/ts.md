#### 字面量类型

字面量类型来解决如果status定义为string类型或者code定义为number类型精度不够的问题

TypeScript 中，这叫做字面量类型（Literal Types），它代表着比原始类型更精确的类型，同时也是原始类型的子类型;字面量类型主要包括字符串字面量类型、数字字面量类型、布尔字面量类型和对象字面量类型，
```js
interface Res {
  code: 10000 | 10001 | 50000;
  status: "success" | "failure";
  data: any;
}
```

通常和联合类型（即这里的 |）一起使用，表达一组字面量类型
```js
interface Tmp {
  bool: true | false;
  num: 1 | 2 | 3;
  str: 'li' | 'dong' | 'yun';
}
```

#### 联合类型
联合类型代表了一组类型的可用集合，只要最终赋值的类型属于联合类型成员之一，就可以认为符合这个联合类型
```js
interface Tmp {
  mixed: true | string | 599 | {} | (() => {}) | (1 | 2)
}
```
+ 注意:
    1. 对于联合类型中的函数类型，需要使用括号()包裹起来
    2. 函数类型并不存在字面量类型，因此这里的(() => {})就是一个合法函数
    3. 可以在联合类型中进一步嵌套联合类型，但是最总都会被展平到第一级中

多个对象联合来实现手动互斥
```js
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
```js
enum PageUrl {
  Home_Page_Url = 'url1',
  Setting_Page_Url = 'url2',
  Share_Page_Url = 'url3',
}

const homePage = PageUrl.Home_Page_Url;
```
+ 如果你没有声明枚举的值，它会默认使用数字枚举，并且从 0 开始，以 1 递增
```js
enum Items{
  Foo,
  Bar,
  Baz
}
```
在这个例子中,Items.Foo,Items.Bar,Items.Baz的值依次是 0，1，2

+ 并且如果你只为某一个成员指定了枚举值，那么之前未赋值成员仍然会使用从 0 递增的方式，之后的成员则会开始从枚举值递增
```js
enum Items{
  Foo,//0
  Bar = 600,//600
  Baz //601
}
```
枚举和对象的重要差异在于:
  + 对象是单向映射的，我们只能从键映射到键值。而枚举是双向映射的，即你可以从枚举成员映射到枚举值，也可以从枚举值映射到枚举成员;
  + 仅有值为**数字**的枚举成员才能够进行这样的双向枚举，**字符串**枚举成员仍然只会进行单次映射
```js
const key1 = Items.Foo;//0
const key2 = Item[0];//Foo
```

#### 常量枚举
```js
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
```js
function foo(name:string):number{
  return name.length
}
```
+ 函数表达式方式定义
```js
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
```js
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
```js
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
```js
function foo(name: string, ...rest: any[]){}
```
也可以使用元组来标注
```js
function foo(name: string, ...rest: [number,string])

foo('ldy',18,'male')
```

#### 函数签名重载
```js
function foo(tmp: number,flag: boolean) : number | string {
  if(flag){
    return String(tmp)
  }
  return tmp
}
```
上面的函数会根据flag的值来判断是返回number类型还是string类型，但是在当前类型的定义中，完全看不到这点，我们只知道返回了一个number|string的联合类型，所以这里需要使用到**函数签名重载**
```js
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
```js
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
```js
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
```js
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
```js
class Foo{
  constructor(private arg1: string, private arg2: string){}
}

const foo = new Foo('ldy','male')
```

#### 静态成员
通过static来定义一个静态成员
```js
class Foo{
  static prop: string = 'ldy'
}
```
不同于实例成员，在类的内部静态成员无法通过 this 来访问，需要通过 **Foo.prop** 这种形式进行访问。

*静态成员直接被挂载在函数体上，而实例成员挂载在原型上，这就是二者的最重要差异：静态成员不会被实例继承，它始终只属于当前定义的这个类（以及其子类）。而原型对象上的实例成员则会沿着原型链进行传递，也就是能够被继承*


#### 继承
```js
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
```js
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
```js
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
```js
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
```js
fucntion foo(message:any,...options:any[]){}
```
在上面的代码中，使用了any类型表示可以接受任意类型的值
除了显示标记一个变量或者参数的类型为any，某些情况下也会被隐式的推导为any，如
```js
let foo;

function func(foo,bar){}
```
同时any类型几乎无所不能，它可以在**声明之后再次接收任意类型的值**，也可以**赋值给其他任意类型的变量**
```js
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
