# react 源码

注：文中的源码删除了报错和警告的部分 已经在 dev 环境下的代码 以及部分服务端渲染的代码

## render

render 是 react 的入口，所有的组件不管是类组件还是方法组件都存在 render 在类组件中 render 是以重新 Component 的形式而 function 组件则是默认的 return 来返回的

在 index 文件中

```js
import React from 'react';
function App() {
  const [a, seta] = useState();
  return <div>111</div>;
}

ReactDOM.render(<App />, document.querySelector('#app'));
```

使用 render 来将 app 挂载到真实的 dom 上，其中经过了许多的过程，从 render 来观察其中发生了什么

```js
function render(element, container, callback) {
  // 第一次渲染没有parentComponent节点
  return legacyRenderSubtreeIntoContainer(
    null,
    element,
    container,
    false,
    callback,
  );
}
```

render 接受 element，container，callback 将其转换一下调用 legacyRenderSubtreeIntoContainer 方法从名字上观察这是将虚拟 dom 挂载到真实 dom 上的方法

```js
function legacyRenderSubtreeIntoContainer(
  parentComponent,
  children,
  container,
  forceHydrate,
  callback,
) {
  // 获取容器节点
  var root = container._reactRootContainer;
  var fiberRoot;
  /**
   * 如果不存在根容器节点则是第一次渲染
   */
  if (!root) {
    // 初次加载 跟不存在表示第一次加载需要进行初始化根 在容器节点上增加_reactRootContainer属性上面是ReactDOMBlockingRoot 内部只有一个属性_internalRoot 指向的是fiberRoot
    root = container._reactRootContainer = legacyCreateRootFromDOMContainer(
      container,
      forceHydrate,
    );
    fiberRoot = root._internalRoot;

    if (typeof callback === 'function') {
      var originalCallback = callback;
      callback = function() {
        var instance = getPublicRootInstance(fiberRoot);
        originalCallback.call(instance);
      };
    } // Initial mount should not be batched.

    unbatchedUpdates(function() {
      updateContainer(children, fiberRoot, parentComponent, callback);
    });
  } else {
    fiberRoot = root._internalRoot;

    if (typeof callback === 'function') {
      var _originalCallback = callback;

      callback = function() {
        var instance = getPublicRootInstance(fiberRoot);

        _originalCallback.call(instance);
      };
    } // Update

    updateContainer(children, fiberRoot, parentComponent, callback);
  }

  return getPublicRootInstance(fiberRoot);
}
```

### legacyCreateRootFromDOMContainer

第一次加载的时候需要进行根节点的创建 legacyCreateRootFromDOMContainer

```js
function legacyCreateRootFromDOMContainer(container, forceHydrate) {
  // 因为是第一次加载需要清空容器
  var shouldHydrate =
    forceHydrate || shouldHydrateDueToLegacyHeuristic(container); // First clear any existing content.
  if (!shouldHydrate) {
    var rootSibling;
    while ((rootSibling = container.lastChild)) {
      container.removeChild(rootSibling);
    }
  }
  return createLegacyRoot(
    container,
    shouldHydrate
      ? {
          hydrate: true,
        }
      : undefined,
  );
}
```

createLegacyRoot 方法是返回一个 ReactDOMBlockingRoot 上面只有一个属性\_internalRoot this.\_internalRoot = createRootImpl(container, tag, options);上面挂着 FiberRoot

```js
function createLegacyRoot(container, options) {
  return new ReactDOMBlockingRoot(container, LegacyRoot, options);
}
```

```js
function createRootImpl(container, tag, options) {
  var root = createContainer(container, tag, hydrate);
  markContainerAsRoot(root.current, container);
  return root;
}
```

```js
function markContainerAsRoot(hostRoot, node) {
  node[internalContainerInstanceKey] = hostRoot;
}
```

```js
function createContainer(containerInfo, tag, hydrate, hydrationCallbacks) {
  return createFiberRoot(containerInfo, tag, hydrate);
}
```

返回的是一个 FiberRoot

```js
function createFiberRoot(containerInfo, tag, hydrate, hydrationCallbacks) {
  var root = new FiberRootNode(containerInfo, tag, hydrate);
  // stateNode is any.

  var uninitializedFiber = createHostRootFiber(tag);
  root.current = uninitializedFiber;
  uninitializedFiber.stateNode = root;
  initializeUpdateQueue(uninitializedFiber);
  return root;
}
```

FiberRoot 和 RootFiber 是两个概念，在 react 的虚拟 dom 中每一个组件或者说每一个元素都是一个 fiber 节点 RootFiber 则是 fiber 树的根在 react 中同时存在着两颗 fiber 树一棵对应着当前渲染 dom 的，另一棵对应着下一个状态需要渲染的 dom 树，两棵树在快速的交替着 FiberRoot 则是一个指向当前渲染的 dom 的节点通过 current 指向 current fiber 树 createFiberRoot 在初始化的过程中做了两件事 1 创建了一个 FiberRoot 并且将它的 current 指向 fiber 树 2 创建了只有一个 root 节点的 Fiber 树，并给节点打上了 update 的标签等待后续的处理

