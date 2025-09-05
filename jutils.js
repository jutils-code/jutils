function $(selector) {
return new jUtils(selector); 
}


class jUtils {
    constructor(element) {       
if(typeof element === 'string' && element.trim().startsWith('<') && element.trim().endsWith('>') && element.trim().length >= 3) {
const createElement = document.createElement('div');
createElement.innerHTML = element;
return new jUtils(createElement);
} else if(typeof element === 'string' && element.trim().startsWith(':')) {
const containerElement = document.createElement(element.trim().replace(':', ''));
return new jUtils(containerElement);
} else {
if (typeof element === 'string') {
  try {
    const elements = document.querySelectorAll(element);
    this.element = elements.length > 0 ? elements : element;
  } catch (err) {
    this.element = element;
  }
} else {
  this.element = element;
}
}
    }
    
    at(index = 0) {
 return new jUtils(this.element[index]);      
    }

// this method doesn't return anything it just execute a callback for each iterate element           
    catchSet(callback) {
// chech if the length of the element is greater than 1     
  if (this.element.length > 1) {
// execute a callback array method for rach elements "doesn't return anything"
Array.from(this.element).forEach(callback);
  } else {
/* if element length is less than 1 check if this.element[0] "first element" === undefined it mean "at()" was called that's why it's undefined 
*/  
  if(this.element[0] === undefined) {
// Else return the element direct if "at()" was called   
callback(this.element);
return;  
  }
// return the first element if "at()" is not called   
 callback(this.element[0]);
  }
   }
  
// this method return a callback containing iterate element
   catchGet(callback, loopType) {
// chech if the length of the element is greater than 1 
 if(this.element.length > 1) {
 // if loopType is defined return an array of specify type e.g 'each, map' among others
 if(loopType !== undefined) {
return $(this.element)[loopType]((item) => callback(item));  
} 

// if loopType is not defined return the first element 
return callback(this.element[0]); 
} else {
/* if element length is less than 1 check if this.element[0] "first element" !== undefined if not call "at()" it wont equal undefined 
*/

if(this.element[0] !== undefined) {
// return the first element if "at()" is not called 
return callback(this.element[0]);         
} else {
// Else return the element direct if "at()" was called 
return callback(this.element);         
}  
  } 
   }
                  

   html(content) {
  if (content !== undefined) {
    this.catchSet((element) => {
      element.innerHTML = content;
    });
    return new jUtils(this.element);
  } else {
return this.catchGet((element) => element.innerHTML);  
  }
   }
             
    text(content) {
if (content !== undefined) {
    this.catchSet((element) => {
      element.textContent = content;
    });
    return new jUtils(this.element);
  } else {
  return this.catchGet((element) => element.textContent);
  }     
   }
    
    val(content) {      
if (content !== undefined) {
    this.catchSet((element) => {
      element.value = content;
    });
    return new jUtils(this.element);
  } else {
  return this.catchGet((element) => element.value);
  }
    }
    
    unwrap() {
return this.catchGet(item => item);       
    }
    
    ready(callback) {
 if(this.element == document) { 
document.addEventListener('DOMContentLoaded', callback); 
 } else if(this.element == window) {    
window.addEventListener('load', callback);
   } else {
throw new TypeError(`${this.element} is not a supported type`);
   }  
    }     

    
   each(callback) {
Array.from(this.element).forEach(callback);       
    }
    
    filter(callback) {
return Array.from(this.element).filter(callback);       
    }
    
    map(callback) {
return Array.from(this.element).map(callback);       
    }
    
    count(callback, flag = 0) {
let count = flag;
for (let i = 0; i < this.element.length; i++) {
    if (callback(this.element[i])) {
      count++;
    }
  }
  return count;        
    }
    
    reduce(callback) {
return Array.from(this.element).reduce(callback);       
    }
    
    find(callback) {
return Array.from(this.element).find(callback);       
    }
    
    some(callback) {
return Array.from(this.element).some(callback);       
    } 
    
    css(styles, property) {
if(typeof styles === 'object') {
this.catchSet((item) => {
   Object.assign(item.style, styles);
})
return new jUtils(this.element);    
}  

if(styles !== undefined && property !== undefined) {
this.catchSet((item) => {
item.style[styles] = property;       
});
return new jUtils(this.element);    
} else if(styles !== undefined && property === undefined) {
return this.catchGet((item) => item.style[styles]);
    } else {
    return null;
}     
}
    
    append(content) {
this.catchSet((item) => {
item.append(content);     
});                  
return new jUtils(this.element);           
    }
    
    prepend(content) {
this.catchSet((item) => {
item.prepend(content);     
});                         
return new jUtils(this.element);     
    }
    
    appendTo(content) {
this.catchSet((item) => {
content.append(item);        
});       
return new jUtils(this.element);           
    }
    
    prependTo(content) {
this.catchSet((item) => {
content.prepend(item);        
});               
return new jUtils(this.element);        
    }             
    
    attr(attrName, attrValue) {
if(attrName !== undefined && attrValue !== undefined) {
this.catchSet((item) => {
item.setAttribute(attrName, attrValue);
});               
return new jUtils(this.element);  
} else if(attrName !== undefined && attrValue === undefined) {
return this.catchGet((item) => item.getAttribute(attrName));               
} else {
 return null;
}       
    }
    
    removeAttr(attrName) {
this.catchSet((item) => {
item.removeAttribute(attrName);
});                       
return new jUtils(this.element);    
    }
    
    hide(ms) {
this.catchSet((item) => {    
if(ms === undefined) {  
item.style.display = 'none';
} else {
setTimeout(() => {
item.style.display = 'none';    
}, ms);    
}  
});                       
return new jUtils(this.element);        
    }
    
    show(ms) {
this.catchSet((item) => {    
if(ms === undefined) {      
item.style.display = 'block'; 
} else {
setTimeout(() => {
item.style.display = 'block';    
}, ms);        
}
});                
return new jUtils(this.element);        
    }
           
    toggle(ms) {
this.catchSet((item) => {    
if(ms === undefined) {      
item.style.display = item.style.display === 'none' ? 'block' : 'none';
} else {
setTimeout(() => {
item.style.display = item.style.display === 'none' ? 'block' : 'none';
}, ms);    
}
});                               
return new jUtils(this.element);          
    }
    
    addClass(styles) {
this.catchSet((item) => {
item.classList.add(styles);
});                        
return new jUtils(this.element);        
    }
    
    removeClass(styles) {
this.catchSet((item) => {
item.classList.remove(styles);
});                      
return new jUtils(this.element);                
    }
    
    toggleClass(styles) {
this.catchSet((item) => {
item.classList.toggle(styles);
});                  
return new jUtils(this.element);               
    }
    
    hasClass(styles) {
return this.catchGet((item) => item.classList.contains(styles), 'some');                
   }    
   
   click(callback) {
this.catchSet((item) => {
item.addEventListener('click', callback); 
});   
return callback;         
   }     
   
   on(type, callback) {
if(type !== undefined && callback === undefined) {
this.catchSet((item) => {
item.addEventListener('click', type);      
});  
 return callback;
} else if(type !== undefined && callback !== undefined) {
this.catchSet((item) => {
item.addEventListener(type, callback); 
});  
return callback;
} else {
return null;   
}       
   }  
   
   off(type, callback) {
this.catchSet((item) => {
item.removeEventListener(type, callback);
});     
   }
   
   submit(callback) {
this.catchSet((item) => {
item.addEventListener('submit', callback);  
});  
return callback;      
   }
   
   input(callback) {
this.catchSet((item) => {
item.addEventListener('input', callback);  
});  
return callback;      
   }
   
   dblclick(callback) {
this.catchSet((item) => {
item.addEventListener('dblclick', callback);      
});  
return callback;  
   }
   
   applyBlur(index = '1px') {
this.catchSet((item) => {
item.style.filter = `blur(${index})`;
});     
return new jUtils(this.element);       
  }
  
  cssText(styles, fit) {  
if(styles !== undefined) { 
this.catchSet((item) => {
item.style.cssText = fit === undefined ? styles : item.style.cssText += fit;
}); 
return new jUtils(this.element);     
 } else {
return this.catchGet((item) => item.style.cssText, 'map');             
 } 
  }
  
  merge(...args) {
return Array.from(this.element).concat(...args);   
  }

