const form = document.querySelector('.formOne');
form.addEventListener('submit', (e) => {
    e.preventDefault();
    const fd = new FormData(form);
    fetch("http://localhost:3000/results", {
        method: "POST",
        body: fd,
    }).then(res => res.json())
    .then(data => {
        console.log(data);
    })
})