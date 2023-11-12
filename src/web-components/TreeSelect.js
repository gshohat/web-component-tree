import {ref, toRaw} from 'vue';

const template = document.createElement('template');

template.innerHTML = `
    <style>                               
        .tree-container {
            display: flex;
            flex-direction: column;
            gap: 1rem;   
        }       
        
        .selections-container {
            border: solid 1px grey;
            padding: 1rem;
            width: 30rem;
            overflow: scroll;
            flex: 0 0 1.5rem;
            display: flex;
            gap: 1rem;
        }
        
        .selections {
        
        }
        
        .item-selected {
            padding: 0.5rem;
            margin: 0.5rem;
            background-color: grey;
            white-space: nowrap;
            //flex: 1;
          }
        
          .remove-item {
            color: #34495e6e;
            font-size: 1.2em;
            padding-left: 0.2rem;
          }
        
          .remove-item:hover {
            cursor: pointer;
          }
        
          .arrow-container {
            flex: 1;
            display: flex;
            justify-content: end;
          }
        
          .arrow-vertical-container {
            display: flex;
            flex-direction: column;
            justify-content: center;
          }
        
          .arrow:hover {
            cursor: pointer;
          }
        
          .tree {
            flex: 2;
          }
        
    </style>
    
    <div class="tree-container">
        <div class="selections-container">
            <div class="selections"></div>
    
          <div class="arrow-container">
            <div class="arrow-vertical-container">
              <span class="arrow">&#9660;</span>
            </div>
          </div>          
        </div>  
        <div class="tree" style="visibility: hidden"/>       
    </div>
`

export class TreeSelect extends HTMLElement {
    constructor() {
        super();
        this._shadowRoot = this.attachShadow({ 'mode': 'open' });
        this._shadowRoot.appendChild(template.content.cloneNode(true));

        this._selections = [];
        this._leafElementsSelections = {};

    }

    set items(value) {
        this._items = value;

        let rootTreeElement = document.createElement('div');
        // rootTreeElement.addEventListener()
        this.createTree(this._items, rootTreeElement);

        this.treeDomElement = this._shadowRoot.querySelector('.tree');
        this.treeDomElement.appendChild(rootTreeElement);

        this.selectionsElement = this._shadowRoot.querySelector('.selections');

        this._arrowElement = this._shadowRoot.querySelector('.arrow');
        this._arrowElement.addEventListener('click', toggleTreeVisibility.bind(this))

        document.querySelector('#tree-select').style.height = '100%';
    }

    get items() {
        return this._items;
    }

    createTree(items, element) {
        for (const item of items) {
            if (item.groupLabel) {
                const nestedGroupElement = document.createElement('div');
                nestedGroupElement.classList.add('group');
                nestedGroupElement.style.paddingLeft = `1rem`;
                nestedGroupElement.addEventListener('group-nested-leaf-change', handleNestedLeafChange.bind(this));

                const plusElement = document.createElement('span');
                plusElement.innerText = '+';
                plusElement.style.paddingRight = `0.1rem`;
                plusElement.addEventListener('click', handleToggleChildrenVisibility.bind(this));
                nestedGroupElement.appendChild(plusElement);

                const checkboxElement = document.createElement('input');
                checkboxElement.type = 'checkbox';
                checkboxElement.addEventListener('change', handleGroupChange.bind(this));


                nestedGroupElement.appendChild(checkboxElement);

                const nestedGroupNameElement = document.createElement('span');
                nestedGroupNameElement.innerText = item.groupLabel;
                nestedGroupNameElement.style.paddingLeft = `0.1rem`;

                nestedGroupElement.appendChild(nestedGroupNameElement);

                element.appendChild(nestedGroupElement);

                const nestedGroupChildrenElement = document.createElement('div');
                nestedGroupChildrenElement.classList.add('group-children');
                nestedGroupElement.appendChild(nestedGroupChildrenElement);


                this.createTree(item.children, nestedGroupChildrenElement);
            } else {
                const leafElement = document.createElement('div');
                leafElement.classList.add('leaf');
                leafElement.style.paddingLeft = `1.7rem`;

                const checkboxElement = document.createElement('input');
                checkboxElement.type = 'checkbox';
                leafElement.appendChild(checkboxElement);

                const leafElementName = document.createElement('span');
                leafElementName.innerText = item.label;
                leafElementName.style.paddingLeft = '0.1rem';
                leafElementName.setAttribute('value', item.value);
                leafElement.appendChild(leafElementName);

                checkboxElement.addEventListener('change', handleChange.bind(this));

                element.appendChild(leafElement);
            }
        }
    }

    connectedCallback() {
        // console.log("Custom element added to page.");
    }

    disconnectedCallback() {
        // console.log("Custom element removed from page.");
    }

    adoptedCallback() {
        // console.log("Custom element moved to new page.");
    }

