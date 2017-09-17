xs.periodic(1000).fold(prev => prev + 1, 0).map(i => `Seconds elapsed ${i}`).subscribe({
  next: message => {
    const app = document.querySelector('#app');
    app.textContent = message;
  }
});