  data(key, value) {
if(key !== undefined && value !== undefined) {
this.catchSet((item) => {
item.dataset[key] = value;
}); 
return new jUtils(this.element);      
} else if(key !== undefined && value === undefined) {
return this.catchGet((item) => item.dataset[key]);     
} else {
return null;   
}  
   }
   
   
   fadeIn(delay, callback = () => {}) {
this.catchSet((item) => {
    item.style.opacity = '0';
    item.style.transition = `opacity ${delay / 1000}s`;
    item.style.opacity = '1';

    const handleTransitionEnd = () => {
      item.removeEventListener('transitionend', handleTransitionEnd);
      callback(item);    
      }  
      
item.addEventListener('transitionend', handleTransitionEnd);
  });  
    
return new Promise((resolve, reject) => {
setTimeout(() => {
 resolve(this.element); 
 }, delay);       
});      
   }

               
   fadeOut(delay = 0, callback = () => {}) {
  this.catchSet((item) => {
    item.style.opacity = '1';
    item.style.transition = `opacity ${delay / 1000}s`;
    item.style.opacity = '0';

    const handleTransitionEnd = () => {
      item.removeEventListener('transitionend', handleTransitionEnd);
callback(item);
    };

    item.addEventListener('transitionend', handleTransitionEnd);
  });


return new Promise((resolve, reject) => {
setTimeout(() => {
 resolve(this.element); 
 }, delay);  
 });     
   }
                      
                                  
   fadeToggle(delay = 0, callback = () => {}) {
  this.catchSet((item) => {
    const isVisible = item.style.opacity === '' || item.style.opacity === '1';
    item.style.transition = `opacity ${delay / 1000}s`;
    item.style.opacity = isVisible ? '0' : '1';
    const handleTransitionEnd = () => {
      item.removeEventListener('transitionend', handleTransitionEnd);
      callback(item);
    };
    item.addEventListener('transitionend', handleTransitionEnd);
  });
  
  return new Promise((resolve, reject) => {
setTimeout(() => {
 resolve(this.element); 
 }, delay);       
});
   }
   

   delay(ms = 0, callback) {
  this.delayChain = this.delayChain || Promise.resolve(this.element);
  this.delayChain = this.delayChain.then(element => {
    return new Promise(resolve => {
      setTimeout(() => {
        callback(element);
        resolve(element);
      }, ms);
    });
  });
  return this;
}
     
  
   scrollRight(delay = 10, stop = 10000, callback = () => {}) {
  this.catchSet((item) => {
    const originalHtml = item.innerHTML;
    const timer = delay / 1000;
    const text = item.textContent;
    item.style.overflow = 'hidden';
    item.style.width = '100%';
    item.innerHTML = `<span style="display: inline-block; white-space: nowrap;">${text}</span>`;
    let x = -item.querySelector('span').offsetWidth;
    const intervalId = setInterval(() => {
      x += 1;
      item.querySelector('span').style.transform = `translateX(${x}px)`;
      if (x >= item.offsetWidth) {
        x = -item.querySelector('span').offsetWidth;
      }
    }, timer);
    setTimeout(() => {
      clearInterval(intervalId);
      item.style.transform = '';
      item.style.overflow = '';
      item.innerHTML = originalHtml; // Restore original HTML content
      callback(item);
    }, stop);
  });
   }


   scrollLeft(delay = 10, stop = 10000, callback = () => {}) {
  this.catchSet((item) => {
    const originalHtml = item.innerHTML;
    const timer = delay / 1000;
    const text = item.textContent;
    const width = item.offsetWidth;
    item.style.overflow = 'hidden';
    item.style.width = width + 'px';
    item.innerHTML = `<span style="display: inline-block; white-space: nowrap;">${text}</span>`;
    let x = width;
    const intervalId = setInterval(() => {
      x -= 1;
      item.querySelector('span').style.transform = `translateX(${x}px)`;
      if (x <= -item.querySelector('span').offsetWidth) {
        x = width;
      }
    }, timer);
    setTimeout(() => {
      clearInterval(intervalId);
      item.style.transform = '';
      item.style.overflow = '';
      item.innerHTML = originalHtml; // Restore original HTML content
      callback(item);
    }, stop);
  });
   }


   slideLeft(delay = 10000, callback = () => {}) {
  this.catchSet((item) => {
    document.body.style.position = 'fixed';
    item.style.display = 'none';
    setTimeout(() => {
      item.style.display = 'block';
      item.style.position = 'relative';
      item.style.left = `${window.innerWidth}px`;
      item.style.transition = `left ${delay / 1000}s ease-in-out`;
      setTimeout(() => {
        item.style.left = '0px';
      }, 0);
      if (callback) {
        setTimeout(() => {
          callback(item);
        }, delay);
      }
    }, 0);
  });
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(this.element);
    }, delay);
  });
   }


   slideRight(delay = 10000, callback = () => {}) {
  this.catchSet((item) => {
    document.body.style.position = 'fixed';
    item.style.display = 'none';
    setTimeout(() => {
      item.style.display = 'block';
      item.style.position = 'relative';
      item.style.left = `-${item.offsetWidth + 10}px`;
      item.style.transition = `left ${delay / 1000}s ease-in-out`;
      setTimeout(() => {
        item.style.left = '0px';
      }, 0);
      if (callback) {
        setTimeout(() => {
          callback(item);
        }, delay);
      }
    }, 0);
  });
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(this.element);
    }, delay);
  });
   }


   slideUp(delay = 10000, callback = () => {}) {
  this.catchSet((item) => {
    const scrollHeight = item.scrollHeight;
    const fit = delay / 1000; /* Calculate the transition time in seconds */
    item.style.transition = `max-height ${fit}s ease-in-out`;
    item.style.overflow = 'hidden';
    item.style.maxHeight = `${scrollHeight}px`;
    // Trigger the animation
    requestAnimationFrame(() => {
      item.style.maxHeight = '0px';
    });
    if (callback) {
      setTimeout(() => {
        callback(item);
      }, delay);
    }
  });
   }


   slideDown(delay = 10000, callback = () => {}) {
  this.catchSet((item) => {
    const scrollHeight = item.scrollHeight;
    const fit = delay / 1000; /* Calculate the transition time in seconds */
    item.style.transition = `max-height ${fit}s ease-in-out`;
    item.style.overflow = 'hidden';
    item.style.maxHeight = '0px';
    // Trigger the animation
    requestAnimationFrame(() => {
      item.style.maxHeight = `${scrollHeight}px`;
    });
    if (callback) {
      setTimeout(() => {
        callback(item);
      }, delay);
    }
  });
   }
   
      
