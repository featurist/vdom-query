# vdom-query

Traverses and manipulates
[virtual-dom](https://github.com/Matt-Esch/virtual-dom) trees.

Implements a subset of the jQuery API.

## Example

```JavaScript
var h = require('virtual-dom/h');
var $ = require('vdom-query');

function render() {
  return h('.top', h('.banana'));
}

var vdom = render();
$(vdom).find('.banana').first().attr('class') //-> banana

```

# API

## Finding elements in a virtual dom

```JavaScript
var $ = require('vdom-query');
$(vdom).find('your-selector')

```

* `vdom` - a virtual DOM fragment.

The resulting vdom-query object represents a set of elements, which can be manipulated to produce new sets. Every set can extract data or interact with its matching elements.

Traversing the dom to find elements is deferred until it is required, rather than as the query is being constructed. The dom is re-rendered before any traversal.

### .find(selector)
Get the descendants of each element in the current set of matched elements, filtered by a selector.

### .is(selector)
Check the current matched set of elements against a selector and return true if at least one of these elements matches the given arguments.

### .hasClass(selector)
Determine whether any of the matched elements are assigned the given class.

### .addClass(className)
Adds the given className to the current set of elements.

### .attr(name)
Get the value of an attribute for the first element in the set of matched elements.

### .prop(name, value)
Get prop value of the first element in the set of matched elements or sets one or more props for every matched element.

### .val(value)
Gets the value of the first element in the set of matched elements or sets the value of of the first element in the set of matched elements.

### .innerText()
Gets the innerText of the elements in the set of matched elements.

### .text(value)
Gets the text of the elements in the set of matched elements or sets the text of the elements in the matched set.

### .size()
Return the number of elements in the vdom-query object.

### .append(vdom|html)
Appends the given vdom or html string to the current set of matched elements.

### .parent()
Get the parent of each element in the current set of matched elements.

### .remove()
Remove the set of matched elements from the parent node

### .on(eventName, callback)
Adds an event handler to the matched set of elements for the given event name.

### .trigger(eventName, data)
Triggers the event handlers for the given event name on the current set of matched elements.

### .focus()
Sets the focus to be the first element in the set of matched elements

# Work in progress

Patches welcome!
