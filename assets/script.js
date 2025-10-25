
     // Mobile Menu Toggle
        const mobileMenu = document.getElementById('mobileMenu');
        const closeMenu = document.getElementById('closeMenu');
        const nav = document.getElementById('mainNav');
        
        mobileMenu.addEventListener('click', () => {
            nav.classList.add('active');
            document.body.style.overflow = 'hidden'; // Prevent scrolling when menu is open
        });
        
        closeMenu.addEventListener('click', () => {
            nav.classList.remove('active');
            document.body.style.overflow = ''; // Restore scrolling
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (nav.classList.contains('active') && 
                !nav.contains(e.target) && 
                !mobileMenu.contains(e.target)) {
                nav.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
        
        // Mobile Dropdown Toggle
        const dropdownToggles = document.querySelectorAll('.dropdown-toggle');
        
        dropdownToggles.forEach(toggle => {
            toggle.addEventListener('click', (e) => {
                if (window.innerWidth <= 768) {
                    e.preventDefault();
                    const dropdown = toggle.nextElementSibling;
                    const isActive = dropdown.classList.contains('active');
                    
                    // Close all other dropdowns
                    document.querySelectorAll('.dropdown.active').forEach(d => {
                        if (d !== dropdown) d.classList.remove('active');
                    });
                    
                    // Toggle current dropdown
                    dropdown.classList.toggle('active');
                    
                    // Rotate chevron icon
                    const icon = toggle.querySelector('i');
                    if (dropdown.classList.contains('active')) {
                        icon.style.transform = 'rotate(180deg)';
                    } else {
                        icon.style.transform = 'rotate(0)';
                    }
                }
            });
        });
        
        // Theme Toggle
        const themeToggle = document.getElementById('themeToggle');
        const body = document.body;
        
        themeToggle.addEventListener('click', () => {
            if (body.classList.contains('light-theme')) {
                body.classList.remove('light-theme');
                body.classList.add('dark-theme');
                themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
                localStorage.setItem('theme', 'dark');
            } else {
                body.classList.remove('dark-theme');
                body.classList.add('light-theme');
                themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
                localStorage.setItem('theme', 'light');
            }
        });
        
        // Check for saved theme preference
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) {
            body.classList.remove('light-theme', 'dark-theme');
            body.classList.add(savedTheme + '-theme');
            themeToggle.innerHTML = savedTheme === 'dark' ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
        }
        
       // NAV INIT - safe to call multiple times (e.g. after fetch)
function initNav() {
  // Elements (guarded)
  const mobileMenu = document.getElementById('mobileMenu');
  const closeMenu = document.getElementById('closeMenu');
  const nav = document.getElementById('mainNav');
  const body = document.body;

  // If nav isn't present, nothing to do
  if (!nav) return;

  // Ensure mobileMenu/closeMenu exist (may be optional)
  // Mobile open
  if (mobileMenu) {
    mobileMenu.addEventListener('click', (e) => {
      e.stopPropagation();
      nav.classList.add('active');
      body.style.overflow = 'hidden';
    });
  }

  // Mobile close
  if (closeMenu) {
    closeMenu.addEventListener('click', (e) => {
      e.stopPropagation();
      nav.classList.remove('active');
      body.style.overflow = '';
      // Reset dropdowns and chevrons
      resetDropdowns();
    });
  }

  // Helper: reset dropdowns & chevrons
  function resetDropdowns() {
    document.querySelectorAll('.dropdown').forEach(d => d.classList.remove('active'));
    document.querySelectorAll('.dropdown-toggle i').forEach(icon => {
      icon.style.transform = 'rotate(0)';
    });
  }

  // Click outside to close (mobile only)
  document.addEventListener('click', (e) => {
    if (window.innerWidth <= 768) {
      // If click is not inside nav or the mobileMenu button
      const path = e.composedPath ? e.composedPath() : (e.path || []);
      const clickedInsideNav = path.includes(nav) || (mobileMenu && path.includes(mobileMenu));
      if (!clickedInsideNav) {
        nav.classList.remove('active');
        body.style.overflow = '';
        resetDropdowns();
      }
    }
  });

  // Mobile dropdown toggles (delegated)
  // Works even if dropdown-toggle elements are added later
  document.addEventListener('click', (e) => {
    const toggle = e.target.closest('.dropdown-toggle');
    if (!toggle) return;

    // Only handle mobile behavior for small screens
    if (window.innerWidth <= 768) {
      e.preventDefault();
      const dropdown = toggle.nextElementSibling;
      if (!dropdown || !dropdown.classList.contains('dropdown')) return;

      // Close other dropdowns
      document.querySelectorAll('.dropdown.active').forEach(d => {
        if (d !== dropdown) d.classList.remove('active');
      });

      // Toggle current dropdown
      const isActive = dropdown.classList.toggle('active');

      // Rotate chevron icon if present
      const icon = toggle.querySelector('i');
      if (icon) icon.style.transform = isActive ? 'rotate(180deg)' : 'rotate(0)';
    }
  });

  // Reset on resize (debounced)
  let resizeTimer = null;
  window.addEventListener('resize', () => {
    if (resizeTimer) clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      // On switching to desktop, ensure mobile menu closed
      if (window.innerWidth > 768 && nav.classList.contains('active')) {
        nav.classList.remove('active');
        body.style.overflow = '';
      }
      // Reset all dropdowns & chevrons
      resetDropdowns();
    }, 120);
  });

  // Desktop dropdown positioning on hover (mouseenter)
  // Use mouseenter only on pointer capable devices (desktop)
  // Add listeners to li elements that contain dropdowns
  document.querySelectorAll('nav ul li').forEach(li => {
    const dropdown = li.querySelector('.dropdown');
    if (!dropdown) return;

    // For keyboard accessibility, also show on focus of the link
    const link = li.querySelector('a, button');
    li.addEventListener('mouseenter', () => {
      // Only run this for desktop widths
      if (window.innerWidth <= 768) return;

      // reset inline positioning first
      dropdown.style.left = '';
      dropdown.style.right = '';

      const rect = dropdown.getBoundingClientRect();
      const overflowRight = rect.right - window.innerWidth;
      const overflowLeft = rect.left;

      if (overflowRight > 0 && overflowLeft >= 0) {
        // shift to the left side of parent so right aligns
        dropdown.style.left = 'auto';
        dropdown.style.right = '0';
      } else {
        dropdown.style.left = '0';
        dropdown.style.right = 'auto';
      }

      // ensure visible (desktop uses CSS :hover but in case)
      dropdown.classList.add('visible-by-js');
    });

    li.addEventListener('mouseleave', () => {
      // remove any JS-only visible indicator
      dropdown.classList.remove('visible-by-js');
    });

    // keyboard: show positioning when link receives focus
    if (link) {
      link.addEventListener('focus', () => {
        if (window.innerWidth <= 768) return;
        dropdown.style.left = '';
        dropdown.style.right = '';
        const rect = dropdown.getBoundingClientRect();
        const overflowRight = rect.right - window.innerWidth;
        if (overflowRight > 0) {
          dropdown.style.left = 'auto';
          dropdown.style.right = '0';
        } else {
          dropdown.style.left = '0';
          dropdown.style.right = 'auto';
        }
      });
    }
  });

  // Optional: remove any leftover inline transforms on icons if switching to desktop
  window.matchMedia('(min-width: 769px)').addEventListener?.('change', (e) => {
    if (e.matches) resetDropdowns();
  });
}

// Run on DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initNav);
} else {
  initNav();
}

/* 
If you load footer via fetch(), call initNav() again after insertion:
fetch('footer.html').then(r => r.text()).then(html => {
  document.getElementById('siteFooter').innerHTML = html;
  initNav(); // ensure handlers on footer elements are attached
});
*/


