// 🔧 SCRIPT MEJORADO PARA FORMULARIO DE CONTACTO
// Versión corregida que maneja errores y usa la API correctamente

// 🎨 INYECTAR ESTILOS CSS PARA EL FORMULARIO
function injectFormStyles() {
  const style = document.createElement('style');
  style.textContent = `
    /* Estilos del formulario de contacto */
    #gravity-form-container {
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
    }
    
    #gravity-form-container.form-loading {
      min-height: 400px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    
    .loading-message, .error-message {
      text-align: center;
      padding: 40px 20px;
    }
    
    .loading-message p, .error-message p {
      margin: 10px 0;
      color: #666;
    }
    
    .error-message {
      color: #dc3545;
    }
    
    .spinner {
      animation: rotate 2s linear infinite;
      width: 50px;
      height: 50px;
      margin: 0 auto 20px;
    }
    
    .spinner .path {
      stroke: #3b82f6;
      stroke-linecap: round;
      animation: dash 1.5s ease-in-out infinite;
    }
    
    @keyframes rotate {
      100% { transform: rotate(360deg); }
    }
    
    @keyframes dash {
      0% { stroke-dasharray: 1, 150; stroke-dashoffset: 0; }
      50% { stroke-dasharray: 90, 150; stroke-dashoffset: -35; }
      100% { stroke-dasharray: 90, 150; stroke-dashoffset: -124; }
    }
    
    .contact-form {
      display: flex;
      flex-direction: column;
      gap: 24px;
    }
    
    .form-group {
      display: flex;
      flex-direction: column;
      gap: 8px;
      transition: all 0.3s ease;
    }
    
    .form-group.has-error input,
    .form-group.has-error textarea,
    .form-group.has-error select {
      border-color: #dc3545;
      background-color: #fff5f5;
    }
    
    .form-group label {
      font-weight: 600;
      color: #1a1a1a;
      font-size: 0.95rem;
      margin-bottom: 4px;
    }
    
    .dark .form-group label {
      color: #f3f4f6;
    }
    
    .form-group input,
    .form-group textarea,
    .form-group select {
      width: 100%;
      padding: 12px 16px;
      border: 2px solid #e5e7eb;
      border-radius: 8px;
      font-size: 16px;
      background-color: #ffffff;
      transition: all 0.3s ease;
      font-family: inherit;
    }
    
    .dark .form-group input,
    .dark .form-group textarea,
    .dark .form-group select {
      background-color: #1f2937;
      border-color: #374151;
      color: #f3f4f6;
    }
    
    .form-group input:focus,
    .form-group textarea:focus,
    .form-group select:focus {
      outline: none;
      border-color: #3b82f6;
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
    }
    
    .form-group textarea {
      min-height: 120px;
      resize: vertical;
    }
    
    .field-error {
      color: #dc3545;
      font-size: 0.875rem;
      margin-top: 4px;
      animation: slideIn 0.3s ease;
    }
    
    @keyframes slideIn {
      from { opacity: 0; transform: translateY(-10px); }
      to { opacity: 1; transform: translateY(0); }
    }
    
    .form-actions {
      margin-top: 12px;
    }
    
    .btn.primary-btn {
      width: 100%;
      padding: 14px 24px;
      background: linear-gradient(135deg, #3b82f6, #2563eb);
      color: white;
      border: none;
      border-radius: 8px;
      font-size: 1.05rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
      position: relative;
      overflow: hidden;
    }
    
    .btn.primary-btn:hover {
      background: linear-gradient(135deg, #2563eb, #1d4ed8);
      transform: translateY(-2px);
      box-shadow: 0 10px 20px rgba(37, 99, 235, 0.3);
    }
    
    .btn.primary-btn:disabled,
    .btn.primary-btn.loading {
      opacity: 0.7;
      cursor: not-allowed;
      transform: none;
    }
    
    .spinner-small {
      display: inline-block;
      width: 16px;
      height: 16px;
      border: 2px solid rgba(255, 255, 255, 0.3);
      border-radius: 50%;
      border-top-color: white;
      animation: spin 0.8s linear infinite;
      margin-right: 8px;
      vertical-align: middle;
    }
    
    @keyframes spin {
      to { transform: rotate(360deg); }
    }
    
    .form-message {
      padding: 20px;
      border-radius: 8px;
      margin-top: 20px;
      text-align: center;
      animation: fadeIn 0.5s ease;
    }
    
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }
    
    .form-message.success {
      background-color: #f0fdf4;
      border: 1px solid #86efac;
      color: #166534;
    }
    
    .form-message.error {
      background-color: #fef2f2;
      border: 1px solid #fca5a5;
      color: #991b1b;
    }
    
    .success-icon, .error-icon {
      font-size: 3rem;
      margin-bottom: 10px;
    }
    
    .success-icon { color: #10b981; }
    .error-icon { color: #ef4444; }
    
    .form-message p { margin: 8px 0; }
    .form-message strong { font-weight: 700; }
    
    .form-message a {
      color: #3b82f6;
      text-decoration: none;
      font-weight: 600;
    }
    
    .form-message a:hover {
      text-decoration: underline;
    }
  `;
  document.head.appendChild(style);
}

