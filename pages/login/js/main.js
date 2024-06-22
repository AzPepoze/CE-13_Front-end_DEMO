Loaded_animation()

create_wave(1)
create_wave(5)

function toggle_password() {
     var password = document.getElementById("password");
     var show_password = document.getElementById("show-password");
     if (password.getAttribute("show") == "true") {
          password.setAttribute("show", "false")
          password.type = "password"
          show_password.textContent = "😎"
     } else {
          password.setAttribute("show", "true")
          password.type = "text"
          show_password.textContent = "😱"
     }
     focus_by_id("password")
}

async function Main() {
     await WaitDocumentLoaded()

     document.getElementById("main-login").removeAttribute("hide")
     
     document.getElementById("email").focus()
}

Main()