```js
/** 创建根节点的fiber */
function createHostRootFiber(tag) {
  var mode;

  if (tag === ConcurrentRoot) {
    mode = ConcurrentMode | BlockingMode | StrictMode;
  } else if (tag === BlockingRoot) {
    mode = BlockingMode | StrictMode;
  } else {
    mode = NoMode;
  }

  return createFiber(HostRoot, null, null, mode);
}
```

```js
var createFiber = function(tag, pendingProps, key, mode) {
  // $FlowFixMe: the shapes are exact here but Flow doesn't like constructors
  return new FiberNode(tag, pendingProps, key, mode);
};
```

```js
function initializeUpdateQueue(fiber) {
  var queue = {
    baseState: fiber.memoizedState,
    baseQueue: null,
    shared: {
      pending: null,
    },
    effects: null,
  };
  fiber.updateQueue = queue;
}
```

initializeUpdateQueue 将 fiber 节点打上 update 的标志等后续进行处理

## updateContainer

```js
function updateContainer(element, container, parentComponent, callback) {
  {
    onScheduleRoot(container, element);
  }

  var current$1 = container.current;
  var currentTime = requestCurrentTimeForUpdate();

  var suspenseConfig = requestCurrentSuspenseConfig();
  var expirationTime = computeExpirationForFiber(
    currentTime,
    current$1,
    suspenseConfig,
  );
  var context = getContextForSubtree(parentComponent);

  if (container.context === null) {
    container.context = context;
  } else {
    container.pendingContext = context;
  }

  var update = createUpdate(expirationTime, suspenseConfig); // Caution: React DevTools currently depends on this property
  // being called "element".

  update.payload = {
    element: element,
  };
  callback = callback === undefined ? null : callback;

  if (callback !== null) {
    update.callback = callback;
  }
  // 打上需要更新的标记
  enqueueUpdate(current$1, update);
  scheduleWork(current$1, expirationTime);
  return expirationTime;
}

var scheduleWork = scheduleUpdateOnFiber;
```

```js
function scheduleUpdateOnFiber(fiber, expirationTime) {
  checkForNestedUpdates();
  var root = markUpdateTimeFromFiberToRoot(fiber, expirationTime);

  checkForInterruption(fiber, expirationTime);
  recordScheduleUpdate(); // TODO: computeExpirationForFiber also reads the priority. Pass the
  // priority as an argument to that function and this one.

  var priorityLevel = getCurrentPriorityLevel();

  if (expirationTime === Sync) {
    if (
      // Check if we're inside unbatchedUpdates
      (executionContext & LegacyUnbatchedContext) !== NoContext && // Check if we're not already rendering
      (executionContext & (RenderContext | CommitContext)) === NoContext
    ) {
      // Register pending interactions on the root to avoid losing traced interaction data.
      schedulePendingInteractions(root, expirationTime); // This is a legacy edge case. The initial mount of a ReactDOM.render-ed
      // root inside of batchedUpdates should be synchronous, but layout updates
      // should be deferred until the end of the batch.

      performSyncWorkOnRoot(root);
    } else {
      ensureRootIsScheduled(root);
      schedulePendingInteractions(root, expirationTime);

      if (executionContext === NoContext) {
        // Flush the synchronous work now, unless we're already working or inside
        // a batch. This is intentionally inside scheduleUpdateOnFiber instead of
        // scheduleCallbackForFiber to preserve the ability to schedule a callback
        // without immediately flushing it. We only do this for user-initiated
        // updates, to preserve historical behavior of legacy mode.
        flushSyncCallbackQueue();
      }
    }
  } else {
    ensureRootIsScheduled(root);
    schedulePendingInteractions(root, expirationTime);
  }

  if (
    (executionContext & DiscreteEventContext) !== NoContext && // Only updates at user-blocking priority or greater are considered
    // discrete, even inside a discrete event.
    (priorityLevel === UserBlockingPriority$1 ||
      priorityLevel === ImmediatePriority)
  ) {
    // This is the result of a discrete event. Track the lowest priority
    // discrete update per root so we can flush them early, if needed.
    if (rootsWithPendingDiscreteUpdates === null) {
      rootsWithPendingDiscreteUpdates = new Map([[root, expirationTime]]);
    } else {
      var lastDiscreteTime = rootsWithPendingDiscreteUpdates.get(root);

      if (lastDiscreteTime === undefined || lastDiscreteTime > expirationTime) {
        rootsWithPendingDiscreteUpdates.set(root, expirationTime);
      }
    }
  }
}
```
