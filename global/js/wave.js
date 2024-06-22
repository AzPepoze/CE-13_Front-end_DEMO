async function create_wave(speed) {
     if (Performance_Mode) {
          return
     }
     var wave = document.createElement("div");
     wave.className = "wave"
     wave.style.animation = `SlideWave ${speed}s infinite linear, Rainbow 1s infinite linear`
     var body = await GetDocumentBody()
     body.appendChild(wave)
}