// Inyectar estilos al cargar
injectFormStyles();

document.addEventListener('DOMContentLoaded', async function() {
  console.log('🚀 Iniciando carga del formulario de contacto...');
  
  const container = document.getElementById('gravity-form-container');
  const loadingMessage = container?.querySelector('.loading-message');
  const errorMessage = container?.querySelector('.error-message');
  
  if (!container) {
    console.error('❌ No se encontró el contenedor del formulario');
    return;
  }
  
  try {
    console.log('📡 Cargando estructura del formulario...');
    
    // ✅ CARGAR FORMULARIO con manejo de errores mejorado
    const formResponse = await fetch('/api/gravity-form', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });
    
    console.log('📊 Status respuesta:', formResponse.status);
    
    if (!formResponse.ok) {
      const errorText = await formResponse.text();
      console.error('❌ Error del servidor:', errorText);
      throw new Error(`Error ${formResponse.status}: No se pudo cargar el formulario`);
    }
    
    const formData = await formResponse.json();
    console.log('✅ Formulario cargado:', formData);
    
    if (!formData || !formData.fields || !Array.isArray(formData.fields)) {
      throw new Error('Estructura de formulario inválida');
    }
    
    // ✅ CONSTRUIR FORMULARIO dinámicamente
    const form = document.createElement('form');
    form.id = 'gravityForm';
    form.className = 'contact-form';
    form.noValidate = true; // Validación personalizada
    
    // ✅ CREAR CAMPOS con validación mejorada
    formData.fields.forEach((field, index) => {
      const fieldGroup = createFormField(field, index);
      form.appendChild(fieldGroup);
    });
    
    // ✅ BOTÓN DE ENVÍO
    const submitDiv = createSubmitButton(formData.button?.text || 'Enviar mensaje');
    form.appendChild(submitDiv);
    
    // ✅ MENSAJE DE RESULTADO
    const formMessage = document.createElement('div');
    formMessage.id = 'formMessage';
    formMessage.className = 'form-message';
    formMessage.style.display = 'none';
    
    // ✅ MANEJAR ENVÍO con validación y feedback mejorado
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      console.log('📝 Enviando formulario...');
      
      // Validar formulario
      if (!validateForm(form)) {
        console.log('❌ Validación fallida');
        return;
      }
      
      await submitForm(form, formMessage, formData);
    });
    
    // ✅ REEMPLAZAR CONTENIDO
    container.innerHTML = '';
    container.appendChild(form);
    container.appendChild(formMessage);
    container.classList.remove('form-loading');
    
    console.log('✅ Formulario renderizado correctamente');
    
  } catch (error) {
    console.error('❌ Error cargando formulario:', error);
    showFormError(container, error.message);
  }
});

