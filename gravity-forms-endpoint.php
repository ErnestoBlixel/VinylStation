<?php
/**
 * INSTRUCCIONES PARA WORDPRESS:
 * 
 * 1. Copia este código en el archivo functions.php de tu tema activo
 * 2. O créalo como un plugin personalizado:
 *    - Crea un archivo: wp-content/plugins/gravity-forms-api/gravity-forms-api.php
 *    - Agrega este código
 *    - Activa el plugin desde el panel de WordPress
 */

// Registrar endpoint REST personalizado para Gravity Forms
add_action('rest_api_init', function() {
    // Endpoint para enviar formulario (evita problemas de CORS)
    register_rest_route('vinylstation/v1', '/gravity-form/submit', array(
        'methods' => 'POST',
        'callback' => 'submit_gravity_form_handler',
        'permission_callback' => '__return_true', // Permitir acceso público
    ));
});

// Función para manejar el envío del formulario
function submit_gravity_form_handler($request) {
    $form_id = $request->get_param('form_id');
    $field_values = $request->get_param('field_values');
    
    // Verificar que Gravity Forms esté activo
    if (!class_exists('GFAPI')) {
        return new WP_Error('gf_not_active', 'Gravity Forms no está activo', array('status' => 503));
    }
    
    // Verificar que el formulario existe
    $form = GFAPI::get_form($form_id);
    if (!$form) {
        return new WP_Error('form_not_found', 'Formulario no encontrado', array('status' => 404));
    }
    
    // Construir entrada para Gravity Forms
    $entry = array(
        'form_id' => $form_id,
        'date_created' => current_time('mysql'),
        'ip' => $_SERVER['REMOTE_ADDR'],
        'source_url' => $_SERVER['HTTP_REFERER'] ?? '',
        'user_agent' => $_SERVER['HTTP_USER_AGENT'] ?? '',
        'status' => 'active',
        'is_starred' => 0,
        'is_read' => 0,
    );
    
    // Mapear valores de campo
    foreach ($field_values as $field) {
        $field_id = strval($field['id']);
        $value = $field['value'];
        
        // Buscar el campo en el formulario para aplicar sanitización apropiada
        $gf_field = null;
        foreach ($form['fields'] as $f) {
            if ($f->id == $field_id) {
                $gf_field = $f;
                break;
            }
        }
        
        // Sanitizar según el tipo de campo
        if ($gf_field) {
            switch ($gf_field->type) {
                case 'email':
                    $entry[$field_id] = sanitize_email($value);
                    break;
                case 'textarea':
                    $entry[$field_id] = sanitize_textarea_field($value);
                    break;
                case 'phone':
                    $entry[$field_id] = preg_replace('/[^0-9+\-\s()]/', '', $value);
                    break;
                default:
                    $entry[$field_id] = sanitize_text_field($value);
            }
        } else {
            $entry[$field_id] = sanitize_text_field($value);
        }
    }
    
    // Agregar entrada usando GFAPI
    $entry_id = GFAPI::add_entry($entry);
    
    if (is_wp_error($entry_id)) {
        return new WP_Error('submission_failed', 'Error al enviar el formulario', array(
            'status' => 500,
            'details' => $entry_id->get_error_message()
        ));
    }
    
    // Obtener la entrada recién creada
    $saved_entry = GFAPI::get_entry($entry_id);
    
    // Enviar notificaciones (emails configurados en Gravity Forms)
    $notifications = GFAPI::get_form_notifications($form_id);
    foreach ($notifications as $notification) {
        if (rgar($notification, 'isActive')) {
            GFAPI::send_notification($notification, $form, $saved_entry);
        }
    }
    
    // Obtener mensaje de confirmación
    $confirmation_message = '¡Gracias! Tu mensaje ha sido enviado correctamente.';
    if (!empty($form['confirmation']['message'])) {
        $confirmation_message = GFCommon::replace_variables(
            $form['confirmation']['message'], 
            $form, 
            $saved_entry
        );
    }
    
    return new WP_REST_Response(array(
        'success' => true,
        'entry_id' => $entry_id,
        'message' => wp_strip_all_tags($confirmation_message),
        'debug' => array(
            'form_id' => $form_id,
            'entry_count' => count($field_values)
        )
    ), 200);
}

// Configurar CORS para permitir peticiones desde tu dominio Astro
add_action('rest_api_init', function() {
    remove_filter('rest_pre_serve_request', 'rest_send_cors_headers');
    add_filter('rest_pre_serve_request', function($value) {
        $origin = get_http_origin();
        
        // Lista de orígenes permitidos
        $allowed_origins = array(
            'http://localhost:4321',  // Desarrollo local de Astro
            'http://localhost:3000',  // Otro puerto de desarrollo
            'https://vinylstation.es', // Tu dominio en producción
            'https://www.vinylstation.es'
        );
        
        if (in_array($origin, $allowed_origins)) {
            header('Access-Control-Allow-Origin: ' . $origin);
        } else {
            // Para desarrollo, permitir cualquier origen (cambiar en producción)
            header('Access-Control-Allow-Origin: *');
        }
        
        header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
        header('Access-Control-Allow-Headers: Content-Type, Authorization');
        header('Access-Control-Allow-Credentials: true');
        
        return $value;
    });
}, 15);

// Manejar solicitudes OPTIONS para CORS preflight
add_action('init', function() {
    if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
        header('Access-Control-Allow-Origin: *');
        header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
        header('Access-Control-Allow-Headers: Content-Type, Authorization');
        header('Access-Control-Max-Age: 86400');
        exit();
    }
});
