function sleep(delay) { return new Promise((resolve) => setTimeout(resolve, delay)) }

async function waitForElmByID(selector) {
     return new Promise(resolve => {
          if (document.getElementById(selector)) {
               return resolve(document.getElementById(selector));
          }

          const observer = new MutationObserver(mutations => {
               if (document.getElementById(selector)) {
                    resolve(document.getElementById(selector));
                    observer.disconnect();
               }
          });

          observer.observe(document.body, {
               childList: true,
               subtree: true
          });
     });
}

async function waitForElm(selector) {
     return new Promise(resolve => {
          if (document.querySelector(selector)) {
               return resolve(document.querySelector(selector));
          }

          const observer = new MutationObserver(mutations => {
               if (document.querySelector(selector)) {
                    resolve(document.querySelector(selector));
                    observer.disconnect();
               }
          });

          observer.observe(document.body, {
               childList: true,
               subtree: true
          });
     });
}

async function TryFindElement(selector, attemp) {
     if (attemp == null) {
          attemp = 10
     }

     if (attemp > 0) {
          let element = document.querySelector(selector)

          if (element == null) {
               attemp--
               await sleep(1000)
               if (DebugMode) {
                    console.log("TryAgain")
               }
               return await TryFindElement(selector, attemp)
          } else {
               return element
          }
     } else {
          return
     }
}

async function GetDocumentBody() {
     var DocumentBody = document.body

     if (DocumentBody) {
          return DocumentBody
     } else {
          await sleep(100)
          return await GetDocumentBody()
     }
}

async function GetDocumentHead() {
     var DocumentHead = document.head

     if (DocumentHead) {
          return DocumentHead
     } else {
          await sleep(100)
          return await GetDocumentBody()
     }
}

async function RemoveNewLine(Text) {
     if (Text.includes("\n")) {
          Text = Text.replaceAll("\n", "")
          return await RemoveNewLine(Text)
     } else {
          return await Text
     }
}

function ExportFile(data, filename, type) {
     var file = new Blob([data], { type: type })
     var a = document.createElement("a"),
          url = URL.createObjectURL(file)
     a.href = url
     a.download = filename
     document.body.appendChild(a)
     a.click()
     setTimeout(function () {
          document.body.removeChild(a)
          window.URL.revokeObjectURL(url)
     }, 0)
}

async function RunAllCallback(array, args) {
     //array.filter(callback => !!callback).map(callback => callback(args))
     for (var callback of array) {
          if (!callback) continue
          await callback()
          await sleep(0)
     }
}

async function RunAllCallbackOBJ(OBJ, args) {
     //Object.values(OBJ).filter(callback => !!callback).map(callback => callback(args))
     for (var callback of Object.values(OBJ)) {
          if (!callback) continue
          await callback(args)
          await sleep(0)
     }
}

async function RunAllCallbackMAP(MAP, args) {
     Array.from(MAP.values()).filter(callback => !!callback).map(callback => callback(args))
     // for (var callback of MAP.values()) {
     //     if (!callback) continue
     //     await callback(args)
     //     await sleep(0)
     // }
}

function ELementChange(element, callback, config) {
     if (DebugMode) {
          console.log(element, callback)
     }
     var WatchChange = new MutationObserver(callback)
     WatchChange.observe(element, config)
     return WatchChange
}

function makeid(length) {
     let result = '';
     const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
     const charactersLength = characters.length;
     let counter = 0;
     while (counter < length) {
          result += characters.charAt(Math.floor(Math.random() * charactersLength));
          counter += 1;
     }
     return result;
}

function DistanceFromRootTop(element, root) {
     const elementRect = element.getBoundingClientRect();
     const rootRect = root ? root.getBoundingClientRect() : document.documentElement.getBoundingClientRect();

     const rootTop = rootRect.top

     const elementTop = elementRect.top
     const elementBottom = elementRect.top + elementRect.height

     const distance = Math.min(
          Math.abs(rootTop - elementTop),
          Math.abs(rootTop - elementBottom),
     )

     return distance;
}

function CopyToClipboard(text) {
     navigator.clipboard.writeText(text);
}

function numberWithCommas(x) {
     return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
}

async function WaitDocumentLoaded() {
     return new Promise(async resolve => {
          var Loop = setInterval(function () {
               if (document.readyState === "complete") {
                    clearInterval(Loop);
                    resolve()
               }
          }, 100);
     })
}

function When_Element_Remove(targetElement, callback) {
     var observer = new MutationObserver((mutationsList, observer) => {
          for (const mutation of mutationsList) {
               if (mutation.type === 'childList' && mutation.removedNodes.length > 0) {
                    for (const removedNode of mutation.removedNodes) {
                         if (removedNode === targetElement) {
                              callback();
                              observer.disconnect();
                              return;
                         }
                    }
               }
          }
     });
     observer.observe(document.body, { childList: true });
}

//--------------------------------------------------------------------------
// isElementInViewport
//--------------------------------------------------------------------------

function isElementVerticallyInViewport(elem) {
     var rect = elem.getBoundingClientRect();

     return (
          (rect.top >= 0 && rect.top <= (window.innerHeight || document.documentElement.clientHeight)) ||
          (rect.bottom >= 0 && rect.bottom <= (window.innerHeight || document.documentElement.clientHeight))
     );
}

//--------------------------------------------------------------------------
// OnScroll
//--------------------------------------------------------------------------

var OnScrollTask = new Map();

async function RunScroll(element) {
     //console.log(element)

     if (!OnScrollTask.has(element)) return;
     if (OnScrollTask.get(element).Running) return;

     OnScrollTask.get(element).Running = true;

     var ScrollTop

     if (element == window) {
          ScrollTop = document.documentElement.scrollTop
     } else {
          ScrollTop = element.scrollTop
     }

     await RunAllCallbackMAP(OnScrollTask.get(element).AllFunction, ScrollTop);

     OnScrollTask.get(element).Running = false;
}

