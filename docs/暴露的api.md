# react 暴露的 api

首先先从 react 暴露的 api 进行阅读 react 暴露了很多的 api 在文档上并没有进行明确的说明

Children: react 的子节点 Elements 是一个伪数组，没有数组的方法，Children 实现了一些数组的方法方便使用者进行对 children 的一些操作

```
  var Children = {
    map: mapChildren,
    forEach: forEachChildren,
    count: countChildren,
    toArray: toArray,
    only: onlyChild
  };

```

Component: 封装了基本的类组件的一些方法和属性，类组件要继承 Component

Fragment: 暴露出 Fragment 的 type
`var REACT_FRAGMENT_TYPE = hasSymbol ? Symbol.for('react.fragment') : 0xeacb;`

Profiler: 暴露出 Profiler 的 type
`var REACT_PROFILER_TYPE = hasSymbol ? Symbol.for('react.profiler') : 0xead2;`

StrictMode: 暴露出 StrictMode 的 type
`var REACT_STRICT_MODE_TYPE = hasSymbol ? Symbol.for('react.strict_mode') : 0xeacc;`

Suspense: 暴露出 Suspense 的 type
`var REACT_SUSPENSE_TYPE = hasSymbol ? Symbol.for('react.suspense') : 0xead1;`

PureComponent: 和 Component 的区别是，使用 PureComponent 可以在 props 没有改变时不进行组件的重新渲染，比较 prevProps 和 nextProps 状态再其发生变化时重新渲染组件，浅比较，用于优化组件的性能，如果想实现深比较请使用 shouldComponentUpdate 进行优化

cloneElement: 克隆一个 ReactElement

createContext: 创建一个联系上下文的 Context

createElement: 创建一个 ReactElement

createFactory: 创建一个 ReactElement 的工厂

createRef: 创建一个 Ref,Ref 可以挂载数据和 dom 节点，它在 react 的生命周期的是唯一的，通常可以用来保存一些不随生命周期变化的时间

forwardRef: Ref 转发可以把自组件中的 ref 转发给父组件官方的例子

```
const FancyButton = React.forwardRef((props, ref) => (
  <button ref={ref} className="FancyButton">
    {props.children}
  </button>
));

// 你可以直接获取 DOM button 的 ref：
const ref = React.createRef();
<FancyButton ref={ref}>Click me!</FancyButton>;
```

isValidElement: 用来判断是否是一个有效的 ReactElement

lazy: 对组件进行懒加载 PureComponent 组件的功能

memo: 使用 memo 包裹的组件可以实现，还可以接收一个 function 进行自定义组件的渲染

version: react 的版本

下面是 react 16 新增的特性 hooks 在后面进行详细讲解

useState

useEffect

useCallback

useCallback

useContext

useDebugValue

useImperativeHandle

useLayoutEffect

useMemo

useReducer

useRef
