# js dfs 和 bfs

```js
var tree = {
  name: '中国',
  children: [
    {
      name: '北京',
      children: [
        {
          name: '朝阳群众',
          children: [
            {
              name: '西宁市',
              code: '0521',
            },
          ],
        },
        {
          name: '海淀区',
        },
        {
          name: '昌平区',
        },
      ],
    },
    {
      name: '浙江省',
      children: [
        {
          name: '杭州市',
          code: '0571',
        },
        {
          name: '嘉兴市',
        },
        {
          name: '绍兴市',
        },
        {
          name: '宁波市',
        },
      ],
    },
  ],
};
var node = dfs / bfs(tree, '西宁市');
console.log(node); // 输出： { name: '西宁市', code: '0521' }
```

## 递归

```js
function recursive(tree, name) {
  if (tree.name === name) {
    return tree;
  }

  if (!tree.children) {
    return null;
  }

  for (let i = 0; i < tree.children.length; i++) {
    const result = recursive(tree.children[i], name);
    if (result) {
      return result;
    }
  }

  return null;
}
```

## dfs 深度优先遍历

利用队列先进后出的原理可以把树进行深度优先遍历

```js
function dfs(tree, name) {
  const stack = [tree];

  while (stack) {
    const item = stack.pop();
    if (item.name === name) {
      return item;
    }

    const children = item.children;
    if (children) {
      for (let i = 0; i < children.length; i++) {
        stack.push(children[i]);
      }
    }
  }
  return null;
}
```

## bfs 广度优先遍历

利用队列的先进先出可以进行对树的广度优先遍历

```js
function bfs(tree, name) {
  const queue = [tree];

  while (queue) {
    const item = queue.shift();
    if (item.name === name) {
      return item;
    }

    const children = item.children;
    if (children) {
      for (let i = 0; i < children.length; i++) {
        queue.push(children[i]);
      }
    }
  }
  return null;
}
```