/**
 * @param {HTMLBaseElement} element
 * @param {Function} Func
 */

function RunWhenScroll(element, Func, UseGlobalScroll) {
     var UniqueID = Date.now();

     if (!OnScrollTask.has(element)) {
          OnScrollTask.set(element, {
               AllFunction: new Map(),
               Running: false
          });
     }

     OnScrollTask.get(element).AllFunction.set(UniqueID, Func);

     function Stop() {
          if (OnScrollTask.get(element).AllFunction) {
               OnScrollTask.get(element).AllFunction.delete(UniqueID);
               if (OnScrollTask.get(element).AllFunction.size === 0) {

                    var ThisElementToRemove

                    if (UseGlobalScroll) {
                         ThisElementToRemove = window
                    } else {
                         ThisElementToRemove = element
                    }

                    ThisElementToRemove.removeEventListener('scroll', OnScrollTask.get(element).EventListener);

                    OnScrollTask.delete(element)
               }
          }
     }

     if (!OnScrollTask.get(element).EventListener) {
          OnScrollTask.get(element).EventListener = function () {
               RunScroll(element);
          };
          if (UseGlobalScroll) {
               window.addEventListener('scroll', OnScrollTask.get(element).EventListener, true);
          } else {
               element.addEventListener('scroll', OnScrollTask.get(element).EventListener, false);
          }
     }

     RunScroll(element)

     return {
          Stop: Stop
     };
}

//--------------------------------------------------------------------------
// Slider
// By ChatGPT XD (90%)
//--------------------------------------------------------------------------

function debounce(func, delay) {
     let timeoutId;
     return function () {
          clearTimeout(timeoutId);
          timeoutId = setTimeout(() => {
               func.apply(this, arguments);
          }, delay);
     };
}

function getUrlParams(url) {
     const params = {};
     const queryString = url.split('?')[1] || '';
     queryString.split('&').forEach(param => {
          const [key, value] = param.split('=');
          params[key] = decodeURIComponent(value);
     });
     return params;
}

function getOnlyUrl(url) {
     try {
          const parsedUrl = new URL(url);
          return `${parsedUrl.origin}${parsedUrl.pathname}`;
     } catch (error) {
          console.error("Invalid URL:", error);
          return null;
     }
}


function Create_StyleSheet() {
     var style = document.createElement('style');
     setTimeout(async () => {
          var Head = await GetDocumentHead()
          Head.append(style)
     }, 0);
     return style
}

var loaded_bar_amount = 5;
var cal_loaded_bar_size = 100 / loaded_bar_amount;

async function Loaded_animation() {
     if (localStorage["Performance_Mode"] == 'false') {
          var body = await GetDocumentBody()
          for (let i = 0; i <= loaded_bar_amount; i++) {
               const element = document.createElement('div');
               body.append(element)
               element.className = "loaded-bar"
               element.style.top = `${i * cal_loaded_bar_size}%`
               element.style.height = `${cal_loaded_bar_size}%`
               setTimeout(async () => {
                    await WaitDocumentLoaded()
                    setTimeout(async () => {
                         element.setAttribute("slided", "")
                         await sleep(1000)
                         element.remove()
                    }, 100 * i);
               }, 0);
          }
     }
}

function press_enter(id, event) {
     console.log(event)
     if (event.key == "Enter") {
          var element = document.getElementById(id)
          //console.log(element, element.tagName)
          element.focus()
          if (element.tagName != "INPUT") {
               element.click()
          }
     }
}

function focus_by_id(id) {
     var element = document.getElementById(id)
     if (element) {
          element.focus()
     }
}

function set_blank(name, value) {
     if (localStorage[name] == null || localStorage[name] == 'undefined') {
          localStorage[name] = value
     }
}

var screen_transition;

async function Page_transition() {
     if (Performance_Mode == true) {
          return
     }
     if (screen_transition) {
          screen_transition.remove()
          screen_transition = null
     }
     screen_transition = document.createElement('div')
     screen_transition.className = "blackscreen-next-page"
     screen_transition.style.backgroundPositionX = '0%'
     setTimeout(() => {
          screen_transition.style.backgroundPositionX = '100%'
     }, 1);
     var body = await GetDocumentBody()
     body.append(screen_transition)
}

async function Un_Page_transition() {
     if (screen_transition) {
          var temp = screen_transition
          screen_transition = null;
          temp.style.backgroundPositionX = '0%'
          setTimeout(() => {
               temp.remove()
          }, 200);
     }
}

window.addEventListener('pageshow', function () {
     if (screen_transition) {
          var temp = screen_transition
          screen_transition = null;
          temp.remove()
     }
})

Performance_Mode = false

async function Load_Document() {
     set_blank("Performance_Mode", "false")
     //--------------------------------------
     var params = getUrlParams(window.location.href)
     if (params["performance"] != null) {
          localStorage["Performance_Mode"] = params["performance"]
     }
     if (params["dark_mode"] != null) {
          localStorage["dark_mode"] = params["dark_mode"]
     }
     //--------------------------------------
     Performance_Mode = JSON.parse(localStorage["Performance_Mode"])
     console.log(Performance_Mode)
     if (localStorage["Performance_Mode"] == "false") {
          document.documentElement.setAttribute("enable-animation", '')
     }
     if (localStorage["dark_mode"] == "false") {
          document.documentElement.setAttribute("enable-light", '')
     }
     //--------------------------------------
     await WaitDocumentLoaded()
     document.documentElement.setAttribute("loaded", '')
     document.getElementById("black_screen").remove()
}

Load_Document()