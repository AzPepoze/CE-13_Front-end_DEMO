Loaded_animation()

async function Expand_center() {
     var expand_center = document.querySelector("#master-center[show-horizontal]")
     if (expand_center.getAttribute("show") != "") {
          expand_center.setAttribute("show","")
     } else {
          expand_center.removeAttribute("show")
     }
}

async function Main() {
     await WaitDocumentLoaded()
}

Main()