    attributeChangedCallback(name, oldValue, newValue) {
        // console.log(`Attribute ${name} has changed.`);
    }
}

function toggleTreeVisibility(event) {
    if (event.currentTarget.innerHTML === '▼') {
        event.currentTarget.innerHTML = '▲'
        this.treeDomElement.style.visibility = 'visible';
    } else {
        event.currentTarget.innerHTML = '▼'
        this.treeDomElement.style.visibility = 'hidden';
    }
}


function handleChange(event) {
    const spanElement = event.currentTarget.parentNode.childNodes[1];
    const label = spanElement.textContent;
    const value = spanElement.getAttribute('value');
    if (event.currentTarget.checked) {
        this._selections.push({label, value});
        this._leafElementsSelections[value] = event.currentTarget.parentNode;
    }
    else {
        removeSelection.call(this, value);
    }
    event.currentTarget.dispatchEvent(groupNestedLeafChangeEvent);
    createSelections.call(this);

    this.selectionsChanged(this._selections);
}

function createSelections() {
    this.selectionsElement.innerHTML = null;
    for (const [index, selection] of this._selections.entries()) {
        const selectionElement = document.createElement('span');
        selectionElement.textContent = selection.label;
        selectionElement.setAttribute('data-index', index);
        selectionElement.setAttribute('data-value', selection.value);
        selectionElement.classList.add('item-selected');

        const removeItemElement = document.createElement('span');
        removeItemElement.classList.add('remove-item');
        removeItemElement.textContent = 'x';
        removeItemElement.addEventListener('click', handleRemoveSelection.bind(this));
        selectionElement.appendChild(removeItemElement);

        this.selectionsElement.appendChild(selectionElement);
    }
}



function handleRemoveSelection(event) {
    const index = event.currentTarget.parentNode.attributes['data-index'].value;
    const value = event.currentTarget.parentNode.attributes['data-value'].value;
    this._selections.splice(index, 1);
    createSelections.call(this);

    const leafElementSelected = this._leafElementsSelections[value];
    leafElementSelected.childNodes[0].checked = false;
    leafElementSelected.dispatchEvent(groupNestedLeafChangeEvent);
}

function removeSelection(value) {
    this._selections = toRaw(this._selections).filter(selection => selection.value !== value );
}

function handleNestedLeafChange(event) {
    const groupChildrenArray = Array.from(event.currentTarget.childNodes[3].childNodes);
    const filteredGroupChildrenArray = groupChildrenArray.filter((groupChild) => {
        return ( (groupChild.classList.contains('leaf')) && (groupChild.childNodes[0].checked) ||
            (groupChild.classList.contains('group')) && (groupChild.childNodes[1].checked) )
    });
    if (filteredGroupChildrenArray.length < groupChildrenArray.length)
        event.currentTarget.childNodes[1].checked = false
    else if (filteredGroupChildrenArray.length === groupChildrenArray.length)
        event.currentTarget.childNodes[1].checked = true;
}

function handleToggleChildrenVisibility(event) {
    const groupChildrenElement = event.currentTarget.parentNode.childNodes[3];
    groupChildrenElement.style.display === 'none' ? groupChildrenElement.style.display = 'block' : groupChildrenElement.style.display = 'none';
}

const groupNestedLeafChangeEvent = new Event('group-nested-leaf-change', {bubbles: true});

function allGroupDeselected(element) {
    const arr = Array.from(element.childNodes);

    const selectedLeafElements = arr.filter((childNode, index) => {
        return ((index >= 3) && (childNode.childNodes[0].checked))
    });
    return selectedLeafElements.length === 0;
}

function handleGroupChange(event) {
    toggleNestedSelections.call(this, event.currentTarget.checked, event.currentTarget.parentNode.childNodes);
    this.selectionsChanged(this._selections);
    createSelections.call(this);
}

function toggleNestedSelections(checked, childNodes) {
    for (const childElement of childNodes) {
        if (childElement.className === 'leaf') {
            const checkBoxElement =  childElement.childNodes[0];
            if (checkBoxElement.checked === checked)
                continue;
            const spanElement = checkBoxElement.parentNode.childNodes[1];
            const value = spanElement.getAttribute('value');
            if (checked) {
                const label = spanElement.textContent;
                this._selections.push({label, value});
                this._leafElementsSelections[value] = checkBoxElement.parentNode;
            }
            else
                removeSelection.call(this, value);
            checkBoxElement.checked = checked;
        } else if (childElement.className === 'group') {
            const checkBoxElement = childElement.childNodes[1];
            checkBoxElement.checked = checked;
            toggleNestedSelections.call(this, checked, childElement.childNodes[3].childNodes);
        } else if (childElement.className === 'group-children') {
            toggleNestedSelections.call(this, checked, childElement.childNodes);
        }
    }
}

customElements.define("tree-select", TreeSelect);