progress(ms, options = () => {}) {
let time = typeof ms === 'object' ? ms.duration ?? 5000 : ms ?? 5000;

this.catchSet((item) => {
window.addEventListener('load', () => {
if(typeof ms === 'object' && !Array.isArray(ms)) {
Object.assign(item.style, ms);
progressBar.style.background = ms.progressColor;
setTimeout(() => {
 ms.callback ? ms.callback(item) : null; 
}, time); 
} else {
setTimeout(() => {
  options(item); 
}, time);     
}  
});

    item.innerHTML = '';
    item.style.width = '100%';
    item.style.height = '10px';
    item.style.backgroundColor = 'yellow';
    item.style.borderRadius = '10px';
    const progressBar = document.createElement('div');
    progressBar.style.width = '0%';
    progressBar.style.height = '100%';
    progressBar.style.backgroundColor = 'green';
    progressBar.style.transition = `width ${time / 1000}s`;
    item.appendChild(progressBar);
   setTimeout(() => {
      progressBar.style.width = '100%';
    }, 1);        
 });

return new Promise((resolve) => {
  setTimeout(() => {
    resolve(this.element);
  }, time); 
});  
 }
  

      
   swipeLeft(options = {}) {
  const defaults = {
    threshold: 50,
    edgeThreshold: 30,     
    callback: (e) => {
  console.log(e);      
    },
  };

  let opts;

   // Check if options is a function
  if (typeof options === 'function') {
    opts = { ...defaults, callback: options };
  } else {
    opts = { ...defaults, ...options };
  }

  let startX = 0;
  
  
  this.catchSet((item) => {      
 item.addEventListener('touchstart', (event) => {
    startX = event.touches[0].clientX;
  });

  item.addEventListener('touchend', (event) => {
    const endX = event.changedTouches[0].clientX;
if(item.offsetWidth !== undefined) {        
    if (startX > item.offsetWidth - opts.edgeThreshold) return; // check if start point is close enough to the edge
    if (endX - startX > opts.threshold) {
      opts.callback("Swiped from left!");
    }
    } else {
 if (startX > opts.edgeThreshold) return; // check if start point is close enough to the edge
    if (endX - startX > opts.threshold) {
      opts.callback("Swiped from left!");
    }        
    }
  });  
  });
   }


    swipeDown(options = {}) {
  const defaults = {
    threshold: 50,
    edgeThreshold: 30,    
    callback: (e) => {
  console.log(e);      
    },
  };

  let opts;

   // Check if options is a function
  if (typeof options === 'function') {
    opts = { ...defaults, callback: options };
  } else {
    opts = { ...defaults, ...options };
  }

  let startY = 0;
  
  this.catchSet((item) => {      
  item.addEventListener('touchstart', (event) => {
    startY = event.touches[0].clientY;
  });

  item.addEventListener('touchend', (event) => {
    const endY = event.changedTouches[0].clientY;
if(item.offsetWidth !== undefined) {                                    
    if (!opts.targetElement && startY < item.offsetHeight - opts.edgeThreshold) return; // check if start point is close enough to the bottom edge
    if (startY - endY > opts.threshold) {
      opts.callback("Swiped from bottom!");
    }    
    } else {
if (!opts.targetElement && startY < window.innerHeight - opts.edgeThreshold) return; // check if start point is close enough to the bottom edge
    if (startY - endY > opts.threshold) {
      opts.callback("Swiped from bottom!");
    }        
    }    
    });
  });
   }


    swipeRight(options = {}) {
  const defaults = {
    threshold: 50,
    edgeThreshold: 30,    
    callback: (e) => {
   console.log(e);     
    },
  };

let opts;

   // Check if options is a function
  if (typeof options === 'function') {
    opts = { ...defaults, callback: options };
  } else {
    opts = { ...defaults, ...options };
  }


  let startX = 0;
 
 this.catchSet((item) => {      
  item.addEventListener('touchstart', (event) => {
    startX = event.touches[0].clientX;
  });

  item.addEventListener('touchend', (event) => {
    const endX = event.changedTouches[0].clientX; 
if(item.offsetWidth !== undefined) {      
    if (startX < item.offsetWidth - opts.edgeThreshold) return; // only trigger if swipe starts from right edge
    if (startX - endX > opts.threshold) {
      opts.callback('swipe from right!');
    } 
    } else {
if (startX < window.innerWidth - opts.edgeThreshold) return; // only trigger if swipe starts from right edge
    if (startX - endX > opts.threshold) {
      opts.callback('swipe from right!');
    }         
    }      
  });
  });
   }




    swipeUp(options = {}) {
  const defaults = {
    threshold: 50,
    edgeThreshold: 30,    
    callback: (e) => {
  console.log(e);      
    },
  };

  let opts;

   // Check if options is a function
  if (typeof options === 'function') {
    opts = { ...defaults, callback: options };
  } else {
    opts = { ...defaults, ...options };
  }

  let startY = 0;
  
  this.catchSet((item) => {      
  item.addEventListener('touchstart', (event) => {
    startY = event.touches[0].clientY;
  });

  item.addEventListener('touchend', (event) => {
    const endY = event.changedTouches[0].clientY;
if(item.offsetHeight !== undefined) {        
    if (!opts.targetElement && startY > item.offsetHeight - opts.edgeThreshold) return; // check if start point is close enough to the top edge
    if (endY - startY > opts.threshold) {
      opts.callback("Swiped from top!");
    }
    } else {
if (!opts.targetElement && startY > opts.edgeThreshold) return; // check if start point is close enough to the top edge
    if (endY - startY > opts.threshold) {
      opts.callback("Swiped from top!");
    }        
    }
  });
  });
   }


    is(callback) {       
 
return this.catchGet((item) => {  
    // ID selector
    if (callback.startsWith('#')) { 
if(item instanceof NodeList) {
return false;       
} else {
return item.getAttribute('id') === callback.slice(1).trim();    
}     
    }

    // Class selector
    if (callback.startsWith('.')) {
      const className = callback.slice(1).trim();
      return item.classList.contains(className);
    }
    
    // Special selectors
    switch (callback) {
      case ':int':
        return !isNaN(item) && item % 1 === 0;
      case ':float':
        return !isNaN(item) && item % 1 !== 0;
      case ':even':
        return item % 2 === 0;
      case ':odd':
        return item % 2 !== 0;
      case ':negative':
        return item < 0;
      case ':positive':
        return item > 0;
      case ':visible':
        return item.offsetParent !== null;
      case ':hidden':
        return item.offsetParent === null;
      case ':nan':
        return isNaN(item);
      case ':removed':
        return !item;
      case ':checked':
        return item.checked;
      case ':enabled':
        return !item.disabled;
      case ':disabled':
        return item.disabled;
      case ':selected':
        return item.selected;       
    }
    
 // Attribute selector
 if (callback.startsWith('[') && callback.endsWith(']')) {    
      return item.hasAttribute(callback.slice(1, -1));
    }
    
    // Attribute value selector
if (callback.includes('=')) {
      const [attr, value] = callback.split('=');
      return item.getAttribute(attr) === value;
    }
    
    // Tag name selector
if (item.tagName === callback.toUpperCase()) {
      return true;
    }

     // Check if callback is a valid input type
    const inputTypes = [
      'text',
      'password',
      'email',
      'number',
      'date',
      'time',
      'datetime-local',
      'month',
      'week',
      'url',
      'search',
      'tel',
      'color',
      'checkbox',
      'radio',
      'file',
      'submit',
      'reset',
      'button',
      'hidden',
    ];
    if (inputTypes.includes(callback)) {
      return item.type === callback;
    }
    
    return false;     
    

 }, 'some');
   }




   /**
 * Get child elements based on a selector or index.
 * 
 * @param {string|number} selector - CSS selector or index of the child element.
 * @param {boolean} [multiple=false] - Whether to return multiple elements or a single element.
 * @returns {myJutils|Jutils|null} - A myJutils or Jutils object wrapping the child element(s) or null if not found.
 */
   child(selector) {
return this.catchGet((item) => { 
  if (typeof selector === 'number') {
    // If selector is a number, use it as an index        
    return item.children[selector];
  } else if (typeof selector === 'string') {
    // If selector is a string, use it as a CSS selector
return Array.from(item.querySelectorAll(selector));
  } else {
    throw new Error('Invalid selector type. Expected a string or number.');
  }  
  });
   }

// get element firstchild
   first(selector) {
return this.catchGet((item) => { 
  const child = item.firstElementChild;
  if (!child) return null;
  if (selector && !child.matches(selector)) return null;
  return child;
  });
   };
   
// get element lastchild   
   last(selector) {
return this.catchGet((item) => {    
  const child = item.lastElementChild;
  if (!child) return null;
  if (selector && !child.matches(selector)) return null;
  return child;
  });
   };
   
   
   // Insert content before the element
before(content) {
 this.catchSet((item) => { 
  if (typeof content === 'string') {
    // Insert HTML string before element
item.insertAdjacentHTML('beforebegin', content);
  } else {
    // Insert element/node before this.element
item.parentNode.insertBefore(content, item);
  } 
  });
return new jUtils(this.element); 
   };
   
   
   // Insert content after the element
 after(content) {
this.catchSet((item) => {  
  if (typeof content === 'string') {
    // Insert HTML string after element
item.insertAdjacentHTML('afterend', content);
  } else {
    // Insert element/node after this.element
item.parentNode.insertBefore(content, item.nextSibling);
  }
  });
return new jUtils(this.element); 
   };
   
   
   // make text not ccopyable 
 disableCopy() {
this.catchSet((item) => { 
 const element = item;
    if (element) {
    const style = document.createElement('style');
    style.textContent = `
      .uncopyable {
        -webkit-touch-callout: none;
        -webkit-user-select: none;
        -khtml-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
      }
    `;
    document.head.appendChild(style);
    element.classList.add("uncopyable");
    element.addEventListener("selectstart", function(event) {
      event.preventDefault();
    });
  element.addEventListener("contextmenu", function(event) {
      event.preventDefault();
    });
  }
  });
   }
   
   
   // Clipboard copy text  
 copyToClipboard(callback) {
const text = this.element;

  if (navigator.clipboard) {
    navigator.clipboard.writeText(text).then(() => {
      if (callback) callback(true);
    }, () => {
      if (callback) callback(false);
    });
  } else {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.top = '-9999px';
    document.body.appendChild(textarea);
    textarea.focus();
    textarea.select();

    try {
      const successful = document.execCommand('copy');
      if (callback) callback(successful);
    } catch (err) {
      if (callback) callback(false);
    }

 document.body.removeChild(textarea);
    }
   }
         

// Make none VALUE or TEXTAREA element editable 
edit(options) {
 this.catchSet(item => {
  item.setAttribute('contenteditable', 'true');

  let placeholder = item.getAttribute('placeholder'); 

if(typeof options === 'object' && !Array.isArray(options)) {
placeholder = options.placeholder !== undefined ? options.placeholder : item.getAttribute('placeholder');  
Object.assign(item.style, options)
} else if(typeof options === 'string') {
if(options.startsWith('#')) {
item.id = options.slice(1).trim();  
} else if(options.startsWith('.')) {
item.classList.add(options.slice(1).trim());    
} else {
placeholder = options;   
}
} 
  
 item.dataset.placeholder = placeholder || '';
 
 
let originalStyle = item.getAttribute('style');

item.addEventListener('input', () => {
  if (item.textContent.length > 0) {
    item.removeAttribute('style');
    item.id = null;
if(typeof options === 'string' && options.startsWith('.')) {
item.classList.remove(options.slice(1).trim());   
}    
  } else {
item.setAttribute('style', originalStyle);
if(typeof options === 'string') {
if(options.startsWith('#')) {
item.id = options.slice(1).trim();   
} else if(options.startsWith('.')) {
item.classList.add(options.slice(1).trim());    
}    
}  
}      
});


 let style = document.querySelector('style[data-placeholder-style]');
if (!style) {
  style = document.createElement('style');
  style.dataset.placeholderStyle = '';
  style.textContent = `
    [data-placeholder]:empty::after {
      content: attr(data-placeholder);
    }
  `;
  document.head.appendChild(style);
}
  });
}


