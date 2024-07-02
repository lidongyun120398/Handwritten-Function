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