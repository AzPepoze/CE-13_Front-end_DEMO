Loaded_animation()

async function Expand_center() {
     var expand_center = document.querySelector("#master-center[show-horizontal]")
     if (expand_center.getAttribute("show") != "") {
          expand_center.setAttribute("show", "")
     } else {
          expand_center.removeAttribute("show")
     }
}

async function Change_Page(element, event) {
     event.preventDefault();
     const url = element.getAttribute('href');

     history.pushState(null, '', url);
     Apply_Page(url)
}

async function Apply_Page(url) {
     if (url == null) {
          url = window.location.href
     }
     var page = getUrlParams(url)["page"]
     if (!page) {
          page = "Problems"
          history.replaceState(null, '', `${getOnlyUrl(window.location.href)}?page=${page}`);
     }
     url = `${getOnlyUrl(window.location.href).replace(/\/index.html$/, '')}/pages/${page}.html`
     fetch(url)
          .then(response => response.text())
          .then(data => {
               const newContent = new DOMParser().parseFromString(data, 'text/html').querySelector('#content').innerHTML;
               document.getElementById('content').innerHTML = newContent;
          })
          .catch(error => console.error('Error:', error));
}

async function Main() {
     await WaitDocumentLoaded()
}

Apply_Page()
Main()


window.addEventListener('popstate', () => {
     const url = window.location.href;
     Apply_Page(url)
});