// Autotyping logic 
autoType(html, options = {}) {
this.catchSet((item) => {
  const defaults = {
    typeSpeed: 5000,
    loop: 1,
    stopAt: null,
    parser: 'html',
    doneText: null
  };

  const settings = { ...defaults, ...options };

  let currentIndex = 0;
  let isDeleting = false;
  let loopCount = 0;
  let textContent = settings.parser === 'text' ? getTextContent(html) : html;

  function type() {
    if (isDeleting) {
      item.innerHTML = textContent.substring(0, currentIndex) + getCaret();
      currentIndex--;
      if (currentIndex < 0) {
        isDeleting = false;
        loopCount++;
        if (loopCount >= settings.loop) {
          clearInterval(intervalId);
          const displayText = settings.doneText || (settings.parser === 'html' ? html : textContent);
         item.innerHTML = displayText;
        }
      }
    } else {
     item.innerHTML = textContent.substring(0, currentIndex + 1) + getCaret();
      currentIndex++;

      if (settings.stopAt && textContent.substring(0, currentIndex).includes(settings.stopAt)) {
        isDeleting = true;
      }

      if (currentIndex >= textContent.length) {
        if (settings.loop > 1) {
          isDeleting = true;
        } else {
          clearInterval(intervalId);
          const displayText = settings.doneText || (settings.parser === 'html' ? html : textContent);
         item.innerHTML = displayText;
        }
      }
    }
  }

  function getTextContent(html) {
    const div = document.createElement('div');
    div.innerHTML = html;
    return div.textContent || div.innerText || '';
  }

  function getCaret() {
    return '<span style="border-right: 1px solid black; margin-left: 1px;"></span>';
  }

  const intervalId = setInterval(type.bind(this), settings.typeSpeed / 10);
  
  });
};

// Create a horizontal divider with text in the middle.
 divider(options) {
this.catchSet((item) => {
let text = '';

if(typeof options === 'object' && !Array.isArray(options)) {
text = options.text !== undefined ? options.text : item.textContent;   
} else if(typeof options === 'string' || typeof options === 'number') {
text = options;    
} else {
text = item.textContent;    
} 


  item.innerHTML = `
    <hr style="flex-grow: 1; border: none; border-top: 2px solid black; border-radius: 2px;" class="fit88">
    <span style="padding: 0 10px;">${text}</span>
    <hr style="flex-grow: 1; border: none; border-top: 2px solid black; border-radius: 2px;" class="fit88">
  `;
  item.style.display = 'flex';
  item.style.alignItems = 'center';
  item.style.textAlign = 'center'; 


if(typeof options === 'object' && !Array.isArray(options)) {
Array.from(document.querySelectorAll('.fit88')).forEach((element) => {
Object.assign(element.style, options);
});
} 
});
}

// Add a floating label effect to input fields, transforming the placeholder into a label that floats above the input when focused or populated.
 floatLabel(options) {
this.catchSet((input) => {
let placeholder = input.getAttribute('placeholder') || '';

const wrapper = document.createElement('div');
wrapper.classList.add('floating-label-wrapper');  
wrapper.style.marginTop = '10px'
  input.parentNode.replaceChild(wrapper, input);
  wrapper.appendChild(input);

  const label = document.createElement('label');
label.classList.add('floating-label'); 

if(typeof options === 'object' && !Array.isArray(options)) {
Object.assign(label.style, options);
label.textContent = options.placeholder !== undefined ? options.placeholder : placeholder;
} else if(typeof options === 'string') {
if(options.startsWith('#')) {
label.id = options.slice(1).trim(); 
label.textContent = placeholder;
} else if(options.startsWith('.')) {
label.classList.add(options.slice(1).trim());label.textContent = placeholder;    
} else {
label.textContent = options;  
label.style.background = 'white';  
}   
} else {
label.textContent = placeholder; 
label.style.background = 'white';
}

 wrapper.appendChild(label);

  input.removeAttribute('placeholder');

  const style = document.createElement('style');
  style.textContent = `
    .floating-label-wrapper {
      position: relative; 
      display: inline-block;
    }

    .floating-label {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      left: 10px;
      transition: all 0.2s ease;
      pointer-events: none;
      font-size: {input.style.fontSize};
      color: ${'gray'};
      background: ${input.style.background === 'white' ? 'white' : input.style.background};           
    }

    .floating-label.float {
      top: 0;
      font-size: 12px;
      color: ${input.style.color};             
    }

    .floating-label-wrapper input {      
      font-size: ${input.style.fontSize};      
    }
  `;
  document.head.appendChild(style);

  input.addEventListener('input', () => {
    if (input.value.trim() !== '') {
      label.classList.add('float');
    } 
  });

  input.addEventListener('focus', () => {
    label.classList.add('float');
  });

  input.addEventListener('blur', () => {
    if (input.value.trim() === '') {
      label.classList.remove('float');
    }
  });
  });
}


detach() {
  const parent = this.catchGet((item) => item.parentNode);
  
  const nextSibling = this.catchGet((item) => item.nextSibling);

  this.catchSet((item) => item.remove());

  return {
    assignTo: (assign) => {
      this.catchSet((item) => assign.append(item));
    },
    restore: () => {
      this.catchSet((item) => {
        if (nextSibling) {        
        try {              
        parent.insertBefore(item, nextSibling);                         
        } catch(err) {
        parent.appendChild(item);       
        }                  
        } else {
        parent.appendChild(item);          
        }
      });
    }
  }
}

// Replaces the text content of an element with asterisks (*) for masking purpose.
asterisk(changeTo = "*", auto) {
  let tag = this.catchGet((item) => ['INPUT', 'TEXTAREA'].includes(item.tagName) ? 'value' : 'textContent');
  const data = this.catchGet((item) => item[tag], 'map');

  if (changeTo && !auto) {
    this.catchSet((item) => {
      if (!item[tag].includes(changeTo)) {
        item.originalData = item[tag];
        item[tag] = item[tag].replace(/./g, changeTo);
      }
    });
    return data;
  } else {
    this.catchSet((item) => {
      if (!item[tag].includes(changeTo)) {
        item.originalData = item[tag];
        item[tag] = item[tag].replace(/./g, changeTo);
      } else {
        item[tag] = item.originalData;
        delete item.originalData;
      }
    });
    return this.catchGet((item) => item[tag].includes(changeTo));
  }
}


loader(loadSpeed, stopLoader, callback = () => {}) {
  const speedDuration = typeof loadSpeed === 'object' ? loadSpeed.speed ?? 1000 : loadSpeed ?? 1000;
  const stopDuration = typeof loadSpeed === 'object' ? loadSpeed.duration ?? 5000 : stopLoader ?? 5000;

  this.catchSet((item) => {
    window.addEventListener('load', () => {
      if (typeof loadSpeed === 'object') {
        Object.assign(item.style, loadSpeed);
        setTimeout(() => {
          item.style.animation = 'none';
          loadSpeed.callback ? loadSpeed.callback(item) : null;
        }, stopDuration);
      } else {
        setTimeout(() => {
          item.style.animation = 'none';
          callback(item);
        }, stopDuration);
      }
    });

    item.innerHTML = '';
    item.style.cssText = `
      width: 40px;
      height: 40px;
      border: 5px solid #f3f3f3;
      border-top: 5px solid #3498db;
      border-radius: 70%;
      animation: spin ${speedDuration / 1000}s linear infinite;
    `;

    const style = document.createElement('style');
    style.innerHTML = `
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    `;
    document.head.appendChild(style);
  });

  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(this.element);
    }, stopDuration);
  });
}


next(selector) {
return this.catchGet((item) => {
  const sibling = item.nextElementSibling;
  if (!sibling) return null;
  if (selector && !sibling.matches(selector)) return null;
  return new jUtils(sibling);  
  });
};

prev(selector) {
return this.catchGet((item) => {
  const sibling = item.previousElementSibling;
  if (!sibling) return null;
  if (selector && !sibling.matches(selector)) return null;
  return new jUtils(sibling);
  });
};


windowEvent(eventType, callback, loop) {
if(loop) {
return eventType === 'offline' ? !navigator.onLine : navigator.onLine;
} else {
window.addEventListener(eventType, callback); 
}  
}


status(callback) {
if(arguments.length === 1) {
if(typeof callback === 'function') {  
this.windowEvent(this.element, callback);
} else {
this.windowEvent(this.element, callback, true);    
}    
}
}


// Check if element has a character and return the length 
countOccurrences(char) {
  const str = typeof this.element === 'string' ? this.element : this.element.toString();  
  
  
  // Escape special regex characters
  const escapedChar = char.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regex = new RegExp(escapedChar, 'g');
    
    return (str.match(regex) || []).length;        
}



// limit html input characters length 
enforceCharLimit(limit, callback = () => {}) {
this.catchSet((item) => {
  let property;
  if (item.tagName !== 'INPUT' && this.element.tagName !== 'TEXTAREA') {
    property = 'textContent';
  } else {
    property = 'value';
  }
  
if(limit !== undefined) {
    item.addEventListener('input', () => {
      const conth = item[property];
      item.setAttribute('yfds', conth.length);
      if (conth.length >= limit) {
      item[property] = conth.slice(0, limit);
   callback (item[property].length, item);      
      }    
    });
  }  
  
  });
}


// Replace characters not in the specified set with a given replacement.
retainChars(charsToKeep, replacement, global) {

  const regex = new RegExp(`[^${charsToKeep}]`, global !== undefined ? 'g' : '');
return this.element.toString().replace(regex, replacement);
}


