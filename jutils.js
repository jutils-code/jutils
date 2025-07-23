/** 
* The Jutils foundation 
* Version: v1.0.0
* Date: 22-07-2025
 **/


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


/* Get typeof data strictly for array checking */
$.type = function(value, type) {
  if (type === undefined) {
    return Array.isArray(value) ? 'array' : typeof value;
  } else if (arguments.length === 2) {
    return (type === 'array' && Array.isArray(value)) || typeof value === type;
  } else {
    throw new RangeError('$.type() requires 1 or 2 arguments!');
  }
}
 

/* checking if a value is set not empty */
$.isset = function(element) {
  return element !== null && typeof element !== 'undefined';
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


/* Dom manipulation function class */
class myJutils {
 constructor(element, all) {  
  if (all) {
    try {
      this.element = document.querySelectorAll(element);
      this.check = element;
    } catch {
      this.element = element;
      this.check = element;
    }
  } else {
    try {
      if (typeof element === 'string' && element.trim().startsWith('<') && element.trim().endsWith('>') && element.trim().length >= 3) {  
   const tyrs = document.createElement('div');
        tyrs.innerHTML = element;         
    return new myJutils(tyrs);   
      } else if (typeof element === 'string' && element.trim().startsWith(':')) {
        const lisd = document.createElement(element.replace(':', ''));
        return new myJutils(lisd);
      } else {
        this.element = document.querySelector(element);
        this.check = element;
      }
    } catch {
      this.element = element;
      this.check = element;
    }
  }
}

get target() { 
return this.check ? this.element : this.check;          
}
 
    at(index = 0) {  
 return new myJutils(this.element[index]);              
    }
   
   html(content) {
   if(content || content === '') {
this.element.innerHTML = content;    
return new myJutils(this.element);   
   } else {   
return this.element.innerHTML;      
   }    
   }

  text(content) {
   if(content || content === '') {
this.element.textContent = content;    
return new myJutils(this.element);   
   } else {
return this.element.textContent;      
   }    
   } 
   
   val(content) {
   if(content || content === '') {
this.element.value = content;    
return new myJutils(this.element);   
   } else {
return this.element.value;      
   }    
   }
  
 
 ready(callback) {
 if(this.element == document) {
document.addEventListener('DOMContentLoaded', callback); 
return callback;      
 } else if(this.element == window) {    
window.addEventListener('load', callback);
return callback;
   } else {
       throw new TypeError(`${this.check} is not a valid selector`);    
   }  
}     


status(callback) {
if(typeof callback === 'function') {   
 if(this.check === 'online') {    
window.addEventListener('online', callback);
   } else if(this.check === 'offline') {    
window.addEventListener('offline', callback);
} else {
throw new TypeError(`${this.check} is not a valid selector`);          
} 
} else {
if(this.check === 'online') {
 return navigator.onLine;            
   } else if(this.check === 'offline') {
 return !navigator.onLine;            
   } else {
throw new TypeError(`${this.check} is not a valid selector`);      
   }      
}     
}


is(callback) {
  try {
    // Check if callback is a string
    if (typeof callback !== 'string') {
      throw new TypeError('Callback must be a string');
    }

    // ID selector
    if (callback.startsWith('#')) {
      return this.element.getAttribute('id') === callback.slice(1).trim();
    }

    // Class selector
    if (callback.startsWith('.')) {
      const className = callback.slice(1).trim();
      return this.element.classList.contains(className);
    }

    // Text content selector
   if (callback.startsWith(':text-contains(') && callback.endsWith(')')) {
  const text = callback.slice(15, -1).trim();
  return this.element.textContent.includes(text);
} else if (callback.startsWith(':text-exact(') && callback.endsWith(')')) {
  const text = callback.slice(12, -1).trim();
  return this.element.textContent.trim() === text;
}


// Value selectors
if (callback.startsWith(':val-contains(') && callback.endsWith(')')) {
  const text = callback.slice(14, -1).trim();
  return this.element.value.includes(text);
} else if (callback.startsWith(':val-exact(') && callback.endsWith(')')) {
  const text = callback.slice(11, -1).trim();
  return this.element.value.trim() === text;
}


    // Special selectors
    switch (callback) {
      case ':int':
        return !isNaN(this.check) && this.check % 1 === 0;
      case ':float':
        return !isNaN(this.check) && this.check % 1 !== 0;
      case ':even':
        return this.check % 2 === 0;
      case ':odd':
        return this.check % 2 !== 0;
      case ':negative':
        return this.check < 0;
      case ':positive':
        return this.check > 0;
      case ':visible':
        return this.element.offsetParent !== null;
      case ':hidden':
        return this.element.offsetParent === null;
      case ':nan':
        return isNaN(this.check);
      case ':removed':
        return !this.element;
      case ':checked':
        return this.element.checked;
      case ':enabled':
        return !this.element.disabled;
      case ':disabled':
        return this.element.disabled;
      case ':selected':
        return this.element.selected;
    }

    // Attribute selector
    if (callback.startsWith('[') && callback.endsWith(']')) {
      return this.element.hasAttribute(callback.slice(1, -1));
    }

    // Attribute value selector
    if (callback.includes('=')) {
      const [attr, value] = callback.split('=');
      return this.element.getAttribute(attr) === value;
    }

    // Tag name selector
    if (this.element.tagName === callback.toUpperCase()) {
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
      return this.element.type === callback;
    }

    return false;
  } catch (error) {
    throw new TypeError('An is() method error occurred');
  }
}


/* loading icon based on duration */
loader(duration = 2000, options) {
  const defaults = {
    width: 40,
    height: 40,
    bg: '#f3f3f3',
    fg: '#3498db',
    radius: 70,    
    bw: 5,
    fw: 5,
    stop: 100000000, // seconds
    callback: () => {
        
    }  
  };

  const settings = Object.assign(defaults, options);

  this.element.style.width = `${settings.width || settings.w}px`;
  this.element.style.height = `${settings.height || settings.h}px`;
  this.element.style.border = `${settings.bw || settings.backWeight}px solid ${settings.bg || setting.background}`;
  this.element.style.borderTop = `${settings.fw || settings.foreWeight}px solid ${settings.fg ||settings.foreground}`;
  this.element.style.borderRadius = `${settings.radius || settings.borderRadius}%`;
  this.element.style.animation = `spin ${duration / 1000}s linear infinite`;

  const stys = document.createElement('style');
  stys.innerHTML = `
    @keyframes spin {
      0% {
        transform: rotate(0deg);
      }
      100% {
        transform: rotate(360deg);
      }
    }
  `;
  document.head.appendChild(stys);
  
  setTimeout(() => {
this.element.style.animation = 'none';
settings.callback(this);
}, settings.stop);  
};

    

/* apply css style to elements setting multiple or single */
css(styles, property) {
  if (typeof styles === 'object') {
    Object.assign(this.element.style, styles);
    return new myJutils(this.element);
  } else if (styles && property) {
    this.element.style[styles] = property;
    return new myJutils(this.element);
  } else {
    return this.element.style[styles];
  }
}


// append element to document 
append(content) {
   this.element.append(content); 
}

// prepend element to document 
prepend(content) {
   this.element.prepend(content); 
}

// append method create element to document 
appendTo(content) {
if(content) {    
content.append(this.element);      
  } else {
 throw new RangeError('appendTo() required 1 argument!');     
  }
}

// prepend method create element to document 
prependTo(content) {
if(content) {
content.prepend(this.element);    
} else {
throw new RangeError('prependTo() required 1 argument!');
}  
}

// remove whitespace from element 
trim() {
   return this.check.trim();
}

//set or get element attribute 
attr(first, second) {
 if(first && second) {
 this.element.setAttribute(first, second); 
 return new myJutils(this.element);  
 } else {
return this.element.getAttribute(first);     
 }  
}

// remove attribute from element 
removeAttr(first) {
if(first) {
   this.element.removeAttribute(first);  
} else {
 throw new RangeError('removeAttr() required 1 argument!');   
}
 }

// show element with an optional delay
show(delay = 0) {
setTimeout(() => {   
   this.element.style.display = 'block';
   }, delay);  
   return new myJutils(this.element);
}

// hide element with an optional delay
hide(delay = 0) {
setTimeout(() => {   
   this.element.style.display = 'none';
   }, delay);
   return new myJutils(this.element);
}

/* toggle show hide element with an optional delay */
toggle(delay = 0) {
setTimeout(() => {   
  this.element.style.display = this.element.style.display === 'none' ? 'block' : 'none'
  }, delay);  
  return new myJutils(this.element);
}

// add css class to an element 
addClass(style) {
this.element.classList.add(style);
   return new myJutils(this.element);   
}

// remove css class from an element 
removeClass(style) {
this.element.classList.remove(style);
   return new myJutils(this.element);   
}

// toggle css class to an element 
toggleClass(style) {
this.element.classList.toggle(style);
   return new myJutils(this.element);   
}

/* check if an element has the specific class */
hasClass(style) {
if(style) {
 return this.element.classList.contains(style);   
} else {
   throw new RangeError('hasClass() required 1 argument!');
}
}

 
prev() {
  if (this.element.previousElementSibling) {
    return new myJutils(this.element.previousElementSibling);
  } else {
    return null;
  }
}

next() {
  if (this.element.nextElementSibling) {
    return new myJutils(this.element.nextElementSibling);
  } else {
    return null;
  }
}

child(index = 0) {
  if (this.element.children[index]) {
    return new myJutils(this.element.children[index]);
  } else {
    return null;
  }
}

first() {
  if (this.element.firstElementChild) {
    return new myJutils(this.element.firstElementChild);
  } else {
    return null;
  }
}

last() {
  if (this.element.lastElementChild) {
    return new myJutils(this.element.lastElementChild);
  } else {
    return null;
  }
}

before(content) {
  if (typeof content === 'string') {
    this.element.insertAdjacentHTML('beforebegin', content);
  } else {
    this.element.parentNode.insertBefore(content, this.element);
  }
  return this;
}

after(content) {
  if (typeof content === 'string') {
    this.element.insertAdjacentHTML('afterend', content);
  } else {
    this.element.parentNode.insertBefore(content, this.element.nextSibling);
  }
  return this;
}


/* add EventListener dynamically */
on(type, callback) {
  if(type && !callback) {
  this.element.addEventListener('click', type);
  return type;
   } else {
  this.element.addEventListener(type, callback);
  return callback; 
} 
}

/* submit EventListener */
submit(type) { 
if(typeof type === 'function') { 
 this.element.addEventListener('submit', type);
    return type;
    } else {
 this.element.submit();
 return true;     
    }
}


/* preventDefault form behavior */
pform() {
  this.check.preventDefault();
}


/* submit already prevent form */
sform() {
  this.element.submit();  
}

/* input EventListener */
input(type) {  
 this.element.addEventListener('input', type);
    return type;
}


/* focus EventListener */
focus(type) { 
if(typeof type === 'function') {
this.element.addEventListener('focus', type);
    return type;    
} 

this.element.focus();
return true;
}


/* blur EventListener */
blur(type) { 
if(typeof type === 'function') {
this.element.addEventListener('blur', type);
    return type;    
} 

 this.element.blur();
 return true;       
}


/* Separate function count */
scount(separate = '/') {
const element = this.check;
return element.toString().split(separate).length - 1;     
}


/* click EventListener */
click(type) {
 this.element.addEventListener('click', type);
  return type;   
}


/* double click EventListener */
dblclick(type) {
this.element.addEventListener('dblclick', type);
  return type;    
}


/* remove EventListener from element */
off(type, callback) {
 this.element.removeEventListener(type, callback);  
 return true;     
}


/* blur filter html element */
blurEffect(index = '1px') {
  return this.element.style.filter = `blur(${index})`;  
}


/* change input type "password" to text or vice versa(password)  / or set */
itype(type) {
  if (type === undefined) {
    return this.element.type;
  }

  if (['password', 'text'].includes(type)) {
    this.element.type = type;
    return true; // Return the new type
  } else {
    console.warn(`Invalid type: ${type}. Toggling between 'password' and 'text'.`);
    this.element.type = this.element.type === 'password' ? 'text' : 'password';
    return true; // Return the new type
  }
}


/* progress bar */
progressBar(options) {
  const defaults = {
    width: 100,
    height: 10,
    background: 'yellow',
    foreground: 'green',
    duration: 10000, // seconds
    borderRadius: '10px',
    callback: () => {
        
    }    
  };

  const settings = Object.assign(defaults, options);

  this.element.style.width = `${settings.width}%`;
  this.element.style.height = `${settings.height}px`;
  this.element.style.backgroundColor = settings.background;
  this.element.style.borderRadius = settings.borderRadius;
  this.element.style.overflow = 'hidden';

  const progressBar = document.createElement('div');
  progressBar.style.width = '0%';
  progressBar.style.height = '100%';
  progressBar.style.backgroundColor = settings.foreground;
  progressBar.style.transition = `width ${settings.duration / 1000}s`;

  this.element.appendChild(progressBar);

  setTimeout(() => {
    progressBar.style.width = '100%';
  }, 1);

 setTimeout(() => {
settings.callback(this); 
 }, settings.duration); 
};



/* limit characters method */
limitChar(limit, callbacks) {
  let property;
  if (this.element.tagName !== 'INPUT' && this.element.tagName !== 'TEXTAREA') {
    property = 'textContent';
  } else {
    property = 'value';
  }
if(limit) {
    this.element.addEventListener('input', () => {
      const conth = this.element[property];
      this.element.setAttribute('yfds', conth.length);
      if (conth.length >= limit) {
        this.element[property] = conth.slice(0, limit);
    if(callbacks) callbacks (this.element[property].length);      
      }    
    });
  }

  return {
    queue: (callback) => {
      this.element.addEventListener('input', () => {
        const conth = this.element[property];
    if(callbacks) {
  throw new Error('Cannot use both callback');   
    }    
        if (limit && conth.length === limit) {
          callback(this.element[property].length);
        }
      });
      return this; // Return the object itself for chaining
    }
  };
}


// sliding down element based on duration 
slideDown(delay, callback) {
  const fit = delay / 1000;
  this.element.style.transition = `max-height ${fit}s ease-in-out`;
  this.element.style.overflow = 'hidden';
  this.element.style.maxHeight = '0px';
  const scrollHeight = this.element.scrollHeight;
  setTimeout(() => {
    this.element.style.maxHeight = `${scrollHeight}px`;
  }, 0); // Start the animation immediately  
  
  if(callback) {
setTimeout(() => {
    callback(this);
}, delay); 
  }
  
  return {
  queue: (call) => {
  if(callback) {
throw new Error('Callback must not be 2');    
  }
setTimeout(() => {
    call(this);
}, delay);       
  }   
  }
}


// it work as sliding element up on duration 
slideUp(delay, callback) {
  const scrollHeight = this.element.scrollHeight;
  const fit = delay / 1000; /* Calculate the transition time in seconds */
  this.element.style.transition = `max-height ${fit}s ease-in-out`;
  this.element.style.overflow = 'hidden';
  this.element.style.maxHeight = `${scrollHeight}px`;
  
  // Trigger the animation
  requestAnimationFrame(() => {
    this.element.style.maxHeight = '0px';    
  });
  
  if(callback) {
setTimeout(() => {
    callback(this);
}, delay); 
  }
  
  return {
  queue: (call) => {
  if(callback) {
throw new Error('Callback must not be 2');    
  }
setTimeout(() => {
    call(this);
}, delay);       
  }   
  }
}

// Define the tickerRight method
 tickerRight(delay = 10, options) { 
      const originalHtml = this.element.innerHTML;
      const timer = delay / 1000;
      const text = this.element.textContent;
      const width = this.element.offsetWidth;
      this.element.style.overflow = 'hidden';
      this.element.style.width = width + 'px';      
      this.element.innerHTML = `<span style="display: inline-block; white-space: nowrap;">${text}</span>`;
      let x = width;
      const intervalId = setInterval(() => {
        x -= 1;
        this.element.querySelector('span').style.transform = `translateX(${x}px)`;
        if (x <= -this.element.querySelector('span').offsetWidth) {
          x = width;
        }
      }, timer);
      
 if(typeof options === 'object') {         
      setTimeout(() => {
        clearInterval(intervalId);
        this.element.style.transform = '';
        this.element.style.overflow = '';
        this.element.innerHTML = originalHtml; // Restore original HTML content
   options.callback(this);   
      }, options.stop || 10000);    
 } else {
   return {
   queue: (call) => {
setTimeout(() => {
        clearInterval(intervalId);
        this.element.style.transform = '';
        this.element.style.overflow = '';
        this.element.innerHTML = originalHtml; // Restore original HTML content
   call(this);   
      }, options || 10000);           
   }    
   } 
 }     
    }


/* it work as scrolling from left to right continuously */
tickerLeft(delay = 10, options) {
  const originalHtml = this.element.innerHTML;
  const timer = delay / 1000;
  const text = this.element.textContent;
  const width = this.element.offsetWidth;
  this.element.style.overflow = 'hidden';
  this.element.style.width = width + 'px';
  this.element.innerHTML = `<span style="display: inline-block; white-space: nowrap;">${text}</span>`;
  let x = -this.element.querySelector('span').offsetWidth;
  const intervalId = setInterval(() => {
    x += 1;
    this.element.querySelector('span').style.transform = `translateX(${x}px)`;
    if (x >= width) {
      x = -this.element.querySelector('span').offsetWidth;
    }
  }, timer);

if(typeof options === 'object') {
  setTimeout(() => {
    clearInterval(intervalId);
    this.element.style.transform = '';
    this.element.style.overflow = '';
    this.element.innerHTML = originalHtml; // Restore original HTML content
    options.callback(this);
  }, options.stop || 10000);
  } else {
return {
   queue: (call) => {
setTimeout(() => {
    clearInterval(intervalId);
    this.element.style.transform = '';
    this.element.style.overflow = '';
    this.element.innerHTML = originalHtml; // Restore original HTML content
    call(this);
  }, options || 10000);       
   }
}     
  }  
}


slideLeft(delay, callback) {
document.body.style.position = 'fixed';
this.element.style.display = 'none';  
  setTimeout(() => {
    this.element.style.display = 'block';
    this.element.style.position = 'relative';
    this.element.style.left = `-${this.element.offsetWidth + 20}px`;
    this.element.style.transition = `left ${delay / 1000}s ease-in-out`;
    setTimeout(() => {
      this.element.style.left = '0px';
    }, 0);
  }, 0);
  

  if(callback) {
setTimeout(() => {
    callback(this);
}, delay); 
}  

return {
  queue: (call) => {
  if(callback) {
throw new Error('Callback must not be 2');    
  }
setTimeout(() => {
    call(this);
}, delay);       
  }   
  }  
}


slideRight(delay, callback) {
document.body.style.position = 'fixed';
  this.element.style.display = 'none';
  setTimeout(() => {
    this.element.style.display = 'block';
    this.element.style.position = 'relative';
    this.element.style.left = `${window.innerWidth}px`;
    this.element.style.transition = `left ${delay / 1000}s ease-in-out`;
    setTimeout(() => {
      this.element.style.left = '0px';
    }, 0);
  }, 0);
  
 
  if(callback) {
setTimeout(() => {
    callback(this);
}, delay);  
}
  
  return {
  queue: (call) => {
  if(callback) {
throw new Error('Callback must not be 2');    
  } 
setTimeout(() => {
    call(this);
}, delay);       
  }   
  }
}


/* Autotyping text automatically */
autoTyping(phrases, options = {}) {
const elementId = this.element;
  const typedTextElement = elementId;
  let currentPhraseIndex = 0;
  let currentCharIndex = 0;
  let isDeleting = false;
  let loopCount = 0;

  // Set default options
  const typeSpeed = options.typeSpeed || 100;
  const retype = options.retype !== undefined ? options.retype : false;
  const stopAt = options.stopAt || (retype ? null : 'end');
  const loop = options.loop || (retype ? Infinity : 1);
  const endWith = options.endWith || 'last';

  // Convert phrases to array if it's not already
  if (!Array.isArray(phrases)) {
    phrases = [phrases];
  }

  function autoType() {
    const currentPhrase = phrases[currentPhraseIndex];

    if (isDeleting) {
      typedTextElement.innerHTML = currentPhrase.substring(0, currentCharIndex);
      currentCharIndex--;
      if (currentCharIndex === 0) {
        isDeleting = false;
        currentPhraseIndex = (currentPhraseIndex + 1) % phrases.length;
        if (currentPhraseIndex === 0) {
          loopCount++;
          if (loopCount >= loop) {
            if (endWith === 'last') {
              typedTextElement.innerHTML = phrases[phrases.length - 1];
            } else if (endWith === 'first') {
              typedTextElement.innerHTML = phrases[0];
            } else if (endWith === 'empty') {
              typedTextElement.innerHTML = '';
            }
            return clearInterval(intervalId);
          }
        }
      }
    } else {
      typedTextElement.innerHTML = currentPhrase.substring(0, currentCharIndex + 1);
      currentCharIndex++;

      // Check if we need to stop or delete
      if (stopAt && currentPhrase.substring(0, currentCharIndex).toLowerCase().includes(stopAt.toLowerCase())) {
        if (retype) {
          isDeleting = true;
        } else {
          return clearInterval(intervalId);
        }
      }

      if (currentCharIndex === currentPhrase.length) {
        if (retype) {
          if (stopAt === null) {
            setTimeout(() => {
              isDeleting = true;
            }, 1000); // wait 1 second before deleting
          } else {
            isDeleting = true;
          }
        } else {
          currentCharIndex = 0;
          if (loopCount < loop - 1) {
            loopCount++;
          } else {
            if (endWith === 'last') {
              typedTextElement.innerHTML = phrases[phrases.length - 1];
            } else if (endWith === 'first') {
              typedTextElement.innerHTML = phrases[0];
            } else if (endWith === 'empty') {
              typedTextElement.innerHTML = '';
            } 
            return clearInterval(intervalId);
          }
        }
      }
    }
  }

  const intervalId = setInterval(autoType, typeSpeed);
}


/* replace element not */
keepChar(charsToKeep, replacement, global = false) {
  const regex = new RegExp(`[^${charsToKeep}]`, global ? 'g' : '');
  return this.check.toString().replace(regex, replacement);
}


/* fade out html element based on delay */
fadeOut(delay = 0, callback) {
  this.element.style.display = 'block';
  this.element.style.opacity = 1;
  this.element.style.transition = `all ${delay / 1000}s`;
  setTimeout(() => {
    this.element.style.opacity = 0;
  }, 0); 
  setTimeout(() => {
    this.element.style.display = 'none';
  }, delay); 
  

  if(callback) {
setTimeout(() => {
    callback(this);
}, delay); 
}  
  
  return {
  queue: (call) => {
  if(callback) {
throw new Error('Callback must not be 2');    
  }
setTimeout(() => {
    call(this);
}, delay);       
  }   
  }
}



/* fade in html element based on delay */
fadeIn(delay = 0, callback) {
  const fitd = delay / 1000;
  this.element.style.transition = `all ${fitd}s`;
  this.element.style.display = 'block';
  this.element.style.opacity = 0;
  this.element.offsetHeight; // Trigger a reflow
  this.element.style.opacity = 1;
  

  if(callback) {
setTimeout(() => {
    callback(this);
}, delay); 
}  
  
  return {
  queue: (call) => {
  if(callback) {
throw new Error('Callback must not be 2');    
  }
setTimeout(() => {
    call(this);
}, delay);       
  }   
  }
}

/* delay element */
delay(delay = 0) {  
  this.element.style.transitionDelay = `${delay}ms`;
 return this;
  }
  

/* remove element */
detach() {
  this.parent = this.element.parentNode;
  this.nextSibling = this.element.nextSibling;
  this.rems = this.element;
  this.element.remove();
  return {
    assignTo: (assign) => {
      assign.append(this.rems);
    },
    restore: () => {
      if (this.nextSibling) {
        this.parent.insertBefore(this.rems, this.nextSibling);
      } else {
        this.parent.appendChild(this.rems);
      }
    }
  }
}


/* asterisk element function */
asterisk(changeTo = "*", auto) {
  let tag;

  if (['INPUT', 'TEXTAREA'].includes(this.element.tagName)){
    tag = 'value';   
  } else {
    tag = 'textContent';
  }

  const data = this.element[tag];

  if (changeTo && !auto) {
  try {
    if (!this.element[tag].includes(changeTo)) {
      const trds = this.element[tag].replace(/./g, changeTo);
      this.element.originalData = data;
      this.element[tag] = trds;
    } 
  return data;
  } catch {
throw new Error("Cannot asterisk() multiple element at once need to use each()");      
  }    
  } else {   
    const element = this.element;   
  try {
      let tag = ['INPUT', 'TEXTAREA'].includes(element.tagName) ? 'value' : 'textContent';
      if (!element[tag].includes(changeTo)) {      
        element.originalData = element[tag];
        element[tag] = element[tag].replace(/./g, changeTo); 
        return true;                   
      } else {
        element[tag] = element.originalData;
        delete element.originalData;  
        return false;                     
      }   
  } catch(err) {
throw new Error("Cannot 'auto' asterisk() multiple element at once need to use each()");    
  }  
}
}


/* cssText function */
cssText(styling, override = true) {
  if (typeof styling === 'string') {
    this.element.style.cssText = override ? styling : this.element.style.cssText + styling;
  } else if (styling === undefined || styling === null) {
    return this.element.style.cssText;
  } else {
    throw new Error(`Invalid styling value. Expecting a string, but received ${typeof styling}.`);
  }
}


/* Creating floating effect */floatLabel(labelId) {
  const input = this.element;
  if (!input) return;

  const wrapper = document.createElement('div');
wrapper.classList.add('floating-label-wrapper');  
wrapper.style.marginTop = '10px'
  input.parentNode.replaceChild(wrapper, input);
  wrapper.appendChild(input);

  const label = document.createElement('label');
  label.textContent = input.getAttribute('placeholder') || '';
label.classList.add('floating-label'); 
try {
 label.classList.add(labelId)
 } finally {
   label.id = labelId;
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
}


/* insert element to a string with position */
insert(char, position = '0') {
if(position === 'start') {
return char + this.check;   
} else if(position === 'end') {
return this.check + char;   
} else {
 return this.check.slice(0, position) + char + this.check.slice(position);
}
}

/* Contenteditable true function */
edit(options) {
  const element = this.element;
  element.setAttribute('contenteditable', 'true');

  let placeholder = ''; 
  let id = '';  
  if (typeof options === 'string' || !options) {           
  id = options;  
  placeholder = element.getAttribute('placeholder');            
  } else if(typeof options === 'object') {
  id = options.id
  placeholder = options.placeholder;    
  } 
  
 element.dataset.placeholder = placeholder;
 element.id = id;
 
element.addEventListener('input', () => {
    if(element.textContent.length > 0) {
  element.id = null;   
    } else {    
  element.id = id;   
    }
})


  let style = document.querySelector('style[data-placeholder-style]');
  if (!style) {
    style = document.createElement('style');
    style.dataset.placeholderStyle = '';
    style.innerHTML = `
      [data-placeholder]:empty::before {
     content: attr(data-placeholder);             
      }   
    `;
    document.head.appendChild(style);
  }
}

/* add hr line to element */
lineIt(type, option = {}) {
  let text = typeof type === 'string' || typeof type === 'number' && type ? type : this.element.textContent;

let options = typeof type === 'object' && !option ? type : option;


  const span = this.element;
  span.innerHTML = `
    <hr style="flex-grow: 1; border: none; border-top: ${options.border || '2px'} solid ${options.color || 'black'}; border-radius: ${options.radius || '2px'};">
    <span style="padding: ${options.padding || '0 10px'};">${text}</span>
    <hr style="flex-grow: 1; border: none; border-top: ${options.border || '2px'} solid ${options.color || 'black'}; border-radius: ${options.radius || '2px'};">
  `;
  span.style.display = 'flex';
  span.style.alignItems = 'center';
  span.style.textAlign = 'center';  
}

  
/* forEach utility function */
each(callback) {
Array.from(this.element).forEach((e, i, a) => {
try {
callback(e, i, a)   
} catch {
 callback(new myJutils(e), i, a);  
}
})    
}


/* filter utility function */
filter(callback) {
  return Array.from(this.element).filter((e, i, a) => {
    try {
      return callback(e, i, a);
    } catch (error) {      
      console.error(error);
      return false;
    }
  });
}


/* map utility function */
map(callback) {
  return Array.from(this.element).map((e, i, a) => {
    try {
      return callback(e, i, a);
    } catch (error) {
      console.error(error);
      return null; // or some other default value
    }
  });
}


/* reduce utility function */
reduce(callback, initialValue = 0) {
  return Array.from(this.element).reduce((accumulator, currentValue, index, array) => {
    try {
      return callback(accumulator, currentValue, index, array);
    } catch (error) {
      console.error(error);
      return accumulator; // or some other default behavior
    }
  }, initialValue);
}


/* find utility function */
find(callback) {
  return Array.from(this.element).find((elem, index, array) => {
    try {
      return callback(elem, index, array);
    } catch (error) {
      console.error(error);
      return false; // or some other default behavior
    }
  });
}


/* some utility function */
some(callback) {
  return Array.from(this.element).some((elem, index, array) => {
    try {
      return callback(elem, index, array);
    } catch (error) {
      console.error(error);
      return false; // or some other default behavior
    }
  });
}


in(type) {
  const str = this.element;
  switch(type) {
    case 'upper': 
      return (str.match(/[A-Z]/g) || []).length;
    case 'lower':
      return (str.match(/[a-z]/g) || []).length;
    case 'number': 
      return (str.match(/[0-9]/g) || []).length;
    case 'alpha': 
      return (str.match(/[a-zA-Z]/g) || []).length;
    case 'special':
  return (str.match(/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>?]/g) || []).length;
    case 'emoji':
      return (str.match(/\p{Extended_Pictographic}/gu) || []).length;                   
  }  
}


/* Clipboard copy text  */
 copy(callback) {
const text = this.check; 
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


/* make text not ccopyable */
 uncopy() {
 const element = this.element;
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
}


/* hash element */
hash(mode = '', pin = '') {
  const element = this.check;
  let hash = '';
  let multiplier = 1;
  let offset = 0;

  if (mode === 'DEFAULT') {
    multiplier = 2 * element.length;
  } else if (mode === 'PRIVACY') {
    multiplier = pin.length * 2 + element.length;
  try { 
    offset = pin.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    } catch {
 throw new Error('hash() pin must be a string');  
    }
  } else if (mode === 'HIGH_SECURITY') {
    const hashBuffer = [];
    for (let i = 0; i < pin.length; i++) {
      hashBuffer.push(pin.charCodeAt(i));
    }
    for (let i = 0; i < element.length; i++) {
      hashBuffer.push(element.charCodeAt(i));
    }
    let hashValue = 2166136261;
    for (let i = 0; i < hashBuffer.length; i++) {
      hashValue = hashValue ^ hashBuffer[i];
      hashValue = hashValue * 16777219;
    }
    hash = hashValue.toString(16);
  } else if(mode) {
  throw new TypeError(`"${mode}" is not a valid mode`);    
  }

  for (let i = 0; i < element.length; i++) {
    const charCode = element.charCodeAt(i);
    const hashedChar = String.fromCharCode(charCode + (i % 10) * multiplier + offset);
    hash += hashedChar;
  }
  return hash;
}


/* unhashed already hashed element */
unhash(mode = '', pin = '') {
  const element = this.check;
  let unHash = '';
  let multiplier = 1;
  let offset = 0;

  if (mode === 'DEFAULT') {
    multiplier = 2 * element.length;
  } else if (mode === 'PRIVACY') {
    multiplier = pin.length * 2 + element.length;
    try { 
    offset = pin.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
     } catch {
 throw new Error('unhash() pin must be a string');  
    }
  } else if(mode === 'HIGH_SECURITY') {
throw new Error('Cannot unhash HIGH_SECURITY mode');      
  } else if(mode) {
  throw new TypeError(`"${mode}" is not a valid mode`);    
  }
  

  for (let i = 0; i < element.length; i++) {
    const charCode = element.charCodeAt(i);
    const unHashedChar = String.fromCharCode(charCode - (i % 10) * multiplier - offset);
    unHash += unHashedChar;
  }
  return unHash;
}
  
  
/* sanitize user input */
sanitize(...filters) { 
  const filterFunctions = {
    emoji: (c) => /[\p{Extended_Pictographic}\u200d]/u.test(c),
    number: (c) => /[0-9]/.test(c),
    lowercase: (c) => /[a-z]/.test(c),
    uppercase: (c) => /[A-Z]/.test(c),
    alphabet: (c) => /[a-zA-Z]/.test(c),
    special: (s) => s.replace(/[^!@#$%^&*()_+={}[\]|\:;"<>,.?/~`]/g, ''),
  };

  let result = '';
  for (const char of this.check) {
    if (filters.some((filter) => filterFunctions[filter](char))) {
      result += char;
    }
  }

  return result;
} 


/* filterOut element method */
filterOut(...filters) {
  const filterFunctions = {
    emoji: (s) => s.replace(/[\p{Extended_Pictographic}\u200d]+/gu, ''),
    number: (s) => s.replace(/[0-9]/g, ''),
    lowercase: (s) => s.replace(/[a-z]/g, ''),
    uppercase: (s) => s.replace(/[A-Z]/g, ''),
    alphabet: (s) => s.replace(/[a-zA-Z]/g, ''),    
    special: (s) => s.replace(/[^a-zA-Z0-9\p{Extended_Pictographic}\u200d\s]/gu, ''),
  };

  let result = this.check.toString();
  filters.forEach((filter) => {
    if (!filterFunctions[filter]) {
      throw new Error(`Invalid filter: ${filter}`);
    }
    result = filterFunctions[filter](result);
  });

  return result;
}


/* Swipe from left to right  */
 swipeLeft(options = {}) {
  const defaults = {
    threshold: 50,
    edgeThreshold: 30,     
    callback: (e) => {
  console.log(e);      
    },
  };

  const opts = { ...defaults, ...options };

  let startX = 0;
  let target = this.element;

  target.addEventListener('touchstart', (event) => {
    startX = event.touches[0].clientX;
  });

  target.addEventListener('touchend', (event) => {
    const endX = event.changedTouches[0].clientX;
    if (!opts.targetElement && startX > opts.edgeThreshold) return; // check if start point is close enough to the edge
    if (endX - startX > opts.threshold) {
      opts.callback("Swiped from left!");
    }
  });
}


/* Swipe from bottom to top */
 swipeBottom(options = {}) {
  const defaults = {
    threshold: 50,
    edgeThreshold: 30,    
    callback: (e) => {
  console.log(e);      
    },
  };

  const opts = { ...defaults, ...options };

  let startY = 0;
  let target = this.element;

  target.addEventListener('touchstart', (event) => {
    startY = event.touches[0].clientY;
  });

  target.addEventListener('touchend', (event) => {
    const endY = event.changedTouches[0].clientY;
    if (!opts.targetElement && startY < window.innerHeight - opts.edgeThreshold) return; // check if start point is close enough to the bottom edge
    if (startY - endY > opts.threshold) {
      opts.callback("Swiped from bottom!");
    }
  });
}


/* Swipe from top to down */
 swipeTop(options = {}) {
  const defaults = {
    threshold: 50,
    edgeThreshold: 30,    
    callback: (e) => {
  console.log(e);      
    },
  };

  const opts = { ...defaults, ...options };

  let startY = 0;
  let target = this.element;

  target.addEventListener('touchstart', (event) => {
    startY = event.touches[0].clientY;
  });

  target.addEventListener('touchend', (event) => {
    const endY = event.changedTouches[0].clientY;
    if (!opts.targetElement && startY > opts.edgeThreshold) return; // check if start point is close enough to the top edge
    if (endY - startY > opts.threshold) {
      opts.callback("Swiped from top!");
    }
  });
}


/* Swipe from right to left  */
 swipeRight(options = {}) {
  const defaults = {
    threshold: 50,
    edgeThreshold: 30,    
    callback: (e) => {
   console.log(e);     
    },
  };

  const opts = { ...defaults, ...options };

  let startX = 0;
  let target = this.element;

  target.addEventListener('touchstart', (event) => {
    startX = event.touches[0].clientX;
  });

  target.addEventListener('touchend', (event) => {
    const endX = event.changedTouches[0].clientX;
    if (startX < window.innerWidth - opts.edgeThreshold) return; // only trigger if swipe starts from right edge
    if (startX - endX > opts.threshold) {
      opts.callback('swipe from right!');
    }
  });
}


/* array method to count array matching length */
 count(callback) {
  let count = 0;
for (let i = 0; i < this.element.length; i++) {
    if (callback(this.element[i])) {
      count++;
    }
  }
  return count;
}


/* concat multiple array together */
merge(...args) {
return this.element.concat(...args);   
}


/* set dataset on element */
data(key, value) {
  if(key && value === undefined) {
  return this.element.dataset[key];   
  } else if(key !== undefined && value !== undefined) {
 this.element.dataset[key] = value;
 return true;   
  } else {
return this.element.dataset;      
  } 
}







}




function $(selector, all) {
return new myJutils(selector, all);
}



/* random array class methods */
 $.asc = function(arr, key) {
 const array = arr;
    if (key) {
      const isNumeric = typeof array[0][key] === 'number';
      return array.sort((a, b) => isNumeric ? a[key] - b[key] : a[key].localeCompare(b[key]));
    } else {
      const isNumeric = typeof array[0] === 'number';
      return array.sort((a, b) => isNumeric ? a - b : a.localeCompare(b));
    }
  }


 $.desc = function(arr, key) {
 const array = arr;
    if (key) {
      const isNumeric = typeof array[0][key] === 'number';
      return array.sort((a, b) => isNumeric ? b[key] - a[key] : b[key].localeCompare(a[key]));
    } else {
      const isNumeric = typeof array[0] === 'number';
      return array.sort((a, b) => isNumeric ? b - a : b.localeCompare(a));
    }
  }

 $.reverse = function() { 
    return this.check.reverse();
  }


 $.randArr = function(arr) {
const array = arr; 
    return array[Math.floor(Math.random() * array.length)];
  }
 

$.fixed = function(value, length = 2) {
if(isNaN(value) || isNaN(length)) {
throw new Error('Fixed argument must be numeric');  
} 
return Number(value).toFixed(length);  
}


$.str = function(element) {
return element.toString(); 
}



$.upper = function(element) {
return element.toUpperCase(); 
}


$.lower = function(element) {
return element.toLowerCase();  
}


$.int = function(element) {
return parseInt(element); 
}


$.float = function(element) {
return parseFloat(element);
}


// JSON.stringify function 
$.json = function(element) {
  return JSON.stringify(element);
}


// JSON.parse function 
$.parse = function(element) {
return JSON.parse(element);     
}
 

/* setInterval */
$.interval = function(callback, timer = 0) {
if(arguments.length === 1) {
 return clearInterval(callback);     
} else if(arguments.length === 2) {
if(typeof callback === 'function') {    
const intervalId = setInterval(() => {
    callback(this);
}, timer);
return intervalId;
} else {
  setTimeout(() => {
   return clearInterval(callback);  
}, timer); 
}
}
}


/* setTimeout */
$.timeout = function(callback, timer = 0) {
  if(arguments.length === 1) {
return clearTimeout(callback);     
  } else if(arguments.length === 2) {
  if(typeof callback === 'function') {    
const timeoutId = setTimeout(() => {
 callback(this);   
}, timer); 
return timeoutId;   
  } else {
  setTimeout(() => {
 return clearTimeout(callback);     
}, timer); 
  }  
}
}


/* reload page location.reload  */
$.reload = function(timer) {
   if(!timer) {
    location.reload();   
   } else {
  setTimeout(() => {
   location.reload();    
  }, timer);    
   } 
}


/* redirect url */
$.redirect = function(url, timer) {
   if(timer === undefined) {   
   window.location.href = url;           
   } else {
  setTimeout(() => {
   window.location.href = url;       
  }, timer);  
   } 
}


/* fetch api data auto XML */    
 $.getData = function(...args) {
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

      


let alrs = 0;

$.alert = function(text = '', btn1 = 'OK') {
return new Promise((resolve, reject) => {
  const currentId = alrs++;
  const div = document.createElement('div');
  div.innerHTML = `
    <div style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: rgba(0, 0, 0, 0.5); z-index: ${999 - alrs + currentId}; display: flex; justify-content: center; align-items: center; border-radius: 0px; color: black;" id="backdrop-${currentId}">
      <div id="ralert-${currentId}" style="padding: 10px; border-radius: 0px; background: #fff; border: 1px solid #ddd; width: 80%; max-width: 500px; min-height: 150px; max-height: calc(100vh - 90px); max-width: 500px; z-index: ${1000 - alrs + currentId}; display: flex; flex-direction: column; color: black;">
        <div style="margin-top: -5px; flex-grow: 1; overflow-y: auto; margin-bottom: 10px; overflow-y: auto; background: white; color: black; padding-right: 10px; box-shadow: 0px 1px rgba(6, 3, 0, 0.2);" id="page-${currentId}">${text}</div>
  
  <div style="justify-content: right; padding-top: 15px; padding-bottom: 10px; background: white; color: black; display: flex;">      
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


let conrs= 0;

$.confirm = function(text = '', btn1 = 'CANCEL', btn2 = 'OK') {
  return new Promise((resolve, reject) => {
    const currentId = conrs++;
    const div = document.createElement('div');
    div.innerHTML = `
      <div style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: rgba(0, 0, 0, 0.5); z-index: ${999 - conrs + currentId}; display: flex; justify-content: center; align-items: center; border-radius: 0px; color: black;" id="backdrop-${currentId}">
        <div id="rconfirm-${currentId}" style="padding: 10px; border-radius: 0px; background: #fff; border: 1px solid #ddd; width: 80%; max-width: 500px; min-height: 150px; max-height: calc(100vh - 90px); max-width: 500px; z-index: ${1000 - conrs + currentId}; display: flex; flex-direction: column; color: black;">
            
          <div style="flex-grow: 1; overflow-y: auto; margin-bottom: 10px; background: white; color: black; box-shadow: 0px 1px rgba(6, 3, 0, 0.2); padding-right: 10px;" id="page1-${currentId}">${text}</div>
          <div style="justify-content: right; padding-top: 15px; padding-bottom: 10px; background: white; color: black; display: flex;">
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

 
// random number function 
$.randInt = function(min, max) {
  if(max === undefined) {
return Math.floor(Math.random() * min);    
  } else if(min !== undefined && max !== undefined) {
return Math.floor(Math.random() * (max - min + 1)) + min;      
  } else {
 throw new RangeError('$.randInt() required 1 or 2 arguments');
  } 
}     


/* random alphabet function */
$.randAlpha = function(length, options = {}) {
  let alphabets = '';
  if (options.uppercase) alphabets += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  if (options.lowercase) alphabets += 'abcdefghijklmnopqrstuvwxyz';
  if (!options.uppercase && !options.lowercase) alphabets = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';

  let randomString = '';
  for (let i = 0; i < length; i++) {
    randomString += alphabets.charAt(Math.floor(Math.random() * alphabets.length));
  }
  return randomString;
};


/* validate user email address and return boolean */
$.validateEmail = function(email) {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email.trim()) && email.length <= 254;
}


/* Sanitizes a string to prevent XSS and SQL injection attacks. */
$.sanitize = function(input, callback) {
  if (typeof input !== 'string') {
    throw new Error('Input must be a string');
  }

  const originalInput = input;

  // Remove HTML tags
  input = input.replace(/<\/?[^>]+(>|$)/g, '');

  // Remove script tags and JavaScript code
  input = input.replace(/<script.*?>.*?<\/script>/gi, '');
  input = input.replace(/javascript:/gi, '');
  input = input.replace(/on\w+=/gi, ''); // Remove event handlers

  // Remove SQL injection attempts (note: this is not foolproof and should not be relied upon for SQL security)
  input = input.replace(/UNION|SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|TRUNCATE|grant|revoke|exec|execute|fetch|desc|describe|show/gi, '');

  // Remove special characters
  input = input.replace(/[^\w\s.,!?-]/gi, '');

  // Trim whitespace
  input = input.trim();

  if(callback === undefined) {
    return input;
  } else if(typeof callback === 'function'){
return callback(input);    
  } else {
  return originalInput === input;    
  } 
}


/* manipulate pushState function */
$.state = function(flag, url, options = {}) {
  if (!flag || typeof flag !== 'string' || !url || typeof url !== 'string') {
    throw new Error('Invalid flag or url. Both must be non-empty strings.');
  }

  const currentUrl = new URL(window.location.href);
  currentUrl[flag] = url;
  window.history.pushState(options, '', currentUrl.href);
  return true;
}

// onpopstate logic
$.stateEvent = function(callback) {
  if (typeof callback !== 'function') {
    throw new Error('Callback must be a function.');
  }

  window.addEventListener('popstate', callback);
  return callback;
}


/* URL search params function */
$.params = function(options) {
try {
const myParams = new URLSearchParams(options);  
return myParams;
} catch(err) {
    throw new Error('An error occurred! ' + err)
}
}


/* manipulate window location */
$.location = function(flag, url) {
if(!flag || typeof flag !== 'string') {
throw new Error('Invalid flag');
} 

   if(url) {
   window.location[flag] = url;
   return true;      
   } else {
   return window.location[flag];
   }    
}


/* custom formData() utility function */
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



/* localStorage API function */
 $.storage = function(key, value) {
if(key === undefined) {
return localStorage;  
} else if(value === undefined) {
if(key === ':CLEAR:') {
localStorage.clear();
    return true;     
} else if(Number(key)) {
return localStorage.key(key);          
} else {
 return localStorage.getItem(key);  
}   
} else {
if(value !== ':REMOVE:') {
localStorage.setItem(key, value);
return true;       
 } else {
   localStorage.removeItem(key);   
   return true;       
 }    
} 
 }


/* sessionStorage API function */
 $.session = function(key, value) {
if(key === undefined) {
return sessionStorage;  
} else if(value === undefined) {
if(key === ':CLEAR:') {
sessionStorage.clear();
    return true;     
} else if(Number(key)) {
return sessionStorage.key(key);          
} else {
 return sessionStorage.getItem(key);  
}   
} else {
if(value !== ':REMOVE:') {
sessionStorage.setItem(key, value);
return true;       
 } else {
   sessionStorage.removeItem(key);   
   return true;       
 }    
} 
 }
 

/* Makes an AJAX request to a server. */
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


/* Gets or sets a property of the current date. */
$.date = function(...args) {
  const request = new Date();
  
  if (Array.isArray(args[0])) {
    // Getter
    return args[0].map(flag => {
      const prop = request[flag];
      return typeof prop === 'function' ? prop.call(request) : prop;
    });
  } else {
    // Setter
    for (let i = 0; i < args.length; i += 2) {
      const flag = args[i];
      const value = args[i + 1];
      const prop = request[flag];
      if (typeof prop === 'function') {
        prop.call(request, value);
      } else {
        throw new Error(`Cannot set flag: ${flag}`);
      }
    }
    return request;
  }
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


/* Converts time strings to milliseconds and returns the total. */
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


/* Retrieve or store data in local storage under the given key */  
$.dataStore = function(key, data) {
  if (key !== undefined && data !== undefined) {
    if (typeof data === 'object' || Array.isArray(data)) {
      let history = $.parse($.storage(key)) || [];
      if (!Array.isArray(history)) {
        history = [history];
      }
      history.push(data);
      $.storage(key, $.json(history));
    } else {
      throw new Error(`Invalid typeof data "${typeof data}" $.dataStore expect either "object" or "array"`);
    }
  }

  let history = $.parse($.storage(key)) || [];
  if (!Array.isArray(history)) {
    history = [history];
  }

  let latestItem = history[history.length - 1] || {};

  return $.extend(history, latestItem);
}


/* Object assign function logic */
$.extend = function(target, ...args) {
  return Object.assign(target, ...args); 
}
