# Web Component Tree

![NPM License](https://img.shields.io/npm/l/vue-dropdown-tree-select)

**Lightweight** component for displaying hierarchical data **< 15k** 😎 <br>
Compatible with React, Vue, Angular & other frameworks. 
Emits selections to parent component

![web-component-tree](https://github.com/gshohat/web-component-tree/assets/91323932/8966b5df-b556-42c5-89a6-728645c72500)



## Vue Usage

`npm i web-component-tree`

```
<script setup>
import TreeSelect from 'web-component-tree';

const items = [
  { groupLabel: 'Frontend Developer',
    children: [
      {groupLabel: 'Vue',
        children: [ { label:'Options Api', value: 'optionsApi'},
          { label: 'Composition Api', value: 'compositionApi' }]},
      { label: 'React', value: 'react'},
      { label: 'Angular', value: 'angular'}
    ]},
  { groupLabel: 'Backend Developer',
    children: [
      {label: 'Bun', value: 'bun' },
      { label: 'Deno', value: 'deno' },
      { label:'Node', value: 'node' }
    ]},
];

onMounted(() => {
  const treeElement = document.querySelector('#tree-select');
  treeElement.items = items;

  treeElement.selectionsChanged = (selections) => {
    console.log(selections);
  }

</script>


<template>
<tree-select id="tree-select"/>
</template
```

vite config
```
export default defineConfig({
  plugins: [
    vue({
      template: {
        compilerOptions: {
          isCustomElement: (tag) => tag.includes('tree-select')
        }
      }
    })
  ],
```

## Contact
Feel free to ping me 💫
<br>
connect@giladshohat.com

[giladshohat.com](https://giladshohat.com)