// ✅ FUNCIÓN PARA CREAR CAMPOS DE FORMULARIO
function createFormField(field, index) {
  const fieldGroup = document.createElement('div');
  fieldGroup.className = 'form-group';
  fieldGroup.style.opacity = '0';
  fieldGroup.style.transform = 'translateY(20px)';
  
  // Label
  const label = document.createElement('label');
  label.htmlFor = `input_${field.id}`;
  label.textContent = field.label + (field.isRequired ? ' *' : '');
  fieldGroup.appendChild(label);
  
  // Campo de entrada
  let inputElement;
  
  switch (field.type) {
    case 'text':
    case 'name':
      inputElement = document.createElement('input');
      inputElement.type = 'text';
      break;
      
    case 'email':
      inputElement = document.createElement('input');
      inputElement.type = 'email';
      break;
      
    case 'phone':
      inputElement = document.createElement('input');
      inputElement.type = 'tel';
      break;
      
    case 'textarea':
      inputElement = document.createElement('textarea');
      inputElement.rows = 5;
      break;
      
    case 'select':
      inputElement = document.createElement('select');
      
      // Opción vacía
      const emptyOption = document.createElement('option');
      emptyOption.value = '';
      emptyOption.textContent = field.placeholder || 'Selecciona una opción';
      inputElement.appendChild(emptyOption);
      
      // Opciones del campo
      if (field.choices) {
        field.choices.forEach(choice => {
          const option = document.createElement('option');
          option.value = choice.value;
          option.textContent = choice.text;
          inputElement.appendChild(option);
        });
      }
      break;
      
    default:
      inputElement = document.createElement('input');
      inputElement.type = 'text';
  }
  
  // Configurar atributos del campo
  inputElement.id = `input_${field.id}`;
  inputElement.name = `input_${field.id}`;
  inputElement.placeholder = field.placeholder || '';
  inputElement.required = field.isRequired || false;
  
  // Añadir campo al grupo
  fieldGroup.appendChild(inputElement);
  
  // Animación de entrada
  setTimeout(() => {
    fieldGroup.style.transition = 'all 0.5s ease-out';
    fieldGroup.style.opacity = '1';
    fieldGroup.style.transform = 'translateY(0)';
  }, 100 + (index * 100));
  
  return fieldGroup;
}

// ✅ FUNCIÓN PARA CREAR BOTÓN DE ENVÍO
function createSubmitButton(buttonText) {
  const submitDiv = document.createElement('div');
  submitDiv.className = 'form-actions';
  submitDiv.style.opacity = '0';
  submitDiv.style.transform = 'translateY(20px)';
  
  const submitButton = document.createElement('button');
  submitButton.type = 'submit';
  submitButton.className = 'btn primary-btn';
  submitButton.innerHTML = `<span>${buttonText}</span>`;
  submitDiv.appendChild(submitButton);
  
  // Animación del botón
  setTimeout(() => {
    submitDiv.style.transition = 'all 0.5s ease-out';
    submitDiv.style.opacity = '1';
    submitDiv.style.transform = 'translateY(0)';
  }, 600);
  
  return submitDiv;
}

// ✅ FUNCIÓN PARA VALIDAR FORMULARIO
function validateForm(form) {
  let isValid = true;
  const formData = new FormData(form);
  
  // Limpiar errores previos
  form.querySelectorAll('.field-error').forEach(error => error.remove());
  form.querySelectorAll('.form-group').forEach(group => group.classList.remove('has-error'));
  
  // Validar cada campo requerido
  for (let [key, value] of formData.entries()) {
    const input = form.querySelector(`[name="${key}"]`);
    const fieldGroup = input?.closest('.form-group');
    
    if (input?.required && (!value || value.toString().trim() === '')) {
      showFieldError(fieldGroup, 'Este campo es obligatorio');
      isValid = false;
    } else if (input?.type === 'email' && value && !isValidEmail(value.toString())) {
      showFieldError(fieldGroup, 'Por favor, introduce un email válido');
      isValid = false;
    }
  }
  
  return isValid;
}

// ✅ FUNCIÓN PARA MOSTRAR ERROR DE CAMPO
function showFieldError(fieldGroup, message) {
  if (!fieldGroup) return;
  
  fieldGroup.classList.add('has-error');
  
  const errorDiv = document.createElement('div');
  errorDiv.className = 'field-error';
  errorDiv.textContent = message;
  fieldGroup.appendChild(errorDiv);
}