// Count the number of characters in the string based on the specified type.
countCharsByType(type) {
  const str = this.element;   
const types = {
    upper: (str.match(/[A-Z]/g) || []).length,
    uppercase: (str.match(/[A-Z]/g) || []).length,
    lower: (str.match(/[a-z]/g) || []).length,
    lowercase: (str.match(/[a-z]/g) || []).length,    
    emoji: (str.match(/\p{Extended_Pictographic}/gu) || []).length,
    special: (str.match(/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>?]/g) || []).length,
    specialcharacter: (str.match(/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>?]/g) || []).length,
    number: (str.match(/[0-9]/g) || []).length,  
    num: (str.match(/[0-9]/g) || []).length,   
    alpha: (str.match(/[a-zA-Z]/g) || []).length,
    alphabet: (str.match(/[a-zA-Z]/g) || []).length
}  

const err = () => {
throw new Error(`Invalid character type specified "${type}"`);                 
}
     
return types[type] ? types[type] : err();
}





// Filter and return characters from the string based on specified criteria.
cleanString(...filters) { 
  const filterFunctions = {
    emoji: (c) => /[\p{Extended_Pictographic}\u200d]/u.test(c),
    number: (c) => /[0-9]/.test(c),
    num: (c) => /[0-9]/.test(c),
    lowercase: (c) => /[a-z]/.test(c),
    lower: (c) => /[a-z]/.test(c),
    uppercase: (c) => /[A-Z]/.test(c),
    upper: (c) => /[A-Z]/.test(c),
    alphabet: (c) => /[a-zA-Z]/.test(c),
    alpha: (c) => /[a-zA-Z]/.test(c),
    special: (s) => s.replace(/[a-zA-Z0-9\p{Extended_Pictographic}\u200d\s]/gu, ''),
    specialcharacter: (s) => s.replace(/[a-zA-Z0-9\p{Extended_Pictographic}\u200d\s]/gu, ''),
  };

  let result = '';  
try {        
  for (const char of this.element) {
    if (filters.some((filter) => filterFunctions[filter](char))) {
      result += char;
    }
  }
} catch {
 throw new TypeError(`${filters} is not a valid selector`);
}

  return result;
} 



// Remove specified character types from the string.
filterString(...filters) {
  const filterFunctions = {
    emoji: (s) => s.replace(/[\p{Extended_Pictographic}\u200d]+/gu, ''),
    number: (s) => s.replace(/[0-9]/g, ''),
    num: (s) => s.replace(/[0-9]/g, ''),
    lowercase: (s) => s.replace(/[a-z]/g, ''),
    lower: (s) => s.replace(/[a-z]/g, ''),
    uppercase: (s) => s.replace(/[A-Z]/g, ''),
    upper: (s) => s.replace(/[A-Z]/g, ''),
    alphabet: (s) => s.replace(/[a-zA-Z]/g, ''),    
    alpha: (s) => s.replace(/[a-zA-Z]/g, ''),    
    special: (s) => s.replace(/[^a-zA-Z0-9\p{Extended_Pictographic}\u200d\s]/gu, ''),
    specialcharacter: (s) => s.replace(/[^a-zA-Z0-9\p{Extended_Pictographic}\u200d\s]/gu, ''),
  };

  let result = this.element.toString();
  try {
  filters.forEach((filter) => {
    if (!filterFunctions[filter]) {
      throw new Error(`Invalid filter: ${filter}`);
    }
    result = filterFunctions[filter](result);
  });
} catch {
    throw new TypeError(`${filters} is not a valid selector`);
}
  return result;
}


// Insert a character at a specified position in the string.
// The position can be a numeric index or a substring to find its location.
insertCharAt(char, position) {
  let index;
  if (typeof position === 'number') {
    index = position - 1;
  } else {
    index = this.element.indexOf(position);
    if (index === -1) {
      throw new Error('Position string not found');
    }
  }  
 return this.element.slice(0, index + (typeof position === 'number' ? 1 : position.length)) + char + this.element.slice(index + (typeof position === 'number' ? 1 : position.length)); 
}


// change input type "password" to text or vice versa(password)  / or set 
inputType(type) {
return this.catchGet((item) => {
  if (type === undefined) {
    return item.type;
  } else if(type === true) {
item.type = item.type === 'password' ? 'text' : 'password';          
  } else {
item.type = type;          
  } 
  }, 'map');
}


 addLoadEffect(duration = 5000, callback = () => {}) {
  this.catchSet((item) => {
    item.classList.add('loading89');
    setTimeout(() => {
      item.classList.remove('loading89');
      callback(item);
    }, duration);
  });

  const style = document.createElement('style');
  style.textContent = `
    .loading89 {
      color: transparent;
      text-shadow: 0 0 15px rgba(0, 0, 0, 1);
      animation: loading89 1.5s infinite;             
    }
    @keyframes loading89 {
      0% {
        text-shadow: 0 0 15px rgba(0, 0, 0, 1);
      }
      50% {
        text-shadow: 0 0 8px rgba(0, 0, 0, 0.5);
      }
      100% {
        text-shadow: 0 0 15px rgba(0, 0, 0, 1);
      }
    }
  `;
  document.head.appendChild(style);
  
  return new Promise((resolve) => {
  setTimeout(() => {      
      resolve(this.element);
    }, duration);  
  });
}





}




$.ascend = function(array, keyFunction = x => x) {
  return array.sort((a, b) => {
    const aValue = keyFunction(a);
    const bValue = keyFunction(b);
    if (aValue instanceof Date && bValue instanceof Date) {
      return aValue - bValue;
    }
    return String(aValue).localeCompare(String(bValue));
  });
};


$.descend = function(array, keyFunction = x => x) {
  return array.sort((a, b) => {
    const aValue = keyFunction(a);
    const bValue = keyFunction(b);
    if (aValue instanceof Date && bValue instanceof Date) {
      return bValue - aValue;
    }
    return String(bValue).localeCompare(String(aValue));
  });
};


// generate random array 
$.randArr = function(array) {
    return array[Math.floor(Math.random() * array.length)];
  }


// to fixed
$.fixed = function(value, length = 2) {
return Number(value).toFixed(length);  
}

// to string 
$.str = function(element) {
return element.toString(); 
}


// to uppercase 
$.upper = function(element) {
return element.toUpperCase(); 
}


// to lowercase 
$.lower = function(element) {
return element.toLowerCase();  
}


// parseInt 
$.int = function(element) {
return parseInt(element); 
}


// parseFloat 
$.float = function(element) {
return parseFloat(element);
}

// Toggle the case of the string (uppercase becomes lowercase, and vice versa)
$.swapCase = function(value) {
return value === value.toUpperCase() ? value.toLowerCase() : value.toUpperCase();    
}  
  
  
// JSON.stringify function 
$.json = function(content) {
  return JSON.stringify(content);
}


// JSON.parse function 
$.parse = function(content) {
return JSON.parse(content);     
}


// custom alert function 
let alrs = 0;
$.alert = function(text = '', btn1 = 'OK') {
return new Promise((resolve, reject) => {
  const currentId = alrs++;
  const div = document.createElement('div');
  div.innerHTML = `
    <div style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: rgba(0, 0, 0, 0.5); z-index: ${999 - alrs + currentId}; display: flex; justify-content: center; align-items: center; border-radius: 0px; color: black;" id="backdrop-${currentId}">
      <div id="ralert-${currentId}" style="padding: 10px; border-radius: 0px; background: #fff; border: 1px solid #ddd; width: 80%; max-width: 500px; min-height: 150px; max-height: calc(100vh - 90px); max-width: 500px; z-index: ${1000 - alrs + currentId}; display: flex; flex-direction: column; color: black;">
        <div style="margin-top: -5px; flex-grow: 1; overflow-y: auto; margin-bottom: 10px; overflow-y: auto; background: white; color: black; padding-right: 10px;" id="page-${currentId}">${text}</div>
  
  <div style="justify-content: right; padding-top: 15px; padding-bottom: 10px; background: white; color: black; display: flex; box-shadow: 0 5px 5px -5px rgba(0, 0, 0, 0.2) inset;">      
        <button id="btn1-${currentId}" style="border: none; background: white; font-weight: bold; color: black;">${btn1}</button>
      </div>
    </div>
    </div>
  `;
  document.body.append(div);
  document.getElementById(`btn1-${currentId}`).onclick = function () {
  resolve(true);
    div.remove();
  }
  document.addEventListener('click', (event) => {
    if(event.target.id === `backdrop-${currentId}`) {
      div.remove();
    }
  })
  })
}


 // custom confirm function 
