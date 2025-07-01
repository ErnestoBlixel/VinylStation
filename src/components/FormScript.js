// 🔧 SCRIPT MEJORADO PARA FORMULARIO DE CONTACTO
// Versión corregida que maneja errores y usa la API correctamente

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
    <p>Te responderemos en breve. Gracias por contactar con VinylStation.</p>
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
}

// ✅ FUNCIÓN PARA MOSTRAR ERROR
function showErrorMessage(messageContainer, errorDetails) {
  messageContainer.className = 'form-message error';
  messageContainer.innerHTML = `
    <div class="error-icon">✕</div>
    <p><strong>No se pudo enviar el formulario</strong></p>
    <p class="error-details">${errorDetails}</p>
    <hr>
    <p><strong>Contacto alternativo:</strong></p>
    <p>📧 <a href="mailto:hola@vinylstation.com">hola@vinylstation.com</a></p>
    <p>📞 <a href="tel:+34925676778">+34 925 676 778</a></p>
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
