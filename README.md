# Web Component Tree Select

![NPM License](https://img.shields.io/npm/l/vue-dropdown-tree-select)

**Lightweight** component for displaying hierarchical data **< 15k** 😎 <br>
Compatible with React, Vue, Angular & other frameworks. 
Emits selections to parent component

![tree-select](https://github.com/gshohat/web-component-tree-select/assets/91323932/0c43c1c8-8626-4e2c-a0d9-af74df7d8e24)

## Usage

`npm i web-component-tree-select`

```
<script setup>
import TreeSelect from 'web-component-tree-select';

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


## Contact
Feel free to ping me 💫
<br>
connect@giladshohat.com

[giladshohat.com](https://giladshohat.com)

