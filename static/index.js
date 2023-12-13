// Commenting to make sure this file can accessed through express
function parseunsafeHTML(unclean)
 {
    return unclean
         .replace(/&/g, "&amp;")
         .replace(/</g, "&lt;")
         .replace(/>/g, "&gt;")
         .replace(/"/g, "&quot;")
         .replace(/'/g, "&#039;");
}



class notification {
  constructor(event) {
    this.message = parseunsafeHTML(event);
    this.notification = document.createElement("div")
    this.notification.id = "notification"
    this.notification.innerHTML = `<p>${this.message}</p>`
    document.body.appendChild(this.notification)
  }

  show() {
    this.notification.classList.add("shown")
    setTimeout(() => {
      this.notification.classList.remove("shown")
    }, 1500);
  }
}

addEventListener("load", (event) => {
  if(window.location.search) {
  let urlParams = new URLSearchParams(window.location.search)
  let toast_notification = new notification(urlParams.get('message'))
  if(urlParams.get('submission') == "true") {
   toast_notification.notification.classList.add("correct") 
   console.log(toast_notification.notification)
  }
  toast_notification.show();
}
});



