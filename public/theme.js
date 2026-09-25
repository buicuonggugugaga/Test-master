(function () {
    const STORAGE_KEY = 'testmasterTheme';
    const root = document.documentElement;

    function getInitialTheme() {
        const savedTheme = localStorage.getItem(STORAGE_KEY);
        if (savedTheme === 'dark' || savedTheme === 'light') return savedTheme;
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }

    function applyTheme(theme) {
        root.dataset.theme = theme;
        root.style.colorScheme = theme;
        localStorage.setItem(STORAGE_KEY, theme);
        window.dispatchEvent(new CustomEvent('themechange', { detail: { theme } }));

        const button = document.getElementById('theme-toggle');
        if (button) {
            const isDark = theme === 'dark';
            button.textContent = isDark ? '☀' : '☾';
            button.setAttribute('aria-label', isDark ? 'Chuyển sang chế độ sáng' : 'Chuyển sang chế độ tối');
            button.title = isDark ? 'Chế độ sáng' : 'Chế độ tối';
        }
    }

    applyTheme(getInitialTheme());
    // Drop the drag position saved by older versions of the toggle.
    localStorage.removeItem('testmasterThemeTogglePosition');

    document.addEventListener('DOMContentLoaded', () => {
        document.querySelectorAll('.navbar .container').forEach((container, index) => {
            const navLinks = container.querySelector('.nav-links');
            if (!navLinks || container.querySelector('.nav-menu-toggle')) return;

            if (!navLinks.id) {
                navLinks.id = `nav-menu-${index + 1}`;
            }

            const menuButton = document.createElement('button');
            menuButton.type = 'button';
            menuButton.className = 'nav-menu-toggle';
            menuButton.setAttribute('aria-label', 'Mở menu điều hướng');
            menuButton.setAttribute('aria-controls', navLinks.id);
            menuButton.setAttribute('aria-expanded', 'false');
            menuButton.innerHTML = '<span></span><span></span><span></span>';

            function setMenuOpen(isOpen) {
                navLinks.classList.toggle('is-open', isOpen);
                menuButton.classList.toggle('is-open', isOpen);
                menuButton.setAttribute('aria-expanded', String(isOpen));
                menuButton.setAttribute('aria-label', isOpen ? 'Đóng menu điều hướng' : 'Mở menu điều hướng');
            }

            menuButton.addEventListener('click', (event) => {
                event.stopPropagation();
                setMenuOpen(!navLinks.classList.contains('is-open'));
            });

            navLinks.addEventListener('click', (event) => {
                if (event.target.closest('a')) setMenuOpen(false);
            });

            document.addEventListener('click', (event) => {
                if (!container.contains(event.target)) setMenuOpen(false);
            });

            document.addEventListener('keydown', (event) => {
                if (event.key === 'Escape') setMenuOpen(false);
            });

            window.addEventListener('resize', () => {
                if (window.innerWidth > 768) setMenuOpen(false);
            });

            container.insertBefore(menuButton, navLinks);
        });

        if (document.getElementById('theme-toggle')) return;

        const button = document.createElement('button');
        button.id = 'theme-toggle';
        button.type = 'button';
        button.className = 'theme-toggle';
        // Fixed to the bottom-left corner (see .theme-toggle in style.css).
        button.addEventListener('click', () => {
            applyTheme(root.dataset.theme === 'dark' ? 'light' : 'dark');
        });
        document.body.appendChild(button);
        applyTheme(root.dataset.theme || 'light');
    });
})();
