async function Load_background() {
     var image = document.createElement('img')
     image.className = "bg"
     image.src = "../../global/img/bg.jpg"
     image.style = `
     transform: scale(1.5);
     opacity: 0;
     filter: blur(10px);`
     var body = await GetDocumentBody()
     body.appendChild(image)
     await WaitDocumentLoaded()
     image.style = ``
}

if (!Performance_Mode) {
     Load_background()
}