let conrs= 0;
$.confirm = function(text = '', btn1 = 'CANCEL', btn2 = 'OK') {
  return new Promise((resolve, reject) => {
    const currentId = conrs++;
    const div = document.createElement('div');
    div.innerHTML = `
      <div style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: rgba(0, 0, 0, 0.5); z-index: ${999 - conrs + currentId}; display: flex; justify-content: center; align-items: center; border-radius: 0px; color: black;" id="backdrop-${currentId}">
        <div id="rconfirm-${currentId}" style="padding: 10px; border-radius: 0px; background: #fff; border: 1px solid #ddd; width: 80%; max-width: 500px; min-height: 150px; max-height: calc(100vh - 90px); max-width: 500px; z-index: ${1000 - conrs + currentId}; display: flex; flex-direction: column; color: black;">
            
          <div style="flex-grow: 1; overflow-y: auto; margin-bottom: 10px; background: white; color: black; padding-right: 10px;" id="page1-${currentId}">${text}</div>
          <div style="justify-content: right; padding-top: 15px; padding-bottom: 10px; background: white; color: black; display: flex; box-shadow: 0 5px 5px -5px rgba(0, 0, 0, 0.2) inset;">
            <button id="btn1-${currentId}" style="border: none; background: white; font-weight: bold; color: black; margin-right: 10px;">${btn1}</button>
            <button id="btn2-${currentId}" style="border: none; background: white; font-weight: bold; color: black;">${btn2}</button>
          </div>
        </div>
      </div>
    `;
    document.body.append(div);
    document.getElementById(`btn1-${currentId}`).onclick = function () {
      resolve({ value: 'false', text: document.getElementById(`page1-${currentId}`).textContent,
          action: false });
      div.remove()
    }
    document.getElementById(`btn2-${currentId}`).onclick = function () {
      resolve({ value: 'true', text: document.getElementById(`page1-${currentId}`).textContent,
          action: true });
      div.remove()
    }
    document.addEventListener('click', (event) => {
      if(event.target.id === `backdrop-${currentId}`) {
        div.remove();
      }
    })
  })
}


// custom prompt function 
let promyr = 0;
$.prompt = function(text = '', btn1 = 'CANCEL', btn2 = 'OK') {
  return new Promise((resolve, reject) => {
    const currentId = promyr++;
    const div = document.createElement('div');
    div.innerHTML = `
      <div style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: rgba(0, 0, 0, 0.5); z-index: ${999 - promyr + currentId}; display: flex; justify-content: center; align-items: center; border-radius: 0px; color: black;" id="backdrop-${currentId}">
        <div id="rprompt-${currentId}" style="padding: 10px; border-radius: 0px; background: #fff; border: 1px solid #ddd; width: 80%; max-width: 500px; min-height: 150px; max-height: calc(100vh - 90px); z-index: ${1000 - promyr + currentId}; display: flex; flex-direction: column; color: black;">
          <div style="flex-grow: 1; overflow-y: auto; margin-bottom: 10px; background: white; color: black; padding-right: 10px;" id="pages-${currentId}">${text}</div>
          <input id="test-${currentId}" type="text" style="outline: none; border: none; border-bottom: 2px solid black; width: 100%; background: white; color: black; padding: 5px 0;">
  <div style="display: flex; justify-content: space-between; padding-bottom: 10px; padding-top: 15px; background: white; color: black;">      
          <button id="btn1-${currentId}" style="border: none; background: white; font-weight: bold; color: black;">${btn1}</button>
          <button id="btn2-${currentId}" style="border: none; border: none; background: white; font-weight: bold; color: black;">${btn2}</button>
        </div>
      </div>
      </div>
    `;
    document.body.append(div);
    document.getElementById(`btn1-${currentId}`).onclick = function () {
      resolve({ value: 'null', text: document.getElementById(`pages-${currentId}`).textContent,
          action: false });
      div.remove()
    }
    document.getElementById(`btn2-${currentId}`).onclick = function () {
      resolve({ value: document.getElementById(`test-${currentId}`).value, text: document.getElementById(`pages-${currentId}`).textContent,
         action: true });
      div.remove()
    }
    document.addEventListener('click', (event) => {
      if(event.target.id === `backdrop-${currentId}`) {
        div.remove();
      }
    })
    document.getElementById(`test-${currentId}`).focus();
  })
}


// generate random number  
$.randInt = function(min, max) {
  if(min !== undefined && max === undefined) {
return Math.floor(Math.random() * min);    
  } else if(min !== undefined && max !== undefined) {
return Math.floor(Math.random() * (max - min + 1)) + min;      
  } else {
 return null;
  } 
}     


// generate random alphabet 
$.randAlpha = function(length, options = {}) {
  const optionMap = {
    upper: 'uppercase',
    lower: 'lowercase',
  };

  if (typeof options === 'string') {
    options = { [optionMap[options]]: true };
  }

  let alphabets = '';
  if (options.uppercase || options.upper) alphabets += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  if (options.lowercase || options.lower) alphabets += 'abcdefghijklmnopqrstuvwxyz';
  if (!options.uppercase && !options.lowercase && !options.lower && !options.upper) alphabets = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';

  let randomString = '';
  for (let i = 0; i < length; i++) {
    randomString += alphabets.charAt(Math.floor(Math.random() * alphabets.length));
  }
  return randomString;
};


$.getMonthName = function(...args) {
  if (args.length > 3) {
    throw new Error('Too many arguments. Expected at most 3 arguments (date, format, and type).');
  }

  let myDate = new Date();
  let format = 'en-US';
  let type = 'long';

  args.forEach(arg => {
    if (arg instanceof Date && !isNaN(arg.getTime())) {
      myDate = arg;
    } else if (typeof arg === 'string' && arg.includes('-')) {
      format = arg;
    } else if (['long', 'short'].includes(arg)) {
      type = arg;
    } else {
      throw new Error(`Invalid argument: ${arg}. Expected a Date object, a format string, or a type ('long' or 'short').`);
    }
  });

  return myDate.toLocaleString(format, { month: type });
};


$.getWeekName = function(...args) {
  if (args.length > 3) {
    throw new Error('Too many arguments. Expected at most 3 arguments (date, format, and type).');
  }

  let myDate = new Date();
  let format = 'en-US';
  let type = 'long';

  args.forEach(arg => {
    if (arg instanceof Date && !isNaN(arg.getTime())) {
      myDate = arg;
    } else if (typeof arg === 'string' && arg.includes('-')) {
      format = arg;
    } else if (['long', 'short'].includes(arg)) {
      type = arg;
    } else {
      throw new Error(`Invalid argument: ${arg}. Expected a Date object, a format string, or a type ('long' or 'short').`);
    }
  });

  return myDate.toLocaleString(format, { weekday: type });
};


/* checking if a value is set not empty */
$.isset = function(calue) {
  return value !== null && typeof value !== 'undefined';
}


/* checking if a value is empty not set */
$.empty = function(value) {
  if (arguments.length !== 1) {
    throw new RangeError('empty() requires exactly 1 argument!');
  }

  return (
    value === null ||
    value === undefined ||
    (typeof value === 'object' && Object.keys(value).length === 0) ||
    (typeof value === 'string' && value.trim() === '') ||
    (typeof value === 'number' && isNaN(value)) ||
    (Array.isArray(value) && value.length === 0)
  );
}


/* Get typeof data strictly for array checking */
$.type = function(value, type) {
  if (value !== undefined && type === undefined) {
    return Array.isArray(value) ? 'array' : typeof value;
  } else if (value !== undefined && type !== undefined) {
    return (type === 'array' && Array.isArray(value)) || typeof value === type;
  } else {
    return null;
  }
}


/* Parse date string into a timestamp, handling both standard date formats and numeric strings */
$.parseDate = function(date) {
  let dateValue = Date.parse(date);
  if (isNaN(dateValue)) {
   dateValue = parseInt(date.toString().replace(/\D/g, ''));
     if (isNaN(dateValue)) {
   dateValue = null;  
     }
  }
  return dateValue;
}


// send to server "METHOD: GET"
 $.queryString = function(...args) {
    if (args.length % 2 !== 0) {
        throw new Error('Number of arguments must be even');
    }

    if (args.length > 100) {
        throw new Error('Number of arguments exceeds 100');
    }

    const pairs = [];

    for (let i = 0; i < args.length; i += 2) {
        const key = args[i];
        const value = args[i + 1];
        pairs.push(`${key}=${value}`);
    }

    return pairs.join('&');
}


// reload current page on optional duration 
$.reload = function(ms) {
   if(ms === undefined) {
    location.reload();       
   } else {
const timeoutId = setTimeout(() => {
   location.reload();    
  }, ms);
   return timeoutId;     
   } 
}


// redirect to specify url on optional duration 
$.redirect = function(url, ms) {
   if(url !== undefined && ms === undefined) {   
   window.location.href = url;      
   } else {
  const timeoutId = setTimeout(() => {
   window.location.href = url;       
  }, ms);
  return timeoutId; 
   } 
}


// setTimeout 
$.timeout = function(callback, ms = 0) {
if(callback !== undefined && ms === undefined) {
clearTimeout(callback);     
} else if(callback !== undefined && ms !== undefined) {
if(typeof callback === 'function' && !isNaN(ms)) {  
return setTimeout(callback, ms);
} else if(typeof ms === 'function' && !isNaN(callback)) {  
return setTimeout(ms, callback);
} else {
setTimeout(() => {
  clearTimeout(callback);     
}, ms);         
}    
} else {
throw new Error("Invalid arguments");
}
}



// setInterval 
$.interval = function(callback, ms = 0) {
if(callback !== undefined && ms === undefined) {
clearInterval(callback);     
} else if(callback !== undefined && ms !== undefined) {
if(typeof callback === 'function' && !isNaN(ms)) {  
return setInterval(callback, ms);
} else if(typeof ms === 'function' && !isNaN(callback)) {  
return setInterval(ms, callback);
} else {
setTimeout(() => {
  clearInterval(callback);     
}, ms);         
}    
} else {
throw new Error("Invalid arguments");
}
}