// ✅ FUNCIÓN PARA VALIDAR EMAIL
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// ✅ FUNCIÓN PARA ENVIAR FORMULARIO
async function submitForm(form, messageContainer, formData) {
  const submitButton = form.querySelector('button[type="submit"]');
  const originalText = submitButton.innerHTML;
  
  try {
    // Estado de carga
    submitButton.innerHTML = '<span class="spinner-small"></span> Enviando...';
    submitButton.disabled = true;
    submitButton.classList.add('loading');
    
    // Preparar datos del formulario
    const formDataToSend = new FormData(form);
    const entry = {};
    
    // ✅ FORMATO CORRECTO para Gravity Forms API v2
    for (let [key, value] of formDataToSend.entries()) {
      if (value && value.toString().trim()) {
        const fieldId = key.replace('input_', '');
        entry[fieldId] = value.toString().trim();
      }
    }
    
    console.log('📋 Datos a enviar:', entry);
    
    // Enviar formulario
    const submitResponse = await fetch('/api/gravity-form', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        input_values: entry
      })
    });
    
    console.log('📡 Status envío:', submitResponse.status);
    
    const responseText = await submitResponse.text();
    console.log('📄 Respuesta del servidor:', responseText);
    
    let responseData;
    try {
      responseData = JSON.parse(responseText);
    } catch {
      responseData = { message: responseText };
    }
    
    if (!submitResponse.ok) {
      throw new Error(responseData.details || responseData.message || `Error ${submitResponse.status}`);
    }
    
    // ✅ ÉXITO
    console.log('✅ Formulario enviado correctamente');
    showSuccessMessage(messageContainer, form);
    
  } catch (error) {
    console.error('❌ Error enviando formulario:', error);
    showErrorMessage(messageContainer, error.message);
  } finally {
    // Restaurar botón
    submitButton.innerHTML = originalText;
    submitButton.disabled = false;
    submitButton.classList.remove('loading');
  }
}

// ✅ FUNCIÓN PARA MOSTRAR ÉXITO
function showSuccessMessage(messageContainer, form) {
  messageContainer.className = 'form-message success';
  messageContainer.innerHTML = `
    <div class="success-icon">✓</div>
    <p><strong>¡Mensaje enviado correctamente!</strong></p>
    <p>Hemos recibido tu mensaje y te responderemos lo antes posible.</p>
    <p>Gracias por contactar con VinylStation Radio 🎧</p>
  `;
  messageContainer.style.display = 'block';
  
  // Limpiar formulario
  form.reset();
  
  // Scroll al mensaje
  messageContainer.scrollIntoView({ behavior: 'smooth', block: 'center' });
  
  // Efecto visual en el formulario
  form.style.transition = 'all 0.5s ease-out';
  form.style.opacity = '0.7';
  form.style.transform = 'scale(0.98)';
  
  // Ocultar mensaje después de 10 segundos
  setTimeout(() => {
    messageContainer.style.transition = 'opacity 0.5s ease-out';
    messageContainer.style.opacity = '0';
    setTimeout(() => {
      messageContainer.style.display = 'none';
      messageContainer.style.opacity = '1';
      form.style.opacity = '1';
      form.style.transform = 'scale(1)';
    }, 500);
  }, 10000);
}

// ✅ FUNCIÓN PARA MOSTRAR ERROR
function showErrorMessage(messageContainer, errorDetails) {
  messageContainer.className = 'form-message error';
  messageContainer.innerHTML = `
    <div class="error-icon">✕</div>
    <p><strong>Error al enviar el mensaje</strong></p>
    <p class="error-details">Por favor, inténtalo de nuevo en unos momentos.</p>
    <hr>
    <p><strong>También puedes contactarnos directamente:</strong></p>
    <p>📧 <a href="mailto:hola@vinylstation.es">hola@vinylstation.es</a></p>
    <p>📱 Redes sociales: @vinylstation_radio</p>
  `;
  messageContainer.style.display = 'block';
  messageContainer.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

// ✅ FUNCIÓN PARA MOSTRAR ERROR DE CARGA
function showFormError(container, errorMessage) {
  const loadingMessage = container.querySelector('.loading-message');
  const errorDiv = container.querySelector('.error-message');
  
  if (loadingMessage) loadingMessage.style.display = 'none';
  if (errorDiv) {
    errorDiv.style.display = 'block';
    // Añadir detalles del error
    const errorDetails = errorDiv.querySelector('.error-text');
    if (errorDetails) {
      errorDetails.textContent = `Error: ${errorMessage}`;
    }
  }
}
