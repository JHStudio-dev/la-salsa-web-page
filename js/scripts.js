document.addEventListener('DOMContentLoaded', () => {
    const navbar = document.querySelector('.jh-navbar');

    // Función para manejar el cambio de estilo al hacer scroll
    const handleScroll = () => {
        if (window.scrollY > 50) {
            navbar.classList.add('navbar-scrolled');
        } else {
            navbar.classList.remove('navbar-scrolled');
        }
    };

    window.addEventListener('scroll', handleScroll);

    // Ejecutar una vez al cargar por si la página ya tiene scroll
    handleScroll();
});