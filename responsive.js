// 拷贝一份数组的原型
const arrayPrototype = Array.prototype;
// 以 Array.prototype 为原型创建 arrayMethods 对象
const arrayMethods = Object.create(arrayPrototype);

const methodsNeedChange = [
  "push",
  "pop",
  "shift",
  "unshift",
  "splice",
  "sort",
  "reverse",
];

for (let i = 0; i < methodsNeedChange.length; i++) {
  // 备份原来的方法
  const original = arrayMethods[methodsNeedChange[i]];
  // 定义新的方法
  def(
    arrayMethods,
    methodsNeedChange[i],
    function () {
      // 用来保存新插入的值
      let inserted = [];
      // 由于 arguments 对象是类数组，所以先通过扩展运算符转为数组之后，再进行操作。
      let args = [...arguments];
      // 先判断 是否是 push unshift splice ，如果是的话，先取出插入的新值，后面进行 observeArray
      switch (methodsNeedChange[i]) {
        case "push":
        case "unshift":
          inserted = args;
          break;
        case "splice":
          // splice(起始下标，删除个数，新添加的元素)
          inserted = args.slice(2);
      }
      // 先判断 inserted 里面有东西，才执行 observeArray
      inserted.length && observeArray(inserted);
      // 将备份的方法进行执行，毕竟不能丢失数组方法原本的功能执行
      original.apply(this, arguments);
      // 写监听到之后更新视图
    },
    false
  );
}

function defineReactive(obj, key, val) {
  console.log(key);
  // 判断当前入参个数，两个的话直接返回当前层的对象
  if (arguments.length === 2) {
    val = obj[key];
    observe(val);
  }
  Object.defineProperty(obj, key, {
    // 可枚举，默认为 false
    enumerable: true,
    // 属性的描述符能够被改变，或者是删除，默认为 false
    configurable: true,
    get() {
      return val;
    },
    set(newValue) {
      val = newValue;
      observe(val);
    },
  });
}

function def(obj, key, value, enumerable) {
  Object.defineProperty(obj, key, {
    value,
    //这个属性仅仅保存 Observer 实例，所以不需要遍历
    enumerable,
  });
}

// 遍历对象当前层的所有属性，并且绑定 defineReactive
class Observer {
  constructor(obj) {
    def(obj, "__ob__", this, false);
    if (Array.isArray(obj)) {
      observeArray(obj);
      Object.setPrototypeOf(obj, arrayMethods);
    } else {
      this.walk(obj);
    }
  }
  walk(obj) {
    let keys = Object.keys(obj);
    for (let i = 0; i < keys.length; i++) {
      defineReactive(obj, keys[i]);
    }
  }
}

function observe(value) {
  if (typeof value !== "object") return;
  let ob;
  // eslint-disable-next-line no-prototype-builtins
  if (value.hasOwnProperty("__ob__") && value.__ob__ instanceof Observer) {
    ob = value.__ob__;
  } else {
    ob = new Observer(value);
  }
  return ob;
}

function observeArray(list) {
  for (let i = 0, l = list.length; i < l; i++) {
    observe(list[i]);
  }
}
