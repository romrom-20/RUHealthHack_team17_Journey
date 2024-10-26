const form = document.querySelector('formOne');
form.addEventListener('submit', (e) => {
    e.preventDefault;
    const fd = new FormData(form);
    fetch("http://localhost:5000", {
        method: "POST",
        body: fd,
        headers: {
            "Content-type": "application/x-www-form-urlencoded",
        },
    }).then(res => res.json())
})