// localStorage API 
$.storage = function(key, value) {
if(key === undefined) {
return localStorage;      
} else if(key !== undefined && value === undefined) {
if(key === ':CLEAR:' || key === ':clear:') {
localStorage.clear();            
} 
return localStorage.getItem(key);
} else {
if(value !== ':REMOVE:' && value !== ':remove:' && key !== ':REMOVE:' && key !== ':remove:') {
localStorage.setItem(key, value);
return;   
 } else {
localStorage.removeItem(key !== ':REMOVE:' && key !== ':remove:' ? key : value);       
 }   
}
}


// sessionStorage API 
$.session = function(key, value) {
if(key === undefined) {
return sessionStorage;      
} else if(key !== undefined && value === undefined) {
if(key === ':CLEAR:' || key === ':clear:') {
sessionStorage.clear();            
} 
return sessionStorage.getItem(key);
} else {
if(value !== ':REMOVE:' && value !== ':remove:' && key !== ':REMOVE:' && key !== ':remove:') {
sessionStorage.setItem(key, value);
return;   
 } else {
sessionStorage.removeItem(key !== ':REMOVE:' && key !== ':remove:' ? key : value);       
 }   
}
}





/* Retrieve or store data in local storage under the given key */  
$.dataStore = function(key, ...data) {
   if (key !== undefined && data !== undefined) {
    if (typeof data === 'object' || Array.isArray(data)) { 
  const history = JSON.parse(localStorage.getItem(key)) || [];    
 if (!Array.isArray(history)) {
        history = [history];
      }
   history.push(...data);   
 localStorage.setItem(key, JSON.stringify(history));        
    } else {
  throw new Error(`Invalid typeof data "${typeof data}" $.dataStore expect either "object" or "array"`);    
    }
    }
let history = JSON.parse(localStorage.getItem(key)) || [];

if (!Array.isArray(history)) {
        history = [history];
    }

// Retrieves the value of a specific key from the last item that has it
let lastItemWithNam;
history.get = (keyName) => {
history.forEach((item, index) => {
  if (item[keyName] !== undefined) {
    lastItemWithNam = item[keyName];    
  }
});
return lastItemWithNam || 0;  
}

// Counts the number of items that have a specific key 
let count = 0;
history.count = (keyName) => {
if(keyName) {
history.forEach((item, index) => {
 if (item[keyName] !== undefined) {
    count++;
    }
}); 
} else {
history.forEach((item, index) => {
count++
});
}
return count;  
}

// Removes the stored data entirely
history.empty = () => {
    localStorage.removeItem(key);  
    history = [];
}

// Deletes a specific key from either all items or the last item that has it
let toDeleteIndex;    
history.delete = (keyName, all = false) => {
if(all) {
history.forEach((item, index) => {
if(item[keyName] !== undefined) {
delete history[index][keyName];
}
});
} else {
history.forEach((item, index) => {
if(item[keyName] !== undefined) {
toDeleteIndex = index;  
}  
});
delete history[toDeleteIndex][keyName];
}
localStorage.setItem(key, JSON.stringify(history));   
}

// Adds new data to the history array
history.set = (...data) => {
history.push(...data);
   localStorage.setItem(key, JSON.stringify(history));   
}

return history;    
}


$.request = function(url = 'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd', dataType = 'json') {
return async () => {
      if (window.fetch) {
        try {
          const response = await fetch(url);
          if (!response.ok) throw new Error('Network response was not ok');
          await response[dataType]();
          return true;
        } catch {
          return false;
        }
      } else {
        return new Promise((resolve) => {
          const xhr = new XMLHttpRequest();
          xhr.open('GET', url, true);
          xhr.responseType = dataType;
          xhr.onload = function() {
            if (xhr.status >= 200 && xhr.status < 300) {
              resolve(true);
            } else {
              resolve(false);
            }
          };
          xhr.onerror = function() {
            resolve(false);
          };
          xhr.send();
        });
      }
    };    
}


$.conn = function(hold, callback) {
hold().then((hasConnection) => {
      callback(hasConnection);
    });    
}


// chain multiple promise at once
$.when = function(...promises) {
  const promise = Promise.all([...promises]);
  const deferred = {
    done: (cb) => { deferred._done = cb; return deferred; },
    fail: (cb) => { deferred._fail = cb; return deferred; },
    always: (cb) => { deferred._always = cb; return deferred; }
  };

  const handleResults = (cb, results) => {
    // Handle both (a, b) and ([a, b]) syntax
    if (cb.length === results.length) {
      return cb(...results);
    } else {
      return cb(results);
    }
  };

  promise.then((results) => {
    if (deferred._done) handleResults(deferred._done, results);
    if (deferred._always) deferred._always();
  })
  .catch((err) => {
    if (deferred._fail) deferred._fail(err);
    if (deferred._always) deferred._always();
  });

  // Make deferred a thenable (like a promise)
  deferred.then = (onFulfilled, onRejected) => {
    return promise.then((results) => handleResults(onFulfilled, results), onRejected);
  };
  deferred.catch = promise.catch.bind(promise);
  deferred.finally = promise.finally.bind(promise);

  return deferred;
}  


// Makes an AJAX request to a server. 
  $.ajax = function(options = {}) {
  // Validate URL
  if (!options.url || options.url.trim() === "") {
    throw new Error("Url is required");
  }

  const urlRegex = /^(?:https?:\/\/)?[a-zA-Z0-9.-]+\.[a-zA-Z0-9]{2,}(:[0-9]+)?(\/.*)?$/;
  if (!urlRegex.test(options.url)) {
    throw new Error("Invalid Url");
  }

  // Prepare URL and data
  const methods = (options.type || 'GET').toUpperCase();
  let myUrl = options.url;
  let myData = null;

  if (methods === 'GET' && options.data) {
    if (typeof options.data === 'object') {
      const params = new URLSearchParams(options.data).toString();
      myUrl = `${options.url}?${params}`;
    } else if (typeof options.data === 'string') {
      myUrl = options.url + '?' + options.data;
    }
  } else if (methods !== 'GET' && options.data) {
    myData = options.data;
  }

  // Merge options with default Fetch API options
  const fetchOptions = {
    method: methods,
    body: myData,
    headers: {},
    ...options
  };

  // Set headers
  if (options.headers) {
    // Use headers if defined
    Object.keys(options.headers).forEach(key => {
      fetchOptions.headers[key] = options.headers[key];
    });
  } else {
    // Set Content-Type using contentType and headerValue
    if (myData instanceof FormData) {
      delete fetchOptions.headers['Content-Type']; // Let the browser set it      
    } else {
      fetchOptions.headers[options.contentType || 'Content-Type'] = options.headerValue || 'application/octet-stream';
    }
  }

  const promise = new Promise((resolve, reject) => {
    if (window.fetch) {
      fetch(myUrl, fetchOptions)
        .then(response => {
          if (!response.ok) {
            options.status && options.status('NOT OK ' + response.statusText);
            throw new Error('Response not OK');
          }
          return response[options.dataType || 'text'](); // Use specified dataType
        })
        .then(data => {
          resolve(data); // Directly resolve the data
          options.success && options.success(data);
        })
        .catch(err => {
          reject(err);
          options.error && options.error(err);
        })
        .finally(() => options.complete && options.complete());
    } else {
      const httpRequest = new XMLHttpRequest();
      httpRequest.open(methods, myUrl, options.async || true);

      // Set headers for XMLHttpRequest
      if (options.headers) {
        Object.keys(options.headers).forEach(key => {
          httpRequest.setRequestHeader(key, options.headers[key]);
        });
      } else {
        // Set Content-Type using contentType and headerValue
        if (!(myData instanceof FormData)) {
          httpRequest.setRequestHeader(options.contentType || 'Content-Type', options.headerValue || 'application/json');
        }
      }

      // Set responseType to control the type of data returned
      httpRequest.responseType = options.dataType || 'text';

      httpRequest.onload = () => {
        if (httpRequest.status >= 200 && httpRequest.status < 300) {
          resolve(httpRequest.response); // Resolve the response directly
          options.success && options.success(httpRequest.response);
        } else {
          options.status && options.status(`NOT OK ${httpRequest.statusText}`);
          reject(httpRequest.statusText);
        }
        options.complete && options.complete();
      };

      httpRequest.onerror = () => {
        options.error && options.error(`Error: ${httpRequest.statusText}`);
        reject(`Error: ${httpRequest.statusText}`);
        options.complete && options.complete();
      };

      httpRequest.send(myData);
    }
  });

  promise.done = function(callback) {
    promise.then(callback);
    return promise;
  };

  promise.fail = function(callback) {
    promise.catch(callback);
    return promise;
  };

  promise.always = function(callback) {
    promise.finally(callback);
    return promise;
  };

  return promise;
};



// validate email
$.validateEmail = function(email) {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email.trim()) && email.length <= 254;
}         


$.validateUrl = function(url) {
  const urlRegex = /^(?:https?:\/\/)?[a-zA-Z0-9.-]+\.[a-zA-Z0-9]{2,}(:[0-9]+)?(\/.*)?$/;
  return urlRegex.test(url)
}


