Loaded_animation()

create_wave(1)
create_wave(5)

var menu_href = '../menu/index.html'

function toggle_password() {
     var password = document.getElementById("password");
     var show_password = document.getElementById("show-password");
     if (password.getAttribute("show") == "true") {
          password.setAttribute("show", "false")
          password.type = "password"
          show_password.textContent = "😎"
          show_password.removeAttribute('button-selected')
     } else {
          password.setAttribute("show", "true")
          password.type = "text"
          show_password.textContent = "😱"
          show_password.setAttribute('button-selected','')
     }
     focus_by_id("password")
}

function login() {
     var email = document.getElementById("email")
     var password = document.getElementById("password");

     if (true) {
          //localStorage["user_id"] = "Test"
          Page_transition()
          setTimeout(() => {
               window.location.href = menu_href
          }, 500);
          // setTimeout(() => {
          //      Un_Page_transition()
          // }, 1000);
     } else {

     }

     //window.location.href = menu_href
}

async function Main() {
     if (localStorage["user_id"] && localStorage["user_id"] !== "") {
          window.location.href = menu_href
     }
     await WaitDocumentLoaded()

     document.getElementById("main-login").removeAttribute("hide")

     document.getElementById("email").focus()
}

Main()