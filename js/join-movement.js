// Join Movement Modal Functionality
document.addEventListener('DOMContentLoaded', () => {
    // Tab switching functionality
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
            button.classList.add('active');
            const tabId = button.getAttribute('data-tab');
            document.getElementById(`${tabId}-tab`).classList.add('active');
        });
    });

    // Handle "Others" business type
    const businessTypeSelect = document.getElementById('businessType');
    const otherBusinessType = document.getElementById('otherBusinessType');
    if (businessTypeSelect && otherBusinessType) {
        const charCount = otherBusinessType.querySelector('.char-count');
        const textarea = otherBusinessType.querySelector('textarea');

        businessTypeSelect.addEventListener('change', () => {
            otherBusinessType.style.display = 
                businessTypeSelect.value === 'others' ? 'block' : 'none';
        });

        if (textarea && charCount) {
            textarea.addEventListener('input', () => {
                charCount.textContent = `${textarea.value.length}/200`;
            });
        }
    }

    // Form submission handling
    const handleSubmit = async (event) => {
        event.preventDefault();
        const form = event.target;
        const formData = new FormData(form);
        const formType = form.id === 'enthusiastsForm' ? 'enthusiast' : 'business';

        // Email validation
        const email = formData.get('email');
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            alert('Please enter a valid email address');
            return;
        }

        // Business type validation
        if (formType === 'business' && 
            formData.get('businessType') === 'others' && 
            !formData.get('otherBusinessTypeText')) {
            alert('Please specify your business type');
            return;
        }

        try {
            const submitButton = form.querySelector('button[type="submit"]');
            submitButton.textContent = 'Submitting...';
            submitButton.disabled = true;

            // Add form type and timestamp to the form data
            formData.append('formType', formType);
            formData.append('timestamp', new Date().toISOString());

            // Send request with form data
            const response = await fetch(scriptURL, {
                method: 'POST',
                mode: 'no-cors',
                body: formData
            });

            // Since we're using no-cors, we can't read the response
            // We'll assume success if we get here
            alert('Thank you for joining the movement! We will be in touch soon.');
            document.getElementById('joinMovementModal').style.display = 'none';
            form.reset();

        } catch (error) {
            console.error('Error:', error);
            alert('Sorry, there was an error submitting the form. Please try again.');
        } finally {
            const submitButton = form.querySelector('button[type="submit"]');
            submitButton.textContent = 'Submit';
            submitButton.disabled = false;
        }
    };

    document.getElementById('enthusiastsForm')?.addEventListener('submit', handleSubmit);
    document.getElementById('businessForm')?.addEventListener('submit', handleSubmit);

    // Modal open/close functionality
    const modal = document.getElementById('joinMovementModal');
    const openButtons = document.querySelectorAll('[href="#"].button');
    const closeButton = document.querySelector('.close');

    openButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            modal.style.display = 'block';
        });
    });

    closeButton?.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });

    // Populate country dropdowns
    const countries = [
        "Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Antigua and Barbuda", "Argentina", "Armenia", "Australia", "Austria", "Azerbaijan",
        "Bahamas", "Bahrain", "Bangladesh", "Barbados", "Belarus", "Belgium", "Belize", "Benin", "Bhutan", "Bolivia", "Bosnia and Herzegovina",
        "Botswana", "Brazil", "Brunei", "Bulgaria", "Burkina Faso", "Burundi", "Cabo Verde", "Cambodia", "Cameroon", "Canada", "Central African Republic",
        "Chad", "Chile", "China", "Colombia", "Comoros", "Congo", "Costa Rica", "Croatia", "Cuba", "Cyprus", "Czech Republic", "Denmark", "Djibouti",
        "Dominica", "Dominican Republic", "Ecuador", "Egypt", "El Salvador", "Equatorial Guinea", "Eritrea", "Estonia", "Eswatini", "Ethiopia", "Fiji",
        "Finland", "France", "Gabon", "Gambia", "Georgia", "Germany", "Ghana", "Greece", "Grenada", "Guatemala", "Guinea", "Guinea-Bissau", "Guyana",
        "Haiti", "Honduras", "Hungary", "Iceland", "India", "Indonesia", "Iran", "Iraq", "Ireland", "Israel", "Italy", "Jamaica", "Japan", "Jordan",
        "Kazakhstan", "Kenya", "Kiribati", "Korea, North", "Korea, South", "Kosovo", "Kuwait", "Kyrgyzstan", "Laos", "Latvia", "Lebanon", "Lesotho",
        "Liberia", "Libya", "Liechtenstein", "Lithuania", "Luxembourg", "Madagascar", "Malawi", "Malaysia", "Maldives", "Mali", "Malta", "Marshall Islands",
        "Mauritania", "Mauritius", "Mexico", "Micronesia", "Moldova", "Monaco", "Mongolia", "Montenegro", "Morocco", "Mozambique", "Myanmar", "Namibia",
        "Nauru", "Nepal", "Netherlands", "New Zealand", "Nicaragua", "Niger", "Nigeria", "North Macedonia", "Norway", "Oman", "Pakistan", "Palau",
        "Palestine", "Panama", "Papua New Guinea", "Paraguay", "Peru", "Philippines", "Poland", "Portugal", "Qatar", "Romania", "Russia", "Rwanda",
        "Saint Kitts and Nevis", "Saint Lucia", "Saint Vincent and the Grenadines", "Samoa", "San Marino", "Sao Tome and Principe", "Saudi Arabia",
        "Senegal", "Serbia", "Seychelles", "Sierra Leone", "Singapore", "Slovakia", "Slovenia", "Solomon Islands", "Somalia", "South Africa",
        "South Sudan", "Spain", "Sri Lanka", "Sudan", "Suriname", "Sweden", "Switzerland", "Syria", "Taiwan", "Tajikistan", "Tanzania", "Thailand",
        "Timor-Leste", "Togo", "Tonga", "Trinidad and Tobago", "Tunisia", "Turkey", "Turkmenistan", "Tuvalu", "Uganda", "Ukraine",
        "United Arab Emirates", "United Kingdom", "United States", "Uruguay", "Uzbekistan", "Vanuatu", "Vatican City", "Venezuela", "Vietnam",
        "Yemen", "Zambia", "Zimbabwe"
    ];

    const countrySelects = document.querySelectorAll('select[name="country"]');
    const countryOptions = countries.map(country => 
        `<option value="${country}">${country}</option>`
    ).join('');
    
    countrySelects.forEach(select => {
        select.innerHTML = '<option value="">Select Country</option>' + countryOptions;
    });
});