// Converts time strings to milliseconds and returns the total. 
 $.msSum = function(...args) {
  let totalMs = 0;
  const conversions = {
    y: 31536000000, // 1 year in ms (approx.)
    year: 31536000000, // 1 year in ms (approx.)
    M: 2592000000, // 1 month in ms (approx.)
    month: 2592000000, // 1 month in ms (approx.)
    w: 604800000, // 1 week in ms
    week: 604800000, // 1 week in ms
    d: 86400000, // 1 day in ms
    day: 86400000, // 1 day in ms
    h: 3600000, // 1 hour in ms
    hour: 3600000, // 1 hour in ms   
    m: 60000, // 1 minute in ms
    min: 60000, // 1 minute in ms
    minute: 60000, // 1 minute in ms
    s: 1000, // 1 second in ms
    sec: 1000, // 1 second in ms
    second: 1000, // 1 second in ms
    ms: 1 // 1 millisecond in ms
  };

  args.forEach(arg => {
    const match = arg.match(/(\d+)(y|M|w|d|h|m|s|ms|year|month|week|day|hour|min|minute|sec|second)/i);
    if (match) {
      const value = parseInt(match[1]);
      const unit = match[2].toLowerCase();
      totalMs += value * conversions[unit];
    } else {
      // Handle invalid input
      // You can throw an error or return an error message
      throw new Error(`Invalid input: ${arg}`);
    }
  });

  return totalMs;
}



/* Calculates a future or past date by adding the specified milliseconds to the current date. */
$.shiftDate = function(ms, back) {
  // Get current date
  const date = new Date();
  
  // Determine whether to add or subtract milliseconds
  const multiplier = back ? -1 : 1;
  
  // Return new date with added or subtracted milliseconds
  return new Date(date.getTime() + (ms * multiplier));
}



// Object assign function logic 
$.extend = function(target, ...args) {
  return Object.assign(target, ...args); 
}


// hash a string 
$.hash = function(value, pin = '') {
  let hash = '';
  let offset = 0;
  if (pin) {
    offset = pin.toString().split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  }
  for (let i = 0; i < value.length; i++) {
    const charCode = value.charCodeAt(i);
    const hashedChar = String.fromCharCode(charCode + (i % 10) * (pin ? pin.length : 1) + offset);
    hash += hashedChar;
  }
  return hash;
}


// unhash a string
$.unhash = function(value, pin = '') {
  let unHash = '';
  let offset = 0;
  if (pin) {
    offset = pin.toString().split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  }
  for (let i = 0; i < value.length; i++) {
    const charCode = value.charCodeAt(i);
    const unHashedChar = String.fromCharCode(charCode - (i % 10) * (pin ? pin.length : 1) - offset);
    unHash += unHashedChar;
  }
  return unHash;
}



// custom formData() utility function 
$.formData = function(...args) {
  const formData = new FormData();

  // Check if the first argument is an object
  if (args.length === 1 && typeof args[0] === 'object' && args[0] !== null) {
    const data = args[0];
    Object.keys(data).forEach((key) => {
      const value = data[key];
      if (value instanceof File) {
        formData.append(key, value);
      } else if (Array.isArray(value)) {
        value.forEach((item, index) => {
          formData.append(`${key}[${index}]`, item);
        });
      } else {
        formData.append(key, value);
      }
    });
  } else {
    // Handle key-value pairs
    for (let i = 0; i < args.length; i += 2) {
      const key = args[i];
      const value = args[i + 1];
      if (value instanceof File) {
        formData.append(key, value);
      } else {
        formData.append(key, value);
      }
    }
  }
  return formData;
};



$.params = function(options) {
  try {
    return new URLSearchParams(options);
  } catch (err) {
    throw new Error(`Failed to create URLSearchParams: ${err.message}`);
  }
}



$.pushstate = function(flag, title, options) {
if(options === undefined) {
if(typeof title === 'object') {
window.history.pushState(title, '', flag);
} else {
window.history.pushState({}, '', flag); 
document.title = title || document.title;       
}
} else {
window.history.pushState(options, '', flag);
document.title = title || document.title;       
}
 }
 

// manipulate window location 
$.url = function(flag, url) {
  if (typeof flag !== 'string' || !['href', 'pathname', 'search', 'hash', 'origin'].includes(flag)) {
    throw new Error(`Unsupported flag: ${flag}. Must be one of 'href', 'pathname', 'search', 'hash', or 'origin'.`);
  }
  if (url !== undefined) {
    if (typeof url !== 'string') {
      throw new Error('Invalid url. Must be a string.');
    }
    if (flag === 'search' && !url.startsWith('?')) {
      url = '?' + url;
    } else if (flag === 'hash' && !url.startsWith('#')) {
      url = '#' + url;
    }
    window.location[flag] = url;
    return true;
  } else {
    return window.location[flag];
  }
}


$.date = function(date = new Date()) {
  return {   
    custom(value) {
      if (value !== undefined) {
        date = new Date(value.toString());
        return $.date(date);
      } else {
        throw new Error('custom() required a valid date parameter');
      }
    },
    year(value) {
      if (value !== undefined) {
        date.setFullYear(value);
        return $.date(date);
      } else {
        return date.getFullYear();
      }
    },
    month(value) {
      if (value !== undefined) {
        date.setMonth(value);
        return $.date(date);
      } else {
        return date.getMonth();
      }
    },
    date(value) {
      if (value !== undefined) {
        date.setDate(value);
        return $.date(date);
      } else {
        return date.getDate();
      }
    },
    day(value) {
      if (value !== undefined) {
        date.setDate(date.getDate() + (value - date.getDay()) + 1);
        return $.date(date);
      } else {
        return date.getDay();
      }
    },
    hours(value) {
      if (value !== undefined) {
        date.setHours(value);
        return $.date(date);
      } else {
        return date.getHours();
      }
    },
    minutes(value) {
      if (value !== undefined) {
        date.setMinutes(value);
        return $.date(date);
      } else {
        return date.getMinutes();
      }
    },
    seconds(value) {
      if (value !== undefined) {
        date.setSeconds(value);
        return $.date(date);
      } else {
        return date.getSeconds();
      }
    },
    ms(value) {
      if (value !== undefined) {
        date.setMilliseconds(value);
        return $.date(date);
      } else {
        return date.getMilliseconds();
      }
    },
    time(value) {
      if (value !== undefined) {
        date.setTime(value);
        return $.date(date);
      } else {
        return date.getTime();
      }
    },
    locale() {
      return date.toLocaleString();
    },
    localeTime() {
      return date.toLocaleTimeString();
    },
    localeDate() {
      return date.toLocaleDateString();
    },
    result() {
      return date;
    },      
    }         
}


/**
 * Sends an email using EmailJS.
 *
 * @param {Object} options - Options for the email.
 * @param {string} options.publicKey - Public key for EmailJS.
 * @param {string} options.serviceId - Service ID for EmailJS.
 * @param {string} options.templateId - Template ID for EmailJS.
 * @param {number} [options.version=4] - Version of EmailJS to use.
 * @param {string} [options.url='https://cdn.jsdelivr.net/npm/@emailjs/browser@'] - URL of the EmailJS CDN.
 * @param {Function} [options.success] - Callback function for success.
 * @param {Function} [options.error] - Callback function for error.
 * @param {HTMLElement} options.template - Template element to send.
 */
$.emailJs = function(options) {
  const defaults = {
    publicKey: 'YOUR_PUBLIC_KEY',
    serviceId: 'YOUR_SERVICE_ID',
    templateId: 'YOUR_TEMPLATE_ID',
    version: 4,
    url: null,
    success: () => {},
    error: () => {},
    template: null,
  };

  const settings = Object.assign({}, defaults, options);

  const script = document.createElement('script');
if(settings.url) {
script.src = settings.url;    
} else {
script.src = `https://cdn.jsdelivr.net/npm/@emailjs/browser@${settings.version}/dist/email.min.js`;    
}      

  script.onload = () => {
    emailjs.init(settings.publicKey);
    emailjs.sendForm(settings.serviceId, settings.templateId, settings.content)
      .then((data) => {
     settings.success(data);
      }, (err) => {
     settings.error(err);
      });
  };

  document.head.appendChild(script);
};




// send email programmically to user
$.brevo = function(options = {}) {
const requiredProperties = ['apiKey', 'senderEmail', 'recipientEmail', 'subject', 'content'];
  requiredProperties.forEach((property) => {
    if (!options[property]) {
      throw new Error(`Missing required property: ${property}`);
    }
  });

const url = options.url || `https://api.brevo.com/v${options.version || 3}/smtp/email`; 
const data = {
sender: {
name: options.senderName,
email: options.senderEmail
 },
 to: [
 {
     email: options.recipientEmail,
     name: options.recipientName
   }
 ],
 
 subject: options.subject,
 htmlContent: options.content 
}

fetch(url, {
method: 'POST',
headers: {
accept: 'application/json',
'api-key': options.apiKey,
'content-type': 'application/json'
},
body: JSON.stringify(data)  
})  
.then(response => response.json())   
.then(data => {
    options.success(data);
})   
.catch(err => {
    options.error(err);
})    
}
